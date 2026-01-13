import { useState, useEffect } from 'react';
import { Button, Alert, Box, Typography, Chip } from '@mui/material';
import { startTransfer, getTransferStatus } from '../api/transferApi';

interface TransferFormProps {
  sourceBucket: string;
  destinationBucket: string;
  fileKey: string;
  onStatusChange: (status: 'idle' | 'transferring' | 'completed' | 'error') => void;
}

export default function TransferForm({ sourceBucket, destinationBucket, fileKey, onStatusChange }: TransferFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (jobId) {
      interval = setInterval(async () => {
        try {
          const status = await getTransferStatus(jobId);
          if (status === 'COMPLETED') {
            onStatusChange('completed');
            setJobId(null);
          } else if (status === 'FAILED') {
            onStatusChange('error');
            setError('Transfer failed');
            setJobId(null);
          }
        } catch (err) {
          console.error('Failed to get transfer status:', err);
        }
      }, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [jobId, onStatusChange]);

  const handleTransfer = async () => {
    if (!sourceBucket || !destinationBucket || !fileKey) {
      setError('Please select source bucket, destination bucket, and file');
      return;
    }

    setLoading(true);
    setError('');
    onStatusChange('transferring');

    try {
      const transferJobId = await startTransfer({
        sourceBucket,
        destinationBucket,
        fileKey
      });
      setJobId(transferJobId);
    } catch (err) {
      setError('Transfer failed to start. Please try again.');
      onStatusChange('error');
    } finally {
      setLoading(false);
    }
  };

  const canTransfer = sourceBucket && destinationBucket && fileKey && !jobId;
  const isTransferring = !!jobId;

  return (
    <Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {/* Transfer Summary */}
      {canTransfer && (
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="subtitle2" gutterBottom>Transfer Summary:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Chip label={sourceBucket} size="small" color="primary" />
            <Typography>➡️</Typography>
            <Chip label={destinationBucket} size="small" color="warning" />
          </Box>
          <Typography variant="body2" color="text.secondary">
            File: <strong>{fileKey}</strong>
          </Typography>
        </Box>
      )}
      
      <Button 
        variant="contained" 
        onClick={handleTransfer}
        disabled={loading || !canTransfer}
        fullWidth
        sx={{
          py: 1.5,
          fontSize: '1.1rem'
        }}
      >
        {loading ? 'Starting Transfer...' : 
         isTransferring ? '🔄 Transfer in Progress...' : 
         '➡️ Start Transfer'}
      </Button>
    </Box>
  );
}