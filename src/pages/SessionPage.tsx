import { useState } from 'react';
import { Container, Box, Button } from '@mui/material';
import SessionConfigForm from '../components/SessionConfig';
import SessionStatus from '../components/SessionStatus';
import BetForm from '../components/BetForm';
import BetHistory from '../components/BetHistory';
import { SessionConfig, SessionState, Bet } from '../types/session';
import { saveSession } from "@/services/sessionStorage"

export default function SessionPage() {
  const [session, setSession] = useState<SessionState | null>(null);

  const handleStartSession = (config: SessionConfig) => {
    const newSession: SessionState = {
      ...config,
      currentBalance: config.initialCapital,
      isActive: true,
      startTime: new Date(),
      bets: [],
    };
    setSession(newSession);
  };

  const handleAddBet = (bet: Bet) => {
    if (!session) return;

    const newBalance = session.currentBalance + bet.result;
    const hasReachedStopLoss = newBalance <= (session.initialCapital - session.stopLoss);
    const hasReachedStopWin = (newBalance - session.initialCapital) >= session.stopWin;

    setSession((prev) => {
      if (!prev) return null;
      
      const updatedSession = {
        ...prev,
        currentBalance: newBalance,
        bets: [bet, ...prev.bets],
        isActive: !hasReachedStopLoss && !hasReachedStopWin,
        ...(hasReachedStopLoss || hasReachedStopWin ? { endTime: new Date() } : {}),
      };

      // Sauvegarder la session si elle est terminée
      if (hasReachedStopLoss || hasReachedStopWin) {
        saveSession(updatedSession);
      }

      return updatedSession;
    });
  };

  const handleEndSession = () => {
    if (!session) return;

    setSession((prev) => {
      if (!prev) return null;
      const updatedSession = {
        ...prev,
        isActive: false,
        endTime: new Date(),
      };

      // Sauvegarder la session terminée
      saveSession(updatedSession);

      return updatedSession;
    });
  };

  if (!session) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <SessionConfigForm onStart={handleStartSession} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <SessionStatus session={session} />
        
        <BetForm
          onAddBet={handleAddBet}
          disabled={!session.isActive}
        />

        {session.isActive && (
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={handleEndSession}
            >
              Terminer la session
            </Button>
          </Box>
        )}

        <BetHistory bets={session.bets} />
      </Box>
    </Container>
  );
}
