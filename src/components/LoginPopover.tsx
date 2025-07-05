import { Popover, Box, Typography, TextField, Button } from '@mui/material';
const WALMART_BLUE = '#0071CE';

export default function LoginPopover({ open, anchorEl, onClose, email, password, setEmail, setPassword, onLogin }: {
  open: boolean,
  anchorEl: HTMLElement | null,
  onClose: () => void,
  email: string,
  password: string,
  setEmail: (v: string) => void,
  setPassword: (v: string) => void,
  onLogin: (e: React.FormEvent) => void
}) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{ sx: { zIndex: 2000 } }}
    >
      <Box sx={{ p: 3, width: 320 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Box sx={{ width: 50, height: 50, background: 'linear-gradient(135deg, #0071CE 0%, #005fa3 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>🔐</Typography>
          </Box>
          <Typography variant="h5" sx={{ color: WALMART_BLUE, fontWeight: 'bold' }}>
            Walmart Personnel Login
          </Typography>
        </Box>
        <form onSubmit={onLogin}>
          <TextField label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth sx={{ mb: 3 }} required variant="outlined" InputProps={{ sx: { borderRadius: 2 } }} />
          <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth sx={{ mb: 3 }} required variant="outlined" InputProps={{ sx: { borderRadius: 2 } }} />
          <Button type="submit" variant="contained" sx={{ background: 'linear-gradient(135deg, #0071CE 0%, #005fa3 100%)', color: '#fff', fontWeight: 'bold', py: 1.5, px: 4, borderRadius: 2, boxShadow: '0 4px 15px rgba(0, 113, 206, 0.4)', '&:hover': { background: 'linear-gradient(135deg, #005fa3 0%, #0071CE 100%)', boxShadow: '0 6px 20px rgba(0, 113, 206, 0.6)' } }}>
            🔐 Login
          </Button>
        </form>
      </Box>
    </Popover>
  );
} 