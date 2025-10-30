import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DAILY_CREDITS } from '@/utils/constants';
import type { CreditState } from '@/types/credit.types';

interface CreditContextType {
  credits: CreditState;
  deductCredit: () => Promise<void>;
  resetCredits: () => void;
}

const CreditContext = createContext<CreditContextType | undefined>(undefined);

const getNextMidnight = (): Date => {
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return midnight;
};

const loadCreditsFromStorage = (): CreditState => {
  const stored = localStorage.getItem('credits');
  if (stored) {
    const parsed = JSON.parse(stored);
    const resetAt = new Date(parsed.resetAt);
    
    // Check if we've passed midnight
    if (new Date() >= resetAt) {
      return {
        total: DAILY_CREDITS,
        used: 0,
        remaining: DAILY_CREDITS,
        resetAt: getNextMidnight()
      };
    }
    
    return {
      ...parsed,
      resetAt
    };
  }
  
  return {
    total: DAILY_CREDITS,
    used: 0,
    remaining: DAILY_CREDITS,
    resetAt: getNextMidnight()
  };
};

export const CreditProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [credits, setCredits] = useState<CreditState>(loadCreditsFromStorage);

  useEffect(() => {
    localStorage.setItem('credits', JSON.stringify(credits));
  }, [credits]);

  useEffect(() => {
    const checkReset = setInterval(() => {
      const now = new Date();
      if (now >= credits.resetAt) {
        setCredits({
          total: DAILY_CREDITS,
          used: 0,
          remaining: DAILY_CREDITS,
          resetAt: getNextMidnight()
        });
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkReset);
  }, [credits.resetAt]);

  const deductCredit = async () => {
    if (credits.remaining <= 0) {
      throw new Error('No credits remaining');
    }
    
    setCredits(prev => ({
      ...prev,
      used: prev.used + 1,
      remaining: prev.remaining - 1
    }));
  };

  const resetCredits = () => {
    setCredits({
      total: DAILY_CREDITS,
      used: 0,
      remaining: DAILY_CREDITS,
      resetAt: getNextMidnight()
    });
  };

  return (
    <CreditContext.Provider value={{ credits, deductCredit, resetCredits }}>
      {children}
    </CreditContext.Provider>
  );
};

export const useCredits = (): CreditContextType => {
  const context = useContext(CreditContext);
  if (!context) {
    throw new Error('useCredits must be used within CreditProvider');
  }
  return context;
};
