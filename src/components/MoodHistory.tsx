
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { initializeMemory } from '@/lib/memory';
import { MoodEntry } from '@/lib/types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MoodHistory: React.FC = () => {
  const { moodHistory } = initializeMemory();
  
  // Format data for the chart
  const chartData = moodHistory
    .slice(0, 14) // Show only the last 2 weeks
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()) // Sort chronologically
    .map((entry) => {
      // Convert mood to a number for charting (1-6 scale)
      const moodValue = parseInt(entry.mood.id);
      return {
        date: entry.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: moodValue,
        mood: entry.mood.label,
        color: entry.mood.color.replace('bg-', '')
      };
    });

  // Group entries by date for the text list display
  const groupedByDate = moodHistory.reduce((acc: Record<string, MoodEntry[]>, entry) => {
    const dateKey = entry.timestamp.toLocaleDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {});

  const dateEntries = Object.entries(groupedByDate)
    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime()) // Sort newest first
    .slice(0, 7); // Show only the last 7 days in the text list
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Your Mood History</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 1 ? (
          <>
            <div className="h-40 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis 
                    domain={[1, 6]} 
                    tick={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      const entry = chartData.find(item => item.value === value);
                      return [entry?.mood || value];
                    }}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="text-sm">
              {dateEntries.map(([date, entries]) => (
                <div key={date} className="mb-3">
                  <p className="font-medium">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                  {entries.map(entry => (
                    <div key={entry.id} className="pl-3 border-l-2 border-eizi-blue ml-2 mt-1">
                      <span className="mr-2">{entry.mood.emoji}</span>
                      <span className="font-medium">{entry.mood.label}</span>
                      {entry.note && <p className="text-xs italic mt-1">{entry.note}</p>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No mood history yet.</p>
            <p className="text-sm mt-1">Your mood trends will appear here after you record some entries.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodHistory;
