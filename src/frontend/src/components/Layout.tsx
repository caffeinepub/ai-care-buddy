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
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Health Guardian</h1>
                {userProfile && (
                  <p className="text-sm text-muted-foreground">Welcome back, {userProfile.name}</p>
                )}
              </div>
            </div>
            <LoginButton />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Your Personal Health Companion
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your daily wellness routines, get AI-powered health guidance, and keep emergency contacts at your fingertips.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 h-auto p-1">
            <TabsTrigger value="tracker" className="flex items-center gap-2 py-3">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Health Tracker</span>
              <span className="sm:hidden">Tracker</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2 py-3">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">AI Assistant</span>
              <span className="sm:hidden">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2 py-3">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Emergency</span>
              <span className="sm:hidden">SOS</span>
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
      <footer className="border-t mt-16 bg-card/30">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Health Guardian. Built with{' '}
              <Heart className="inline w-4 h-4 text-destructive" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'health-guardian'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
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

