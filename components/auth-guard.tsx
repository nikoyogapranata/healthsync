//components\auth-guard.tsx

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client" // Import the correct client
import { Loader2 } from "lucide-react"
import { toast } from "./ui/use-toast"

// Define the roles your system uses
type UserRole = "superadmin"  | "regional_admin" | "admin" | "director" | "doctor" | "patient";

interface AuthGuardProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
  fallbackPath?: string
}

export function AuthGuard({ children, allowedRoles, fallbackPath = "/login" }: AuthGuardProps) {
  const supabase = createClient(); // Create the modern client instance
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // 1. Get the current user session from the browser cookie
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // If no user is logged in, redirect to the login page
        router.push(fallbackPath);
        return;
      }

      // 2. Get the user's profile from your 'users' table to check their role
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error || !userProfile) {
        console.error("Auth Guard Error: Could not find user profile.", error);
        toast({ title: "Authorization Error", description: "Your user profile could not be found.", variant: "destructive" });
        await supabase.auth.signOut(); // Log the user out for safety
        router.push(fallbackPath);
        return;
      }
      
      // 3. Check if the user's role is in the list of allowed roles for this page
      if (!allowedRoles.includes(userProfile.role as UserRole)) {
        toast({ title: "Access Denied", description: "You are not authorized to view this page.", variant: "destructive" });
        
        // Redirect logic based on their actual role
        switch (userProfile.role as UserRole) {
          case "regional_admin": router.push("/regional-admin-dashboard"); break;
          case "superadmin": router.push("/superadmin-dashboard"); break;
          case "patient": router.push("/dashboard"); break;
          case "doctor": router.push("/doctor-dashboard"); break;
          case "admin": router.push("/admin-dashboard"); break;
          case "director": router.push("/director-dashboard"); break;
          default: router.push("/"); break;
        }
        return;
      }

      // 4. If all checks pass, authorize the user
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [allowedRoles, fallbackPath, router, supabase]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-4">Verifying access...</p>
      </div>
    );
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return null;
}