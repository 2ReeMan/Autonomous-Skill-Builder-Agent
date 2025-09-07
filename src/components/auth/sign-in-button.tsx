
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
import { Phone } from 'lucide-react';
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
          <Tabs defaultValue="email">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone" disabled>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <SignInForm onSignIn={() => setOpen(false)} />
            </TabsContent>
            <TabsContent value="phone">
              {/* Phone Sign In Form will go here */}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
