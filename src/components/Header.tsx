import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Button } from '@mui/material';
import AppsIcon from '@mui/icons-material/Apps';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';

const WALMART_BLUE = '#0071CE';

export default function Header({ onProfileClick, goToWalmart }: { onProfileClick: (e: React.MouseEvent<HTMLElement>) => void, goToWalmart: () => void }) {
  return (
    <AppBar position="static" sx={{ background: WALMART_BLUE, boxShadow: '0 2px 10px rgba(0, 113, 206, 0.15)' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={goToWalmart}>
          <Box sx={{ width: 40, height: 40, background: '#FFC220', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
            <Typography variant="h5" sx={{ color: '#222', fontWeight: 'bold', fontFamily: 'sans-serif' }}>✦</Typography>
          </Box>
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, fontFamily: 'sans-serif', letterSpacing: 0.5 }}>
            Walmart
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={goToWalmart}><AppsIcon /></IconButton>
          <IconButton color="inherit" onClick={onProfileClick}><PersonOutlineIcon /></IconButton>
          <IconButton color="inherit" onClick={goToWalmart}><Badge badgeContent={0} color="warning"><ShoppingCartIcon /></Badge></IconButton>
        </Box>
      </Toolbar>
      {/* Navigation Bar */}
      <Toolbar sx={{ background: '#fff', minHeight: 36, px: { xs: 1, sm: 2 }, display: { xs: 'none', md: 'flex' } }}>
        <Button startIcon={<CategoryIcon />} sx={{ color: WALMART_BLUE, fontWeight: 600, textTransform: 'none', mr: 2 }} onClick={goToWalmart}>Departments</Button>
        <Button sx={{ color: '#222', textTransform: 'none', mr: 1 }} onClick={goToWalmart}>Services</Button>
        <Button sx={{ color: '#222', textTransform: 'none', mr: 1 }} onClick={goToWalmart}>Get it Fast</Button>
        <Button sx={{ color: '#222', textTransform: 'none', mr: 1 }} onClick={goToWalmart}>New Arrivals</Button>
        <Button sx={{ color: '#222', textTransform: 'none', mr: 1 }} onClick={goToWalmart}>Rollbacks & more</Button>
        <Button sx={{ color: '#222', textTransform: 'none', mr: 1 }} onClick={goToWalmart}>Pharmacy Delivery</Button>
        <Button sx={{ color: '#222', textTransform: 'none', mr: 1 }} onClick={goToWalmart}>Trending</Button>
        <Button sx={{ color: '#222', textTransform: 'none', mr: 1, border: '1px solid #0071CE', borderRadius: 2, px: 2 }} onClick={goToWalmart}>Walmart+</Button>
      </Toolbar>
    </AppBar>
  );
} 