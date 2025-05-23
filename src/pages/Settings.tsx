import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { loadApiConfig, saveApiConfig } from '@/lib/api-config';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('gpt-3.5-turbo');

  useEffect(() => {
    const config = loadApiConfig();
    if (config.chatAI.apiKey) {
      setApiKey(config.chatAI.apiKey);
      setProvider(config.chatAI.provider);
      setModel(config.chatAI.model);
    }
  }, []);

  const handleSave = () => {
    try {
      saveApiConfig({
        chatAI: {
          provider: provider as 'openai' | 'anthropic' | 'mistral' | 'perplexity',
          apiKey,
          model
        }
      });
      toast({
        title: "Settings saved",
        description: "Your API configuration has been saved successfully.",
      });
      navigate('/'); // Navigate back to chat after saving
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>Configure your AI provider settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="provider">AI Provider</Label>
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger>
                <SelectValue placeholder="Select AI provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="anthropic">Anthropic</SelectItem>
                <SelectItem value="mistral">Mistral AI</SelectItem>
                <SelectItem value="perplexity">Perplexity AI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger>
                <SelectValue placeholder="Select AI model" />
              </SelectTrigger>
              <SelectContent>
                {provider === 'openai' && (
                  <>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo-preview">GPT-4 Turbo</SelectItem>
                  </>
                )}
                {provider === 'anthropic' && (
                  <>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                    <SelectItem value="claude-2.1">Claude 2.1</SelectItem>
                  </>
                )}
                {provider === 'mistral' && (
                  <>
                    <SelectItem value="mistral-tiny">Mistral Tiny</SelectItem>
                    <SelectItem value="mistral-small">Mistral Small</SelectItem>
                    <SelectItem value="mistral-medium">Mistral Medium</SelectItem>
                  </>
                )}
                {provider === 'perplexity' && (
                  <>
                    <SelectItem value="pplx-7b-online">PPLX 7B Online</SelectItem>
                    <SelectItem value="pplx-70b-online">PPLX 70B Online</SelectItem>
                    <SelectItem value="codellama-34b-instruct">CodeLlama 34B</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSave} className="w-full">Save Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings; 