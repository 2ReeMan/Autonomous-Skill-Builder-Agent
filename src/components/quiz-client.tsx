'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, X, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface QuizClientProps {
  questions: QuizQuestion[];
  onQuizFinish: (score: number) => void;
  onCompleteButton?: React.ReactNode;
}

export function QuizClient({ questions, onQuizFinish, onCompleteButton }: QuizClientProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);

  const handleAnswerSelect = (answer: string) => {
    if (feedback) return; // Don't do anything if feedback is already being shown

    setSelectedAnswer(answer);

    const question = questions[currentQuestion];
    const isCorrect = answer === question.correctAnswer;
    const newScore = isCorrect ? score + 1 : score;

    if (isCorrect) {
      setScore(newScore);
    }

    setFeedback({ correct: isCorrect, explanation: question.explanation });

    setTimeout(() => {
      setSelectedAnswer(null);
      setFeedback(null);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setIsFinished(true);
        const finalScore = (newScore / questions.length) * 100;
        onQuizFinish(finalScore);
      }
    }, 3000); // Wait 3 seconds before moving to the next question or finishing
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
  };

  if (!questions || questions.length === 0) {
    return <p>No questions available for this quiz.</p>;
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const scorePercentage = (score / questions.length) * 100;

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        {!isFinished ? (
          <>
            <CardContent className="pt-6">
              <p className="font-semibold">{questions[currentQuestion].question}</p>
              <Progress value={progress} className="my-4" />
              <RadioGroup
                value={selectedAnswer ?? ''}
                onValueChange={handleAnswerSelect}
                disabled={!!feedback}
                className="space-y-4"
              >
                {questions[currentQuestion].options.map((option) => {
                  const isCorrectAnswer = option === questions[currentQuestion].correctAnswer;
                  const isSelected = selectedAnswer === option;
                  return (
                    <Label
                      key={option}
                      className={cn(
                        'flex items-center space-x-3 rounded-md border p-4 transition-colors hover:bg-accent',
                        feedback && isCorrectAnswer && 'border-green-500 bg-green-500/10',
                        feedback && isSelected && !isCorrectAnswer && 'border-red-500 bg-red-500/10'
                      )}
                    >
                      <RadioGroupItem value={option} />
                      <span>{option}</span>
                      {feedback && isCorrectAnswer && <Check className="ml-auto h-5 w-5 text-green-500" />}
                      {feedback && isSelected && !isCorrectAnswer && <X className="ml-auto h-5 w-5 text-red-500" />}
                    </Label>
                  );
                })}
              </RadioGroup>

              {feedback && (
                <Alert variant={feedback.correct ? 'default' : 'destructive'} className="mt-4 animate-in fade-in">
                  <AlertTitle>{feedback.correct ? 'Correct!' : 'Incorrect'}</AlertTitle>
                  <AlertDescription>
                    {feedback.correct
                      ? feedback.explanation
                      : `The correct answer is "${questions[currentQuestion].correctAnswer}". ${feedback.explanation}`}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </>
        ) : (
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-2xl font-bold font-headline">Quiz Completed!</h2>
            <p className="mt-2 text-muted-foreground">You scored</p>
            <p className="my-4 text-5xl font-bold text-primary">{scorePercentage.toFixed(0)}%</p>
            <p className="text-muted-foreground">
              ({score} / {questions.length} correct)
            </p>
            {onCompleteButton ? (
              onCompleteButton
            ) : (
              <Button onClick={handleRestart} className="mt-6">
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
