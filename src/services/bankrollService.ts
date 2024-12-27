const BANKROLL_KEY = "roulette_bankroll";

export interface BankrollTransaction {
  date: string;
  amount: number;
  type: "deposit" | "withdraw" | "session_win" | "session_loss";
  description?: string;
}

export interface BankrollState {
  totalBalance: number;
  lastUpdate: string;
  history: BankrollTransaction[];
}

const defaultState: BankrollState = {
  totalBalance: 0,
  lastUpdate: new Date().toISOString(),
  history: [],
};

export function getBankrollState(): BankrollState {
  const stored = localStorage.getItem(BANKROLL_KEY);
  if (!stored) return defaultState;
  return JSON.parse(stored);
}

export function updateBankroll(
  amount: number,
  type: BankrollTransaction["type"],
  description?: string
) {
  const currentState = getBankrollState();

  const newTransaction: BankrollTransaction = {
    date: new Date().toISOString(),
    amount,
    type,
    description,
  };

  const newBalance =
    currentState.totalBalance +
    (type === "withdraw" || type === "session_loss" ? -amount : amount);

  const newState: BankrollState = {
    totalBalance: newBalance,
    lastUpdate: new Date().toISOString(),
    history: [newTransaction, ...currentState.history],
  };

  localStorage.setItem(BANKROLL_KEY, JSON.stringify(newState));
  return newState;
}

export function getAvailableBalance(): number {
  return getBankrollState().totalBalance;
}

export function deposit(amount: number, description?: string) {
  return updateBankroll(amount, "deposit", description);
}

export function withdraw(amount: number, description?: string) {
  return updateBankroll(amount, "withdraw", description);
}

export function recordSessionResult(profit: number, description?: string) {
  return updateBankroll(
    Math.abs(profit),
    profit >= 0 ? "session_win" : "session_loss",
    description
  );
}
