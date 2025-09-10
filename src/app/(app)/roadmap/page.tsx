'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Wand2, CheckCircle, Book, Youtube, Lightbulb } from 'lucide-react';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generatePersonalizedRoadmap, GeneratePersonalizedRoadmapOutput } from '@/ai/flows/generate-personalized-roadmap';
import { useUserProgress } from '@/hooks/use-user-progress';
import { QuizClient } from '@/components/quiz-client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

const roadmapFormSchema = z.object({
  goal: z.string().min(5, { message: 'Please describe your goal in more detail.' }),
  currentSkills: z.string().min(2, { message: 'Please list at least one skill.' }),
  desiredRoadmapLength: z.enum(['short', 'medium', 'long']),
});

type RoadmapFormValues = z.infer<typeof roadmapFormSchema>;

export default function RoadmapPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedData, setGeneratedData] = useState<GeneratePersonalizedRoadmapOutput | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const { completeCourse, isCourseCompleted } = useUserProgress();
  const courseId = "generated-roadmap";

  const form = useForm<RoadmapFormValues>({
    resolver: zodResolver(roadmapFormSchema),
    defaultValues: {
      goal: '',
      currentSkills: '',
      desiredRoadmapLength: 'medium',
    },
  });

  async function onSubmit(values: RoadmapFormValues) {
    setIsLoading(true);
    setGeneratedData(null);
    setQuizFinished(false);
    try {
      const result = await generatePersonalizedRoadmap(values);
      setGeneratedData(result);
    } catch (error: any) {
      console.error(error);
      const description = (error.message && error.message.includes('503'))
        ? "The AI model is currently overloaded. Please wait a moment and try again."
        : 'There was a problem generating your roadmap. Please try again.';
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCompleteCourse = (score: number) => {
    completeCourse(courseId, score);
    toast({
      title: 'Roadmap Completed!',
      description: 'Your progress has been updated on the dashboard.',
    });
  };

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="Personalized Roadmap"
          description="Tell us your goals, and our AI will craft a unique learning path just for you."
        />
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {!generatedData && !isLoading ? (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Create Your Roadmap</CardTitle>
                <CardDescription>Fill out the form below to get started.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="goal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Learning Goal</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Become a full-stack web developer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currentSkills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Skills</FormLabel>
                          <FormControl>
                            <Textarea placeholder="e.g., HTML, CSS, basic JavaScript" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="desiredRoadmapLength"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Roadmap Length</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a desired length" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="short">Short (1-3 months)</SelectItem>
                              <SelectItem value="medium">Medium (3-6 months)</SelectItem>
                              <SelectItem value="long">Long (6+ months)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full">
                      <Wand2 className="mr-2" />
                      Generate Roadmap
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : null}

          {isLoading && (
            <Card className="lg:col-span-2 flex items-center justify-center h-96">
              <div className="text-center text-muted-foreground p-8">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-lg">Generating your personalized path...</p>
                <p className="text-sm">This might take a moment.</p>
              </div>
            </Card>
          )}

          {generatedData && (
            <>
              <div className="space-y-6 animate-in fade-in duration-500">
                <Card className="bg-transparent border-0 shadow-none">
                  <CardHeader className="p-0">
                    <CardTitle className="text-3xl font-headline">{generatedData.title}</CardTitle>
                    <CardDescription>{generatedData.introduction}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 mt-6">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                      {generatedData.steps.map((step, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="border bg-card rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline font-semibold">
                            Step {index + 1}: {step.title}
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-2">
                            <p className="text-muted-foreground">{step.description}</p>
                            
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center"><Lightbulb className="mr-2 h-4 w-4 text-primary"/> Key Concepts</h4>
                              <div className="flex flex-wrap gap-2">
                                {step.keyConcepts.map(concept => <Badge key={concept} variant="secondary">{concept}</Badge>)}
                              </div>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2 flex items-center"><Book className="mr-2 h-4 w-4 text-primary"/> Resources</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {step.resources.map(res => <li key={res.url}><a href={res.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{res.title}</a></li>)}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center"><Youtube className="mr-2 h-4 w-4 text-primary"/> YouTube Videos</h4>
                              <ul className="list-disc list-inside space-y-1">
                                {step.youtubeLinks.map(link => <li key={link.url}><a href={link.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{link.title}</a></li>)}
                              </ul>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                     <p className="mt-6 text-muted-foreground">{generatedData.conclusion}</p>
                  </CardContent>
                </Card>
              </div>
              <Card className="h-fit sticky top-8 animate-in fade-in duration-500 delay-200">
                <CardHeader>
                  <CardTitle>Test Your Knowledge</CardTitle>
                  <CardDescription>Complete the quiz to mark this roadmap as complete.</CardDescription>
                </CardHeader>
                <CardContent>
                  {isCourseCompleted(courseId) ? (
                     <div className='text-center p-8 bg-green-500/10 rounded-lg border border-green-500/20'>
                        <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                        <h3 className="mt-4 font-bold text-xl">Roadmap Completed!</h3>
                        <p className="text-muted-foreground mt-2">You've successfully finished this learning path. Great job!</p>
                     </div>
                  ) : (
                    <QuizClient 
                      questions={generatedData.quiz} 
                      onQuizFinish={(score) => {
                        setQuizFinished(true);
                        handleCompleteCourse(score);
                      }} 
                    />
                  )}
                </CardContent>
              </Card>
            </>
          )}

        </div>
      </div>
    </main>
  );
}
