import { z } from 'genkit';

/**
 * @fileOverview Defines the Zod schema for a single quiz question.
 * This is in its own file to avoid violating 'use server' export rules.
 *
 * - QuizQuestionSchema - The Zod schema for a single quiz question.
 * - QuizQuestion - The TypeScript type inferred from the schema.
 */

export const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('A list of 4 multiple-choice options.'),
  correctAnswer: z.string().describe('The correct answer from the options.'),
  explanation: z
    .string()
    .describe('A detailed explanation of why the correct answer is correct.'),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
