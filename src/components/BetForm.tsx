import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { Bet } from '../types/session';
import { useKeyboardShortcuts, GLOBAL_SHORTCUTS } from '../hooks/useKeyboardShortcuts';

interface BetFormProps {
  onAddBet: (bet: Bet) => void;
  disabled: boolean;
}

export default function BetForm({ onAddBet, disabled }: BetFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [result, setResult] = useState<'win' | 'loss'>('win');

  const handleSubmit = (isWin: boolean) => {
    if (!amount || disabled) return;

    const bet: Bet = {
      amount: parseFloat(amount),
      timestamp: new Date(),
      isWin,
    };

    onAddBet(bet);
    setAmount('');
    setResult('win');
  };

  // Filtrer les raccourcis pertinents pour les paris
  const betShortcuts = GLOBAL_SHORTCUTS.filter(
    shortcut => ['Enregistrer un gain', 'Enregistrer une perte'].includes(shortcut.description)
  ).map(shortcut => ({
    ...shortcut,
    action: () => {
      if (disabled || !amount) return;
      handleSubmit(shortcut.description === 'Enregistrer un gain');
    }
  }));

  useKeyboardShortcuts(betShortcuts);

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: '0 auto',
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Raccourcis : Ctrl+G (Gain) | Ctrl+P (Perte)
      </Typography>
      
      <TextField
        label="Montant"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={disabled}
        fullWidth
        InputProps={{
          inputProps: { min: 0, step: 0.5 }
        }}
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleSubmit(true)}
          disabled={!amount || disabled}
          fullWidth
        >
          Gain
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleSubmit(false)}
          disabled={!amount || disabled}
          fullWidth
        >
          Perte
        </Button>
      </Box>
    </Box>
  );
}
