"use client";

import { SignUp } from "@clerk/nextjs";
import { Shield } from "lucide-react";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import {
  clerkLightVars,
  clerkDarkVars,
  clerkElementOverrides,
} from "../../clerkTheme";

export default function SignUpPage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Shield className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Contract Guard
        </h1>
        <p className="text-muted-foreground text-sm">
          Create an account to get started
        </p>
      </div>
      <SignUp
        appearance={{
          baseTheme: isDark ? dark : undefined,
          variables: isDark ? clerkDarkVars : clerkLightVars,
          elements: clerkElementOverrides,
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
      />
    </div>
  );
}
