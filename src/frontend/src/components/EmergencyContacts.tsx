import { useState } from 'react';
import { useGetEmergencyContacts } from '../hooks/useGetEmergencyContacts';
import { useAddEmergencyContact } from '../hooks/useAddEmergencyContact';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Plus, Loader2, User, Heart, AlertCircle } from 'lucide-react';

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
      {/* Professional Emergency Notice */}
      <Card className="border-l-4 border-l-destructive shadow-soft">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">Emergency Contacts</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Keep your emergency contacts up to date. In case of emergency, call your local emergency services (911 in US, 112 in EU, etc.) immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Contacts */}
      {contacts && contacts.length > 0 && (
        <Card className="shadow-soft">
          <CardHeader className="border-b bg-card/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground font-semibold">Your Emergency Contacts</CardTitle>
                <CardDescription className="font-normal">Quick access to your important contacts</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {contacts.map((contact, index) => (
                <div 
                  key={index} 
                  className="p-5 border border-border rounded-xl bg-card hover:bg-accent/5 transition-all duration-200 shadow-xs hover:shadow-soft"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-semibold text-foreground text-base">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 font-normal">
                        <Heart className="w-3.5 h-3.5" />
                        {contact.relationship}
                      </p>
                      <a
                        href={`tel:${contact.phoneNumber}`}
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {contact.phoneNumber}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {error && !contacts && (
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center font-normal">
              No emergency contacts saved yet. Add your first contact below.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add New Contact Form */}
      <Card className="shadow-soft">
        <CardHeader className="border-b bg-card/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-semibold">Add Emergency Contact</CardTitle>
              <CardDescription className="font-normal">Add someone who can be reached in case of emergency</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2.5">
              <Label htmlFor="name" className="font-medium text-sm">Contact Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isPending}
                required
                className="h-11 border-input focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="relationship" className="font-medium text-sm">Relationship *</Label>
              <Input
                id="relationship"
                type="text"
                placeholder="e.g., Spouse, Parent, Sibling, Friend"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                disabled={isPending}
                required
                className="h-11 border-input focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
              />
            </div>

            <div className="space-y-2.5">
              <Label htmlFor="phone" className="font-medium text-sm">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isPending}
                required
                className="h-11 border-input focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-lg shadow-soft hover:shadow-md transition-all duration-200 font-medium"
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
