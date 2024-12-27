import { useState, useEffect } from "react";
import { Container, Box, Button } from "@mui/material";
import SessionConfigForm from "../components/SessionConfigForm";
import SessionStatus from "../components/SessionStatus";
import BetForm from "../components/BetForm";
import BetHistory from "../components/BetHistory";
import { SessionState, SessionConfig, Bet } from "../types/session";
import { recordSessionResult } from "@/services/bankrollService";
import { saveSession } from "@/services/sessionStorage";

export default function SessionPage() {
  const [session, setSession] = useState<SessionState | null>(null);

  const handleStartSession = (config: SessionConfig) => {
    setSession({
      ...config,
      currentBalance: config.initialCapital,
      isActive: true,
      startTime: new Date(),
      bets: [],
    });
  };

  const handleEndSession = () => {
    if (session) {
      const finalSession = {
        ...session,
        isActive: false,
        endTime: new Date(),
      };

      // Calculer le profit/perte de la session
      const profit = finalSession.currentBalance - finalSession.initialCapital;

      // Mettre à jour le bankroll
      recordSessionResult(
        profit,
        `Session du ${new Date().toLocaleDateString()}`
      );

      // Sauvegarder la session dans l'historique
      saveSession(finalSession);

      setSession(finalSession);
    }
  };

  const handleAddBet = (bet: Bet) => {
    if (!session) return;

    const newBalance =
      session.currentBalance + (bet.isWin ? bet.amount : -bet.amount);
    const newSession = {
      ...session,
      currentBalance: newBalance,
      bets: [...session.bets, bet],
    };

    // Vérifier si on atteint le stop loss ou le stop win
    const profitLoss = newBalance - session.initialCapital;
    if (profitLoss <= -session.stopLoss || profitLoss >= session.stopWin) {
      newSession.isActive = false;
      newSession.endTime = new Date();

      // Mettre à jour le bankroll et sauvegarder la session si elle se termine
      recordSessionResult(profitLoss, `Session du ${new Date().toLocaleDateString()}`);
      saveSession(newSession);
    }

    setSession(newSession);
  };

  if (!session) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <SessionConfigForm onSubmit={handleStartSession} />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <SessionStatus session={session} />
        <BetForm onAddBet={handleAddBet} disabled={!session.isActive} />
        <Box sx={{ mt: 3 }}>
          <BetHistory bets={session.bets} />
        </Box>
        {session.isActive && (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleEndSession}
            >
              Terminer la Session
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}
