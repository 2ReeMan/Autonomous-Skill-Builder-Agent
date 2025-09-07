'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, X, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const quizQuestions = [
  {
    question: "What is the primary function of the 'useState' hook in React?",
    options: [
      'To manage side effects',
      'To manage state in functional components',
      'To fetch data from an API',
      'To create context for state sharing',
    ],
    answer: 'To manage state in functional components',
  },
  {
    question: 'Which of the following is NOT a core concept of Redux?',
    options: ['Store', 'Actions', 'Reducers', 'Components'],
    answer: 'Components',
  },
  {
    question: 'What does CSS stand for?',
    options: [
      'Cascading Style Sheets',
      'Creative Style System',
      'Computer Style Sheets',
      'Colorful Style Syntax',
    ],
    answer: 'Cascading Style Sheets',
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const handleNext = () => {
    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].answer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <PageHeader
          title="Skill Assessment"
          description="Test your knowledge with our adaptive quizzes."
        />
        <div className="mt-6 mx-auto max-w-2xl">
          <Card>
            {!isFinished ? (
              <>
                <CardHeader>
                  <CardTitle>Question {currentQuestion + 1} of {quizQuestions.length}</CardTitle>
                  <CardDescription className="pt-2">{quizQuestions[currentQuestion].question}</CardDescription>
                  <Progress value={progress} className="mt-4" />
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={selectedAnswer ?? ''}
                    onValueChange={setSelectedAnswer}
                    disabled={showResult}
                    className="space-y-4"
                  >
                    {quizQuestions[currentQuestion].options.map((option) => {
                       const isCorrect = option === quizQuestions[currentQuestion].answer;
                       const isSelected = selectedAnswer === option;
                      return (
                      <Label
                        key={option}
                        className={cn(
                          "flex items-center space-x-3 rounded-md border p-4 transition-colors hover:bg-accent",
                          showResult && isCorrect && "border-green-500 bg-green-500/10",
                          showResult && isSelected && !isCorrect && "border-red-500 bg-red-500/10"
                        )}
                      >
                        <RadioGroupItem value={option} />
                        <span>{option}</span>
                        {showResult && isCorrect && <Check className="ml-auto h-5 w-5 text-green-500" />}
                        {showResult && isSelected && !isCorrect && <X className="ml-auto h-5 w-5 text-red-500" />}
                      </Label>
                    )}
                    )}
                  </RadioGroup>
                  <Button onClick={handleNext} disabled={!selectedAnswer || showResult} className="mt-6 w-full">
                    {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  </Button>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <h2 className="text-2xl font-bold font-headline">Quiz Completed!</h2>
                <p className="mt-2 text-muted-foreground">You scored</p>
                <p className="my-4 text-5xl font-bold text-primary">
                  {score} / {quizQuestions.length}
                </p>
                <Button onClick={handleRestart}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
