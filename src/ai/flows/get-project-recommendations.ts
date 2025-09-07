'use server';

/**
 * @fileOverview AI-powered project recommendations based on user learning progress and interests.
 *
 * - getProjectRecommendations - A function that handles the project recommendation process.
 * - GetProjectRecommendationsInput - The input type for the getProjectRecommendations function.
 * - GetProjectRecommendationsOutput - The return type for the getProjectRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetProjectRecommendationsInputSchema = z.object({
  learningProgress: z
    .string()
    .describe('The user learning progress (courses completed, modules finished).'),
  interests: z.string().describe('The user interests (e.g. AI, Web development).'),
  desiredDifficulty: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('The desired difficulty of the projects.'),
});
export type GetProjectRecommendationsInput = z.infer<typeof GetProjectRecommendationsInputSchema>;

const GetProjectRecommendationsOutputSchema = z.object({
  projectRecommendations: z
    .array(z.string())
    .describe('A list of project recommendations based on the user input.'),
});
export type GetProjectRecommendationsOutput = z.infer<typeof GetProjectRecommendationsOutputSchema>;

export async function getProjectRecommendations(
  input: GetProjectRecommendationsInput
): Promise<GetProjectRecommendationsOutput> {
  return getProjectRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getProjectRecommendationsPrompt',
  input: {schema: GetProjectRecommendationsInputSchema},
  output: {schema: GetProjectRecommendationsOutputSchema},
  prompt: `You are an AI project recommendation system. Given the user's learning progress, interests, and desired difficulty, you will suggest relevant projects that they can build to apply their knowledge and build a portfolio.

Learning Progress: {{{learningProgress}}}
Interests: {{{interests}}}
Desired Difficulty: {{{desiredDifficulty}}}

Suggest 3 projects.`,
});

const getProjectRecommendationsFlow = ai.defineFlow(
  {
    name: 'getProjectRecommendationsFlow',
    inputSchema: GetProjectRecommendationsInputSchema,
    outputSchema: GetProjectRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
