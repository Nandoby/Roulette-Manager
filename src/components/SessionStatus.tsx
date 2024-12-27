import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  Chip,
} from '@mui/material';
import { SessionState } from '../types/session';

interface SessionStatusProps {
  session: SessionState;
}

export default function SessionStatus({ session }: SessionStatusProps) {
  // Calculer le total des gains/pertes
  const currentBalance = session.bets.reduce((total, bet) => {
    return total + (bet.isWin ? bet.amount : -bet.amount);
  }, session.initialCapital);

  const profitLoss = currentBalance - session.initialCapital;
  const profitPercentage = (profitLoss / session.initialCapital) * 100;
  
  // Calcul de la progression vers les limites
  const lossProgress = Math.max(0, Math.min(100, 
    (-profitLoss / session.stopLoss) * 100
  ));
  
  const winProgress = Math.max(0, Math.min(100,
    (profitLoss / session.stopWin) * 100
  ));

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">État de la Session</Typography>
        <Chip
          label={session.isActive ? 'En cours' : 'Terminée'}
          color={session.isActive ? 'success' : 'default'}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          Capital Initial: {session.initialCapital.toFixed(2)} €
        </Typography>
        <Typography variant="h5" gutterBottom>
          Solde Actuel: {currentBalance.toFixed(2)} €
        </Typography>
        <Typography
          variant="body1"
          color={profitLoss >= 0 ? 'success.main' : 'error.main'}
        >
          {profitLoss >= 0 ? 'Gain' : 'Perte'}: {Math.abs(profitLoss).toFixed(2)} € 
          ({profitPercentage.toFixed(1)}%)
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" gutterBottom>
          Progression vers Stop Loss ({session.stopLoss} €)
        </Typography>
        <LinearProgress
          variant="determinate"
          value={lossProgress}
          color="error"
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>

      <Box>
        <Typography variant="body2" gutterBottom>
          Progression vers Stop Win ({session.stopWin} €)
        </Typography>
        <LinearProgress
          variant="determinate"
          value={winProgress}
          color="success"
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>
    </Paper>
  );
}
