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
import { QuizQuestionSchema } from '@/ai/schema/quiz-schema';

const RoadmapResourceSchema = z.object({
  title: z.string().describe("The title of the resource or video."),
  url: z.string().url().describe("The full URL to the resource or video."),
});

const RoadmapStepSchema = z.object({
  title: z.string().describe("The title of this step in the roadmap."),
  description: z.string().describe("A concise description of what this step covers."),
  keyConcepts: z.array(z.string()).describe("A list of key concepts to learn in this step."),
  resources: z.array(RoadmapResourceSchema).describe("A list of high-quality articles, tutorials, or documentation."),
  youtubeLinks: z.array(RoadmapResourceSchema).describe("A list of relevant YouTube videos. The URL should be a YouTube search query if a specific video is not available."),
});

const GeneratePersonalizedRoadmapOutputSchema = z.object({
  title: z.string().describe("The main title for the entire learning roadmap."),
  introduction: z.string().describe("A brief, encouraging introduction to the roadmap."),
  steps: z.array(RoadmapStepSchema).describe("An array of 3-5 learning steps."),
  conclusion: z.string().describe("A motivating conclusion to wrap up the roadmap."),
  quiz: z.array(QuizQuestionSchema).describe('A quiz with 10 questions to test the user\'s knowledge on the roadmap topics.'),
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
their current skills, and desired roadmap length as input, and generate a personalized,
structured learning roadmap for them. The roadmap should be broken down into 3-5 distinct steps.
For each step, provide a title, description, key concepts, a list of article/documentation resources,
and a list of YouTube video resources. For YouTube links, create a youtube search query URL (e.g., "https://www.youtube.com/results?search_query=...")
to ensure the links are always functional and relevant. Also generate a comprehensive 10-question quiz based on the topics in the roadmap.

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
