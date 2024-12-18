import { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { SessionConfig } from "@/types/session";

interface SessionConfigFormProps {
  onStart: (config: SessionConfig) => void;
}

export default function SessionConfigForm({ onStart }: SessionConfigFormProps) {
  const [config, setConfig] = useState<SessionConfig>({
    initialCapital: 0,
    stopLoss: 0,
    stopWin: 0,
  });

  const [error, setError] = useState<string>("");

  const handleChange =
    (field: keyof SessionConfig) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(event.target.value);
      setConfig((prev) => ({ ...prev, [field]: value }));
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Validations
    if (config.initialCapital <= 0) {
      setError("Le capital initial doit être supérieur à 0");
      return;
    }
    if (config.stopLoss <= 0) {
      setError("Le Stop Loss doit être supérieur à 0");
      return;
    }
    if (config.stopWin <= 0) {
      setError("Le Stop Win doit être supérieur à 0");
      return;
    }

    setError("");
    onStart(config);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 400, max: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Configuration de la Session
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Capital Initial (€)"
            type="number"
            value={config.initialCapital}
            onChange={handleChange("initialCapital")}
            required
            fullWidth
          />

          <TextField
            label="Stop Loss (€)"
            type="number"
            value={config.stopLoss}
            onChange={handleChange("stopLoss")}
            required
            fullWidth
          />

          <TextField
            label="Stop Win (€)"
            type="number"
            value={config.stopWin}
            onChange={handleChange("stopWin")}
            required
            fullWidth
            helperText="Objectif de gain pour la session"
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Démarrer la Session
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
