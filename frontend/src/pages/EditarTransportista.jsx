import React, { useState, useEffect, useContext } from "react";
import { Container, TextField, Button, Grid, Typography, Stepper, Step, StepLabel, Paper, MenuItem, Box } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from "../pages/context/AuthContext";
import dayjs from "dayjs";

const steps = ["Información General", "Detalles del Transporte"];

const EditarTransportista = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    contacto: "",
    email: "",
    tipoVehiculo: "",
    tipoMaterial: "",
    fecha_ingreso: null,
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  // Obtenemos el token del contexto de autenticación
  const { token } = useContext(AuthContext);

  // Cargar los datos actuales del transportista
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/api/transportistas/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener los datos del transportista");
          }
          return response.json();
        })
        .then((data) => {
          setFormData({
            nombre: data.nombre || "",
            contacto: data.contacto || "",
            email: data.email || "",
            // Asegúrate de que los nombres de campo coincidan con los del serializer de la API
            tipoVehiculo: data.tipo_vehiculo || "",
            tipoMaterial: data.tipo_material || "",
            fecha_ingreso: data.fecha_ingreso ? dayjs(data.fecha_ingreso) : null,
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMessage("No se pudo cargar la información del transportista.");
        });
    }
  }, [id, token]);

  // Validación de los campos
  const validate = (step) => {
    let newErrors = {};
  
    if (step === 0) {
      if (!formData.nombre.trim()) {
        newErrors.nombre = "El nombre es obligatorio.";
      }
      if (!/^\d{9}$/.test(formData.contacto)) {
        newErrors.contacto = "El contacto debe tener exactamente 9 dígitos numéricos.";
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Correo electrónico inválido.";
      }
    }
  
    if (step === 1) {
      if (!formData.tipoVehiculo.trim()) {
        newErrors.tipoVehiculo = "El tipo de vehículo es obligatorio.";
      }
      if (!formData.tipoMaterial) {
        newErrors.tipoMaterial = "Debe seleccionar un tipo de material.";
      }
    }
  
    if (step === 2) {
      if (!formData.fecha_ingreso) {
        newErrors.fecha_ingreso = "La fecha de ingreso es obligatoria.";
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) {
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
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
    if (!validate()) return;

    const payload = {
      nombre: formData.nombre,
      contacto: formData.contacto,
      email: formData.email,
      tipo_vehiculo: formData.tipoVehiculo,
      tipo_material: formData.tipoMaterial,
      fecha_ingreso: formData.fecha_ingreso ? formData.fecha_ingreso.toISOString().split("T")[0] : null,
    };

    try {
      const response = await fetch(`http://localhost:8000/api/transportistas/${id}/actualizar/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        navigate("/transportistas", { state: { successMessage: "Transportista actualizado con éxito." } });
      } else {
        setErrorMessage("Error al actualizar el transportista.");
      }
    } catch (error) {
      setErrorMessage("Ocurrió un error. Intenta nuevamente.");
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
          <Typography variant="h3" gutterBottom sx={{ textAlign: 'center' }}>
            Editar Transportista
          </Typography>

          {errorMessage && (
            <Typography variant="body1" color="error" align="center" sx={{ mb: 3 }}>
              {errorMessage}
            </Typography>
          )}

          <Stepper activeStep={activeStep} alternativeLabel>
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
                    required
                    error={!!errors.nombre}
                    helperText={errors.nombre}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Contacto Telefónico"
                    fullWidth
                    name="contacto"
                    value={formData.contacto}
                    onChange={handleChange}
                    required
                    error={!!errors.contacto}
                    helperText={errors.contacto}
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
                    required
                    error={!!errors.email}
                    helperText={errors.email}
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
                    required
                    error={!!errors.tipoVehiculo}
                    helperText={errors.tipoVehiculo}
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
                    required
                    error={!!errors.tipoMaterial}
                    helperText={errors.tipoMaterial}
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

            {activeStep === 2 && (
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
                        required
                        error={!!errors.fecha_ingreso}
                        helperText={errors.fecha_ingreso}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            )}
          </Grid>


            <Grid container spacing={2} justifyContent="space-between" sx={{ marginTop: 3 }}>
              {activeStep !== 0 && (
                <Grid item xs={6}>
                  <Button onClick={handleBack} size="large">Atrás</Button>
                </Grid>
              )}
              {activeStep < steps.length - 1 && (
                <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                <Grid item>
                  <Button onClick={handleNext} size="large">Siguiente</Button>
                </Grid>
              </Grid>
              )}
              {activeStep === steps.length - 1 && (
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Button type="submit" variant="contained" color="primary" size="large">
                    Finalizar
                  </Button>
                </Grid>
              )}
            </Grid>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default EditarTransportista;
