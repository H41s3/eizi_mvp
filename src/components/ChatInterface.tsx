import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';
import ModeSelector, { ChatMode } from './chat/ModeSelector';
import { useChat } from '@/hooks/use-chat';
import { Message } from '@/lib/types';

interface ChatInterfaceProps {
  initialMessages?: Message[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialMessages = [] }) => {
  const [selectedMode, setSelectedMode] = useState<ChatMode | null>(null);
  const {
    messages,
    inputText,
    setInputText,
    isTyping,
    handleSendMessage,
    handleClearMessages,
    setSelectedChatMode
  } = useChat(initialMessages);

  const handleModeSelect = (mode: ChatMode) => {
    setSelectedMode(mode);
    setSelectedChatMode(mode);
  };

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-grow overflow-hidden border-0 shadow-none">
        <CardContent className="p-3 h-full flex flex-col">
          <MessageList messages={messages} isTyping={isTyping} />
          
          <div className="mt-auto space-y-3">
            <ModeSelector selectedMode={selectedMode} onModeSelect={handleModeSelect} />
            <ChatInput
              inputText={inputText}
              setInputText={setInputText}
              handleSendMessage={handleSendMessage}
              handleClearMessages={handleClearMessages}
              isTyping={isTyping}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatInterface;
