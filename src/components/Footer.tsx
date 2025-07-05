import { Box } from '@mui/material';
const WALMART_BLUE = '#0071CE';

export default function Footer() {
  return (
    <Box component="footer" sx={{
      width: '100%',
      // maxWidth: '1280px',
      margin: '0 auto',
      background: WALMART_BLUE,
      color: '#fff',
      py: 2,
      // px: { xs: 2, md: 6 },
      textAlign: 'center',
      fontSize: { xs: '0.95rem', md: '1.05rem' },
      fontWeight: 500,
      letterSpacing: 0.2,
      mt: 'auto',
      boxShadow: '0 -2px 8px rgba(0, 113, 206, 0.08)',
    }}>
      Walmart | Save Money. Live better. &copy; {new Date().getFullYear()} Walmart. All Rights Reserved.
    </Box>
  );
} 