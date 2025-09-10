import Link from 'next/link';
import { AppLogo } from '@/components/app-logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignUpForm } from '@/components/auth/sign-up-form';

export default function SignUpPage() {
    return (
      <div className="w-full max-w-md space-y-6">
          <div className="flex justify-center">
              <Link href="/" className="flex items-center gap-2">
                  <AppLogo className="h-8 w-8 text-primary" />
                  <span className="font-bold font-headline text-2xl">LearnFlowAI</span>
              </Link>
          </div>
          <Card>
              <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>
                  Start your personalized learning journey with LearnFlowAI.
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  <SignUpForm />
                  <div className="mt-4 text-center text-sm">
                        Already have an account?{' '}
                      <Link href="/sign-in" className="underline">
                          Sign in
                      </Link>
                  </div>
              </CardContent>
          </Card>
      </div>
    );
  }
  