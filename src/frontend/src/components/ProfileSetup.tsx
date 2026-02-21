import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useSaveCallerUserProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User } from 'lucide-react';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveProfile({ name: name.trim() });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md shadow-medium">
        <CardHeader className="text-center space-y-3 pb-6">
          <div className="mx-auto w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-2 shadow-soft">
            <User className="w-7 h-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">Welcome to Health Guardian</CardTitle>
          <CardDescription className="font-normal text-base leading-relaxed">
            Let's get started by setting up your profile. What should we call you?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="name" className="font-medium text-sm">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                required
                autoFocus
                className="h-12 border-input focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl shadow-soft hover:shadow-md transition-all duration-200 font-medium text-base" 
              disabled={isPending || !name.trim()}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Setting up...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
