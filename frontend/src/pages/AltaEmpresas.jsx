import React, { useState, useContext } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Box,
  Alert,
  CircularProgress,
  MenuItem
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const TIPO_MATERIAL_OPTIONS = [
  { value: "escombro_limpio", label: "Escombro Limpio" },
  { value: "plastico", label: "Plástico" },
  { value: "papel_carton", label: "Papel y Cartón" },
  { value: "metales", label: "Metales" },
  { value: "madera", label: "Madera" },
  { value: "mezclados", label: "Mezclados" },
  { value: "peligrosos", label: "Peligrosos" },
];

const AltaEmpresasGestoras = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    contacto: "",
    email: "",
    tipo_material: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  // Validación básica
  const validateForm = () => {
    let newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    }
    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = "La ubicación es obligatoria.";
    }
    if (!/^\d{9}$/.test(formData.contacto)) {
      newErrors.contacto = "El contacto debe tener exactamente 9 dígitos numéricos.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido.";
    }
    if (!formData.tipo_material) {
      newErrors.tipo_material = "Debe seleccionar un tipo de material.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!validateForm()) return;
    setIsLoading(true);

    if (!token) {
      setErrorMessage("No estás autenticado. Por favor, inicia sesión.");
      setIsLoading(false);
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';


    try {
      const response = await fetch(`${API_URL}/api/empresas/registro/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar la empresa gestora");
      }
      // Si todo va bien
      const data = await response.json();
      setSuccessMessage("Empresa registrada con éxito.");
      setIsLoading(false);
      // Navegamos a la lista
      navigate("/empresasgestoras", { state: { successMessage: "Empresa registrada con éxito." } });
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
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
        sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box sx={{ width: "100%" }}>
          <Paper elevation={3} sx={{ padding: 6, borderRadius: 3 }}>
            <Typography variant="h3" gutterBottom sx={{ mb: 4, textAlign: "center" }}>
              Alta Empresa Gestora
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

            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
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
                    label="Ubicación"
                    fullWidth
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleChange}
                    error={!!errors.ubicacion}
                    helperText={errors.ubicacion}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Contacto Telefónico"
                    fullWidth
                    name="contacto"
                    value={formData.contacto}
                    onChange={handleChange}
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
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    select
                    label="Tipo de Material"
                    name="tipo_material"
                    value={formData.tipo_material}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.tipo_material}
                    helperText={errors.tipo_material}
                  >
                    {TIPO_MATERIAL_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
              <Box sx={{ textAlign: "right", mt: 4 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
                >
                  {isLoading ? "Registrando..." : "Registrar"}
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AltaEmpresasGestoras;
