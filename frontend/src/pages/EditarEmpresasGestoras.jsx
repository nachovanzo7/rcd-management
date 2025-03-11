import React, { useState, useEffect, useContext } from "react";
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
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../pages/context/AuthContext";

const EditarEmpresaGestora = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    contacto: "",
    ubicacion: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/api/empresas/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al obtener los datos de la empresa gestora");
          }
          return response.json();
        })
        .then((data) => {
          setFormData({
            nombre: data.nombre || "",
            email: data.email || "",
            contacto: data.contacto || "",
            ubicacion: data.ubicacion || "",
          });
        })
        .catch(() => {
          setErrorMessage("No se pudo cargar la información de la empresa gestora.");
        });
    }
  }, [id, token]);

  const validateForm = () => {
    let newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido.";
    }

    if (!/^\d{9}$/.test(formData.contacto)) {
      newErrors.contacto = "El contacto telefónico debe tener exactamente 9 dígitos numéricos.";
    }

    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = "La ubicación es obligatoria.";
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

    try {
      const response = await fetch(`http://localhost:8000/api/empresas/modificar/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Error al actualizar la empresa gestora");
      }
      
      setSuccessMessage("Empresa actualizada con éxito.");
      setIsLoading(false);
      navigate("/empresasgestoras", { state: { successMessage: "Empresa actualizada con éxito." } });
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  const theme = createTheme({
    palette: {
      primary: { main: "#a8c948" },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ padding: 6, marginTop: 6, borderRadius: 3 }}>
          <Typography variant="h3" gutterBottom sx={{ mb: 4, textAlign: "center" }}>
            Editar Empresa Gestora
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
            <Grid container spacing={3}>
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
                  label="Email"
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
                  label="Ubicación"
                  fullWidth
                  name="ubicacion"
                  value={formData.ubicacion}
                  onChange={handleChange}
                  error={!!errors.ubicacion}
                  helperText={errors.ubicacion}
                />
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
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default EditarEmpresaGestora;