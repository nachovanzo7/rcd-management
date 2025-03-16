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
  IconButton 
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../pages/context/AuthContext";
import { Download } from "lucide-react";

const DetallesMezclado = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const [mezclado, setMezclado] = useState(null);
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
      setError("ID de mezclado no proporcionado.");
      setLoading(false);
      return;
    }
    fetch(`${API_URL}/api/mezclados/detalle/?id=${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setMezclado(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id, token]);

  // Función para descargar la imagen sin redireccionar
  const downloadImage = (url, filename) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((err) => console.error("Error al descargar la imagen:", err));
  };

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

  if (!mezclado) {
    return (
      <ThemeProvider theme={theme}>
        <Typography variant="h6" color="error" align="center">
          Mezclado no encontrado
        </Typography>
      </ThemeProvider>
    );
  }

  // Arreglo de detalles a mostrar
  const detalles = [
    { label: "Obra", value: mezclado.nombre_obra },
    { label: "Pesaje (kg)", value: mezclado.pesaje },
    { label: "Fecha de Registro", value: mezclado.fecha_registro },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ maxWidth: 800, margin: "0 auto", padding: 4 }}>
        <CardContent>
          <Typography variant="h3" align="center" sx={{ mb: 4 }}>
            {mezclado.nombre_obra}
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
          {mezclado.imagenes && mezclado.imagenes.length > 0 && (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Imágenes
              </Typography>
              <Grid container spacing={2}>
                {mezclado.imagenes.map((img) => {
                  // Aseguramos la URL completa
                  const downloadUrl = img.imagen.startsWith("http")
                    ? img.imagen
                    : `http://127.0.0.1:8000${img.imagen}`;
                  return (
                    <Grid item xs={12} sm={6} md={4} key={img.id}>
                      <Box sx={{ position: "relative" }}>
                        <img
                          src={downloadUrl}
                          alt={`Imagen ${img.id}`}
                          style={{ maxWidth: "100%", borderRadius: "8px" }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 8,
                            right: 8,
                          }}
                        >
                          <IconButton
                            onClick={() =>
                              downloadImage(downloadUrl, `imagen_${img.id}.jpg`)
                            }
                            sx={{
                              backgroundColor: "white",
                              "&:hover": { backgroundColor: "grey" },
                            }}
                          >
                            <Download size={24} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default DetallesMezclado;
