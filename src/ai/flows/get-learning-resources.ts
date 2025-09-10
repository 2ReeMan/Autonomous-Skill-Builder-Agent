'use server';
/**
 * @fileOverview A flow for generating learning resources for a given topic.
 *
 * - getLearningResources - A function that fetches learning resources.
 * - GetLearningResourcesInput - The input type for the function.
 * - GetLearningResourcesOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ResourceSchema = z.object({
  title: z.string().describe('The title of the resource or video.'),
  url: z.string().url().describe('The full URL to the resource or video.'),
});

export const GetLearningResourcesInputSchema = z.object({
  topic: z.string().describe('The topic to get learning resources for.'),
});

export const GetLearningResourcesOutputSchema = z.object({
  resources: z.array(ResourceSchema).describe('A list of high-quality articles, tutorials, or documentation.'),
  youtubeLinks: z.array(ResourceSchema).describe('A list of relevant YouTube videos.'),
});

export type GetLearningResourcesInput = z.infer<typeof GetLearningResourcesInputSchema>;
export type GetLearningResourcesOutput = z.infer<typeof GetLearningResourcesOutputSchema>;

export async function getLearningResources(
  input: GetLearningResourcesInput
): Promise<GetLearningResourcesOutput> {
  return getLearningResourcesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getLearningResourcesPrompt',
  input: { schema: GetLearningResourcesInputSchema },
  output: { schema: GetLearningResourcesOutputSchema },
  prompt: `You are an AI learning assistant. For the given topic, provide a list of 2-3 high-quality articles/tutorials and 2-3 relevant YouTube videos to help someone learn about it. For YouTube links, create a youtube search query URL (e.g., "https://www.youtube.com/results?search_query=...") to ensure the links are always functional.

Topic: {{{topic}}}
`,
});

const getLearningResourcesFlow = ai.defineFlow(
  {
    name: 'getLearningResourcesFlow',
    inputSchema: GetLearningResourcesInputSchema,
    outputSchema: GetLearningResourcesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
