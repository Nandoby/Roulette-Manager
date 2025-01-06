import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  getBankrollState,
  deposit,
  withdraw,
  BankrollState,
  BankrollTransaction,
} from "@/services/bankrollService";

export default function BankrollPage() {
  const [bankrollState, setBankrollState] = useState<BankrollState>(
    getBankrollState()
  );
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleDeposit = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return;

    setBankrollState(deposit(value, description));
    setAmount("");
    setDescription("");
  };

  const handleWithdraw = () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0 || value > bankrollState.totalBalance)
      return;

    setBankrollState(withdraw(value, description));
    setAmount("");
    setDescription("");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("fr-FR");
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const getTransactionLabel = (type: BankrollTransaction["type"]) => {
    switch (type) {
      case "deposit":
        return "Dépôt";
      case "withdraw":
        return "Retrait";
      case "session_win":
        return "Gain de session";
      case "session_loss":
        return "Perte de session";
    }
  };

  const formatDescription = (description: string | undefined) => {
    if (!description) return '-';
    // Retourner la partie avant le caractère invisible
    return description.split('\u200B')[0];
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Gestion du Bankroll
          </Typography>
          <Typography variant="h4" sx={{ mb: 3, color: "primary.main" }}>
            {formatAmount(bankrollState.totalBalance)}
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              maxWidth: 400,
            }}
          >
            <TextField
              label="Montant"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              InputProps={{
                inputProps: { min: 0, step: 0.5 },
              }}
            />
            <TextField
              label="Description (optionnel)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDeposit}
                disabled={!amount || parseFloat(amount) <= 0}
                fullWidth
              >
                Déposer
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleWithdraw}
                disabled={
                  !amount ||
                  parseFloat(amount) <= 0 ||
                  parseFloat(amount) > bankrollState.totalBalance
                }
                fullWidth
              >
                Retirer
              </Button>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Historique des transactions
          </Typography>
          <List>
            {bankrollState.history.map((transaction, index) => (
              <Box key={transaction.date}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography>
                          {getTransactionLabel(transaction.type)}
                          {transaction.description &&
                            ` - ${formatDescription(transaction.description)}`}
                        </Typography>
                        <Typography
                          sx={{
                            color:
                              transaction.type === "withdraw" ||
                              transaction.type === "session_loss"
                                ? "error.main"
                                : "success.main",
                            fontWeight: "bold",
                          }}
                        >
                          {transaction.type === "withdraw" ||
                          transaction.type === "session_loss"
                            ? "-"
                            : "+"}
                          {formatAmount(transaction.amount)}
                        </Typography>
                      </Box>
                    }
                    secondary={formatDate(transaction.date)}
                  />
                </ListItem>
                {index < bankrollState.history.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
}
