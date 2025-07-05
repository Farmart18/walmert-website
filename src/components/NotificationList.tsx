import { Grid, Paper, Box, Typography, IconButton } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeleteIcon from '@mui/icons-material/Delete';
const WALMART_BLUE = '#0071CE';

export default function NotificationList({ notifications, user, onDelete }: {
  notifications: any[],
  user: any,
  onDelete: (id: number) => void
}) {
  if (!notifications.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: '#666' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>No notifications yet</Typography>
        <Typography variant="body2">Check back later for updates!</Typography>
      </Box>
    );
  }
  return (
    <Grid container spacing={2}>
      {notifications.map((n, index) => (
        <Grid item xs={12} sm={6} md={6} lg={4} key={n.id}>
          <Paper sx={{
            p: 2,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0, 113, 206, 0.08)',
            border: '1px solid rgba(0, 113, 206, 0.08)',
            background: index % 2 === 0 ? 'rgba(0, 113, 206, 0.02)' : 'rgba(255, 194, 32, 0.02)',
            minHeight: 160,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <Box>
              <Typography variant="h6" sx={{ color: WALMART_BLUE, fontWeight: 'bold', mb: 1 }}>
                {n.title}
              </Typography>
              <Typography variant="body1" sx={{ color: '#333', mb: 1, lineHeight: 1.6 }}>
                {n.message}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '0.85rem', mt: 2, justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" sx={{ mr: 2 }}>
                  <PersonOutlineIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {n.author}
                </Typography>
                <Typography variant="body2">
                  <LocalOfferIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} /> {new Date(n.created_at).toLocaleDateString()} at {new Date(n.created_at).toLocaleTimeString()}
                </Typography>
              </Box>
              {user && user.email === n.author && (
                <IconButton color="error" size="small" onClick={() => onDelete(n.id)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
} 