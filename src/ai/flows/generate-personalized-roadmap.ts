'use server';

/**
 * @fileOverview Generates a personalized learning roadmap based on user goals and current skill level.
 *
 * - generatePersonalizedRoadmap - A function that generates the personalized learning roadmap.
 * - GeneratePersonalizedRoadmapInput - The input type for the generatePersonalizedRoadmap function.
 * - GeneratePersonalizedRoadmapOutput - The return type for the generatePersonalizedRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('A list of 4 multiple-choice options.'),
  correctAnswer: z.string().describe('The correct answer from the options.'),
  explanation: z
    .string()
    .describe('A detailed explanation of why the correct answer is correct.'),
});

const GeneratePersonalizedRoadmapOutputSchema = z.object({
  roadmap: z.string().describe('A personalized learning roadmap for the user in markdown format.'),
  quiz: z.array(QuizQuestionSchema).describe('A quiz with 25 questions to test the user\'s knowledge on the roadmap topics.'),
});

export type GeneratePersonalizedRoadmapOutput = z.infer<
  typeof GeneratePersonalizedRoadmapOutputSchema
>;


const GeneratePersonalizedRoadmapInputSchema = z.object({
  goal: z
    .string()
    .describe('The learning goal of the user (e.g., become a full-stack web developer).'),
  currentSkills: z
    .string()
    .describe('A comma separated list of the user\'s current skills (e.g., HTML, CSS, JavaScript).'),
  desiredRoadmapLength: z
    .string()
    .describe('The desired length of the roadmap, e.g. short, medium, or long.'),
});

export type GeneratePersonalizedRoadmapInput = z.infer<
  typeof GeneratePersonalizedRoadmapInputSchema
>;

export async function generatePersonalizedRoadmap(
  input: GeneratePersonalizedRoadmapInput
): Promise<GeneratePersonalizedRoadmapOutput> {
  return generatePersonalizedRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedRoadmapPrompt',
  input: {schema: GeneratePersonalizedRoadmapInputSchema},
  output: {schema: GeneratePersonalizedRoadmapOutputSchema},
  prompt: `You are an AI learning roadmap generator. You take a user's learning goal,
their current skills, and desired roadmap length as input, and generate a personalized
learning roadmap for them. Also generate a comprehensive 25-question quiz based on the topics in the roadmap.

User Goal: {{{goal}}}
Current Skills: {{{currentSkills}}}
Desired Roadmap Length: {{{desiredRoadmapLength}}}
`,
});

const generatePersonalizedRoadmapFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedRoadmapFlow',
    inputSchema: GeneratePersonalizedRoadmapInputSchema,
    outputSchema: GeneratePersonalizedRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
