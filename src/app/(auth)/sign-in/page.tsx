import Link from 'next/link';
import { AppLogo } from '@/components/app-logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignInForm } from '@/components/auth/sign-in-form';

export default function SignInPage() {
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
                <CardTitle>Welcome Back!</CardTitle>
                <CardDescription>
                Sign in to continue your learning journey.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SignInForm />
                <div className="mt-4 text-center text-sm">
                    Don't have an account?{' '}
                    <Link href="/sign-up" className="underline">
                        Sign up
                    </Link>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
