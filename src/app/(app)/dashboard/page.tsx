'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { CheckCircle, Zap, Target } from 'lucide-react';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { useAuth } from '@/hooks/use-auth';
import { useUserProgress } from '@/hooks/use-user-progress';

const chartData = [
  { month: 'January', skills: 4 },
  { month: 'February', skills: 3 },
  { month: 'March', skills: 7 },
  { month: 'April', skills: 5 },
  { month: 'May', skills: 6 },
  { month: 'June', skills: 9 },
];

const chartConfig = {
  skills: {
    label: 'Skills Mastered',
    color: 'hsl(var(--primary))',
  },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { completedCourses, averageScore, loading } = useUserProgress();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader 
          title={`Welcome Back, ${user?.displayName || 'Learner'}!`}
          description="Here's a snapshot of your learning progress. Keep up the great work!"
        />
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCourses.length}</div>
              <p className="text-xs text-muted-foreground">Keep it up!</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">Your average quiz score.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Goal</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold truncate">Full-Stack Developer</div>
              <p className="text-xs text-muted-foreground">Focus on your goal!</p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Completed Courses</CardTitle>
              <CardDescription>Courses you have successfully completed.</CardDescription>
            </CardHeader>
            <CardContent>
              {completedCourses.length > 0 ? (
                <ul className="space-y-2">
                  {completedCourses.map((course) => (
                    <li key={course.courseId} className="flex justify-between items-center">
                      <span>{course.courseId}</span>
                      <span className="font-semibold text-primary">{course.score.toFixed(0)}%</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">You haven’t completed any courses yet. Finish a course to see it here!</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Progress</CardTitle>
              <CardDescription>Number of new skills mastered each month.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip cursor={false} content={<ChartTooltipContent />} />
                    <Bar dataKey="skills" fill="var(--color-skills)" radius={8} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
