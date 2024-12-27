import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { SessionConfig } from "../types/session";
import { getAvailableBalance } from "@/services/bankrollService";

interface SessionConfigFormProps {
  onSubmit: (config: SessionConfig) => void;
}

export default function SessionConfigForm({
  onSubmit,
}: SessionConfigFormProps) {
  const [config, setConfig] = useState<SessionConfig>({
    initialCapital: getAvailableBalance(),
    stopLoss: 0,
    stopWin: 0,
  });

  const [availableBalance, setAvailableBalance] = useState(
    getAvailableBalance()
  );

  useEffect(() => {
    // Mettre à jour le capital initial si le solde disponible change
    setConfig((prev) => ({
      ...prev,
      initialCapital: availableBalance,
    }));
  }, [availableBalance]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.stopLoss <= 0 || config.stopWin <= 0) {
      return;
    }
    onSubmit(config);
  };

  const handleChange =
    (field: keyof SessionConfig) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setConfig((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  if (availableBalance <= 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Vous n'avez pas de fonds disponibles. Veuillez d'abord ajouter des
          fonds dans votre bankroll.
        </Alert>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          component="a"
          href="/bankroll"
        >
          Gérer le Bankroll
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Configuration de la Session
      </Typography>
      <Alert severity="info" sx={{ mb: 3 }}>
        Capital disponible : {availableBalance.toFixed(2)} €
      </Alert>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: 400,
          margin: "0 auto",
        }}
      >
        <TextField
          label="Stop Loss (€)"
          type="number"
          value={config.stopLoss || ""}
          onChange={handleChange("stopLoss")}
          required
          fullWidth
          InputProps={{
            inputProps: { min: 0, max: availableBalance, step: 0.5 },
          }}
          helperText="Arrêt automatique si les pertes atteignent ce montant"
        />
        <TextField
          label="Stop Win (€)"
          type="number"
          value={config.stopWin || ""}
          onChange={handleChange("stopWin")}
          required
          fullWidth
          InputProps={{
            inputProps: { min: 0, step: 0.5 },
          }}
          helperText="Arrêt automatique si les gains atteignent ce montant"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={
            config.stopLoss <= 0 ||
            config.stopWin <= 0 ||
            config.stopLoss > availableBalance
          }
          fullWidth
        >
          Démarrer la Session
        </Button>
      </Box>
    </Paper>
  );
}
