import { Typography, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Bienvenue sur votre Gestionnaire de Roulette
      </Typography>
      <Typography variant="body1" paragraph>
        Gérez vos sessions de jeu et suivez vos performances en temps réel.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => navigate('/session')}
      >
        Démarrer une nouvelle session
      </Button>
    </Box>
  )
}

export default HomePage
