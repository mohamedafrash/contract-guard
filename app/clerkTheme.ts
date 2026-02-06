export const clerkLightVars = {
  colorBackground: 'hsl(0, 0%, 100%)',
  colorText: 'hsl(222, 47%, 11%)',
  colorTextSecondary: 'hsl(215, 16%, 47%)',
  colorPrimary: 'hsl(217, 91%, 60%)',
  colorInputBackground: 'hsl(0, 0%, 100%)',
  colorInputText: 'hsl(222, 47%, 11%)',
  colorNeutral: 'hsl(222, 47%, 11%)',
  borderRadius: '0.75rem',
} as const;

export const clerkDarkVars = {
  colorBackground: 'hsl(222, 47%, 14%)',
  colorText: 'hsl(210, 40%, 98%)',
  colorTextSecondary: 'hsl(215, 20%, 65%)',
  colorPrimary: 'hsl(217, 91%, 60%)',
  colorInputBackground: 'hsl(222, 47%, 11%)',
  colorInputText: 'hsl(210, 40%, 98%)',
  colorNeutral: 'hsl(210, 40%, 98%)',
  borderRadius: '0.75rem',
} as const;

export const clerkElementOverrides = {
  rootBox: 'mx-auto w-full max-w-md',
  cardBox: 'shadow-sm rounded-2xl border border-[hsl(var(--border))]',
  card: 'bg-[hsl(var(--card))]',
  headerTitle: 'text-[hsl(var(--foreground))]',
  headerSubtitle: 'text-[hsl(var(--muted-foreground))]',
  socialButtonsBlockButton:
    'bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] border border-[hsl(var(--border))] hover:opacity-80',
  formButtonPrimary:
    'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:opacity-90 shadow-sm',
  footerActionLink: 'text-[hsl(var(--primary))] hover:opacity-80',
  formFieldInput:
    'bg-[hsl(var(--background))] border-[hsl(var(--border))] text-[hsl(var(--foreground))]',
  formFieldLabel: 'text-[hsl(var(--foreground))]',
  dividerLine: 'bg-[hsl(var(--border))]',
  dividerText: 'text-[hsl(var(--muted-foreground))]',
  identityPreviewEditButton: 'text-[hsl(var(--primary))]',
  footer: 'bg-transparent',
} as const;
