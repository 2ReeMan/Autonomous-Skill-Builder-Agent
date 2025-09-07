'use server';

/**
 * @fileOverview This file defines a Genkit flow for answering user questions and providing relevant learning resources.
 *
 * It includes:
 * - answerUserQuestions: The main function to process user questions and return answers with resources.
 * - AnswerUserQuestionsInput: The input type for the answerUserQuestions function.
 * - AnswerUserQuestionsOutput: The output type for the answerUserQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerUserQuestionsInputSchema = z.object({
  question: z.string().describe('The user question to be answered.'),
});

export type AnswerUserQuestionsInput = z.infer<typeof AnswerUserQuestionsInputSchema>;

const AnswerUserQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question.'),
  resources: z.array(z.string().url()).describe('A list of relevant learning resources (URLs) for the user.'),
});

export type AnswerUserQuestionsOutput = z.infer<typeof AnswerUserQuestionsOutputSchema>;

export async function answerUserQuestions(input: AnswerUserQuestionsInput): Promise<AnswerUserQuestionsOutput> {
  return answerUserQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerUserQuestionsPrompt',
  input: {schema: AnswerUserQuestionsInputSchema},
  output: {schema: AnswerUserQuestionsOutputSchema},
  prompt: `You are an AI chatbot tutor designed to provide personalized guidance and motivation to users.
Answer the user's question and provide relevant learning resources as URLs to help them overcome learning obstacles and stay engaged.

Question: {{{question}}}
`,
});

const answerUserQuestionsFlow = ai.defineFlow(
  {
    name: 'answerUserQuestionsFlow',
    inputSchema: AnswerUserQuestionsInputSchema,
    outputSchema: AnswerUserQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
