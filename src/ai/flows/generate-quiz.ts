'use server';
/**
 * @fileOverview A flow for generating a quiz on a given topic.
 *
 * - generateQuiz - A function that generates a quiz.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { QuizQuestionSchema, type QuizQuestion } from '@/ai/schema/quiz-schema';

export type { QuizQuestion };

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz.'),
});

export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  quiz: z.array(QuizQuestionSchema).describe('A quiz with 10 questions about the topic.'),
});

export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


export async function generateQuiz(
  input: GenerateQuizInput
): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an AI quiz generator. Create a 10-question multiple-choice quiz about the given topic. For each question, provide 4 options, a correct answer, and a detailed explanation for the correct answer.

Topic: {{{topic}}}
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
