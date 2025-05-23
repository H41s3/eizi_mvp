
import React from 'react';
import { Message } from '@/lib/types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  // Format timestamp
  const formatTime = (date: Date) => {
    return date instanceof Date 
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] lg:max-w-[70%] rounded-lg px-4 py-2 ${
          message.sender === 'user'
            ? 'bg-eizi-blue text-white rounded-tr-none'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <div className={`text-xs mt-1 ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
