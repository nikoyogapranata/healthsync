//components\ui\header.tsx

"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state
import { User, Settings, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client"; // Import the correct client

type HeaderProps = {
  pageTitle: string;
};

// --- Helper function to get user initials ---
function getInitials(name: string): string {
  if (!name) return "";
  const names = name.split(' ');
  const firstInitial = names[0]?.[0] || '';
  const lastInitial = names.length > 1 ? names[names.length - 1]?.[0] || '' : '';
  return `${firstInitial}${lastInitial}`.toUpperCase();
}

export function Header({ pageTitle }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();
  
  // State to hold user data and loading status
  const [userData, setUserData] = useState<{
    fullName: string;
    email: string;
    initials: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      // 1. Get user from the session
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // 2. Function to find the user's full name from different profile tables
        const getFullName = async (userId: string) => {
          const tablesToTry = ['patients', 'doctors', 'admins', 'directors'];
          for (const table of tablesToTry) {
            const { data, error } = await supabase
              .from(table)
              .select('full_name')
              .eq('user_id', userId)
              .single();
            
            if (data?.full_name) {
              return data.full_name;
            }
          }
          return user.email; // Fallback to email if no profile found
        };

        const fullName = await getFullName(user.id);
        const initials = getInitials(fullName);
        
        setUserData({
          fullName,
          email: user.email || '',
          initials,
        });
      }
      setLoading(false);
    };

    fetchUserData();
  }, [supabase]);

  // --- Sign Out Functionality ---
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh(); // Ensure a clean state after logout
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
      <SidebarTrigger className="-ml-1 hover:bg-accent/50 transition-colors" />
      <Separator orientation="vertical" className="mr-2 h-4 bg-border/60" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium text-foreground">{pageTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full p-0 hover:bg-accent/50 transition-colors"
            >
              {loading ? (
                <Skeleton className="size-9 rounded-full" />
              ) : (
                <div className="flex items-center justify-center size-8 rounded-full bg-gradient-to-br from-[#3FB6F6] to-[#34D399] text-white font-semibold text-sm">
                  {userData?.initials || '...'}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {userData && (
              <>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userData.fullName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="hover:bg-accent/50 cursor-pointer">
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="hover:bg-accent/50 cursor-pointer">
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem
              onClick={handleSignOut}
              className="hover:bg-accent/50 text-red-600 focus:text-red-600 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}