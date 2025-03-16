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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const RegistrarMezclado = () => {
  const [formData, setFormData] = useState({
    obra: "",
    pesaje: "",
    imagenes: [],
  });
  const [obrasOptions, setObrasOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/api/obras/aprobadas/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setObrasOptions(data);
        })
        .catch((err) => console.error("Error al obtener obras:", err));
    }
  }, [token]);

  // Validación básica del formulario
  const validateForm = () => {
    let newErrors = {};
    if (!formData.obra) {
      newErrors.obra = "Debes seleccionar una obra.";
    }
    if (!formData.pesaje || isNaN(formData.pesaje)) {
      newErrors.pesaje = "El pesaje es obligatorio y debe ser un número.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Para actualizar los archivos (permite seleccionar múltiples)
  const handleFileChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, imagenes: [...prev.imagenes, ...files] }));
    }
  };

  // Función para eliminar un archivo del array
  const handleFileRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
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

    try {
      const data = new FormData();
      data.append("obra", formData.obra);
      data.append("pesaje", formData.pesaje);
      // Adjuntamos cada archivo con la misma clave 'imagenes'
      formData.imagenes.forEach((file) => {
        data.append("imagenes", file);
      });

      const response = await fetch(`${API_URL}/api/mezclados/registrar/`, {
        method: "POST",
        headers: {
          "Authorization": `Token ${token}`,
        },
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar el mezclado");
      }
      const result = await response.json();
      setSuccessMessage("Mezclado registrado con éxito.");
      setIsLoading(false);
      navigate("/listamezclados", { state: { successMessage: "Mezclado registrado con éxito." } });
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
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Paper elevation={3} sx={{ padding: 6, borderRadius: 3 }}>
            <Typography variant="h3" gutterBottom sx={{ mb: 4, textAlign: "center" }}>
              Registrar Mezclado
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
                  <FormControl fullWidth>
                    <InputLabel id="obra-label">Obra</InputLabel>
                    <Select
                      labelId="obra-label"
                      label="Obra"
                      name="obra"
                      value={formData.obra}
                      onChange={handleChange}
                      error={!!errors.obra}
                    >
                      {obrasOptions.length > 0 ? (
                        obrasOptions.map((obra) => (
                          <MenuItem key={obra.id} value={obra.id}>
                            {obra.nombre_obra}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem value="">
                          No se encontraron obras
                        </MenuItem>
                      )}
                    </Select>
                    {errors.obra && (
                      <Typography color="error" variant="caption">
                        {errors.obra}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Pesaje (kg)"
                    fullWidth
                    name="pesaje"
                    type="number"
                    value={formData.pesaje}
                    onChange={handleChange}
                    error={!!errors.pesaje}
                    helperText={errors.pesaje}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" component="label">
                    Subir Imágenes (JPG, JPEG, PNG)
                    <input type="file" hidden accept=".jpg,.jpeg,.png" multiple onChange={handleFileChange} />
                  </Button>
                  {formData.imagenes.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {formData.imagenes.map((file, index) => (
                        <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <Typography variant="body2">{file.name}</Typography>
                          <Button variant="outlined" color="error" onClick={() => handleFileRemove(index)}>
                            Eliminar
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  )}
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

export default RegistrarMezclado;
