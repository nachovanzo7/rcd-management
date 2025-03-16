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
import dayjs from "dayjs";

const DetallesCoordinacion = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [coordinacion, setCoordinacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const theme = createTheme({
    palette: {
      primary: { main: "#a8c948" },
    },
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    if (!id) {
      setError("ID de coordinación no proporcionado.");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/coordinacionretiro/${id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los detalles de la coordinación.");
        }
        return response.json();
      })
      .then((data) => {
        setCoordinacion(data);
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

  if (!coordinacion) {
    return (
      <ThemeProvider theme={theme}>
        <Typography variant="h6" color="error" align="center">
          Coordinación no encontrada
        </Typography>
      </ThemeProvider>
    );
  }

  // Se arma un arreglo con los detalles a mostrar.
  const detalles = [
    { label: "Obra", value: coordinacion.nombre_obra },
    { label: "Tipo de Material", value: coordinacion.tipo_material },
    {
      label: "Fecha de Solicitud",
      value: coordinacion.fecha_solicitud
        ? dayjs(coordinacion.fecha_solicitud).format("DD/MM/YYYY")
        : "No disponible",
    },
    {
      label: "Fecha de Retiro",
      value: coordinacion.fecha_retiro
        ? dayjs(coordinacion.fecha_retiro).format("DD/MM/YYYY")
        : "No disponible",
    },
    { label: "Transportista", value: coordinacion.transportista_nombre },
    { label: "Cantidad", value: coordinacion.cantidad },
    { label: "Contacto del Transportista", value: coordinacion.transportista_contacto },
    { label: "Descripción", value: coordinacion.descripcion },
    { label: "Observaciones", value: coordinacion.observaciones },
    { label: "Estado", value: coordinacion.estado },
    { label: "Empresa de Tratamiento", value: coordinacion.empresa_gestora_nombre },
    { label: "Comentarios", value: coordinacion.comentarios },
    { label: "Contacto de la Empresa", value: coordinacion.empresa_gestora_contacto },
    { label: "Pesaje", value: coordinacion.pesaje },
  ];

  // Función para decidir el color de fondo según el label
  const getBackgroundColor = (label) => {
    if (label.includes("Transportista")) {
      // Fondo naranja claro
      return "#ffefdb";
    }
    if (label.includes("Empresa")) {
      // Fondo verde claro
      return "#e2f7dc";
    }
    // Fondo por defecto
    return "#f4f4f4";
  };

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ maxWidth: 800, margin: "0 auto", padding: 4 }}>
        <CardContent>
          <Typography variant="h3" align="center" sx={{ mb: 4 }}>
            Detalles de la Coordinación
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {detalles.map((item, index) => {
              // Obtenemos el color de fondo para esta fila
              const bgColor = getBackgroundColor(item.label);

              return (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper sx={{ padding: 2, backgroundColor: bgColor }}>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2">
                      {item.value ? item.value : "No disponible"}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default DetallesCoordinacion;
