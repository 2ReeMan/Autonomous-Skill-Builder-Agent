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

const GeneratePersonalizedRoadmapOutputSchema = z.object({
  roadmap: z.string().describe('A personalized learning roadmap for the user.'),
});

export type GeneratePersonalizedRoadmapOutput = z.infer<
  typeof GeneratePersonalizedRoadmapOutputSchema
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
learning roadmap for them.

User Goal: {{{goal}}}
Current Skills: {{{currentSkills}}}
Desired Roadmap Length: {{{desiredRoadmapLength}}}

Roadmap:`,
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
