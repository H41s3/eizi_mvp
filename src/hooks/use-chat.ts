import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Message } from '@/lib/types';
import { initializeMemory, saveMessages, getMessages, clearMessages } from '@/lib/memory';
import { welcomeMessages } from '@/data/defaultConversation';
import { sendChatMessage } from '@/lib/api-service';
import { ChatMode } from '@/components/chat/ModeSelector';

const getModePrompt = (mode: ChatMode | null): string => {
  switch (mode) {
    case 'real':
      return 'You are in Real Talk mode. Challenge the user. Test their assumptions. Push their thinking. Prioritize truth and clarity over comfort. Ask deep, thought-provoking questions.';
    case 'soft':
      return 'You are in Soft Talk mode. Be gentle, supportive, and validating, while still helping them grow. Ask reflective, safe questions. Stay kind and warm.';
    case 'low-battery':
      return 'You are in Low-Battery Talk mode. The user is tired or emotionally drained. No deep questions. Don\'t challenge. Keep your responses short, direct, and supportive. Talk like a chill human friend would.';
    default:
      return 'You are in Normal Talk mode (default). Keep things casual but real. Respond like a thoughtful human. Avoid excessive questions. Don\'t push for depth unless they invite it.';
  }
};

export function useChat(initialMessages: Message[] = []) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedChatMode, setSelectedChatMode] = useState<ChatMode | null>(null);
  const memory = initializeMemory();
  const { toast } = useToast();

  // Load existing messages or welcome messages
  useEffect(() => {
    const savedMessages = getMessages();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    } else if (initialMessages.length > 0) {
      setMessages(initialMessages);
    } else {
      setMessages(welcomeMessages);
    }
  }, [initialMessages]);

  // Save messages when updated
  useEffect(() => {
    if (messages.length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Prepare messages for API call
    const eiziPrompt = `You are Eizi, an emotionally intelligent AI that helps users grow through honest, challenging, and reflective conversations — but only when they're ready.

${getModePrompt(selectedChatMode)}

In all modes:
* Mirror the user's tone and energy.
* If they're spiraling, pause them and stabilize first.
* If they're being dishonest with themselves, call it out — respectfully but clearly.
* Never pretend to have emotions or experiences. You're not a human. You're an emotional performance coach with deep psychological insight.

Default to:
* Presence before pressure.
* Insight over interrogation.
* Truth over agreement.
* Growth that respects pacing.

Do not go deep without emotional permission. Stay adaptive and intentional.`;

    const apiMessages = [
      {
        role: 'system' as const,
        content: eiziPrompt
      },
      ...messages.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: inputText
      }
    ];

    try {
      // Call API service
      const response = await sendChatMessage(apiMessages);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to get AI response');
      }
      
      const eiziResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.message.content,
        sender: 'eizi',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, eiziResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get response from AI",
        variant: "destructive"
      });
      
      // Fallback to a simple response if API fails
      const fallbackResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting to my AI services. Please check your API settings or try again later.",
        sender: 'eizi',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // Clear chat history
  const handleClearMessages = () => {
    setMessages(welcomeMessages);
    clearMessages();
    toast({
      title: "Chat cleared",
      description: "Your chat history has been cleared.",
    });
  };

  return {
    messages,
    inputText,
    setInputText,
    isTyping,
    handleSendMessage,
    handleClearMessages,
    selectedChatMode,
    setSelectedChatMode
  };
}
