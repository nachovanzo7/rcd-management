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
  Link as MuiLink,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../pages/context/AuthContext";

const DetallesObra = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [obra, setObra] = useState(null);
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
      setError("ID de obra no proporcionado.");
      setLoading(false);
      return;
    }

    fetch(`http://127.0.0.1:8000/api/obras/${id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al obtener los detalles de la obra.");
        }
        return response.json();
      })
      .then((data) => {
        setObra(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, token]);

  // Agregamos un console.log para ver qué devuelve la API
  useEffect(() => {
    if (obra) {
      console.log("Obra recibida:", obra);
    }
  }, [obra]);

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

  if (!obra) {
    return (
      <ThemeProvider theme={theme}>
        <Typography variant="h6" color="error" align="center">
          Obra no encontrada
        </Typography>
      </ThemeProvider>
    );
  }

  // Se obtiene el nombre del cliente desde el serializer
  const clienteDetalle = obra.cliente_nombre || "N/A";

  // Se arma el array de detalles de la obra, incluyendo el listado de archivos
  const detalles = [
    { label: "Nombre de la Obra", value: obra.nombre_obra },
    { label: "Cliente", value: clienteDetalle },
    { label: "Localidad", value: obra.localidad },
    { label: "Barrio", value: obra.barrio },
    { label: "Dirección", value: obra.direccion },
    { label: "Visitas por Mes", value: obra.cant_visitas_mes },
    { label: "Inicio de la Obra", value: obra.inicio_obra },
    { label: "Duración de la Obra", value: obra.duracion_obra },
    { label: "Etapa de la Obra", value: obra.etapa_obra },
    { label: "Tipo de Construcción", value: obra.tipo_construccion || "N/A" },
    { label: "Metros Cuadrados", value: obra.m2_obra || "N/A" },
    {
      label: "Archivos Adjuntos",
      value:
        obra.archivos && obra.archivos.length > 0 ? (
          <Box>
            {obra.archivos.map((archivoObj, index) => (
              <MuiLink
                key={index}
                href={archivoObj.archivo}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ display: "block", mb: 1 }}
              >
                Descargar Archivo {index + 1}
              </MuiLink>
            ))}
          </Box>
        ) : (
          "No disponible"
        ),
    },
    { label: "Jefe de Obra", value: obra.nombre_jefe_obra },
    { label: "Email del Jefe", value: obra.mail_jefe_obra },
    { label: "Teléfono del Jefe", value: obra.telefono_jefe_obra },
    { label: "Capataz", value: obra.nombre_capataz },
    { label: "Email del Capataz", value: obra.mail_capataz },
    { label: "Teléfono del Capataz", value: obra.telefono_capataz },
    { label: "Encargado", value: obra.nombre_encargado_supervisor },
    { label: "Email del Encargado", value: obra.mail_encargado_supervisor },
    { label: "Teléfono del Encargado", value: obra.telefono_encargado_supervisor },
    { label: "Cantidad de Pisos", value: obra.cant_pisos },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ maxWidth: 800, margin: "0 auto", padding: 4 }}>
        <CardContent>
          <Typography variant="h3" align="center" sx={{ mb: 4 }}>
            {obra.nombre_obra}
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
          {/* Se muestra la imagen si está disponible (opcional) */}
          {obra.imagenes && (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <img
                src={obra.imagenes}
                alt={obra.nombre_obra}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: "8px",
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default DetallesObra;
