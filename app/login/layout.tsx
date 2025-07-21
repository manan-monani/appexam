
// Layout for the login page, providing a minimal wrapper
// Ensures consistent styling and context for authentication pages
// Reference: HackerRank Clone document, Section 5.1 (Frontend Structure)

import { ReactNode } from 'react';

export default function LoginLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {children}
    </div>
  );
}
