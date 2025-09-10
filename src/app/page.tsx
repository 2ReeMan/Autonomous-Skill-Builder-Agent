import Link from 'next/link';
import { ArrowRight, Bot, GitMerge, Lightbulb, Zap, CheckCircle, BarChart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeatureCard } from '@/components/feature-card';
import { AppLogo } from '@/components/app-logo';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <AppLogo className="h-6 w-6 text-primary" />
            <span className="font-bold font-headline text-lg">LearnFlowAI</span>
          </Link>
          <nav className="flex items-center gap-2">
             <Button variant="ghost" asChild>
                <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button asChild>
                <Link href="/sign-up">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid place-items-center gap-8 px-4 py-24 text-center md:py-32">
          <div className="space-y-6">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Unlock Your Potential with AI-Powered Learning
            </h1>
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
              LearnFlowAI crafts personalized learning roadmaps, recommends projects, and provides instant tutoring to help you master new skills faster than ever.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
                <Link href="/sign-up">Start Your Journey <ArrowRight className="ml-2" /></Link>
            </Button>
          </div>
        </section>

        <section id="features" className="container space-y-12 py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-headline text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Everything you need to accelerate your learning and build your dream career.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<GitMerge />}
              title="Personalized Roadmaps"
              description="Get a step-by-step, AI-generated learning path tailored to your specific career goals and existing skills."
            />
            <FeatureCard
              icon={<Lightbulb />}
              title="AI Project Recommendations"
              description="Apply your knowledge with project suggestions that match your interests and skill level."
            />
            <FeatureCard
              icon={<Zap />}
              title="Adaptive Assessments"
              description="Test your knowledge with smart quizzes that adjust in difficulty to challenge you appropriately."
            />
            <FeatureCard
              icon={<Bot />}
              title="AI Chatbot Tutor"
              description="Stuck on a concept? Get instant, personalized help and resources from your AI tutor, 24/7."
            />
             <FeatureCard
              icon={<BarChart/>}
              title="Progress Tracking"
              description="Visualize your journey with a detailed dashboard tracking your course completions, quiz scores, and skill mastery."
            />
            <FeatureCard
              icon={<BookOpen/>}
              title="Skill Catalog"
              description="Explore a vast library of skills, from programming languages to design principles, and add them to your learning plan."
            />
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container flex h-14 items-center justify-center text-sm text-muted-foreground">
          © 2025 LearnFlowAI. All Rights Reserved To Botla Varshini
        </div>
      </footer>
    </div>
  );
}
