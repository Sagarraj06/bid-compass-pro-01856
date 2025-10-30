export interface CreditSystem {
  dailyAllocation: 10;
  resetTime: "00:00 IST";
  currentBalance: number;
  usedToday: number;
  nextResetAt: Date;
}

export interface CreditState {
  total: number;
  used: number;
  remaining: number;
  resetAt: Date;
}
