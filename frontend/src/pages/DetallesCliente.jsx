import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Divider, Paper, Grid } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../pages/context/AuthContext';

const DetallesCliente = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const [cliente, setCliente] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  const { token } = useContext(AuthContext);

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetch(`${API_URL}/api/clientes/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setCliente(data);
        setCargando(false);
      })
      .catch((error) => {
        setError(error.message);
        setCargando(false);
      });
  }, [id, token]);

  if (cargando) {
    return <Typography variant="h6" align="center">Cargando...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error" align="center">{error}</Typography>;
  }

  if (!cliente) {
    return <Typography variant="h6" color="error" align="center">Cliente no encontrado</Typography>;
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: '#a8c948',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ maxWidth: 800, margin: '0 auto', padding: 4 }}>
        <CardContent>
          <Typography variant="h3" align="center" sx={{ mb: 4 }}>
            Detalles del Cliente
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper sx={{ padding: 2, backgroundColor: '#f8f9f9' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Nombre</Typography>
                <Typography variant="body2">{cliente.nombre}</Typography>
              </Paper>
            </Grid>
  {/* Dirección */}
  <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 2, backgroundColor: '#f8f9f9' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Dirección</Typography>
                <Typography variant="body2">{cliente.direccion}</Typography>
              </Paper>
            </Grid>

            {/* Contacto */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 2, backgroundColor: '#f8f9f9' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Contacto</Typography>
                <Typography variant="body2">{cliente.contacto}</Typography>
              </Paper>
            </Grid>

            {/* Nombre de Contacto */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 2, backgroundColor: '#f8f9f9' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Nombre de Contacto</Typography>
                <Typography variant="body2">{cliente.nombre_contacto}</Typography>
              </Paper>
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 2, backgroundColor: '#f8f9f9' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Email</Typography>
                <Typography variant="body2">{cliente.email}</Typography>
              </Paper>
            </Grid>
            

            {/* Fecha de Ingreso */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 2, backgroundColor: '#f8f9f9' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Fecha de Ingreso</Typography>
                <Typography variant="body2">{cliente.fecha_ingreso}</Typography>
              </Paper>
            </Grid>

            {/* Razón Social */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 2, backgroundColor: '#f8f9f9' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Razón Social</Typography>
                <Typography variant="body2">{cliente.razon_social}</Typography>
              </Paper>
            </Grid>

            {/* Dirección Fiscal */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 2, backgroundColor: '#f8f9f9' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Dirección Fiscal</Typography>
                <Typography variant="body2">{cliente.direccion_fiscal}</Typography>
              </Paper>
            </Grid>

            {/* RUT */}
            <Grid item xs={12} sm={6}>
              <Paper sx={{ padding: 2, backgroundColor: '#f8f9f9' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>RUT</Typography>
                <Typography variant="body2">{cliente.rut}</Typography>
              </Paper>
            </Grid>          </Grid>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default DetallesCliente;
