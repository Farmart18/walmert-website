import React from 'react';
import { Paper, Box, Typography, Divider } from '@mui/material';

interface BatchCardProps {
  crop_type: string;
  variety: string;
  sowing_date: string;
  notes: string;
  blockchain_hash: string;
  created_at: string;
}

const BatchCard: React.FC<BatchCardProps> = ({ crop_type, variety, sowing_date, notes, blockchain_hash, created_at }) => {
  return (
    <Paper sx={{ p: 3, mb: 2, borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{crop_type} ({variety})</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Sowing Date: {new Date(sowing_date).toLocaleDateString()}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body1" sx={{ mb: 1 }}>
          {notes}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
          Blockchain Hash: {blockchain_hash}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Created: {new Date(created_at).toLocaleString()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default BatchCard; 