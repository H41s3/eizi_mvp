import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import type { OpenAIResponse } from '@/types/openai';

export function TestOpenAI() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.post<OpenAIResponse>('/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: input }
        ]
      });
      
      setResponse(result.choices[0].message.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your message..."
            disabled={loading}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </Button>
        {error && (
          <div className="text-red-500 text-sm mt-2">{error}</div>
        )}
        {response && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="whitespace-pre-wrap">{response}</p>
          </div>
        )}
      </form>
    </Card>
  );
} 