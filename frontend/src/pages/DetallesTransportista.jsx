import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Paper, Divider, Box, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../pages/context/AuthContext';

const DetallesTransportista = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  
  // Obtenemos el token del contexto de autenticación
  const { token } = useContext(AuthContext);

  const [transportista, setTransportista] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = createTheme({
    palette: {
      primary: {
        main: '#a8c948',
      },
    },
  });

  useEffect(() => {
    if (!id) {
      setError('ID de transportista no proporcionado.');
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/transportistas/${id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al obtener los detalles del transportista.");
        }
        return response.json();
      })
      .then(data => {
        setTransportista(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, token]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      </ThemeProvider>
    );
  }

  if (!transportista) {
    return (
      <ThemeProvider theme={theme}>
        <Typography variant="h6" color="error" align="center">
          Transportista no encontrado.
        </Typography>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ maxWidth: 800, margin: '0 auto', padding: 4 }}>
        <CardContent>
          <Typography variant="h3" align="center" sx={{ mb: 4 }}>
            {transportista.nombre}
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={3}>
            {[
              { label: "Nombre Transportista", value: transportista.nombre },
              { label: "Contacto", value: transportista.contacto },
              { label: "Correo Electrónico", value: transportista.email },
              { label: "Tipo de Vehículo", value: transportista.tipo_vehiculo },
              { label: "Tipo de Material", value: transportista.tipo_material }
            ].map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper sx={{ padding: 2, backgroundColor: '#f4f4f4' }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2">
                    {item.value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default DetallesTransportista;
