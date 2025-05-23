
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { getMoodEmojis, addMoodEntry } from '@/lib/memory';
import { Mood, MoodEntry } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MoodTrackerProps {
  onMoodSelect?: (mood: Mood) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ onMoodSelect }) => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const moods = getMoodEmojis();

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    if (onMoodSelect) {
      onMoodSelect(mood);
    }
    setIsExpanded(true);
  };

  const handleSaveMood = () => {
    if (selectedMood) {
      const moodEntry: MoodEntry = {
        id: Date.now().toString(),
        mood: selectedMood,
        note: note.trim() || undefined,
        timestamp: new Date()
      };
      addMoodEntry(moodEntry);
      // Reset form
      setNote('');
      setSelectedMood(null);
      setIsExpanded(false);
    }
  };

  return (
    <Card className="mb-4 border-2 border-eizi-blue bg-white dark:bg-gray-800 dark:border-purple-900/50 transition-colors">
      <CardContent className="pt-4">
        <h3 className="text-center mb-3 font-medium dark:text-gray-100">How are you feeling today?</h3>
        
        <div className="flex justify-center flex-wrap gap-3 mb-4">
          {moods.map((mood) => (
            <Button
              key={mood.id}
              variant="outline"
              className={cn(
                "rounded-full h-12 w-12 flex items-center justify-center text-2xl p-0 transition-transform dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600",
                selectedMood?.id === mood.id ? `${mood.color} border-2 border-black dark:border-purple-300 scale-110` : ""
              )}
              onClick={() => handleMoodSelect(mood)}
            >
              {mood.emoji}
            </Button>
          ))}
        </div>

        {isExpanded && selectedMood && (
          <div className="space-y-3 animate-accordion-down">
            <p className="text-center text-sm dark:text-gray-300">
              You selected: <span className="font-medium dark:text-white">{selectedMood.label}</span>
            </p>
            
            <div>
              <Input
                placeholder="Add a note about how you feel... (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mb-3 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 dark:placeholder:text-gray-400"
              />
              
              <div className="flex justify-center">
                <Button onClick={handleSaveMood} className="bg-eizi-green hover:bg-eizi-green/80 dark:text-white">
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodTracker;
