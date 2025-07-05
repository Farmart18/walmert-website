import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
  IconButton,
  InputBase,
  Grid,
  Divider,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AppsIcon from '@mui/icons-material/Apps';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CategoryIcon from '@mui/icons-material/Category';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import Popover from '@mui/material/Popover';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

// Walmart color palette
const WALMART_BLUE = '#0071CE';
const WALMART_YELLOW = '#FFC220';

interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  author: string;
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success'|'error'}>({open: false, message: '', severity: 'success'});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showBanner, setShowBanner] = useState(true);

  // Fetch notifications
  useEffect(() => {
    fetchNotifications();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function fetchNotifications() {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setNotifications(data as Notification[]);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    console.log('Login submit', email);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setSnackbar({open: true, message: error.message, severity: 'error'});
      setPassword(''); // Optionally clear only password on error
    } else {
      setSnackbar({open: true, message: 'Logged in!', severity: 'success'});
      // Fetch the user again to ensure state is updated
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);
      setAnchorEl(null); // Close the popover only on success
      setEmail('');
      setPassword('');
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSnackbar({open: true, message: 'Logged out!', severity: 'success'});
  }

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !message) return;
    const { error } = await supabase.from('notifications').insert([
      { title, message, author: user.email }
    ]);
    if (error) setSnackbar({open: true, message: error.message, severity: 'error'});
    else {
      setSnackbar({open: true, message: 'Notification posted!', severity: 'success'});
      setTitle('');
      setMessage('');
      fetchNotifications();
    }
  }

  async function handleDeleteNotification(id: number) {
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) {
      setSnackbar({open: true, message: error.message, severity: 'error'});
    } else {
      setSnackbar({open: true, message: 'Notification deleted!', severity: 'success'});
      fetchNotifications();
    }
  }

  // Handler for profile icon click
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  // Helper function to open Walmart
  const goToWalmart = () => window.open('https://www.walmart.com', '_blank', 'noopener,noreferrer');

  // Find the latest notification
  const latestNotification = notifications.length > 0 ? notifications[0] : null;

  return (
    <Box sx={{ background: '#f2f8fd', minHeight: '100vh', width: '100vw', position: 'relative' }}>
      {/* Walmart-style Header */}
      <AppBar position="static" sx={{ background: WALMART_BLUE, boxShadow: '0 2px 10px rgba(0, 113, 206, 0.15)' }}>
        <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={goToWalmart}>
            <Box sx={{ width: 40, height: 40, background: WALMART_YELLOW, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
              <Typography variant="h5" sx={{ color: '#222', fontWeight: 'bold', fontFamily: 'sans-serif' }}>✦</Typography>
            </Box>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, fontFamily: 'sans-serif', letterSpacing: 0.5 }}>
              Walmart
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit" onClick={goToWalmart}><AppsIcon /></IconButton>
            <IconButton color="inherit" onClick={handleProfileClick}><PersonOutlineIcon /></IconButton>
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
      {/* Notification Banner (site-wide, only for non-logged-in users) */}
      {!user && latestNotification && showBanner && (
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
            <span style={{ fontWeight: 700 }}>{latestNotification.title}:</span> {latestNotification.message}
          </Box>
          <IconButton size="small" onClick={() => setShowBanner(false)} sx={{ position: 'absolute', right: 8, top: 4, color: '#222' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      {/* Main content: only show notification list and form for logged-in users */}
      {user && (
        <Box sx={{
          width: '100vw',
          height: { xs: 'auto', md: 'calc(100vh - 136px)' },
          minHeight: { xs: 'auto', md: 'calc(100vh - 136px)' },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          p: 0,
          m: 0,
          gap: 0,
          background: 'transparent',
        }}>
          <Box sx={{
            flex: 1,
            height: { xs: 'auto', md: '100%' },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            borderRight: { md: '1.5px solid #e7f0f7' },
            background: 'transparent',
            p: { xs: 0, md: 4 },
          }}>
            <Paper sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 113, 206, 0.08)',
              border: '1px solid rgba(0, 113, 206, 0.08)',
              height: { xs: 'auto', md: '100%' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              background: '#fff',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ width: 50, height: 50, background: 'linear-gradient(135deg, #0071CE 0%, #005fa3 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>📝</Typography>
                </Box>
                <Typography variant="h5" sx={{ color: WALMART_BLUE, fontWeight: 'bold' }}>
                  Post a Notification
                </Typography>
              </Box>
              <form onSubmit={handlePost}>
                <TextField label="Notification Title" value={title} onChange={e => setTitle(e.target.value)} fullWidth sx={{ mb: 3 }} required variant="outlined" InputProps={{ sx: { borderRadius: 2 } }} />
                <TextField label="Notification Message" value={message} onChange={e => setMessage(e.target.value)} fullWidth multiline rows={4} sx={{ mb: 3 }} required variant="outlined" InputProps={{ sx: { borderRadius: 2 } }} />
                <Button type="submit" variant="contained" sx={{ background: 'linear-gradient(135deg, #FFC220 0%, #FFD700 100%)', color: '#222', fontWeight: 'bold', py: 1.5, px: 4, borderRadius: 2, boxShadow: '0 4px 15px rgba(255, 194, 32, 0.4)', '&:hover': { background: 'linear-gradient(135deg, #FFD700 0%, #FFC220 100%)', boxShadow: '0 6px 20px rgba(255, 194, 32, 0.6)' } }}>
                  📢 Post Notification
                </Button>
              </form>
              <Divider sx={{ my: 3 }} />
              <Button fullWidth variant="outlined" color="primary" onClick={handleLogout} sx={{ fontWeight: 'bold', borderRadius: 2, borderColor: WALMART_BLUE, color: WALMART_BLUE, '&:hover': { background: '#f2f8fd' } }}>
                Logout
              </Button>
            </Paper>
          </Box>
          <Box sx={{
            flex: 1,
            height: { xs: 'auto', md: '100%' },
            display: 'flex',
            flexDirection: 'column',
            background: 'transparent',
            p: { xs: 0, md: 4 },
          }}>
            <Paper sx={{
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0, 113, 206, 0.08)',
              border: '1px solid rgba(0, 113, 206, 0.08)',
              flex: 1,
              minHeight: 0,
              height: { xs: 'auto', md: '100%' },
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              background: '#fff',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ width: 50, height: 50, background: 'linear-gradient(135deg, #FFC220 0%, #FFD700 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2 }}>
                  <Typography variant="h6" sx={{ color: '#222', fontWeight: 'bold' }}>📢</Typography>
                </Box>
                <Typography variant="h5" sx={{ color: WALMART_BLUE, fontWeight: 'bold' }}>
                  Public Notifications
                </Typography>
              </Box>
              {notifications.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, color: '#666' }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>No notifications yet</Typography>
                  <Typography variant="body2">Check back later for updates!</Typography>
                </Box>
              ) : (
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
                            <IconButton color="error" size="small" onClick={() => handleDeleteNotification(n.id)}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Box>
        </Box>
      )}
      {/* Login Popover */}
      {!user && (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleProfileClose}
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
            <form onSubmit={handleLogin}>
              <TextField label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth sx={{ mb: 3 }} required variant="outlined" InputProps={{ sx: { borderRadius: 2 } }} />
              <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth sx={{ mb: 3 }} required variant="outlined" InputProps={{ sx: { borderRadius: 2 } }} />
              <Button type="submit" variant="contained" sx={{ background: 'linear-gradient(135deg, #0071CE 0%, #005fa3 100%)', color: '#fff', fontWeight: 'bold', py: 1.5, px: 4, borderRadius: 2, boxShadow: '0 4px 15px rgba(0, 113, 206, 0.4)', '&:hover': { background: 'linear-gradient(135deg, #005fa3 0%, #0071CE 100%)', boxShadow: '0 6px 20px rgba(0, 113, 206, 0.6)' } }}>
                🔐 Login
              </Button>
            </form>
          </Box>
        </Popover>
      )}
    </Box>
  );
}

export default App;
