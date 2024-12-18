export interface SessionConfig {
  initialCapital: number;
  stopLoss: number;
  stopWin: number;
}

export interface Bet {
  id: string;
  amount: number;
  result: number; // Montant gagné (positif) ou perdu (négatif)
  timestamp: Date;
}

export interface SessionState extends SessionConfig {
  currentBalance: number;
  isActive: boolean;
  startTime: Date;
  endTime?: Date;
  bets: Bet[];
}
