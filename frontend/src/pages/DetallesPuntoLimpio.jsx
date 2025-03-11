import React, { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, Typography, Grid, Paper, Divider, Box, CircularProgress } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../pages/context/AuthContext";
import dayjs from "dayjs"; // Importa dayjs

const DetallesPuntoLimpio = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [puntoLimpio, setPuntoLimpio] = useState(null);
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
      setError("ID de punto limpio no proporcionado.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8000/api/puntolimpio/detalle/?id=${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setPuntoLimpio(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los detalles del Punto Limpio:', error);
        setError(error.message);
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

  if (!puntoLimpio) {
    return (
      <ThemeProvider theme={theme}>
        <Typography variant="h6" color="error" align="center">
          Punto Limpio no encontrado
        </Typography>
      </ThemeProvider>
    );
  }

  // Se formatea la fecha con dayjs al formato "dd/MM/yyyy"
  const fechaFormateada = puntoLimpio.fecha_ingreso
    ? dayjs(puntoLimpio.fecha_ingreso).format("DD/MM/YYYY")
    : "N/A";

  // Se agregan los detalles, incluyendo "Fecha de Ingreso" formateada
  const detalles = [
    { label: "Nombre de la Obra", value: puntoLimpio.nombre_obra },
    { label: "Fracciones", value: puntoLimpio.cantidad || "N/A" },
    { label: "Ubicación", value: puntoLimpio.ubicacion },
    { label: "Accesibilidad", value: puntoLimpio.accesibilidad },
    { label: "Tipo de Contenedor", value: puntoLimpio.tipo_contenedor },
    { label: "Fecha de Ingreso", value: fechaFormateada },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ maxWidth: 800, margin: "0 auto", padding: 4 }}>
        <CardContent>
          <Typography variant="h3" align="center" sx={{ mb: 4 }}>
            {puntoLimpio.nombre_obra}
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
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default DetallesPuntoLimpio;
