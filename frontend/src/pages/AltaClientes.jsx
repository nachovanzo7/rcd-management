import React, { useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const steps = ["Información General", "Detalles Fiscales", "Contacto"];

const AltaCliente = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    contacto: "",
    nombre_contacto: "",
    email: "",
    password: "",
    fecha_ingreso: null,
    razon_social: "",
    direccion_fiscal: "",
    rut: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const validateStep = (step) => {
    let newErrors = {};
    if (step === 0) {

      if (!formData.nombre.trim() || !/^[a-zA-Z\s]{3,}$/.test(formData.nombre)) {
        newErrors.nombre =
          "Nombre inválido. Mínimo 3 letras y solo caracteres alfabéticos.";
      }
      if (!formData.direccion.trim()) {
        newErrors.direccion = "La dirección es obligatoria.";
      }
      if (!/^\d{9}$/.test(formData.contacto)) {
        newErrors.contacto =
          "El contacto debe tener exactamente 9 dígitos numéricos.";
      }
      if (
        !formData.nombre_contacto.trim() ||
        !/^[a-zA-Z\s]{3,}$/.test(formData.nombre_contacto)
      ) {
        newErrors.nombre_contacto =
          "Nombre de contacto inválido. Mínimo 3 letras.";
      }
    } else if (step === 1) {

      if (!formData.razon_social.trim()) {
        newErrors.razon_social = "Razón Social es obligatoria.";
      }
      if (!formData.direccion_fiscal.trim()) {
        newErrors.direccion_fiscal = "Dirección fiscal es obligatoria.";
      }
      if (!/^\d{12}$/.test(formData.rut)) {
        newErrors.rut = "RUT inválido. Debe contener exactamente 12 números.";
      }
    } else if (step === 2) {
      // Validar Contacto
      if (!formData.fecha_ingreso) {
        newErrors.fecha_ingreso = "Fecha de ingreso es obligatoria.";
      } else {
        const fecha = new Date(formData.fecha_ingreso);
        if (isNaN(fecha.getTime())) {
          newErrors.fecha_ingreso = "Fecha de ingreso no válida.";
        }
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Correo electrónico inválido.";
      }
      if (
        !/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(formData.password)
      ) {
        newErrors.password =
          "Contraseña inválida. Mínimo 8 caracteres, con al menos una letra y un número.";
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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateStep(activeStep)) return;
    setIsLoading(true);

    const clientData = {
      ...formData,
      fecha_ingreso: formData.fecha_ingreso
        ? formData.fecha_ingreso.toISOString().split("T")[0]
        : null,
    };


    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

    fetch(`${API_URL}/api/clientes/registro/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(clientData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((errorText) => {
            console.error("Respuesta de error:", errorText);
            throw new Error(errorText);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Cliente registrado:", data);
        setSuccessMessage("Cliente registrado con éxito.");
        setErrorMessage("");
        setIsLoading(false);
        navigate("/", {
          state: { successMessage: "Cliente registrado con éxito." },
        });
      })
      .catch((err) => {
        console.error("Error al dar de alta el cliente:", err);
        if (err.message.toLowerCase().includes("email")) {
          setErrorMessage(
            "El email ya está registrado. Por favor, utiliza otro email."
          );
        } else {
          setErrorMessage(
            "Ocurrió un error al registrar el cliente. Intenta nuevamente."
          );
        }
        setIsLoading(false);
      });
  };

  const theme = createTheme({
    palette: {
      primary: {
        main: "#a8c948",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container
        maxWidth="md"
        sx={{
          minHeight: "calc(100vh - var(--header-height))",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          className="inner-content"
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Paper elevation={3} sx={{ padding: 6, borderRadius: 3 }}>
            <Typography variant="h3" gutterBottom sx={{ mb: 8, textAlign: "center" }}>
              Alta Cliente
            </Typography>

            {successMessage && (
              <Alert severity="success" sx={{ mb: 4 }}>
                {successMessage}
              </Alert>
            )}

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 4 }}>
                {errorMessage}
              </Alert>
            )}

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 8 }}>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
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
                        required
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
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Contacto telefónico"
                        fullWidth
                        name="contacto"
                        value={formData.contacto}
                        onChange={handleChange}
                        error={!!errors.contacto}
                        helperText={errors.contacto}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Nombre de Contacto"
                        fullWidth
                        name="nombre_contacto"
                        value={formData.nombre_contacto}
                        onChange={handleChange}
                        error={!!errors.nombre_contacto}
                        helperText={errors.nombre_contacto}
                        required
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
                        required
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
                        required
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
                        required
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
                              required
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
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Contraseña"
                        type="password"
                        fullWidth
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        required
                      />
                    </Grid>
                  </>
                )}
              </Grid>
              <Grid container spacing={2} sx={{ mt: 4 }}>
                {activeStep !== 0 && (
                  <Grid item xs={6}>
                    <Button onClick={handleBack}>Atrás</Button>
                  </Grid>
                )}
                {activeStep === 0 && (
                  <Grid item xs={12} sx={{ textAlign: "right" }}>
                    <Button onClick={handleNext}>Siguiente</Button>
                  </Grid>
                )}
                {activeStep !== 0 && activeStep < steps.length - 1 && (
                  <Grid item xs={6} sx={{ textAlign: "right" }}>
                    <Button onClick={handleNext}>Siguiente</Button>
                  </Grid>
                )}
                {activeStep === steps.length - 1 && (
                  <Grid item xs={6} sx={{ textAlign: "right" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={isLoading}
                      startIcon={
                        isLoading && <CircularProgress size={20} color="inherit" />
                      }
                    >
                      {isLoading ? "Procesando..." : "Finalizar"}
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

export default AltaCliente;
