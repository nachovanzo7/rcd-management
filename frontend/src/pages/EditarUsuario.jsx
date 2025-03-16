// EditarUsuario.jsx
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
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../pages/context/AuthContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#a8c948",
    },
  },
});

const EditarUsuario = () => {
  const { token } = useContext(AuthContext);
  const { id, email } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    rol: "",
    obra: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [obrasList, setObrasList] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    fetch(`${API_URL}/api/usuarios/${id}/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setFormData({ ...data }))
      .catch((err) => console.error(err));
  }, [id, token]);

  useEffect(() => {
    if (email) {
      fetch(`${API_URL}/api/usuarios/editar/${email}/`, {
        headers: { Authorization: `Token ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setFormData(data))
        .catch((err) => console.error(err));
    }
  }, [email, token]);

  // Cargar todas las obras aprobadas
  useEffect(() => {
    const fetchObras = async () => {
      try {
        const res = await fetch(`${API_URL}/api/obras/aprobadas/`, {
          headers: { Authorization: `Token ${token}` },
        });
        if (!res.ok) throw new Error("Error al cargar obras aprobadas");
        const data = await res.json();
        setObrasList(data);
      } catch (err) {
        console.error(err);
        setErrorMessage("Error al cargar obras aprobadas");
      }
    };

    // Si el rol es "técnico" o "supervisor" se muestra la lista de obras
    if (formData.rol === "tecnico" || formData.rol === "supervisor") {
      fetchObras();
    } else {
      setObrasList([]);
      setFormData((prev) => ({ ...prev, obra: "" }));
    }
  }, [formData.rol, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/usuarios/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Error al actualizar usuario");

      setSuccessMessage("Usuario actualizado correctamente.");
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ padding: 6, borderRadius: 3 }}>
          <Typography variant="h3" gutterBottom sx={{ textAlign: "center" }}>
            Editar Usuario
          </Typography>

          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Contraseña (opcional)"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  label="Rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="tecnico">Técnico</MenuItem>
                  <MenuItem value="supervisor">Supervisor</MenuItem>
                  <MenuItem value="coordinador">Coordinador</MenuItem>
                </TextField>
              </Grid>

              {(formData.rol === "tecnico" || formData.rol === "supervisor") && (
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Obra"
                    name="obra"
                    value={formData.obra}
                    onChange={handleChange}
                    fullWidth
                  >
                    {obrasList.map((obra) => (
                      <MenuItem key={obra.id} value={obra.id}>
                        {obra.nombre_obra} - {obra.direccion}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              )}

              <Button type="submit" variant="contained" fullWidth disabled={isLoading}>
                {isLoading ? "Actualizando..." : "Actualizar"}
              </Button>
            </Grid>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default EditarUsuario;
