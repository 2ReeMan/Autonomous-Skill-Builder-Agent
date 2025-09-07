'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { SignUpForm } from './sign-up-form';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export function SignUpButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Get Started <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create an Account</DialogTitle>
            <DialogDescription>
              Start your personalized learning journey with LearnFlowAI.
            </DialogDescription>
          </DialogHeader>
          <SignUpForm onSignUp={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
