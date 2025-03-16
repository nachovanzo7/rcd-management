import React, { useState, useContext } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  Paper,
  Box,
} from '@mui/material';
import { AuthContext } from './context/AuthContext';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const steps = ['Información General', 'Detalles de Transporte'];

const AltaTransportistas = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    email: '',
    tipoVehiculo: '',
    tipoMaterial: '',
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Función de validación general
  const validate = () => {
    let newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    }
    if (!/^\d{9}$/.test(formData.contacto)) {
      newErrors.contacto = "El contacto debe tener exactamente 9 dígitos numéricos.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido.";
    }
    if (!formData.tipoVehiculo.trim()) {
      newErrors.tipoVehiculo = "El tipo de vehículo es obligatorio.";
    }
    if (!formData.tipoMaterial) {
      newErrors.tipoMaterial = "Debe seleccionar un tipo de material.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Valida datos del primer paso antes de avanzar
  const handleNext = () => {
    if (activeStep === 0) {
      let stepErrors = {};
      if (!formData.nombre.trim()) {
        stepErrors.nombre = "El nombre es obligatorio.";
      }
      if (!/^\d{9}$/.test(formData.contacto)) {
        stepErrors.contacto = "El contacto debe tener exactamente 9 dígitos numéricos.";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        stepErrors.email = "Correo electrónico inválido.";
      }
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
    setErrorMessage('');
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setErrorMessage('');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Limpiamos el error del campo conforme se corrige
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const payload = {
      nombre: formData.nombre,
      contacto: formData.contacto,
      email: formData.email,
      tipo_vehiculo: formData.tipoVehiculo,
      tipo_material: formData.tipoMaterial,
      estado: 'activo',
    };

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';


    try {
      if (!token) {
        throw new Error('Token no disponible, redirigiendo a login');
      }

      const response = await fetch(`${API_URL}/api/transportistas/registro/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const mensaje = errorData.email ? errorData.email[0] : response.statusText;
        throw new Error(mensaje);
      }

      const data = await response.json();
      console.log('Transportista creado:', data);
      navigate('/transportistas');
    } catch (error) {
      console.error('Error al crear el transportista:', error);
      setErrorMessage(error.message);
    }
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: '#a8c948',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Paper elevation={3} sx={{ padding: 6, borderRadius: 3 }}>
            <Typography variant="h3" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
              Alta Transportista
            </Typography>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {activeStep === 0 && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        label="Nombre"
                        fullWidth
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        error={Boolean(errors.nombre)}
                        helperText={errors.nombre}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Contacto Telefónico"
                        fullWidth
                        name="contacto"
                        value={formData.contacto}
                        onChange={handleChange}
                        error={Boolean(errors.contacto)}
                        helperText={errors.contacto}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={Boolean(errors.email)}
                        helperText={errors.email}
                        required
                      />
                    </Grid>
                  </>
                )}

                {activeStep === 1 && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        label="Tipo de Vehículo"
                        fullWidth
                        name="tipoVehiculo"
                        value={formData.tipoVehiculo}
                        onChange={handleChange}
                        error={Boolean(errors.tipoVehiculo)}
                        helperText={errors.tipoVehiculo}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Tipo de Material"
                        fullWidth
                        name="tipoMaterial"
                        value={formData.tipoMaterial}
                        onChange={handleChange}
                        error={Boolean(errors.tipoMaterial)}
                        helperText={errors.tipoMaterial}
                        required
                      >
                        <MenuItem value="escombro_limpio">Escombro Limpio</MenuItem>
                        <MenuItem value="plastico">Plástico</MenuItem>
                        <MenuItem value="papel_carton">Papel y Cartón</MenuItem>
                        <MenuItem value="metales">Metales</MenuItem>
                        <MenuItem value="madera">Madera</MenuItem>
                        <MenuItem value="mezclados">Mezclados</MenuItem>
                        <MenuItem value="peligrosos">Peligrosos</MenuItem>
                      </TextField>
                    </Grid>
                  </>
                )}
              </Grid>

              {errorMessage && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                  {errorMessage}
                </Typography>
              )}

              <Grid container spacing={2} sx={{ mt: 4 }}>
                {activeStep !== 0 && (
                  <Grid item xs={6}>
                    <Button onClick={handleBack}>Atrás</Button>
                  </Grid>
                )}

                {activeStep === 0 && (
                  <Grid item xs={12} sx={{ textAlign: 'right' }}>
                    <Button onClick={handleNext}>Siguiente</Button>
                  </Grid>
                )}

                {activeStep !== 0 && activeStep < steps.length - 1 && (
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Button onClick={handleNext}>Siguiente</Button>
                  </Grid>
                )}

                {activeStep === steps.length - 1 && (
                  <Grid item xs={6} sx={{ textAlign: 'right' }}>
                    <Button type="submit" variant="contained" color="primary">
                      Finalizar
                    </Button>
                  </Grid>
                )}
              </Grid>
            </form>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AltaTransportistas;
