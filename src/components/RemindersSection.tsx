import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { initializeMemory, addReminder, toggleReminder } from '@/lib/memory';
import { Reminder } from '@/lib/types';
import { reminderSuggestions } from '@/data/defaultConversation';

const RemindersSection: React.FC = () => {
  const [newReminder, setNewReminder] = useState('');
  const { reminders } = initializeMemory();
  
  const handleAddReminder = (text?: string) => {
    const reminderText = text || newReminder.trim();
    if (reminderText) {
      const reminder: Reminder = {
        id: Date.now().toString(),
        message: reminderText,
        completed: false,
        timestamp: new Date()
      };
      addReminder(reminder);
      setNewReminder('');
    }
  };
  
  const activeReminders = reminders.filter(r => !r.completed);
  const completedReminders = reminders.filter(r => r.completed);
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Gentle Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Input 
            placeholder="Add a new reminder..." 
            value={newReminder}
            onChange={(e) => setNewReminder(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddReminder();
            }}
            className="flex-1"
          />
          <Button 
            onClick={() => handleAddReminder()}
            className="bg-eizi-purple hover:bg-eizi-purple/80 text-white"
          >
            Add
          </Button>
        </div>
        
        {reminders.length === 0 && (
          <div className="mt-3 mb-6">
            <p className="text-gray-500 text-sm mb-2">Suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {reminderSuggestions.slice(0, 5).map((suggestion) => (
                <Button 
                  key={`suggestion-${suggestion.toLowerCase().replace(/\s+/g, '-')}`}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddReminder(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {activeReminders.length > 0 && (
          <div className="space-y-2 mb-4">
            <p className="font-medium text-sm">Active</p>
            {activeReminders.map(reminder => (
              <div key={reminder.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={`reminder-${reminder.id}`}
                  checked={reminder.completed}
                  onCheckedChange={() => toggleReminder(reminder.id)}
                  className="mt-1"
                />
                <label 
                  htmlFor={`reminder-${reminder.id}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {reminder.message}
                </label>
              </div>
            ))}
          </div>
        )}
        
        {completedReminders.length > 0 && (
          <div className="space-y-2">
            <p className="font-medium text-sm text-gray-500">Completed</p>
            {completedReminders.slice(0, 3).map(reminder => (
              <div key={reminder.id} className="flex items-start space-x-2">
                <Checkbox 
                  id={`reminder-${reminder.id}`}
                  checked={reminder.completed}
                  onCheckedChange={() => toggleReminder(reminder.id)}
                  className="mt-1"
                />
                <label 
                  htmlFor={`reminder-${reminder.id}`}
                  className="text-sm line-through text-gray-500 cursor-pointer flex-1"
                >
                  {reminder.message}
                </label>
              </div>
            ))}
            
            {completedReminders.length > 3 && (
              <p className="text-xs text-gray-400">
                +{completedReminders.length - 3} more completed reminders
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RemindersSection;
