'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Loader2 } from 'lucide-react';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { answerUserQuestions } from '@/ai/flows/answer-user-questions';
import { useAuth } from '@/hooks/use-auth';

interface Message {
  role: 'user' | 'ai';
  content: string;
  resources?: string[];
}

export default function TutorPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "Hello! I'm your AI Tutor. How can I help you learn today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await answerUserQuestions({ question: input });
      const aiMessage: Message = { role: 'ai', content: result.answer, resources: result.resources };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem communicating with the AI tutor. Please try again.',
      });
       const errorMessage: Message = { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' };
       setMessages(prev => [...prev.slice(0, -1), userMessage, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
       <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="AI Tutor"
          description="Your personal AI-powered learning assistant. Ask anything!"
        />
        <Card className="mt-6 h-[70vh] flex flex-col">
          <CardContent className="p-0 flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <div key={index} className={cn('flex items-start gap-4', message.role === 'user' && 'justify-end')}>
                    {message.role === 'ai' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot /></AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn(
                      'max-w-md rounded-lg p-3',
                      message.role === 'ai' ? 'bg-secondary' : 'bg-primary text-primary-foreground'
                    )}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.resources && message.resources.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-bold text-sm mb-2">Helpful Resources:</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {message.resources.map((resource, i) => (
                              <li key={i}><a href={resource} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground/80">{resource}</a></li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <Avatar className="h-8 w-8">
                        {user?.photoURL && <AvatarImage src={user.photoURL} alt="User avatar" />}
                        <AvatarFallback><User /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-4">
                     <Avatar className="h-8 w-8">
                        <AvatarFallback><Bot /></AvatarFallback>
                      </Avatar>
                      <div className="bg-secondary rounded-lg p-3 flex items-center space-x-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Thinking...</span>
                      </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about a concept, get career advice, or request a resource..."
                  className="pr-20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button type="submit" size="icon" className="absolute right-3 top-1/2 -translate-y-1/2" disabled={isLoading || !input.trim()}>
                  <Send />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
        </div>
    </main>
  );
}
