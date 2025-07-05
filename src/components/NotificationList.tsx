import React from 'react';
import { Paper, Typography, Box, IconButton } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeleteIcon from '@mui/icons-material/Delete';

interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  author: string;
}

interface NotificationListProps {
  notifications: Notification[];
  user: any;
  onDelete: (id: number) => void;
}

const WALMART_BLUE = '#0071CE';

const NotificationList: React.FC<NotificationListProps> = ({ notifications, user, onDelete }) => {
  const notification = notifications.length > 0 ? notifications[0] : null;

  if (!notification) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: '#666' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>No notifications yet</Typography>
        <Typography variant="body2">Check back later for updates!</Typography>
      </Box>
    );
  }

  // Parse date safely
  let dateString = 'Unknown date';
  if (notification.created_at) {
    const date = new Date(notification.created_at);
    if (!isNaN(date.getTime())) {
      dateString = date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        timeZone: 'Asia/Kolkata'
      });
    }
  }

  return (
    <Paper sx={{
      p: 2,
      borderRadius: 2,
      boxShadow: '0 2px 8px rgba(0, 113, 206, 0.08)',
      border: '1px solid rgba(0, 113, 206, 0.08)',
      background: 'rgba(0, 113, 206, 0.02)',
      minHeight: 160,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <Box>
        <Typography variant="h6" sx={{ color: WALMART_BLUE, fontWeight: 'bold', mb: 1 }}>
          {notification.title}
        </Typography>
        <Typography variant="body1" sx={{ color: '#333', mb: 1, lineHeight: 1.6 }}>
          {notification.message}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '0.85rem', mt: 2, justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" sx={{ mr: 2 }}>
            <PersonOutlineIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {notification.author}
          </Typography>
          <Typography variant="body2">
            <LocalOfferIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {dateString}
          </Typography>
        </Box>
        {user && user.email === notification.author && (
          <IconButton color="error" size="small" onClick={() => onDelete(notification.id)}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
};

export default NotificationList; 