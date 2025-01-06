import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SessionState } from '../types/session';
import { getSavedSessions, saveSession } from '@/services/sessionStorage';
import { getBankrollState, updateBankroll } from '@/services/bankrollService';
import TextField from '@mui/material/TextField';

export default function DashboardPage() {
  const [sessions, setSessions] = useState<SessionState[]>([]);
  const [bankrollHistory, setBankrollHistory] = useState<any[]>([]);
  const [editingSession, setEditingSession] = useState<SessionState | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setSessions(getSavedSessions());
    setBankrollHistory(getBankrollState().history);
  };

  const handleDeleteSession = (sessionIndex: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette session ?')) {
      const updatedSessions = sessions.filter((_, index) => index !== sessionIndex);
      localStorage.setItem('roulette_sessions', JSON.stringify(updatedSessions));
      loadData();
    }
  };

  const handleEditSession = (session: SessionState) => {
    setEditingSession(session);
    setIsDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingSession) {
      const updatedSessions = sessions.map((session) =>
        session.startTime === editingSession.startTime ? editingSession : session
      );
      localStorage.setItem('roulette_sessions', JSON.stringify(updatedSessions));
      setIsDialogOpen(false);
      setEditingSession(null);
      loadData();
    }
  };

  const handleEditSessionChange = (field: keyof SessionState, value: any) => {
    if (editingSession) {
      setEditingSession({
        ...editingSession,
        [field]: value,
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord
      </Typography>

      {/* Sessions Section */}
      <Paper sx={{ mb: 4, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Sessions
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Capital Initial</TableCell>
                <TableCell>Résultat Final</TableCell>
                <TableCell>Nombre de Paris</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(session.startTime).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{session.initialCapital}€</TableCell>
                  <TableCell>
                    {(session.currentBalance - session.initialCapital).toFixed(2)}€
                  </TableCell>
                  <TableCell>{session.bets.length}</TableCell>
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
      </Paper>

      {/* Bankroll History Section */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Historique Bankroll
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bankrollHistory.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(entry.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{entry.amount}€</TableCell>
                  <TableCell>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                    <IconButton>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Modifier la Session</DialogTitle>
        <DialogContent>
          {editingSession && (
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Capital Initial"
                type="number"
                value={editingSession.initialCapital}
                onChange={(e) => handleEditSessionChange('initialCapital', parseFloat(e.target.value))}
                fullWidth
              />
              <TextField
                label="Stop Loss"
                type="number"
                value={editingSession.stopLoss}
                onChange={(e) => handleEditSessionChange('stopLoss', parseFloat(e.target.value))}
                fullWidth
              />
              <TextField
                label="Stop Win"
                type="number"
                value={editingSession.stopWin}
                onChange={(e) => handleEditSessionChange('stopWin', parseFloat(e.target.value))}
                fullWidth
              />
              <TextField
                label="Solde Actuel"
                type="number"
                value={editingSession.currentBalance}
                onChange={(e) => handleEditSessionChange('currentBalance', parseFloat(e.target.value))}
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}