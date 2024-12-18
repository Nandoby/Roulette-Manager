import { createTheme, PaletteMode } from "@mui/material";

const getTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#121212',
      paper: mode === 'light' ? '#fff' : '#1e1e1e',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease',
        }
      }
    }
  }
});

export default getTheme;
