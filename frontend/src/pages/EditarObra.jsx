import React, { useState, useEffect, useContext } from "react";
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
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../pages/context/AuthContext";  // Ajusta la ruta según corresponda

const steps = ['Información General', 'Detalles de la Obra', 'Equipo Responsable'];

// Función que mapea las claves del objeto formData (camelCase) a los nombres que espera el backend (snake_case)
const mapFormDataToPayload = (data) => {
  return {
    nombre_obra: data.nombreObra,
    localidad: data.localidad,
    barrio: data.barrio,
    direccion: data.direccion,
    cant_visitas_mes: data.visitasMes,
    inicio_obra: data.inicioObra 
      ? data.inicioObra.toISOString().split("T")[0] 
      : null,
    duracion_obra: data.duracionObra,
    etapa_obra: data.etapaObra,
    nombre_jefe_obra: data.jefeObra,
    mail_jefe_obra: data.emailJefe,
    telefono_jefe_obra: data.telefonoJefe,
    nombre_capataz: data.capataz,
    mail_capataz: data.emailCapataz,
    telefono_capataz: data.telefonoCapataz,
    nombre_encargado_supervisor: data.encargado,
    mail_encargado_supervisor: data.emailEncargado,
    telefono_encargado_supervisor: data.telefonoEncargado,
    imagenes: data.imagen,  // Si usas archivos, asegúrate de tratarlo de forma adecuada
    pedido: data.pedido,
  };
};

