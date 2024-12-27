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

    // Calculer le prix cumulatif
    let cumulativeProfit = 0;
    const chartData = sessions.map((s) => {
      const sessionProfit = s.currentBalance - s.initialCapital;
      cumulativeProfit += sessionProfit;
      return {
        date: new Date(s.startTime).toLocaleDateString(),
        profit: cumulativeProfit,
        sessionProfit,
        balance: s.currentBalance,
      };
    });

    return {
      totalSessions,
      winSessions,
      winRate: totalSessions ? (winSessions / totalSessions) * 100 : 0,
      totalProfit: cumulativeProfit,
      chartData,
    };
  }, [sessions]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      return (
        <Paper sx={{ p: 1 }}>
          <Typography variant="body2">{payload[0].payload.date}</Typography>
          <Typography variant="body2" color="text.secondary">
            Profit/Perte session : {payload[0].payload.sessionProfit.toFixed(2)}{" "}
            €
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Profit/Perte cumulé : {payload[0].payload.profit.toFixed(2)} €
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Solde : {payload[0].payload.balance.toFixed(2)} €
          </Typography>
        </Paper>
      );
    }
    return null;
  };

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
              <Tooltip content={<CustomTooltip />}/>
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#8884d8"
                name="Profit/Perte cumulé"
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
