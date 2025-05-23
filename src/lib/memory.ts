import { UserMemory, Message, MoodEntry, Reminder } from './types';

// In a real implementation, this would be stored in a database
// For the MVP, we're using localStorage for simplicity
const MEMORY_KEY = 'eizi-user-memory';
const CONVERSATIONS_KEY = 'eizi-conversations';

export const getMoodEmojis = () => [
  { id: '1', emoji: '😊', label: 'Happy', color: 'bg-eizi-yellow' },
  { id: '2', emoji: '😌', label: 'Peaceful', color: 'bg-eizi-teal' },
  { id: '3', emoji: '😐', label: 'Neutral', color: 'bg-eizi-blue' },
  { id: '4', emoji: '😔', label: 'Sad', color: 'bg-eizi-purple' },
  { id: '5', emoji: '😡', label: 'Angry', color: 'bg-eizi-red' },
  { id: '6', emoji: '😰', label: 'Anxious', color: 'bg-eizi-green' },
];

// Initialize user memory with defaults
export const initializeMemory = (): UserMemory => {
  const existingMemory = localStorage.getItem(MEMORY_KEY);
  
  if (existingMemory) {
    const memory = JSON.parse(existingMemory);
    // Convert date strings back to Date objects
    if (memory.lastInteraction) {
      memory.lastInteraction = new Date(memory.lastInteraction);
    }
    if (memory.importantDates) {
      memory.importantDates = memory.importantDates.map((item: any) => ({
        ...item,
        date: new Date(item.date)
      }));
    }
    if (memory.moodHistory) {
      memory.moodHistory = memory.moodHistory.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
    }
    return memory;
  }
  
  // Default memory structure
  const defaultMemory: UserMemory = {
    preferredLanguage: 'English',
    moodHistory: [],
    reminders: [],
  };
  
  localStorage.setItem(MEMORY_KEY, JSON.stringify(defaultMemory));
  return defaultMemory;
};

export const saveMemory = (memory: UserMemory): void => {
  localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
};

export const addMoodEntry = (entry: MoodEntry): void => {
  const memory = initializeMemory();
  memory.moodHistory = [entry, ...memory.moodHistory];
  saveMemory(memory);
};

export const addReminder = (reminder: Reminder): void => {
  const memory = initializeMemory();
  memory.reminders = [reminder, ...memory.reminders];
  saveMemory(memory);
};

export const toggleReminder = (id: string): void => {
  const memory = initializeMemory();
  memory.reminders = memory.reminders.map(reminder => 
    reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
  );
  saveMemory(memory);
};

export const updateUserName = (name: string): void => {
  const memory = initializeMemory();
  memory.name = name;
  saveMemory(memory);
};

export const updateLanguagePreference = (preferredLanguage: "English" | "Taglish"): void => {
  const memory = initializeMemory();
  memory.preferredLanguage = preferredLanguage;
  saveMemory(memory);
};

export const saveMessages = (messages: Message[]): void => {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(messages));
};

export const getMessages = (): Message[] => {
  const storedMessages = localStorage.getItem(CONVERSATIONS_KEY);
  if (!storedMessages) return [];
  
  const messages = JSON.parse(storedMessages);
  return messages.map((msg: any) => ({
    ...msg,
    timestamp: new Date(msg.timestamp)
  }));
};

// Clear all saved messages and reset to default
export const clearMessages = (): void => {
  localStorage.removeItem(CONVERSATIONS_KEY);
};

// For MVP, this creates a "memory context" that could be sent to GPT
export const createMemoryContext = (): string => {
  const memory = initializeMemory();
  
  let context = "User Information:\n";
  
  if (memory.name) {
    context += `Name: ${memory.name}\n`;
  }
  
  context += `Preferred Language: ${memory.preferredLanguage}\n\n`;
  
  if (memory.struggles && memory.struggles.length > 0) {
    context += `Common Struggles: ${memory.struggles.join(", ")}\n\n`;
  }
  
  if (memory.moodHistory && memory.moodHistory.length > 0) {
    const recentMoods = memory.moodHistory.slice(0, 5);
    context += "Recent Moods:\n";
    recentMoods.forEach(entry => {
      const date = entry.timestamp.toLocaleDateString();
      context += `- ${date}: ${entry.mood.label}${entry.note ? ` (Note: "${entry.note}")` : ''}\n`;
    });
    context += "\n";
  }
  
  if (memory.commonTopics && memory.commonTopics.length > 0) {
    context += `Frequently Discussed Topics: ${memory.commonTopics.join(", ")}\n\n`;
  }
  
  if (memory.reminders && memory.reminders.length > 0) {
    const activeReminders = memory.reminders.filter(r => !r.completed);
    if (activeReminders.length > 0) {
      context += "Active Reminders:\n";
      activeReminders.forEach(reminder => {
        context += `- ${reminder.message}\n`;
      });
    }
  }
  
  return context;
};
