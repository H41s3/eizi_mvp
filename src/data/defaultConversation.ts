import { Message } from '../lib/types';

export const welcomeMessages: Message[] = [
  {
    id: '1',
    content: "Hi, I'm Eizi. I'm here to have honest, thoughtful conversations with you. Let's start casual - you can always change the energy of our chat using the mode buttons below.",
    sender: "eizi",
    timestamp: new Date()
  }
];

export const moodCheckPrompts: string[] = [
  "How are you really feeling today?",
  "Let's be honest about your current state - what's going on?",
  "Take a moment to reflect - what's your true mood right now?",
  "Beyond the surface, how are you actually doing?",
  "Let's check in properly - how's your emotional state?",
  "What feelings are you carrying with you today?"
];

export const reminderSuggestions: string[] = [
  "Drink water",
  "Take a short break",
  "Stretch for 5 minutes",
  "Check in with a friend",
  "Review your notes",
  "Finish homework",
  "Get some fresh air",
  "Eat a healthy meal",
  "Take medication",
  "Go to bed early"
];

// For the MVP, these are template responses that would be replaced with actual GPT responses
export const responseTemplates = {
  greeting: (name?: string) => 
    name ? `Welcome back ${name}. Ready for an honest conversation?` : "Welcome. Shall we begin our discussion?",
  
  moodResponse: {
    "Happy": "That's positive to hear. Let's explore what's contributing to this state and how to build on it.",
    "Peaceful": "A calm mind is a great foundation. What insights come to you in this state?",
    "Neutral": "Neutral can be telling. Are you truly neutral, or perhaps avoiding deeper feelings?",
    "Sad": "Thank you for being honest. Would you like to explore what's beneath this sadness?",
    "Angry": "Anger often masks other emotions. Want to dig deeper into what's really going on?",
    "Anxious": "Let's examine this anxiety together. What thoughts are driving it?"
  },
  
  reminder: "Important reminder for your growth:",
  
  encouragement: [
    "Growth comes from facing challenges head-on.",
    "Discomfort often precedes breakthrough.",
    "Honest self-reflection is the path forward.",
    "Your willingness to examine yourself is commendable.",
    "Progress isn't always comfortable, but it's worth it.",
    "Face the truth, embrace the growth."
  ]
};
