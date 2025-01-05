import { ReactNode, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import CasinoIcon from '@mui/icons-material/Casino';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const { mode, toggleTheme } = useCustomTheme();
  const navigate = useNavigate();
  const [helpOpen, setHelpOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const theme = useTheme();

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

  const menuItems = [
    { text: 'Accueil', icon: <HomeIcon />, path: '/' },
    { text: 'Session', icon: <CasinoIcon />, path: '/session' },
    { text: 'Statistiques', icon: <ShowChartIcon />, path: '/stats' },
    { text: 'Bankroll', icon: <AccountBalanceWalletIcon />, path: '/bankroll' },
    { text: 'Administration', icon: <AdminPanelSettingsIcon />, path: '/admin' },
  ];

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
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

      <Drawer
        variant="temporary"
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                component={RouterLink}
                to={item.path}
                onClick={toggleDrawer}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

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
