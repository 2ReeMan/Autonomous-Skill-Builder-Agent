'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Lightbulb } from 'lucide-react';

import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getProjectRecommendations } from '@/ai/flows/get-project-recommendations';

const projectFormSchema = z.object({
  learningProgress: z.string().min(5, { message: 'Please describe your progress in more detail.' }),
  interests: z.string().min(2, { message: 'Please list at least one interest.' }),
  desiredDifficulty: z.enum(['beginner', 'intermediate', 'advanced']),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function ProjectsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      learningProgress: '',
      interests: '',
      desiredDifficulty: 'intermediate',
    },
  });

  async function onSubmit(values: ProjectFormValues) {
    setIsLoading(true);
    setRecommendations([]);
    try {
      const result = await getProjectRecommendations(values);
      setRecommendations(result.projectRecommendations);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem getting project recommendations. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="Project Recommendations"
          description="Get project ideas to apply your skills and build your portfolio."
        />
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Find Your Next Project</CardTitle>
              <CardDescription>Tell us about your progress and interests.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-3">
                  <FormField
                    control={form.control}
                    name="learningProgress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Learning Progress</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Completed React basics, familiar with Node.js" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interests</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., AI, Web Development, Data Science" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="desiredDifficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full !mt-8">
                      {isLoading ? <Loader2 className="animate-spin" /> : 'Get Recommendations'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && recommendations.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
                <Lightbulb className="mx-auto h-12 w-12" />
                <p className="mt-4">Your project ideas will appear here.</p>
            </div>
          )}
          {recommendations.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="text-primary"/>
                        Project Idea
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{rec}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
