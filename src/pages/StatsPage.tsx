import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import SessionStats from "@/components/SessionStats";
import {
  getSessionsByMonth,
  getSessionsByYear,
  getSavedSessions,
} from "@/services/sessionStorage";

export default function StatsPage() {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  
  const monthSessions = getSessionsByMonth(selectedYear, selectedMonth);
  const yearSessions = getSessionsByYear(selectedYear);
  const allSessions = getSavedSessions();

  const availableYears = Array.from(
    new Set(allSessions.map(s => new Date(s.startTime).getFullYear()))
  ).sort((a, b) => b - a);

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Statistiques
        </Typography>

        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Année</InputLabel>
            <Select
              value={selectedYear}
              label="Année"
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {availableYears.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Mois</InputLabel>
            <Select
              value={selectedMonth}
              label="Mois"
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {months.map((month, index) => (
                <MenuItem key={index} value={index}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <SessionStats 
          sessions={monthSessions}
          title={`Statistiques - ${months[selectedMonth]} ${selectedYear}`}
        />

        <SessionStats 
          sessions={yearSessions}
          title={`Statistiques - Année ${selectedYear}`}
        />

        <SessionStats 
          sessions={allSessions}
          title={`Statistiques Globales`}
        />
      </Box>
    </Container>
  )
}

