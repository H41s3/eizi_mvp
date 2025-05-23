
export interface Message {
  id: string;
  content: string;
  sender: "user" | "eizi";
  timestamp: Date;
}

export interface Mood {
  id: string;
  emoji: string;
  label: string;
  color: string;
}

export interface MoodEntry {
  id: string;
  mood: Mood;
  note?: string;
  timestamp: Date;
}

export interface Reminder {
  id: string;
  message: string;
  completed: boolean;
  timestamp: Date;
}

export interface UserMemory {
  name?: string;
  preferredLanguage: "English" | "Taglish";
  struggles?: string[];
  importantDates?: {
    description: string;
    date: Date;
  }[];
  moodHistory: MoodEntry[];
  lastInteraction?: Date;
  commonTopics?: string[];
  reminders: Reminder[];
}

export interface Conversation {
  id: string;
  messages: Message[];
  startedAt: Date;
}
