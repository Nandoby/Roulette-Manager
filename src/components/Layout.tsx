import { ReactNode } from 'react'
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, py: 3 }}>
        {children}
      </Box>
    </Box>
  )
}

export default Layout
