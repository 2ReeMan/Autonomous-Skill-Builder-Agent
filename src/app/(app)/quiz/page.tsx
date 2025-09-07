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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const quizQuestions = [
  // ... 25 questions will be dynamically loaded ...
  {
    question: "What is the primary function of the 'useState' hook in React?",
    options: [
      'To manage side effects',
      'To manage state in functional components',
      'To fetch data from an API',
      'To create context for state sharing',
    ],
    answer: 'To manage state in functional components',
    explanation: "'useState' is a React Hook that lets you add a state variable to your component. It's the primary way to manage component-level state in functional components."
  },
  {
    question: 'Which of the following is NOT a core concept of Redux?',
    options: ['Store', 'Actions', 'Reducers', 'Components'],
    answer: 'Components',
    explanation: "While Redux is used with Components (like in React), Components themselves are not a core part of the Redux architecture. The core concepts are the Store (holds state), Actions (describe changes), and Reducers (execute changes)."
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
    explanation: 'CSS stands for Cascading Style Sheets. It is the language used to describe the presentation of a document written in a markup language like HTML.'
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<{correct: boolean, explanation: string} | null>(null);

  const handleNext = () => {
    const question = quizQuestions[currentQuestion];
    const isCorrect = selectedAnswer === question.answer;
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setFeedback({ correct: isCorrect, explanation: question.explanation });
    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      setFeedback(null);
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setIsFinished(true);
      }
    }, 4000); // Increased timeout to allow reading feedback
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const scorePercentage = (score / quizQuestions.length) * 100;

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
                       const isCorrectAnswer = option === quizQuestions[currentQuestion].answer;
                       const isSelected = selectedAnswer === option;
                      return (
                      <Label
                        key={option}
                        className={cn(
                          "flex items-center space-x-3 rounded-md border p-4 transition-colors hover:bg-accent",
                          showResult && isCorrectAnswer && "border-green-500 bg-green-500/10",
                          showResult && isSelected && !isCorrectAnswer && "border-red-500 bg-red-500/10"
                        )}
                      >
                        <RadioGroupItem value={option} />
                        <span>{option}</span>
                        {showResult && isCorrectAnswer && <Check className="ml-auto h-5 w-5 text-green-500" />}
                        {showResult && isSelected && !isCorrectAnswer && <X className="ml-auto h-5 w-5 text-red-500" />}
                      </Label>
                    )}
                    )}
                  </RadioGroup>

                  {showResult && feedback && (
                    <Alert variant={feedback.correct ? "default" : "destructive"} className="mt-4">
                       <AlertTitle>{feedback.correct ? 'Correct!' : 'Incorrect'}</AlertTitle>
                       <AlertDescription>
                        {feedback.correct ? feedback.explanation : `The correct answer is "${quizQuestions[currentQuestion].answer}". ${feedback.explanation}`}
                       </AlertDescription>
                    </Alert>
                  )}

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
                  {scorePercentage.toFixed(0)}%
                </p>
                <p className="text-muted-foreground">({score} / {quizQuestions.length} correct)</p>
                <Button onClick={handleRestart} className="mt-6">
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
