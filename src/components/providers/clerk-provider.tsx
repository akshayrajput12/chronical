'use client';

import { ClerkProvider as ClerkProviderOriginal } from '@clerk/nextjs';
import { ReactNode } from 'react';

export function ClerkProvider({ children }: { children: ReactNode }) {
  return <ClerkProviderOriginal>{children}</ClerkProviderOriginal>;
}
