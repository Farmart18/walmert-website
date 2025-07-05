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
} from '@mui/material';

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
  const [isSignUp, setIsSignUp] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success'|'error'}>({open: false, message: '', severity: 'success'});

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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setSnackbar({open: true, message: error.message, severity: 'error'});
    else setSnackbar({open: true, message: 'Logged in!', severity: 'success'});
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setSnackbar({open: true, message: error.message, severity: 'error'});
    else setSnackbar({open: true, message: 'Account created! Please check your email to confirm.', severity: 'success'});
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

  return (
    <Box sx={{ background: '#f2f8fd', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ background: WALMART_BLUE }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff' }}>
            Walmart Notifications
          </Typography>
          {user ? (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          ) : null}
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {user ? (
          <Paper sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6" sx={{ color: WALMART_BLUE, mb: 2 }}>Post a Notification</Typography>
            <form onSubmit={handlePost}>
              <TextField
                label="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                required
              />
              <TextField
                label="Message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 2 }}
                required
              />
              <Button type="submit" variant="contained" sx={{ background: WALMART_YELLOW, color: '#222', '&:hover': { background: '#FFD700' } }}>
                Post
              </Button>
            </form>
          </Paper>
        ) : (
          <Paper sx={{ p: 2, mb: 4 }}>
            <Typography variant="h6" sx={{ color: WALMART_BLUE, mb: 2 }}>
              {isSignUp ? 'Create Walmart Personnel Account' : 'Walmart Personnel Login'}
            </Typography>
            <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                required
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
                required
              />
              <Button type="submit" variant="contained" sx={{ background: WALMART_BLUE, color: '#fff', '&:hover': { background: '#005fa3' }, mr: 2 }}>
                {isSignUp ? 'Sign Up' : 'Login'}
              </Button>
              <Button 
                variant="text" 
                onClick={() => setIsSignUp(!isSignUp)}
                sx={{ color: WALMART_BLUE }}
              >
                {isSignUp ? 'Already have an account? Login' : 'Need an account? Sign Up'}
              </Button>
            </form>
          </Paper>
        )}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ color: WALMART_BLUE, mb: 2 }}>Public Notifications</Typography>
          <List>
            {notifications.map(n => (
              <ListItem key={n.id} alignItems="flex-start">
                <ListItemText
                  primary={<span style={{ color: WALMART_BLUE, fontWeight: 600 }}>{n.title}</span>}
                  secondary={<>
                    <span style={{ color: '#222' }}>{n.message}</span><br/>
                    <span style={{ color: '#888', fontSize: 12 }}>By {n.author} on {new Date(n.created_at).toLocaleString()}</span>
                  </>}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({...s, open: false}))}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
