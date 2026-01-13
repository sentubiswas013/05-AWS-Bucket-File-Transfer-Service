import { useState, useEffect, FormEvent } from 'react';
import { TextField, Button, Container, Typography, Alert, List, ListItem, ListItemText, Paper, Box } from '@mui/material';
import { saveCredentials, getCredentials } from '../api/adminApi';

interface AWSConfig {
  accountName: string;
  accessKey: string;
  secretKey: string;
  region: string;
}

interface StoredCredential {
  id: string;
  accountName: string;
  region: string;
}

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState<StoredCredential[]>([]);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      const creds = await getCredentials();
      setCredentials(creds);
    } catch (err) {
      setError('Failed to load credentials');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const config: AWSConfig = {
      accountName: formData.get('name') as string,
      accessKey: formData.get('access') as string,
      secretKey: formData.get('secret') as string,
      region: formData.get('region') as string
    };

    try {
      await saveCredentials(config);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
      loadCredentials(); // Refresh the list
    } catch (err) {
      setError('Failed to save AWS configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>AWS Configuration Admin Panel</Typography>
      
      {success && <Alert severity="success" sx={{ mb: 2 }}>Configuration saved successfully!</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" gutterBottom>Add New AWS Credentials</Typography>
          <form onSubmit={handleSubmit}>
            <TextField 
              name="name" 
              label="Account Name" 
              fullWidth 
              required 
              sx={{ mb: 2 }}
            />
            <TextField 
              name="access" 
              label="Access Key" 
              fullWidth 
              required 
              sx={{ mb: 2 }}
            />
            <TextField 
              name="secret" 
              label="Secret Key" 
              type="password"
              fullWidth 
              required 
              sx={{ mb: 2 }}
            />
            <TextField 
              name="region" 
              label="Region" 
              fullWidth 
              required 
              sx={{ mb: 2 }}
              placeholder="e.g., us-east-1"
            />
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth 
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Configuration'}
            </Button>
          </form>
        </Paper>
        
        <Paper sx={{ p: 3, flex: 1 }}>
          <Typography variant="h6" gutterBottom>Stored AWS Credentials</Typography>
          {credentials.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No credentials stored yet
            </Typography>
          ) : (
            <List>
              {credentials.map((cred) => (
                <ListItem key={cred.id}>
                  <ListItemText 
                    primary={cred.accountName}
                    secondary={`Region: ${cred.region}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Box>
    </Container>
  );
}