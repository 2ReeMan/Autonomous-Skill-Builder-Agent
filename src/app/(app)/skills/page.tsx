'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { generatePersonalizedRoadmap, GeneratePersonalizedRoadmapOutput } from '@/ai/flows/generate-personalized-roadmap';
import { useUserProgress } from '@/hooks/use-user-progress';
import { QuizClient } from '@/components/quiz-client';

const skills = [
  { name: 'JavaScript', category: 'Web Development', description: 'The language of the web. Essential for front-end and back-end development.' },
  { name: 'React', category: 'Web Development', description: 'A popular JavaScript library for building user interfaces.' },
  { name: 'Node.js', category: 'Web Development', description: 'A JavaScript runtime for building fast and scalable server-side applications.' },
  { name: 'Python', category: 'Data Science', description: 'A versatile language widely used in data analysis, machine learning, and AI.' },
  { name: 'SQL', category: 'Databases', description: 'The standard language for managing and querying relational databases.' },
  { name: 'Docker', category: 'DevOps', description: 'A platform for developing, shipping, and running applications in containers.' },
  { name: 'Figma', category: 'UI/UX Design', description: 'A collaborative interface design tool for creating websites, apps, and more.' },
  { name: 'TypeScript', category: 'Web Development', description: 'A typed superset of JavaScript that compiles to plain JavaScript.' },
  { name: 'GraphQL', category: 'APIs', description: 'A query language for APIs and a runtime for fulfilling those queries with your existing data.' },
];

type Skill = typeof skills[0];

export default function SkillsPage() {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [generatedData, setGeneratedData] = useState<GeneratePersonalizedRoadmapOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const { completeCourse, isCourseCompleted } = useUserProgress();
  
  const handleSkillSelect = async (skill: Skill) => {
    setSelectedSkill(skill);
    setIsLoading(true);
    setGeneratedData(null);
    setQuizFinished(false);
    try {
      const result = await generatePersonalizedRoadmap({
        goal: `Master ${skill.name}`,
        currentSkills: 'Beginner',
        desiredRoadmapLength: 'short',
      });
      setGeneratedData(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteCourse = (score: number) => {
    if (!selectedSkill) return;
    completeCourse(selectedSkill.name, score);
  };

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="Skill Catalog"
          description="Explore our extensive library of skills and add them to your learning plan."
        />
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {skills.map((skill) => (
            <Card key={skill.name} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{skill.name}</CardTitle>
                  <Badge variant="secondary">{skill.category}</Badge>
                </div>
                <CardDescription>{skill.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                {isCourseCompleted(skill.name) ? (
                  <Button variant="outline" disabled className="w-full">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Completed
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" onClick={() => handleSkillSelect(skill)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Start Learning
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedSkill} onOpenChange={(isOpen) => !isOpen && setSelectedSkill(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedSkill?.name}</DialogTitle>
            <DialogDescription>Your learning path and assessment for {selectedSkill?.name}.</DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">Loading...</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 overflow-y-auto pr-2">
              <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-foreground">
                <div dangerouslySetInnerHTML={{ __html: generatedData?.roadmap.replace(/\n/g, '<br />') || "" }} />
              </div>
              <div>
                {generatedData?.quiz && (
                  <QuizClient 
                    questions={generatedData.quiz}
                    onQuizFinish={(score) => {
                      setQuizFinished(true);
                      handleCompleteCourse(score);
                    }}
                  />
                )}
                {quizFinished && (
                  isCourseCompleted(selectedSkill?.name || "") ? (
                    <Button disabled className="mt-4 w-full">
                        <CheckCircle className="mr-2"/>
                        Course Completed
                    </Button>
                  ) : (
                    // This button state should ideally not be seen if logic is correct
                    <Button onClick={() => {}} className="mt-4 w-full">
                        Mark Course as Complete
                    </Button>
                  )
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
