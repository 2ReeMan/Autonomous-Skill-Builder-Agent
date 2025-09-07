'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Wand2 } from 'lucide-react';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generatePersonalizedRoadmap } from '@/ai/flows/generate-personalized-roadmap';

const roadmapFormSchema = z.object({
  goal: z.string().min(5, { message: 'Please describe your goal in more detail.' }),
  currentSkills: z.string().min(2, { message: 'Please list at least one skill.' }),
  desiredRoadmapLength: z.enum(['short', 'medium', 'long']),
});

type RoadmapFormValues = z.infer<typeof roadmapFormSchema>;

export default function RoadmapPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<string | null>(null);

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
    setRoadmap(null);
    try {
      const result = await generatePersonalizedRoadmap(values);
      setRoadmap(result.roadmap);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem generating your roadmap. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="Personalized Roadmap"
          description="Tell us your goals, and our AI will craft a unique learning path just for you."
        />
        <div className="mt-6 grid gap-8 md:grid-cols-2">
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
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Your AI-Generated Path</CardTitle>
              <CardDescription>Your personalized roadmap will appear here.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center">
              {isLoading && <Loader2 className="h-12 w-12 animate-spin text-primary" />}
              {!isLoading && !roadmap && (
                <div className="text-center text-muted-foreground">
                    <Wand2 className="mx-auto h-12 w-12" />
                    <p className="mt-4">Ready to discover your learning journey?</p>
                </div>
              )}
              {roadmap && (
                <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-foreground">
                  {roadmap}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
