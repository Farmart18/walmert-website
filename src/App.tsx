import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import NotificationBanner from './components/NotificationBanner';
import LoginPopover from './components/LoginPopover';
import NotificationForm from './components/NotificationForm';
import NotificationList from './components/NotificationList';
import Footer from './components/Footer';
import BatchCard from './components/BatchCard';
import { Box, Paper, Divider, Button, Alert } from '@mui/material';

interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  author: string;
}

interface Batch {
  id: string;
  crop_type: string;
  variety: string;
  sowing_date: string;
  notes: string;
  blockchain_hash: string;
  created_at: string;
}

const WALMART_BLUE = '#0071CE';

// ErrorBoundary component and
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      return <Box sx={{ p: 4, textAlign: 'center' }}><Alert severity="error">Something went wrong: {this.state.error?.message || 'Unknown error'}</Alert></Box>;
    }
    return this.props.children;
  }
}

function App() {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showBanner, setShowBanner] = useState(true);
  const [envError, setEnvError] = useState<string | null>(null);

  useEffect(() => {
    // Check for missing env vars
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setEnvError('Missing Supabase environment variables. Please check your .env file.');
      return;
    }
    fetchNotifications();
    fetchFinalizedBatches();
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

  async function fetchFinalizedBatches() {
    const { data, error } = await supabase
      .from('batch')
      .select('*')
      .eq('is_finalized', true)
      .order('created_at', { ascending: false });
    if (!error && data) setBatches(data as Batch[]);
    console.log('Fetched finalized batches:', data);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setPassword('');
    } else {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);
      setAnchorEl(null);
      setEmail('');
      setPassword('');
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !message) return;
    const { error } = await supabase.from('notifications').insert([
      { title, message, author: user.email }
    ]);
    if (error) {
      console.error('Error posting notification:', error);
    } else {
      setTitle('');
      setMessage('');
      fetchNotifications();
    }
  }

  async function handleDeleteNotification(id: number) {
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) {
      console.error('Error deleting notification:', error);
    } else {
      fetchNotifications();
    }
  }

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const goToWalmart = () => window.open('https://www.walmart.com', '_blank', 'noopener,noreferrer');
  const latestNotification = notifications.length > 0 ? notifications[0] : null;

  if (envError) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error">{envError}</Alert>
      </Box>
    );
  }

  return (
    <ErrorBoundary>
      <Box sx={{ background: '#f2f8fd', minHeight: '100vh', width: '100vw', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <Header onProfileClick={handleProfileClick} goToWalmart={goToWalmart} />
        <NotificationBanner notification={latestNotification} show={!user && showBanner} onClose={() => setShowBanner(false)} />
        {/* Finalized Batches Section */}
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 3, width: '100%' }}>
          {batches.map(batch => (
            <BatchCard key={batch.id} {...batch} />
          ))}
        </Box>
        {/* End Finalized Batches Section */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {user && (
            <Box sx={{
              width: '100vw',
              height: { xs: 'auto', md: 'calc(100vh - 136px - 64px)' },
              minHeight: { xs: 'auto', md: 'calc(100vh - 136px - 64px)' },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              p: 0,
              m: 0,
              gap: 0,
              background: 'transparent',
              flex: 1,
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
                  <NotificationForm
                    title={title}
                    message={message}
                    setTitle={setTitle}
                    setMessage={setMessage}
                    onPost={handlePost}
                  />
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
                  <NotificationList
                    notifications={notifications}
                    user={user}
                    onDelete={handleDeleteNotification}
                  />
                </Paper>
              </Box>
            </Box>
          )}
          <LoginPopover
            open={open}
            anchorEl={anchorEl}
            onClose={handleProfileClose}
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            onLogin={handleLogin}
          />
        </Box>
        <Footer />
      </Box>
    </ErrorBoundary>
  );
}

export default App;
