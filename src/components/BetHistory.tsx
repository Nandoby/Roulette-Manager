import {
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
  } from '@mui/material';
  import { Bet } from '../types/session';
  
  interface BetHistoryProps {
    bets: Bet[];
  }
  
  export default function BetHistory({ bets }: BetHistoryProps) {
    if (bets.length === 0) {
      return null;
    }
  
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Historique des mises
        </Typography>
  
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Heure</TableCell>
                <TableCell align="right">Montant misé</TableCell>
                <TableCell align="right">Résultat</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bets.map((bet) => (
                <TableRow key={bet.id}>
                  <TableCell>
                    {bet.timestamp.toLocaleTimeString()}
                  </TableCell>
                  <TableCell align="right">
                    {bet.amount.toFixed(2)} €
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: bet.result >= 0 ? 'success.main' : 'error.main',
                      fontWeight: 'bold',
                    }}
                  >
                    {bet.result >= 0 ? '+' : ''}{bet.result.toFixed(2)} €
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }
  