const EditarObra = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nombreObra: '',
    localidad: '',
    barrio: '',
    direccion: '',
    visitasMes: '',
    inicioObra: null,
    duracionObra: '',
    etapaObra: '',
    jefeObra: '',
    emailJefe: '',
    telefonoJefe: '',
    capataz: '',
    emailCapataz: '',
    telefonoCapataz: '',
    encargado: '',
    emailEncargado: '',
    telefonoEncargado: '',
    imagen: null,
    pedido: '',
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  // Obtener el token desde el contexto de autenticación
  const { token } = useContext(AuthContext);

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    if (id) {
      fetch(`${API_URL}/api/obras/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Error al obtener datos de la obra");
          }
          return response.json();
        })
        .then(data => {
          // Mapear las propiedades recibidas a los nombres del estado (camelCase)
          setFormData({
            nombreObra: data.nombre_obra || '',
            localidad: data.localidad || '',
            barrio: data.barrio || '',
            direccion: data.direccion || '',
            visitasMes: data.cant_visitas_mes || '',
            inicioObra: data.inicio_obra ? dayjs(data.inicio_obra) : null,
            duracionObra: data.duracion_obra || '',
            etapaObra: data.etapa_obra || '',
            jefeObra: data.nombre_jefe_obra || '',
            emailJefe: data.mail_jefe_obra || '',
            telefonoJefe: data.telefono_jefe_obra || '',
            capataz: data.nombre_capataz || '',
            emailCapataz: data.mail_capataz || '',
            telefonoCapataz: data.telefono_capataz || '',
            encargado: data.nombre_encargado_supervisor || '',
            emailEncargado: data.mail_encargado_supervisor || '',
            telefonoEncargado: data.telefono_encargado_supervisor || '',
            imagen: data.imagenes || null,
            pedido: data.pedido || '',
          });
        })
        .catch(error => {
          console.error("Error:", error);
          setErrorMessage("No se pudo cargar la información de la obra.");
        });
    }
  }, [id, token]);

  const validateStep = (step) => {
    let newErrors = {};
    if (step === 0) {
      if (!formData.nombreObra.trim()) newErrors.nombreObra = "El nombre es obligatorio.";
      if (!formData.localidad.trim()) newErrors.localidad = "La localidad es obligatoria.";
      if (!formData.barrio.trim()) newErrors.barrio = "El barrio es obligatorio.";
      if (!formData.direccion.trim()) newErrors.direccion = "La dirección es obligatoria.";
    } else if (step === 1) {
      if (!formData.inicioObra) newErrors.inicioObra = "Fecha de inicio es obligatoria.";
      if (!formData.duracionObra.trim()) newErrors.duracionObra = "La duración es obligatoria.";
      if (!formData.etapaObra.trim()) newErrors.etapaObra = "La etapa es obligatoria.";
    } else if (step === 2) {
      if (!formData.jefeObra.trim()) newErrors.jefeObra = "El nombre del jefe es obligatorio.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailJefe)) newErrors.emailJefe = "Correo inválido.";
      if (!/^\d{9}$/.test(formData.telefonoJefe)) newErrors.telefonoJefe = "Debe tener 9 dígitos.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };
  const handleBack = () => setActiveStep(prev => prev - 1);
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleDateChange = (newValue) => {
    setFormData(prev => ({ ...prev, inicioObra: newValue }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateStep(activeStep)) return;
    setIsLoading(true);

    // Mapear los datos del formulario al formato que espera el backend
    const obraData = mapFormDataToPayload(formData);

    console.log("Enviando formulario:", obraData);

    try {
      const response = await fetch(`${API_URL}/api/obras/${id}/actualizar/`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(obraData),
      });

      if (!response.ok) {
        const errorText = await response.json();
        console.error("Respuesta de error:", errorText);
        let newErrors = {};
        if (errorText.mail_jefe_obra) newErrors.emailJefe = "El email ya está registrado.";
        setErrors(newErrors);
        throw new Error("Error en la validación del servidor");
      }

      // Si la actualización es exitosa, se establece un mensaje y se redirige
      setSuccessMessage("Obra actualizada con éxito.");
      navigate("/listadeobras", { state: { successMessage: "Obra actualizada con éxito." } });

    } catch (err) {
      console.error("Error al actualizar la obra:", err);
      setErrorMessage("Ocurrió un error. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
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
            Editar Obra
          </Typography>

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
                      label="Nombre de la Obra"
                      fullWidth
                      name="nombreObra"
                      value={formData.nombreObra}
                      onChange={handleChange}
                      error={!!errors.nombreObra}
                      helperText={errors.nombreObra}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Localidad"
                      fullWidth
                      name="localidad"
                      value={formData.localidad}
                      onChange={handleChange}
                      error={!!errors.localidad}
                      helperText={errors.localidad}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Barrio"
                      fullWidth
                      name="barrio"
                      value={formData.barrio}
                      onChange={handleChange}
                      error={!!errors.barrio}
                      helperText={errors.barrio}
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
                      label="Cantidad de Visitas al Mes"
                      fullWidth
                      name="visitasMes"
                      type="number"
                      value={formData.visitasMes}
                      onChange={handleChange}
                      error={!!errors.visitasMes}
                      helperText={errors.visitasMes}
                      required
                    />
                  </Grid>
                </>
              )}

              {activeStep === 1 && (
                <>
                  <Grid item xs={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Inicio de Obra"
                        value={formData.inicioObra}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            fullWidth 
                            error={!!errors.inicioObra}
                            helperText={errors.inicioObra}
                            required 
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Duración de Obra"
                      fullWidth
                      name="duracionObra"
                      value={formData.duracionObra}
                      onChange={handleChange}
                      error={!!errors.duracionObra}
                      helperText={errors.duracionObra}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Etapa de Obra"
                      fullWidth
                      name="etapaObra"
                      value={formData.etapaObra}
                      onChange={handleChange}
                      error={!!errors.etapaObra}
                      helperText={errors.etapaObra}
                      required
                    />
                  </Grid>
                </>
              )}

              {activeStep === 2 && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      label="Jefe de Obra"
                      fullWidth
                      name="jefeObra"
                      value={formData.jefeObra}
                      onChange={handleChange}
                      error={!!errors.jefeObra}
                      helperText={errors.jefeObra}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Email del Jefe"
                      fullWidth
                      name="emailJefe"
                      type="email"
                      value={formData.emailJefe}
                      onChange={handleChange}
                      error={!!errors.emailJefe}
                      helperText={errors.emailJefe}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Teléfono del Jefe"
                      fullWidth
                      name="telefonoJefe"
                      type="tel"
                      value={formData.telefonoJefe}
                      onChange={handleChange}
                      error={!!errors.telefonoJefe}
                      helperText={errors.telefonoJefe}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Capataz"
                      fullWidth
                      name="capataz"
                      value={formData.capataz}
                      onChange={handleChange}
                      error={!!errors.capataz}
                      helperText={errors.capataz}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Email del Capataz"
                      fullWidth
                      name="emailCapataz"
                      type="email"
                      value={formData.emailCapataz}
                      onChange={handleChange}
                      error={!!errors.emailCapataz}
                      helperText={errors.emailCapataz}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Teléfono del Capataz"
                      fullWidth
                      name="telefonoCapataz"
                      type="tel"
                      value={formData.telefonoCapataz}
                      onChange={handleChange}
                      error={!!errors.telefonoCapataz}
                      helperText={errors.telefonoCapataz}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Encargado"
                      fullWidth
                      name="encargado"
                      value={formData.encargado}
                      onChange={handleChange}
                      error={!!errors.encargado}
                      helperText={errors.encargado}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Email del Encargado"
                      fullWidth
                      name="emailEncargado"
                      type="email"
                      value={formData.emailEncargado}
                      onChange={handleChange}
                      error={!!errors.emailEncargado}
                      helperText={errors.emailEncargado}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Teléfono del Encargado"
                      fullWidth
                      name="telefonoEncargado"
                      type="tel"
                      value={formData.telefonoEncargado}
                      onChange={handleChange}
                      error={!!errors.telefonoEncargado}
                      helperText={errors.telefonoEncargado}
                      required
                    />
                  </Grid>
                </>
              )}
            </Grid>

            <Grid container spacing={2} sx={{ mt: 2 }}>
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
                  <Button type="submit" variant="contained" color="primary">Finalizar</Button>
                </Grid>
              )}
            </Grid>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default EditarObra;
