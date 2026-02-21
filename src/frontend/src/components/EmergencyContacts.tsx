import { useState } from 'react';
import { useGetEmergencyContacts } from '../hooks/useGetEmergencyContacts';
import { useAddEmergencyContact } from '../hooks/useAddEmergencyContact';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Phone, Plus, Loader2, AlertCircle, User, Heart } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function EmergencyContacts() {
  const { identity } = useInternetIdentity();
  const principal = identity?.getPrincipal();
  
  const { data: contacts, isLoading, error } = useGetEmergencyContacts(principal);
  const { mutate: addContact, isPending } = useAddEmergencyContact();

  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && relationship.trim() && phoneNumber.trim()) {
      addContact({
        name: name.trim(),
        relationship: relationship.trim(),
        phoneNumber: phoneNumber.trim()
      });
      setName('');
      setRelationship('');
      setPhoneNumber('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Emergency Alert */}
      <Alert className="border-destructive/50 bg-destructive/5">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <AlertTitle className="text-destructive font-semibold">Emergency Contacts</AlertTitle>
        <AlertDescription>
          Keep your emergency contacts up to date. In case of emergency, call your local emergency services (911 in US, 112 in EU, etc.) immediately.
        </AlertDescription>
      </Alert>

      {/* Existing Contacts */}
      {contacts && contacts.length > 0 && (
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Phone className="w-5 h-5" />
              Your Emergency Contacts
            </CardTitle>
            <CardDescription>Quick access to your important contacts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contacts.map((contact, index) => (
                <div key={index} className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-destructive" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {contact.relationship}
                        </p>
                        <a
                          href={`tel:${contact.phoneNumber}`}
                          className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          {contact.phoneNumber}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {error && !contacts && (
        <Alert>
          <AlertDescription>
            No emergency contacts saved yet. Add your first contact below.
          </AlertDescription>
        </Alert>
      )}

      {/* Add New Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Emergency Contact
          </CardTitle>
          <CardDescription>Add someone who can be reached in case of emergency</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Contact Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship *</Label>
              <Input
                id="relationship"
                type="text"
                placeholder="e.g., Spouse, Parent, Sibling, Friend"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                disabled={isPending}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isPending}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || !name.trim() || !relationship.trim() || !phoneNumber.trim()}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Contact...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Emergency Contact
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

