'use client';

import { usePathname } from 'next/navigation';
import { Bot, GitMerge, LayoutDashboard, Lightbulb, BookMarked, FileQuestion, LogOut, CheckSquare } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppLogo } from './app-logo';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useSidebar } from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/skills', icon: BookMarked, label: 'Skills' },
  { href: '/roadmap', icon: GitMerge, label: 'Roadmap Generator' },
  { href: '/tutor', icon: Bot, label: 'AI Tutor' },
  { href: '/projects', icon: Lightbulb, label: 'AI Projects' },
  { href: '/quiz', icon: FileQuestion, label: 'AI Quiz' },
];

function UserProfile() {
    const { user, signOut } = useAuth();
    const { state } = useSidebar();

    if (state === 'collapsed') {
        return (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={signOut}>
                <LogOut />
            </Button>
        )
    }

    return (
        <div className="flex items-center gap-3 p-2">
            <Avatar>
                <AvatarImage src={user?.photoURL || "https://picsum.photos/100"} data-ai-hint="user avatar" alt="User avatar" />
                <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
                <p className="truncate font-semibold">{user?.displayName || 'User'}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={signOut}>
                <LogOut />
            </Button>
        </div>
    )
}

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex w-full items-center gap-2 p-2">
            <AppLogo className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg font-headline">LearnFlowAI</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                href={item.href}
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <a href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="items-center">
        <Separator className="my-2" />
        <UserProfile />
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
