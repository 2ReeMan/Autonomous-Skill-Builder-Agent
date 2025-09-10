'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Wand2, CheckCircle } from 'lucide-react';

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
          {!generatedData ? (
            <Card>
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
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <Wand2 className="mr-2" />
                          Generate Roadmap
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="flex flex-col">
                <CardHeader>
                  <CardTitle>Your AI-Generated Path</CardTitle>
                  <CardDescription>Follow this roadmap to achieve your learning goals.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  {generatedData.roadmap && (
                    <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-foreground">
                      <div dangerouslySetInnerHTML={{ __html: generatedData.roadmap.replace(/\n/g, '<br />') }} />
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Test Your Knowledge</CardTitle>
                  <CardDescription>Complete the quiz to mark this roadmap as complete.</CardDescription>
                </CardHeader>
                <CardContent>
                  <QuizClient 
                    questions={generatedData.quiz} 
                    onQuizFinish={(score) => {
                      setQuizFinished(true);
                      handleCompleteCourse(score);
                    }} 
                  />
                  {quizFinished && (
                     isCourseCompleted(courseId) ? (
                        <Button disabled className="mt-4 w-full">
                            <CheckCircle className="mr-2"/>
                            Roadmap Completed
                        </Button>
                     ) : (
                        // This button state should ideally not be seen if logic is correct
                        <Button onClick={() => {}} className="mt-4 w-full">
                            Mark Roadmap as Complete
                        </Button>
                     )
                  )}
                </CardContent>
              </Card>
            </>
          )}

          {isLoading && (
            <Card className="flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                <p className="mt-4">Generating your personalized path...</p>
              </div>
            </Card>
          )}

        </div>
      </div>
    </main>
  );
}
