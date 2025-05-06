/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';

type Supply = {
  name: string;
  description: string;
  quantity: string;
  provider: string;
  state: string;
  addedBy?: string;
};

type Props = {
  supplies: Supply[];
  walletAddress: string | null;
  onAdd: (supply: {
    name: string;
    description: string;
    quantity: number;
    provider: string;
  }) => Promise<void>;  // Make sure onAdd returns a Promise for loading
};

export default function SuppliesTable({ supplies, onAdd, walletAddress }: Props) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    quantity: 0,
    provider: '',
    addedBy: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    }));
  };


  const handleSubmit = async () => {
    if (!form.name || !form.description || !form.quantity || !form.provider || !form.addedBy) {
      setError('All fields are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onAdd(form);  // Await the add function
      setSuccess(true);
      setForm({ name: '', description: '', quantity: 0, provider: '', addedBy: '' });
    } catch (err) {
      setError('Failed to add supply.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 4, textAlign: 'left' }}>
      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1">Add Supply</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth sx={{ mb: 1 }} />
        <TextField label="Description" name="description" value={form.description} onChange={handleChange} fullWidth sx={{ mb: 1 }} />
        <TextField label="Quantity" name="quantity" type="number" value={form.quantity || ''} onChange={handleChange} fullWidth sx={{ mb: 1 }} />
        <Select
          label="Provider"
          name="provider"
          value={form.provider}
          onChange={handleChange}
          fullWidth
          displayEmpty
          sx={{ mb: 1 }}
        >
          <MenuItem value="">Select Provider</MenuItem>
          <MenuItem value="Provider A">Provider A</MenuItem>
          <MenuItem value="Provider B">Provider B</MenuItem>
          <MenuItem value="Provider C">Provider C</MenuItem>
        </Select>
        <Button variant="contained" onClick={handleSubmit} disabled={loading || (walletAddress ? false : true)}>
          {loading ? <CircularProgress size={20} /> : 'Add Supply'}
        </Button>
      </Box>

      <Typography variant="h5">Supplies</Typography>
      <List>
        {supplies.map((supply, idx) => (
          <ListItem key={idx} sx={{ borderBottom: '1px solid #ddd', transition: 'all 0.3s ease' }}>
            <ListItemText
              primary={`${supply.name} (${supply.quantity})`}
              secondary={`Provider: ${supply.provider} | Added by: ${supply.addedBy} | State: ${supply.state}`}
            />
          </ListItem>
        ))}
      </List>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        message="Supply added successfully!"
      />
    </Box>
  );
}
