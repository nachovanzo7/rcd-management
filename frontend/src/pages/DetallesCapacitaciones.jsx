import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Divider,
  Box,
  CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../pages/context/AuthContext";

const DetallesCapacitacion = () => {
  // Obtener el token desde el contexto
  const { token } = useContext(AuthContext);

  // Se obtiene el id de la capacitación desde la query string
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [capacitacion, setCapacitacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = createTheme({
    palette: {
      primary: {
        main: "#a8c948",
      },
    },
  });

  useEffect(() => {
    if (!id) {
      setError("ID de capacitación no proporcionado.");
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/capacitaciones/${id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los detalles de la capacitación.");
        }
        return response.json();
      })
      .then((data) => {
        setCapacitacion(data);
        console.log(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, token]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      </ThemeProvider>
    );
  }

  if (!capacitacion) {
    return (
      <ThemeProvider theme={theme}>
        <Typography variant="h6" color="error" align="center">
          Capacitación no encontrada
        </Typography>
      </ThemeProvider>
    );
  }

  // Se arma un arreglo con los detalles a mostrar.
  // Ajusta los nombres de los campos según lo que retorne tu API.
  const detalles = [
    { label: "Motivo", value: capacitacion.motivo },
    { label: "Obra", value: capacitacion.obra_nombre },
    { label: "Fecha", value: capacitacion.fecha },
    { label: "Técnico", value: capacitacion.tecnico_nombre },
    { 
      label: "Supervisor a Cargo", 
      value: capacitacion.supervisor_nombre || "No asignado" 
    },  ];

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ maxWidth: 800, margin: "0 auto", padding: 4 }}>
        <CardContent>
          <Typography variant="h3" align="center" sx={{ mb: 4 }}>
            Detalles de la Capacitación
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {detalles.map((item, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper sx={{ padding: 2, backgroundColor: "#f4f4f4" }}>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {item.label}
                  </Typography>
                  <Typography variant="body2">{item.value}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" align="center" sx={{ mb: 2 }}>
              Comentario
            </Typography>
            <Paper sx={{ padding: 2, backgroundColor: "#f4f4f4" }}>
              <Typography variant="body2">
                {capacitacion.comentario ? capacitacion.comentario : "Sin comentario"}
              </Typography>
            </Paper>
          </Box>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default DetallesCapacitacion;
