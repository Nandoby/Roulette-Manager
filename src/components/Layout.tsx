import { ReactNode } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme as useCustomTheme } from "@/contexts/ThemeContext";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { mode, toggleTheme } = useCustomTheme();
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gestionnaire de Roulette
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Accueil
          </Button>
          <Button color="inherit" component={RouterLink} to="/session">
            Session
          </Button>
          <Button color="inherit" component={RouterLink} to="/stats">
            Statistiques
          </Button>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
