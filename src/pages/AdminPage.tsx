import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SessionState } from '../types/session';
import { BankrollTransaction, BankrollState } from '../services/bankrollService';
import { getSavedSessions } from '../services/sessionStorage';
import { getBankrollState, updateBankroll } from '../services/bankrollService';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AdminPage() {
  const [tabValue, setTabValue] = useState(0);
  const [sessions, setSessions] = useState<SessionState[]>([]);
  const [bankrollState, setBankrollState] = useState<BankrollState>(getBankrollState());
  const [editingSession, setEditingSession] = useState<SessionState | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<BankrollTransaction | null>(null);
  const [isSessionDialogOpen, setIsSessionDialogOpen] = useState(false);
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
  const [error, setError] = useState<string>('');

  const SESSIONS_KEY = "roulette_sessions";
  const BANKROLL_KEY = "roulette_bankroll";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSessions(getSavedSessions());
    setBankrollState(getBankrollState());
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditSession = (session: SessionState) => {
    setEditingSession(session);
    setIsSessionDialogOpen(true);
  };

  const handleEditTransaction = (transaction: BankrollTransaction) => {
    setEditingTransaction(transaction);
    setIsTransactionDialogOpen(true);
  };

  const handleDeleteSession = (sessionIndex: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) {
      const sessionToDelete = sessions[sessionIndex];
      const sessionProfit = sessionToDelete.currentBalance - sessionToDelete.initialCapital;
      
      // 1. Supprimer la session
      const updatedSessions = sessions.filter((_, index) => index !== sessionIndex).map(session => ({
        ...session,
        startTime: session.startTime instanceof Date ? session.startTime.toISOString() : session.startTime,
        endTime: session.endTime instanceof Date ? session.endTime?.toISOString() : session.endTime,
        bets: session.bets.map(bet => ({
          ...bet,
          timestamp: bet.timestamp instanceof Date ? bet.timestamp.toISOString() : bet.timestamp,
        })),
      }));
      
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));

      // 2. Mettre à jour la bankroll
      const currentBankrollState = getBankrollState();
      const sessionTimestamp = new Date(sessionToDelete.startTime).getTime();
      const profitAmount = Math.abs(sessionProfit);
      
      const updatedHistory = currentBankrollState.history.filter((transaction: BankrollTransaction) => {
        if (transaction.type !== 'session_win' && transaction.type !== 'session_loss') {
          return true;
        }

        const transactionTimestamp = new Date(transaction.date).getTime();
        const timeDiff = Math.abs(transactionTimestamp - sessionTimestamp);
        const isNearbyTime = timeDiff < 5000; // 5 secondes de marge
        const isSameAmount = transaction.amount === profitAmount;

        return !(isNearbyTime && isSameAmount);
      });

      const newBalance = currentBankrollState.totalBalance - sessionProfit;
      const newBankrollState = {
        totalBalance: newBalance,
        lastUpdate: new Date().toISOString(),
        history: updatedHistory,
      };

      localStorage.setItem(BANKROLL_KEY, JSON.stringify(newBankrollState));
      loadData();
    }
  };

  const handleSaveSessionEdit = () => {
    if (editingSession) {
      const updatedSessions = sessions.map((session) =>
        session.startTime === editingSession.startTime ? editingSession : session
      );
      localStorage.setItem('roulette_sessions', JSON.stringify(updatedSessions));
      setIsSessionDialogOpen(false);
      setEditingSession(null);
      loadData();
    }
  };

  const handleSaveTransactionEdit = () => {
    if (editingTransaction) {
      const updatedHistory = bankrollState.history.map((transaction) =>
        transaction.date === editingTransaction.date ? editingTransaction : transaction
      );
      
      // Recalculer le solde total
      const newBalance = updatedHistory.reduce((total, transaction) => {
        const amount = transaction.amount;
        return total + (transaction.type === 'withdraw' || transaction.type === 'session_loss' ? -amount : amount);
      }, 0);

      const newState = {
        ...bankrollState,
        totalBalance: newBalance,
        history: updatedHistory,
      };

      localStorage.setItem('roulette_bankroll', JSON.stringify(newState));
      setIsTransactionDialogOpen(false);
      setEditingTransaction(null);
      loadData();
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleString('fr-FR');
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Administration
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Sessions" />
          <Tab label="Transactions Bankroll" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Capital Initial</TableCell>
                <TableCell>Résultat Final</TableCell>
                <TableCell>Stop Loss</TableCell>
                <TableCell>Stop Win</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(session.startTime)}</TableCell>
                  <TableCell>{formatAmount(session.initialCapital)}</TableCell>
                  <TableCell>
                    {formatAmount(session.currentBalance - session.initialCapital)}
                  </TableCell>
                  <TableCell>{formatAmount(session.stopLoss)}</TableCell>
                  <TableCell>{formatAmount(session.stopWin)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditSession(session)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteSession(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bankrollState.history.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell>{formatAmount(transaction.amount)}</TableCell>
                  <TableCell>{transaction.description || '-'}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditTransaction(transaction)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Dialog d'édition de session */}
      <Dialog open={isSessionDialogOpen} onClose={() => setIsSessionDialogOpen(false)}>
        <DialogTitle>Modifier la Session</DialogTitle>
        <DialogContent>
          {editingSession && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Capital Initial"
                type="number"
                value={editingSession.initialCapital}
                onChange={(e) =>
                  setEditingSession({
                    ...editingSession,
                    initialCapital: parseFloat(e.target.value),
                  })
                }
              />
              <TextField
                label="Stop Loss"
                type="number"
                value={editingSession.stopLoss}
                onChange={(e) =>
                  setEditingSession({
                    ...editingSession,
                    stopLoss: parseFloat(e.target.value),
                  })
                }
              />
              <TextField
                label="Stop Win"
                type="number"
                value={editingSession.stopWin}
                onChange={(e) =>
                  setEditingSession({
                    ...editingSession,
                    stopWin: parseFloat(e.target.value),
                  })
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsSessionDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSaveSessionEdit} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog d'édition de transaction */}
      <Dialog open={isTransactionDialogOpen} onClose={() => setIsTransactionDialogOpen(false)}>
        <DialogTitle>Modifier la Transaction</DialogTitle>
        <DialogContent>
          {editingTransaction && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Montant"
                type="number"
                value={editingTransaction.amount}
                onChange={(e) =>
                  setEditingTransaction({
                    ...editingTransaction,
                    amount: parseFloat(e.target.value),
                  })
                }
              />
              <TextField
                label="Description"
                value={editingTransaction.description || ''}
                onChange={(e) =>
                  setEditingTransaction({
                    ...editingTransaction,
                    description: e.target.value,
                  })
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsTransactionDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSaveTransactionEdit} variant="contained">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 