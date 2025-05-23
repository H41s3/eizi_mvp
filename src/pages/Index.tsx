import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Header from '@/components/Header';
import ChatInterface from '@/components/ChatInterface';
import MoodTracker from '@/components/MoodTracker';
import MoodHistory from '@/components/MoodHistory';
import RemindersSection from '@/components/RemindersSection';
import { welcomeMessages } from '@/data/defaultConversation';
import { initializeMemory, updateUserName, updateLanguagePreference } from '@/lib/memory';

const Index = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const memory = initializeMemory();
  
  const [settings, setSettings] = useState({
    name: memory.name || '',
    useTaglish: memory.preferredLanguage === 'Taglish'
  });
  
  const handleSaveSettings = () => {
    updateUserName(settings.name);
    updateLanguagePreference(settings.useTaglish ? 'Taglish' : 'English');
    setSettingsOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-eizi-light to-white">
      <Header onOpenSettings={() => setSettingsOpen(true)} />
      
      <div className="container max-w-3xl flex-grow py-4 px-4 md:py-6">
        <Tabs 
          defaultValue="chat" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full animate-fade-in"
        >
          <TabsList className="grid grid-cols-3 mb-4 shadow-sm bg-eizi-light/50">
            <TabsTrigger value="chat" className="data-[state=active]:bg-eizi-purple data-[state=active]:text-white">Chat</TabsTrigger>
            <TabsTrigger value="mood" className="data-[state=active]:bg-eizi-purple data-[state=active]:text-white">Mood Tracker</TabsTrigger>
            <TabsTrigger value="reminders" className="data-[state=active]:bg-eizi-purple data-[state=active]:text-white">Reminders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="h-[calc(100vh-180px)] flex flex-col">
            <div className="mb-4 animate-slide-up">
              <MoodTracker />
            </div>
            <ChatInterface initialMessages={welcomeMessages} />
          </TabsContent>
          
          <TabsContent value="mood">
            <div className="space-y-6 animate-slide-up">
              <MoodTracker />
              <MoodHistory />
            </div>
          </TabsContent>
          
          <TabsContent value="reminders">
            <div className="animate-slide-up">
              <RemindersSection />
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="sm:max-w-[500px] card-shadow">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="user-preferences">
                <AccordionTrigger>User Preferences</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 py-2">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input
                        id="name"
                        value={settings.name}
                        onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="What should I call you?"
                        className="col-span-3"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="taglish" className="text-right">Taglish</Label>
                      <div className="flex items-center space-x-2 col-span-3">
                        <Switch
                          id="taglish"
                          checked={settings.useTaglish}
                          onCheckedChange={(checked) => setSettings(prev => ({ ...prev, useTaglish: checked }))}
                        />
                        <Label htmlFor="taglish">Enable Taglish responses</Label>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <DialogFooter>
            <Button onClick={handleSaveSettings}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

