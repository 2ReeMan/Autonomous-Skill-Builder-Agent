'use server';
/**
 * @fileOverview A flow for generating a quiz on a given topic.
 *
 * - generateQuiz - A function that generates a quiz.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 * - QuizQuestionSchema - The Zod schema for a single quiz question.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('A list of 4 multiple-choice options.'),
  correctAnswer: z.string().describe('The correct answer from the options.'),
  explanation: z
    .string()
    .describe('A detailed explanation of why the correct answer is correct.'),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

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
