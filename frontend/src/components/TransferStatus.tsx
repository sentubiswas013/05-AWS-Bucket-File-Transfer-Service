import { Box, Typography, Alert } from '@mui/material';

interface TransferStatusProps {
  status: 'idle' | 'transferring' | 'completed' | 'error';
  progress?: number;
  message?: string;
}

export default function TransferStatus({ status, progress = 0, message }: TransferStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'idle':
        return {
          icon: '☁️',
          color: 'info' as const,
          title: 'Ready to Transfer',
          description: 'Select source bucket, destination bucket, and file to start transfer'
        };
      case 'transferring':
        return {
          icon: '🔄',
          color: 'warning' as const,
          title: 'Transfer in Progress',
          description: 'Your file is being transferred between buckets'
        };
      case 'completed':
        return {
          icon: '✅',
          color: 'success' as const,
          title: 'Transfer Completed',
          description: 'File has been successfully transferred to destination bucket'
        };
      case 'error':
        return {
          icon: '❌',
          color: 'error' as const,
          title: 'Transfer Failed',
          description: 'An error occurred during the transfer process'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Box sx={{ mt: 3 }}>
      <Alert 
        severity={config.color} 
        icon={<Typography variant="h4">{config.icon}</Typography>}
        sx={{ p: 3 }}
      >
        <Typography variant="h6" gutterBottom>
          {config.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {message || config.description}
        </Typography>
      </Alert>
    </Box>
  );
}