
'use client';

import { useContext } from 'react';
import { AuthContext } from '@/features/authentication/AuthProvider';
import { AuthContextType } from '@/features/authentication/types';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
