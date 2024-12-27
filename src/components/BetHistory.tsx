import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Bet } from '../types/session';

interface BetHistoryProps {
  bets: Bet[];
}

export default function BetHistory({ bets }: BetHistoryProps) {
  if (bets.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        Aucune mise enregistrée
      </Typography>
    );
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Heure</TableCell>
            <TableCell align="right">Montant</TableCell>
            <TableCell align="right">Résultat</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bets.map((bet, index) => (
            <TableRow key={index}>
              <TableCell>{formatTime(bet.timestamp)}</TableCell>
              <TableCell align="right">{formatAmount(bet.amount)}</TableCell>
              <TableCell 
                align="right"
                sx={{ 
                  color: bet.isWin ? 'success.main' : 'error.main',
                  fontWeight: 'bold'
                }}
              >
                {bet.isWin ? '+' : '-'}{formatAmount(bet.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
