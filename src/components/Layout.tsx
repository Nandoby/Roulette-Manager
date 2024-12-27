import { ReactNode, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import { useTheme as useCustomTheme } from "@/contexts/ThemeContext";
import ShortcutsHelp from "./ShortcutsHelp";
import {
  GLOBAL_SHORTCUTS,
  useKeyboardShortcuts,
} from "@/hooks/useKeyboardShortcuts";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { mode, toggleTheme } = useCustomTheme();
  const navigate = useNavigate();
  const [helpOpen, setHelpOpen] = useState(false);

  const shortcuts = [
    ...GLOBAL_SHORTCUTS.map((shortcut) => ({
      ...shortcut,
      action: () => {
        switch (shortcut.description) {
          case "Changer le thème":
            return toggleTheme();
          case "Page statistiques":
            return navigate("/stats");
          case "Retour à l'accueil":
            return navigate("/");
          case "Nouvelle session":
            return navigate("/session");
        }
      },
    })),
  ];

  useKeyboardShortcuts(shortcuts);

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
          <Button
            color="inherit"
            component={RouterLink}
            to="/bankroll"
            startIcon={<AccountBalanceWalletIcon />}
          >
            Bankroll
          </Button>
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <IconButton
            sx={{ ml: 1 }}
            onClick={() => setHelpOpen(true)}
            color="inherit"
          >
            <HelpOutlineIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Box>
      <ShortcutsHelp
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        shortcuts={shortcuts}
      />
    </Box>
  );
}

export default Layout;
