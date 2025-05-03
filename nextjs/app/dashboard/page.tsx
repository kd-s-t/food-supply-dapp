'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import SuppliesTable from '../components/SuppliesTable';

type Supply = {
  name: string;
  description: string;
  quantity: string;
  provider: string;
  addedBy: string;
  state: string;
};

export default function DashboardPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // First validate JWT
    fetch('http://localhost:3001/auth/protected', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Unauthorized');
        return res.json();
      })
      .then(data => {
        if (data.message) {
          setMessage(data.message);
          // Fetch supplies
          fetchSupplies(token);
        } else {
          setError('Invalid response from server');
        }
      })
      .catch(() => {
        setError('Unauthorized or token expired');
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, []);

  const fetchSupplies = (token: string) => {
    fetch('http://localhost:3001/supply/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setSupplies(data);
      })
      .catch(() => {
        setError('Failed to fetch supplies');
      });
  };

  const addSupply = async (supplyData: {
    name: string;
    description: string;
    quantity: number;
    provider: string;
    addedBy: string;
  }) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch('http://localhost:3001/supply/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(supplyData)
    });

    if (!res.ok) throw new Error('Failed to add supply');

    // After adding, refresh the supplies list
    fetchSupplies(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <Box sx={{ maxWidth: 700, margin: '50px auto', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {loading && <CircularProgress />}
      {!loading && (
        <>
          {message && <Alert severity="success">{message}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <SuppliesTable supplies={supplies} onAdd={addSupply} />

          <Button
            variant="contained"
            color="primary"
            onClick={logout}
            sx={{ mt: 2 }}
          >
            Logout
          </Button>
        </>
      )}
    </Box>
  );
}
