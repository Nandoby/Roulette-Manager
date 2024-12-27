export interface SessionConfig {
  initialCapital: number;
  stopLoss: number;
  stopWin: number;
}

export interface Bet {
  amount: number;
  isWin: boolean;
  timestamp: Date;
}

export interface SessionState extends SessionConfig {
  currentBalance: number;
  isActive: boolean;
  startTime: Date;
  endTime?: Date;
  bets: Bet[];
}
