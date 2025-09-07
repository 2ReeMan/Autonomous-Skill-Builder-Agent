'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { SignInButton } from './sign-in-button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from '@/components/ui/dialog';
import { SignInForm } from './sign-in-form';

export function StartJourneyButton() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSignInOpen, setIsSignInOpen] = useState(false);

  const handleClick = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      setIsSignInOpen(true);
    }
  };

  return (
    <>
      <Button size="lg" onClick={handleClick}>
        Start Your Journey <ArrowRight className="ml-2" />
      </Button>
      <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome Back!</DialogTitle>
            <DialogDescription>
              Sign in to continue your learning journey.
            </DialogDescription>
          </DialogHeader>
          <SignInForm onSignIn={() => setIsSignInOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
