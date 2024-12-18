import { useMemo } from "react";
import { Paper, Typography, Grid, Box } from "@mui/material";
import { SessionState } from "@/types/session";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SessionStatsProps {
  sessions: SessionState[];
  title: string;
}

export default function SessionStats({ sessions, title }: SessionStatsProps) {
  const stats = useMemo(() => {
    const totalSessions = sessions.length;
    const winSessions = sessions.filter(
      (s) => s.currentBalance > s.initialCapital
    ).length;

    const totalProfit = sessions.reduce(
      (sum, s) => sum + (s.currentBalance - s.initialCapital),
      0
    );

    const chartData = sessions.map((s) => ({
      date: new Date(s.startTime).toLocaleDateString(),
      profit: s.currentBalance - s.initialCapital,
      balance: s.currentBalance,
    }));

    return {
      totalSessions,
      winSessions,
      winRate: totalSessions ? (winSessions / totalSessions) * 100 : 0,
      totalProfit,
      chartData,
    };
  }, [sessions]);

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Sessions Totales
            </Typography>
            <Typography variant="h6">{stats.totalSessions}</Typography>
          </Box>
        </Grid>
        <Grid item xs={6} md={3}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Taux de Réussite
            </Typography>
            <Typography variant="h6">{stats.winRate.toFixed(1)}%</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Profit/Perte Total
            </Typography>
            <Typography
              variant="h6"
              color={stats.totalProfit >= 0 ? "success.main" : "error.main"}
            >
              {stats.totalProfit.toFixed(2)} €
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {stats.chartData.length > 0 && (
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#8884d8"
                name="Profit/Perte"
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#82ca9d"
                name="Solde"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
}
