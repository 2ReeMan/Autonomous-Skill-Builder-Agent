'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SignInForm } from './sign-in-form';
import { SignUpForm } from './sign-up-form';
import { useState } from 'react';
import Link from 'next/link';

export function SignInButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        Sign In
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome Back!</DialogTitle>
            <DialogDescription>
              Sign in to continue your learning journey.
            </DialogDescription>
          </DialogHeader>
          <SignInForm onSignIn={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
