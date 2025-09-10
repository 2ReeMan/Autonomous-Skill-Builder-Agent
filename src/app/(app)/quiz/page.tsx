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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateQuiz, QuizQuestion } from '@/ai/flows/generate-quiz';
import { QuizClient } from '@/components/quiz-client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const quizFormSchema = z.object({
  topic: z.string().min(2, { message: 'Please enter a topic.' }),
});

type QuizFormValues = z.infer<typeof quizFormSchema>;

export default function QuizPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [quizData, setQuizData] = useState<QuizQuestion[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(values: QuizFormValues) {
    setIsLoading(true);
    setQuizData(null);
    setError(null);
    try {
      const result = await generateQuiz(values);
      setQuizData(result.quiz);
    } catch (error: any) {
      console.error(error);
      let description = 'There was a problem generating your quiz. Please try again.';
      if (error.message && error.message.includes('503')) {
        description = "The AI model is currently overloaded. Please wait a moment and try again.";
      } else if (error.status === 429) {
        description = "You have made too many requests. Please wait a while before trying again.";
      }
      
      setError(description);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description,
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleQuizFinish = (score: number) => {
    toast({
      title: "Quiz Finished!",
      description: `You scored ${score.toFixed(0)}%. Great job!`,
    });
    // You could add logic here to save the score if needed
  };

  const startNewQuiz = () => {
    setQuizData(null);
    form.reset();
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="AI-Powered Quiz Generator"
          description="Test your knowledge on any topic. Our AI will create a unique quiz just for you."
        />
        <div className="mt-6 mx-auto max-w-2xl">
          {!quizData ? (
            <Card>
              <CardHeader>
                <CardTitle>Create a Quiz</CardTitle>
                <CardDescription>What do you want to be quizzed on?</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., React Hooks, Python Data Structures" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {error && (
                      <Alert variant="destructive">
                        <AlertTitle>Generation Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" disabled={isLoading} className="w-full">
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        <>
                          <Wand2 className="mr-2" />
                          Generate Quiz
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <div>
              <Card className='mb-4'>
                <CardHeader>
                    <CardTitle>Quiz on: {form.getValues('topic')}</CardTitle>
                    <CardDescription>Test your knowledge with these AI-generated questions.</CardDescription>
                </CardHeader>
              </Card>
              <QuizClient 
                questions={quizData} 
                onQuizFinish={handleQuizFinish}
              />
              <Button onClick={startNewQuiz} variant="outline" className="mt-4 w-full">
                Create a New Quiz
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
