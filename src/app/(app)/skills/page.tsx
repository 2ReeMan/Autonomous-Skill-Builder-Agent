
'use client';
import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, CheckCircle, Search, Loader2, Book, Youtube, FileQuestion, Lightbulb } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { generateQuiz, QuizQuestion } from '@/ai/flows/generate-quiz';
import { getLearningResources } from '@/ai/flows/get-learning-resources';
import { type GetLearningResourcesOutput } from '@/ai/schema/learning-resources-schema';
import { useUserProgress } from '@/hooks/use-user-progress';
import { QuizClient } from '@/components/quiz-client';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const skills = [
  { name: 'HTML', category: 'Web Development', description: 'The standard markup language for creating web pages and web applications.' },
  { name: 'CSS', category: 'Web Development', description: 'The language for describing the presentation of Web pages, including colors, layout, and fonts.' },
  { name: 'JavaScript', category: 'Web Development', description: 'The language of the web. Essential for front-end and back-end development.' },
  { name: 'TypeScript', category: 'Web Development', description: 'A typed superset of JavaScript that compiles to plain JavaScript.' },
  { name: 'React', category: 'Web Development', description: 'A popular JavaScript library for building user interfaces.' },
  { name: 'Next.js', category: 'Web Development', description: 'A React framework for building full-stack web applications.' },
  { name: 'Node.js', category: 'Web Development', description: 'A JavaScript runtime for building fast and scalable server-side applications.' },
  { name: 'Python', category: 'Data Science', description: 'A versatile language widely used in data analysis, machine learning, and AI.' },
  { name: 'SQL', category: 'Databases', description: 'The standard language for managing and querying relational databases.' },
  { name: 'MongoDB', category: 'Databases', description: 'A popular NoSQL database for building modern applications.' },
  { name: 'Docker', category: 'DevOps', description: 'A platform for developing, shipping, and running applications in containers.' },
  { name: 'Kubernetes', category: 'DevOps', description: 'An open-source system for automating deployment, scaling, and management of containerized applications.' },
  { name: 'Figma', category: 'UI/UX Design', description: 'A collaborative interface design tool for creating websites, apps, and more.' },
  { name: 'GraphQL', category: 'APIs', description: 'A query language for APIs and a runtime for fulfilling those queries with your existing data.' },
  { name: 'REST APIs', category: 'APIs', description: 'Architectural style for creating networked applications.' },
  { name: 'Git', category: 'Version Control', description: 'A free and open source distributed version control system.' },
  { name: 'Machine Learning', category: 'Data Science', description: 'The scientific study of algorithms and statistical models that computer systems use.' },
  { name: 'Cinematography', category: 'Film Production', description: 'The art of motion-picture photography, including lighting and camera techniques.' },
];

type Skill = typeof skills[0];

export default function SkillsPage() {
  const { toast } = useToast();
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [quizData, setQuizData] = useState<QuizQuestion[] | null>(null);
  const [resources, setResources] = useState<GetLearningResourcesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { completeCourse, isCourseCompleted } = useUserProgress();
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'resources' | 'quiz'>('resources');
  
  const handleSkillSelect = async (skill: Skill) => {
    setSelectedSkill(skill);
    setIsLoading(true);
    setQuizData(null);
    setResources(null);
    setView('resources');
    try {
      const result = await getLearningResources({ topic: skill.name });
      setResources(result);
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem fetching learning resources. Please try again.',
      });
      setSelectedSkill(null); // Close dialog on error
    } finally {
      setIsLoading(false);
    }
  };

  const startQuiz = async () => {
    if (!selectedSkill) return;
    setIsLoading(true);
    setQuizData(null);
    setView('quiz');
    try {
      const result = await generateQuiz({ topic: selectedSkill.name });
      setQuizData(result.quiz);
    } catch (error: any) {
      console.error(error);
      let description = "There was a problem generating the quiz. Please try again.";
      if (error.message && error.message.includes('503')) {
        description = "The AI model is currently overloaded. Please wait a moment and try again.";
      } else if (error.status === 429) {
        description = "You have made too many requests. Please wait a while before trying again.";
      }
      
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description,
      });
      setView('resources'); // Go back to resources view on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizFinish = (score: number) => {
    if (!selectedSkill) return;
    completeCourse(selectedSkill.name, score);
    toast({
      title: `${selectedSkill.name} Completed!`,
      description: `You scored ${score.toFixed(0)}%. Your progress has been updated.`,
    });
  };
  
  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="Skill Catalog"
          description="Explore our extensive library of skills and add them to your learning plan."
        />
        <div className="mt-6 mb-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search skills..."
            className="w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {filteredSkills.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSkills.map((skill) => (
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
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <p>No skills found matching "{searchTerm}".</p>
          </div>
        )}
      </div>

      <Dialog open={!!selectedSkill} onOpenChange={(isOpen) => !isOpen && setSelectedSkill(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Learn: {selectedSkill?.name}</DialogTitle>
            <DialogDescription>
                {view === 'resources' 
                    ? 'Review these materials, then take the quiz to test your knowledge.'
                    : 'Complete the quiz to mark this skill as complete.'}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-4">
                  {view === 'resources' ? 'Fetching resources...' : 'Generating your quiz...'}
                </p>
              </div>
            ) : view === 'resources' && resources ? (
                <div className="space-y-6">
                    {resources.keyConcepts && resources.keyConcepts.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center"><Lightbulb className="mr-2 h-4 w-4 text-primary"/> Key Concepts</h4>
                        <div className="flex flex-wrap gap-2">
                          {resources.keyConcepts.map(concept => <Badge key={concept} variant="secondary">{concept}</Badge>)}
                        </div>
                      </div>
                    )}
                    <div>
                        <h4 className="font-semibold mb-2 flex items-center"><Book className="mr-2 h-4 w-4 text-primary"/> Web Resources</h4>
                        <ul className="list-disc list-inside space-y-2">
                        {resources.resources.map(res => <li key={res.url}><a href={res.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{res.title}</a></li>)}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2 flex items-center"><Youtube className="mr-2 h-4 w-4 text-primary"/> YouTube Videos</h4>
                        <ul className="list-disc list-inside space-y-2">
                        {resources.youtubeLinks.map(link => <li key={link.url}><a href={link.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">{link.title}</a></li>)}
                        </ul>
                    </div>
                    <Button onClick={startQuiz} className="w-full mt-4">
                        <FileQuestion className="mr-2" />
                        Take the Quiz
                    </Button>
                </div>
            ) : view === 'quiz' && quizData ? (
              <QuizClient 
                questions={quizData}
                onQuizFinish={handleQuizFinish}
                onCompleteButton={
                  <DialogClose asChild>
                     <Button className="w-full mt-4">
                      <CheckCircle className="mr-2" />
                      Done
                    </Button>
                  </DialogClose>
                }
              />
            ) : (
                <p>No content available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
