import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, MessageSquare, Phone, Heart } from 'lucide-react';
import LoginButton from './LoginButton';
import HealthRoutineTracker from './HealthRoutineTracker';
import HealthChatInterface from './HealthChatInterface';
import EmergencyContacts from './EmergencyContacts';
import type { UserProfile } from '../backend';

interface LayoutProps {
  userProfile: UserProfile | null;
}

export default function Layout({ userProfile }: LayoutProps) {
  const [activeTab, setActiveTab] = useState('tracker');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shadow-soft">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground tracking-tight">Health Guardian</h1>
                {userProfile && (
                  <p className="text-sm text-muted-foreground font-normal">Welcome back, {userProfile.name}</p>
                )}
              </div>
            </div>
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/[0.03] via-accent/[0.02] to-secondary/[0.03] border-b">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-4xl mx-auto text-center space-y-5">
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight">
              Your Personal Health Companion
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-normal leading-relaxed">
              Track your daily wellness routines, get AI-powered health guidance, and keep emergency contacts at your fingertips.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 h-auto p-1.5 bg-muted/50 shadow-soft">
            <TabsTrigger 
              value="tracker" 
              className="flex items-center gap-2.5 py-3.5 px-4 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-professional transition-all duration-200"
            >
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Health Tracker</span>
              <span className="sm:hidden font-medium">Tracker</span>
            </TabsTrigger>
            <TabsTrigger 
              value="chat" 
              className="flex items-center gap-2.5 py-3.5 px-4 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-professional transition-all duration-200"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">AI Assistant</span>
              <span className="sm:hidden font-medium">Chat</span>
            </TabsTrigger>
            <TabsTrigger 
              value="emergency" 
              className="flex items-center gap-2.5 py-3.5 px-4 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-professional transition-all duration-200"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">Emergency</span>
              <span className="sm:hidden font-medium">SOS</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracker" className="space-y-6">
            <HealthRoutineTracker />
          </TabsContent>

          <TabsContent value="chat" className="space-y-6">
            <HealthChatInterface />
          </TabsContent>

          <TabsContent value="emergency" className="space-y-6">
            <EmergencyContacts />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20 bg-card/50">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="font-normal">
              © {new Date().getFullYear()} Health Guardian. Built with{' '}
              <Heart className="inline w-4 h-4 text-destructive" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'health-guardian'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
