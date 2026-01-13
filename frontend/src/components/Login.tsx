import { useState, FormEvent } from 'react';
import { Button, TextField, Box, Alert } from '@mui/material';
import { login } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField 
        name="username" 
        label="Username" 
        fullWidth 
        required 
        sx={{ mb: 2 }}
      />
      <TextField 
        name="password" 
        label="Password" 
        type="password" 
        fullWidth 
        required 
        sx={{ mb: 2 }}
      />
      <Button 
        type="submit" 
        variant="contained" 
        fullWidth 
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </Box>
  );
}