import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Bot, User, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function HealthChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI health assistant. I can provide general health guidance, answer wellness questions, and help you understand health topics. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in a real app, this would call a backend AI service)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateHealthResponse(userMessage.content),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateHealthResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('water') || lowerQuery.includes('hydration')) {
      return "Staying hydrated is crucial for your health! Adults should aim for about 8 glasses (2 liters) of water per day, though this can vary based on activity level, climate, and individual needs. Signs of good hydration include clear or light yellow urine and feeling energized.";
    }
    
    if (lowerQuery.includes('exercise') || lowerQuery.includes('workout')) {
      return "Regular exercise is essential for overall health! The WHO recommends at least 150 minutes of moderate-intensity aerobic activity per week for adults. This could be 30 minutes, 5 days a week. Include strength training at least twice weekly. Start slowly and gradually increase intensity.";
    }
    
    if (lowerQuery.includes('sleep')) {
      return "Quality sleep is vital for health and wellbeing! Adults typically need 7-9 hours per night. Tips for better sleep: maintain a consistent schedule, create a relaxing bedtime routine, keep your bedroom cool and dark, avoid screens before bed, and limit caffeine in the afternoon.";
    }
    
    if (lowerQuery.includes('diet') || lowerQuery.includes('nutrition') || lowerQuery.includes('food')) {
      return "A balanced diet is key to good health! Focus on whole foods: plenty of fruits and vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods, added sugars, and excessive salt. Eating a variety of colorful foods ensures you get diverse nutrients.";
    }
    
    if (lowerQuery.includes('stress') || lowerQuery.includes('anxiety')) {
      return "Managing stress is important for both mental and physical health. Try these techniques: deep breathing exercises, regular physical activity, adequate sleep, mindfulness or meditation, connecting with loved ones, and setting realistic goals. If stress feels overwhelming, consider speaking with a healthcare professional.";
    }
    
    return "That's a great health question! While I can provide general wellness guidance, I recommend consulting with a healthcare professional for personalized medical advice. They can consider your specific health history and needs. Is there a general health topic I can help explain?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[650px] flex flex-col shadow-soft">
        <CardHeader className="border-b bg-card/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="font-semibold">AI Health Assistant</CardTitle>
              <CardDescription className="font-normal">Get general health guidance and wellness tips</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <div className="space-y-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-5 py-3.5 shadow-soft ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/80 text-foreground border border-border'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed font-normal">{message.content}</p>
                    <p className={`text-xs mt-2 ${message.role === 'user' ? 'opacity-80' : 'opacity-60'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0 shadow-xs">
                      <User className="w-4 h-4 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 shadow-xs">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted/80 rounded-2xl px-5 py-3.5 border border-border shadow-soft">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-5 bg-card/50">
            <div className="mb-3 px-4 py-2.5 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs text-muted-foreground font-normal leading-relaxed">
                This AI assistant provides general health information only. Always consult healthcare professionals for medical advice.
              </p>
            </div>
            <div className="flex gap-3">
              <Textarea
                placeholder="Ask a health question... (Press Enter to send, Shift+Enter for new line)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="min-h-[70px] max-h-[140px] resize-none border-input focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-[70px] w-[70px] rounded-xl shadow-soft hover:shadow-md transition-all duration-200"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
