
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
import { SignUpForm } from './sign-up-form';
import { useState } from 'react';
import { ArrowRight, Phone } from 'lucide-react';

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
              <SignUpForm onSignUp={() => setOpen(false)} />
            </TabsContent>
            <TabsContent value="phone">
              {/* Phone Sign Up Form will go here */}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}
