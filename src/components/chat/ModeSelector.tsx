import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type ChatMode = 'real' | 'soft' | 'low-battery';

interface ModeSelectorProps {
  selectedMode: ChatMode | null;
  onModeSelect: (mode: ChatMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, onModeSelect }) => {
  const modes: { id: ChatMode; label: string; description: string }[] = [
    {
      id: 'real',
      label: 'Real Talk',
      description: 'Challenge thinking, push growth'
    },
    {
      id: 'soft',
      label: 'Soft Talk',
      description: 'Gentle support and insights'
    },
    {
      id: 'low-battery',
      label: 'Low-Battery Talk',
      description: 'Keep it light and simple'
    }
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
      {modes.map((mode) => (
        <Button
          key={mode.id}
          variant={selectedMode === mode.id ? "default" : "outline"}
          className={cn(
            "flex flex-col items-center p-3 h-auto min-w-[120px] transition-all",
            selectedMode === mode.id ? "bg-eizi-purple text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
          )}
          onClick={() => onModeSelect(mode.id)}
        >
          <span className="font-medium">{mode.label}</span>
          <span className="text-xs mt-1 opacity-80">{mode.description}</span>
        </Button>
      ))}
    </div>
  );
};

export default ModeSelector; 