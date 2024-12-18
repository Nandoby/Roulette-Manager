import { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
} from "@mui/material";
import { Bet } from "@/types/session";

interface BetFormProps {
  onAddBet: (bet: Bet) => void;
  disabled?: boolean;
}

export default function BetForm({ onAddBet, disabled = false }: BetFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [result, setResult] = useState<"win" | "loss">("win");
  const [error, setError] = useState<string>("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const betAmount = parseFloat(amount);

    if (isNaN(betAmount) || betAmount <= 0) {
      setError("Le montant doit être un nombre positif");
      return;
    }

    const newBet: Bet = {
      id: Date.now().toString(),
      amount: betAmount,
      result: result === "win" ? betAmount : -betAmount,
      timestamp: new Date(),
    };

    onAddBet(newBet);
    setAmount("");
    setError("");
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Enregistrer une mise
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Montant (€)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={disabled}
            required
            fullWidth
            inputProps={{ min: 0, step: "0.01" }}
          />

          <ToggleButtonGroup
            value={result}
            exclusive
            onChange={(_, newValue) => newValue && setResult(newValue)}
            disabled={disabled}
            fullWidth
          >
            <ToggleButton value="win" color="success">
              Gagné
            </ToggleButton>
            <ToggleButton value="loss" color="error">
              Perdu
            </ToggleButton>
          </ToggleButtonGroup>

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            disabled={disabled}
            fullWidth
          >
            Enregistrer la mise
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
