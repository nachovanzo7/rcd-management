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

const DetallesEmpresaGestora = () => {
  // Obtener el token desde el contexto
  const { token } = useContext(AuthContext);

  // Se obtiene el id de la empresa gestora desde la query string
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [empresa, setEmpresa] = useState(null);
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
      setError("ID de empresa gestora no proporcionado.");
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/empresas/${id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los detalles de la empresa gestora.");
        }
        return response.json();
      })
      .then((data) => {
        setEmpresa(data);
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

  if (!empresa) {
    return (
      <ThemeProvider theme={theme}>
        <Typography variant="h6" color="error" align="center">
          Empresa Gestora no encontrada
        </Typography>
      </ThemeProvider>
    );
  }

  // Armar un arreglo con los detalles a mostrar
  const detalles = [
    { label: "Nombre", value: empresa.nombre },
    { label: "Ubicación", value: empresa.ubicacion },
    { label: "Contacto", value: empresa.contacto },
    { label: "Email", value: empresa.email },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ maxWidth: 800, margin: "0 auto", padding: 4 }}>
        <CardContent>
          <Typography variant="h3" align="center" sx={{ mb: 4 }}>
            {empresa.nombre}
          </Typography>
          <Divider sx={{ mb: 4 }} />
          <Grid container spacing={3}>
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

export default DetallesEmpresaGestora;
