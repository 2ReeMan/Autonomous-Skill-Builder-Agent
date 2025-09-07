import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

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

export default function SkillsPage() {
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
                <Button variant="outline" className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add to my Roadmap
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
