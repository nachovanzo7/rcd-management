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
  MenuItem,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/context/AuthContext";

const steps = ["Información de la Capacitación"];

const AltaCapacitaciones = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    fecha: null,
    motivo: "",
    obra: "",
    tecnico: "",
    comentario: "",
    supervisor: "",
  });

  const [obras, setObras] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [supervisores, setSupervisores] = useState([]);
  const [loadingSupervisores, setLoadingSupervisores] = useState(false);

  const navigate = useNavigate();
  const { token, role, user } = useContext(AuthContext);

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // Carga inicial de Obras
  useEffect(() => {
    fetch(`${API_URL}/api/obras/aprobadas/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        Array.isArray(data) ? setObras(data) : setObras([]);
      })
      .catch((error) => {
        console.error("Error fetching obras:", error);
        setObras([]);
      });
  }, [token]);

  // Carga inicial de Técnicos
  useEffect(() => {
    fetch(`${API_URL}/api/tecnicos/lista/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        Array.isArray(data) ? setTecnicos(data) : setTecnicos([]);
      })
      .catch((error) => {
        console.error("Error fetching técnicos:", error);
        setTecnicos([]);
      });
  }, [token]);

  // Carga de supervisores cuando se selecciona obra
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchSupervisores = async () => {
      if (!formData.obra) {
        setSupervisores([]);
        return;
      }
  
      setLoadingSupervisores(true);
      try {
        const response = await fetch(
          `${API_URL}/api/supervisores/${formData.obra}/supervisores/`,
          {
            signal: controller.signal,
            headers: {
              Authorization: `Token ${token}`,
            }
          }
        );
  
        if (!response.ok) throw new Error('Error al cargar supervisores');
        
        const data = await response.json();
        console.log("Datos de supervisores:", data);
        
        if (Array.isArray(data)) {
          setSupervisores(data);
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Error:", err);
          setSupervisores([]);
          alert(`Error al cargar supervisores: ${err.message}`);
        }
      } finally {
        setLoadingSupervisores(false);
      }
    };
  
    fetchSupervisores();
    return () => controller.abort();
  }, [formData.obra, token]);

  // Auto-selección de técnico si el rol es técnico
  useEffect(() => {
    if (role === "tecnico" && user?.email && tecnicos.length > 0) {
      const tecnicoEncontrado = tecnicos.find((t) => t.email === user.email);
      if (tecnicoEncontrado) {
        setFormData((prev) => ({
          ...prev,
          tecnico: tecnicoEncontrado.id.toString(),
        }));
      }
    }
  }, [role, user, tecnicos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Resetear supervisor si cambia la obra
      ...(name === "obra" && { supervisor: "" }),
    }));
  };

  const handleDateChange = (newValue) => {
    setFormData((prev) => ({ ...prev, fecha: newValue }));
  };

  // Función de validación del formulario
  const validateForm = () => {
    const errors = {};
    if (!formData.fecha) errors.fecha = "La fecha es obligatoria.";
    if (!formData.motivo) errors.motivo = "El motivo es obligatorio.";
    if (!formData.obra) errors.obra = "La obra es obligatoria.";
    if (!formData.tecnico) errors.tecnico = "El técnico es obligatorio.";
    if (formData.obra && !formData.supervisor) {
      errors.supervisor = "El supervisor es obligatorio.";
    }
    return errors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validar el formulario antes de llamar a la API
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      alert(
        "Por favor complete todos los campos obligatorios:\n" +
          Object.values(errors).join("\n")
      );
      return; // No se ejecuta el fetch si hay errores
    }

    const payload = {
      ...formData,
      fecha: formData.fecha?.format("YYYY-MM-DD"),
      obra: formData.obra,
      tecnico: formData.tecnico,
      supervisor: formData.supervisor || null,
    };

    fetch("http://localhost:8000/api/capacitaciones/registro/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error en el registro");
        return response.json();
      })
      .then((data) => {
        console.log("Capacitación registrada:", data);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error al registrar:", error);
        console.log("Payload:", JSON.stringify(payload, null, 2));
        alert("Error al registrar la capacitación");
      });
  };

  const theme = createTheme({
    palette: {
      primary: { main: "#a8c948" },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ minHeight: "100vh", py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ mb: 4 }}
          >
            Alta de Capacitación
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {activeStep === 0 && (
                <>
                  {/* Campo Fecha */}
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Fecha de capacitación"
                        value={formData.fecha}
                        onChange={handleDateChange}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth required />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>

                  {/* Campo Tipo de Capacitación */}
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Tipo de capacitación"
                      fullWidth
                      name="motivo"
                      value={formData.motivo}
                      onChange={handleChange}
                      required
                    >
                      <MenuItem value="Capacitación Inicial">
                        Capacitación Inicial
                      </MenuItem>
                      <MenuItem value="Capacitación Integral">
                        Capacitación Integral
                      </MenuItem>
                      <MenuItem value="Capacitación Dirigida">
                        Capacitación Dirigida
                      </MenuItem>
                    </TextField>
                  </Grid>

                  {/* Campo Obra */}
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Obra"
                      fullWidth
                      name="obra"
                      value={formData.obra}
                      onChange={handleChange}
                      required
                    >
                      {obras.map((obra) => (
                        <MenuItem key={obra.id} value={obra.id}>
                          {obra.nombre_obra}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Campo Técnico */}
                  <Grid item xs={12}>
                    <TextField
                      select
                      label="Técnico responsable"
                      fullWidth
                      name="tecnico"
                      value={formData.tecnico}
                      onChange={handleChange}
                      required
                      disabled={role === "tecnico"}
                    >
                      {tecnicos.map((tecnico) => (
                        <MenuItem key={tecnico.id} value={tecnico.id}>
                          {tecnico.nombre}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  {/* Campo Supervisor (condicional) */}
                  {formData.obra && (
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Encargado de Coordinación"
                        fullWidth
                        name="supervisor"
                        value={formData.supervisor}
                        onChange={handleChange}
                        required
                        disabled={loadingSupervisores}
                      >
                        {loadingSupervisores ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} />
                          </MenuItem>
                        ) : (
                          supervisores.map((sup) => (
                            <MenuItem key={sup.id} value={sup.id}>
                              {`${sup.nombre_completo || "Nombre no disponible"}`}
                            </MenuItem>
                          ))
                        )}
                      </TextField>
                    </Grid>
                  )}

                  {/* Campo Comentarios */}
                  <Grid item xs={12}>
                    <TextField
                      label="Comentarios adicionales"
                      fullWidth
                      multiline
                      rows={4}
                      name="comentario"
                      value={formData.comentario}
                      onChange={handleChange}
                    />
                  </Grid>
                </>
              )}
            </Grid>

            {/* Botones de navegación */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              {activeStep > 0 && (
                <Button
                  onClick={() => setActiveStep((prev) => prev - 1)}
                  sx={{ mr: 2 }}
                >
                  Atrás
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loadingSupervisores}
              >
                {activeStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default AltaCapacitaciones;
