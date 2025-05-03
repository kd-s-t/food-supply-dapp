'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextField, Typography, Box, Alert } from '@mui/material';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.access_token); // Updated to use "access_token"
      router.push('/dashboard');  // redirect to dashboard
    } else {
      setError(data.message || 'Login failed');
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '50px auto', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogin}
        fullWidth
        sx={{ mt: 2 }}
      >
        Login
      </Button>
    </Box>
  );
}
