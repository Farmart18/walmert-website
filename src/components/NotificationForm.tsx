import { Box, Typography, TextField, Button } from '@mui/material';
const WALMART_BLUE = '#0071CE';
const WALMART_YELLOW = '#FFC220';

export default function NotificationForm({ title, message, setTitle, setMessage, onPost }: {
  title: string,
  message: string,
  setTitle: (v: string) => void,
  setMessage: (v: string) => void,
  onPost: (e: React.FormEvent) => void
}) {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box sx={{ width: 50, height: 50, background: 'linear-gradient(135deg, #0071CE 0%, #005fa3 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>📝</Typography>
        </Box>
        <Typography variant="h5" sx={{ color: WALMART_BLUE, fontWeight: 'bold' }}>
          Post a Notification
        </Typography>
      </Box>
      <form onSubmit={onPost}>
        <TextField label="Notification Title" value={title} onChange={e => setTitle(e.target.value)} fullWidth sx={{ mb: 3 }} required variant="outlined" InputProps={{ sx: { borderRadius: 2 } }} />
        <TextField label="Notification Message" value={message} onChange={e => setMessage(e.target.value)} fullWidth multiline rows={4} sx={{ mb: 3 }} required variant="outlined" InputProps={{ sx: { borderRadius: 2 } }} />
        <Button type="submit" variant="contained" sx={{ background: 'linear-gradient(135deg, #FFC220 0%, #FFD700 100%)', color: '#222', fontWeight: 'bold', py: 1.5, px: 4, borderRadius: 2, boxShadow: '0 4px 15px rgba(255, 194, 32, 0.4)', '&:hover': { background: 'linear-gradient(135deg, #FFD700 0%, #FFC220 100%)', boxShadow: '0 6px 20px rgba(255, 194, 32, 0.6)' } }}>
          📢 Post Notification
        </Button>
      </form>
    </>
  );
} 