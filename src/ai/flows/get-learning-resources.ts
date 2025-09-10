'use server';
/**
 * @fileOverview A flow for generating learning resources for a given topic.
 *
 * - getLearningResources - A function that fetches learning resources.
 */

import { ai } from '@/ai/genkit';
import {
  GetLearningResourcesInputSchema,
  GetLearningResourcesOutputSchema,
  type GetLearningResourcesInput,
  type GetLearningResourcesOutput,
} from '@/ai/schema/learning-resources-schema';

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
