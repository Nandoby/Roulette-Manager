import { SessionState, Bet } from "@/types/session";

interface SerializedSessionState extends Omit<SessionState, 'startTime' | 'endTime' | 'bets'> {
  startTime: string;
  endTime?: string;
  bets: Array<Omit<Bet, 'timestamp'> & { timestamp: string }>;
}

const SESSIONS_KEY = "roulette_sessions";

export const saveSession = (session: SessionState): void => {
  const savedSessions = getSavedSessions();
  const serializedSession = {
    ...session,
    startTime: session.startTime.toISOString(),
    endTime: session.endTime?.toISOString(),
    bets: session.bets.map((bet) => ({
      ...bet,
      timestamp: bet.timestamp.toISOString(),
    })),
  };

  savedSessions.push(serializedSession as unknown as SessionState);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(savedSessions));
};

export const getSavedSessions = (): SessionState[] => {
  const sessionsJson = localStorage.getItem(SESSIONS_KEY);
  if (!sessionsJson) return [];

  const sessions = JSON.parse(sessionsJson);
  return sessions.map((session: any) => ({
    ...session,
    startTime: new Date(session.startTime),
    endTime: session.endTime ? new Date(session.endTime) : undefined,
    bets: session.bets.map((bet: any) => ({
      ...bet,
      timestamp: new Date(bet.timestamp),
    })),
  }));
};

export const getSessionsByMonth = (year: number, month: number): SessionState[] => {
  const sessions = getSavedSessions();
  return sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    return sessionDate.getFullYear() === year && sessionDate.getMonth() === month;
  });
};

export const getSessionsByYear = (year: number): SessionState[] => {
  const sessions = getSavedSessions();
  return sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    return sessionDate.getFullYear() === year;
  });
};
