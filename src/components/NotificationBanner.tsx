import { Box, Typography, IconButton } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CloseIcon from '@mui/icons-material/Close';

const WALMART_YELLOW = '#FFC220';
const WALMART_BLUE = '#0071CE';

export default function NotificationBanner({ notification, show, onClose }: { notification: { title: string, message: string } | null, show: boolean, onClose: () => void }) {
  if (!notification || !show) return null;
  return (
    <Box sx={{
      width: '100%',
      background: WALMART_YELLOW,
      color: '#222',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 1.5,
      px: 2,
      fontWeight: 600,
      fontSize: { xs: '1rem', sm: '1.1rem' },
      position: 'relative',
      boxShadow: '0 2px 8px rgba(255, 194, 32, 0.15)',
      zIndex: 1200
    }}>
      <NotificationsActiveIcon sx={{ color: WALMART_BLUE, mr: 1 }} />
      <Box sx={{ flex: 1, textAlign: 'center' }}>
        <span style={{ fontWeight: 700 }}>{notification.title}:</span> {notification.message}
      </Box>
      <IconButton size="small" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 4, color: '#222' }}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </Box>
  );
} 