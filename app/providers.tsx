"use client";

import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { type ReactNode } from "react";
import {
  clerkLightVars,
  clerkDarkVars,
  clerkElementOverrides,
} from "./clerkTheme";

interface ProviderProps {
  children: ReactNode;
}

function ClerkThemeProvider({ children }: ProviderProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <ClerkProvider
      appearance={{
        cssLayerName: "clerk",
        baseTheme: isDark ? dark : undefined,
        variables: isDark ? clerkDarkVars : clerkLightVars,
        elements: clerkElementOverrides,
      }}
    >
      {children}
    </ClerkProvider>
  );
}

export function Providers({ children }: ProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
    >
      <ClerkThemeProvider>{children}</ClerkThemeProvider>
    </NextThemesProvider>
  );
}
