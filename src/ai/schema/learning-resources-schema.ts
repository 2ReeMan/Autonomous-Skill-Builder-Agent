import { z } from 'genkit';

/**
 * @fileOverview Defines the Zod schemas for the learning resources flow.
 *
 * - GetLearningResourcesInputSchema - The Zod schema for the input.
 * - GetLearningResourcesOutputSchema - The Zod schema for the output.
 * - GetLearningResourcesInput - The TypeScript type for the input.
 * - GetLearningResourcesOutput - The TypeScript type for the output.
 */

const ResourceSchema = z.object({
  title: z.string().describe('The title of the resource or video.'),
  url: z.string().url().describe('The full URL to the resource or video.'),
});

export const GetLearningResourcesInputSchema = z.object({
  topic: z.string().describe('The topic to get learning resources for.'),
});

export const GetLearningResourcesOutputSchema = z.object({
  resources: z
    .array(ResourceSchema)
    .describe(
      'A list of high-quality articles, tutorials, or documentation.'
    ),
  youtubeLinks: z
    .array(ResourceSchema)
    .describe('A list of relevant YouTube videos.'),
});

export type GetLearningResourcesInput = z.infer<
  typeof GetLearningResourcesInputSchema
>;
export type GetLearningResourcesOutput = z.infer<
  typeof GetLearningResourcesOutputSchema
>;
