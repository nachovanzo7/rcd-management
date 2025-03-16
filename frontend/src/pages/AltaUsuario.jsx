import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Alert,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/context/AuthContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#a8c948",
    },
  },
});

const AltaUsuario = () => {
  const { token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    rol: "",
    obra: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [obrasList, setObrasList] = useState([]);
  const navigate = useNavigate();

  // Validación mejorada
  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!formData.username.trim()) newErrors.username = "Nombre de usuario requerido";
    if (!emailRegex.test(formData.email)) newErrors.email = "Email inválido";
    if (!passwordRegex.test(formData.password)) newErrors.password = "Mínimo 8 caracteres con letra y número";
    if (!formData.rol) newErrors.rol = "Seleccione un rol";
    
    if ((formData.rol === "tecnico" || formData.rol === "supervisor") && !formData.obra) {
      newErrors.obra = "Seleccione una obra";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';


  useEffect(() => {
    const fetchObras = async () => {
      try {
        const res = await fetch(`${API_URL}/api/obras/aprobadas/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al cargar obras");
        const data = await res.json();
        setObrasList(data);
      } catch (err) {
        console.error("Error:", err);
        setErrorMessage("Error al cargar obras");
      }
    };

    if (formData.rol === "tecnico" || formData.rol === "supervisor") {
      fetchObras();
    } else {
      setObrasList([]);
      setFormData(prev => ({...prev, obra: ""}));
    }
  }, [formData.rol, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        // Asegurar que los roles coincidan con el backend
        rol: formData.rol === "coordinador_obra" ? "coordinador" : formData.rol
      };

      const res = await fetch(`${API_URL}/api/usuarios/crear/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!res.ok) {
        const backendError = data.error || "Error desconocido";
        throw new Error(backendError);
      }

      setSuccessMessage("Usuario creado exitosamente");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Error en registro:", err);
      setErrorMessage(err.message.includes("UNIQUE") 
        ? "El usuario ya existe o la obra tiene supervisor asignado" 
        : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ minHeight: "calc(100vh - var(--header-height))", py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3 }}>
            Registrar Nuevo Usuario
          </Typography>

          {successMessage && <Alert severity="success" sx={{ mb: 3 }}>{successMessage}</Alert>}
          {errorMessage && <Alert severity="error" sx={{ mb: 3 }}>{errorMessage}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Campos de texto */}
              <Grid item xs={12}>
                <TextField
                  label="Nombre de Usuario"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.username}
                  helperText={errors.username}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>

              {/* Selector de Rol */}
              <Grid item xs={12}>
                <TextField
                  select
                  label="Rol del Usuario"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.rol}
                  helperText={errors.rol}
                >
                  <MenuItem value="tecnico">Visitante</MenuItem>
                  <MenuItem value="coordinador">Coordinador General</MenuItem>
                  <MenuItem value="coordinadorlogistico">Coordinador Logístico</MenuItem>
                  <MenuItem value="supervisor">Coordinador de Obra</MenuItem>
                </TextField>
              </Grid>

              {/* Selector de Obra (condicional) */}
              {(formData.rol === "tecnico" || formData.rol === "supervisor") && (
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Obra Asignada"
                    name="obra"
                    value={formData.obra}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.obra}
                    helperText={errors.obra}
                  >
                    {obrasList.map((obra) => (
                      <MenuItem key={obra.id} value={obra.id}>
                        {obra.nombre_obra} - {obra.direccion}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              {/* Botón de envío */}
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  sx={{ width: 200, py: 1.5 }}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Registrar Usuario"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default AltaUsuario;