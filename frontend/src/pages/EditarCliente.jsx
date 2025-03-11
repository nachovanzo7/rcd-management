import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
  Box,
  CircularProgress
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const steps = ["Información General", "Detalles Fiscales", "Contacto"];

const EditarCliente = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    contacto: "",
    nombre_contacto: "",
    email: "",
    fecha_ingreso: null,
    razon_social: "",
    direccion_fiscal: "",
    rut: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Se obtiene el token desde localStorage
  const token = sessionStorage.getItem('token');

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/api/clientes/${id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        }
      })
        .then((response) => {
          if (!response.ok) {
            setErrorMessage("Error al obtener los datos del cliente.");
          }
          return response.json();
        })
        .then((data) => {
          setFormData({
            nombre: data.nombre,
            direccion: data.direccion,
            contacto: data.contacto,
            nombre_contacto: data.nombre_contacto,
            // Aquí se extrae el email desde el usuario asociado
            email: data.usuario ? data.usuario.email : data.email || "",
            fecha_ingreso: dayjs(data.fecha_ingreso),
            razon_social: data.razon_social,
            direccion_fiscal: data.direccion_fiscal,
            rut: data.rut,
          });
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [id, token]);

  const validateStep = (step) => {
    let newErrors = {};
    
    if (step === 0) {
      if (!formData.nombre?.trim() || !/^[a-zA-Z\s]{3,}$/.test(formData.nombre)) {
        newErrors.nombre = "Nombre inválido. Mínimo 3 letras y solo caracteres alfabéticos.";
      }
      if (!formData.direccion?.trim()) {
        newErrors.direccion = "La dirección es obligatoria.";
      }
      if (!formData.contacto?.trim() || !/^\d{9}$/.test(formData.contacto)) {
        newErrors.contacto = "El contacto debe tener exactamente 9 dígitos numéricos.";
      }
      if (!formData.nombre_contacto?.trim() || !/^[a-zA-Z\s]{3,}$/.test(formData.nombre_contacto)) {
        newErrors.nombre_contacto = "Nombre de contacto inválido. Mínimo 3 letras.";
      }
    } 
    
    else if (step === 1) {
      if (!formData.razon_social?.trim()) {
        newErrors.razon_social = "Razón Social es obligatoria.";
      }
      if (!formData.direccion_fiscal?.trim()) {
        newErrors.direccion_fiscal = "Dirección fiscal es obligatoria.";
      }
      if (!formData.rut?.trim() || !/^\d{12}$/.test(formData.rut)) {
        newErrors.rut = "RUT inválido. Debe contener exactamente 12 números.";
      }
    } 
    
    else if (step === 2) { // Contacto
      if (!formData.fecha_ingreso || isNaN(new Date(formData.fecha_ingreso).getTime())) {
        newErrors.fecha_ingreso = "Fecha de ingreso es obligatoria y debe ser válida.";
      }
      if (!formData.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Correo electrónico inválido.";
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (newValue) => {
    setFormData({ ...formData, fecha_ingreso: newValue });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateStep(activeStep)) return;

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        fecha_ingreso: formData.fecha_ingreso 
          ? formData.fecha_ingreso.format("YYYY-MM-DD") 
          : null,
      };

      const response = await fetch(`http://localhost:8000/api/clientes/${id}/actualizar/`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
        body: JSON.stringify(payload),
      });
    
      if (response.ok) {
        const data = await response.json();
        console.log("Cliente actualizado:", data);
        navigate("/clientes");
      } else {
        const errorText = await response.json();
        setErrorMessage(errorText.detail || "Ocurrió un error al actualizar el cliente.");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
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
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ padding: 6, marginTop: 6, borderRadius: 3 }}>
          {/* Título con margen inferior */}
          <Box mb={3}>
            <Typography variant="h3" align="center">
              Editar Cliente
            </Typography>
          </Box>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}

          {/* Stepper con margen inferior */}
          <Box mb={3}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Formulario con margen inferior */}
          <Box mb={3}>
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
                        error={!!errors.nombre} 
                        helperText={errors.nombre}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Dirección"
                        fullWidth
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        error={!!errors.direccion}
                        helperText={errors.direccion}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Contacto"
                        fullWidth
                        name="contacto"
                        value={formData.contacto}
                        onChange={handleChange}
                        error={!!errors.contacto}
                        helperText={errors.contacto}
                      />
                    </Grid>
                  </>
                )}

                {activeStep === 1 && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        label="Razón Social"
                        fullWidth
                        name="razon_social"
                        value={formData.razon_social}
                        onChange={handleChange}
                        error={!!errors.razon_social}
                        helperText={errors.razon_social}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Dirección Fiscal"
                        fullWidth
                        name="direccion_fiscal"
                        value={formData.direccion_fiscal}
                        onChange={handleChange}
                        error={!!errors.direccion_fiscal}
                        helperText={errors.direccion_fiscal}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="RUT"
                        fullWidth
                        name="rut"
                        value={formData.rut}
                        onChange={handleChange}
                        error={!!errors.rut}
                        helperText={errors.rut}
                      />
                    </Grid>
                  </>
                )}

                {activeStep === 2 && (
                  <>
                    <Grid item xs={12}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Fecha de Ingreso"
                          value={formData.fecha_ingreso || null}
                          onChange={handleDateChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              error={!!errors.fecha_ingreso}
                              helperText={errors.fecha_ingreso}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                      />
                    </Grid>
                  </>
                )}
              </Grid>

              <Grid container spacing={3} justifyContent="space-between" sx={{ marginTop: 3 }}>
                <Button 
                  onClick={handleBack} 
                  size="large" 
                  disabled={activeStep === 0}
                  sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
                >
                  Atrás
                </Button>
                {activeStep < steps.length - 1 && (
                  <Button onClick={handleNext} size="large">
                    Siguiente
                  </Button>
                )}
                {activeStep === steps.length - 1 && (
                  <Button type="submit" variant="contained" color="primary" size="large">
                    Guardar Cambios
                  </Button>
                )}
              </Grid>
            </form>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default EditarCliente;
