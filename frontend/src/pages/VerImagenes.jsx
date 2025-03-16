import React, { useState, useEffect, useContext } from "react";
import { 
  Container, 
  Typography, 
  Box, 
  Alert, 
  CircularProgress, 
  Card, 
  CardMedia, 
  CardContent, 
  Grid, 
  MenuItem, 
  TextField,
  Button 
} from "@mui/material";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { AuthContext } from "../pages/context/AuthContext";
import { Download } from "lucide-react";

const VerImagenesObra = () => {
  const [imagenes, setImagenes] = useState([]);
  const [obra, setObra] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Estado para filtrar
  const [filter, setFilter] = useState("todos"); // "todos", "hoy", "ultimo_mes", "ultimos_3_meses", "por_mes"
  // Estado para el mes seleccionado (valor 0-11)
  const [selectedMonth, setSelectedMonth] = useState("");
  
  const { token } = useContext(AuthContext);
  const location = useLocation();

  // Obtener el ID de la obra desde la query string
  const queryParams = new URLSearchParams(location.search);
  const obraId = queryParams.get("obraId");

  useEffect(() => {
    if (!obraId || !token) {
      setErrorMessage("No se proporcionó el ID de la obra.");
      setLoading(false);
      return;
    }
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    // Construir las URLs
    const urlImagenes = `${API_URL}/api/fotos/obras/${obraId}/imagenes/`;
    const urlObra = `${API_URL}/api/obras/${obraId}/`;

    fetch(urlImagenes, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener las imágenes");
        return res.json();
      })
      .then((data) => {
        setImagenes(data);
        return fetch(urlObra, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        });
      })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener datos de la obra");
        return res.json();
      })
      .then((data) => {
        setObra(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("Error al cargar la información de la obra o sus imágenes.");
        setLoading(false);
      });
  }, [obraId, token]);

  const filterImagenes = (imgs) => {
    const today = dayjs();
    
    return imgs.filter((img) => {
      if (!img.fecha) return false;
      
      const imgDate = dayjs(img.fecha);
      if (!imgDate.isValid()) return false;
  
      switch(filter) {
        case "hoy":
          return imgDate.isSame(today, "day");
          
        case "ultimo_mes":
          const oneMonthAgo = today.subtract(1, "month");
          return imgDate.isAfter(oneMonthAgo) || imgDate.isSame(oneMonthAgo, "day");
          
        case "ultimos_6_meses":
          const sixMonthsAgo = today.subtract(6, "month");
          return imgDate.isAfter(sixMonthsAgo) || imgDate.isSame(sixMonthsAgo, "day");
          
        case "por_mes":
          if (selectedMonth === "") return false;
          return imgDate.month() === parseInt(selectedMonth, 10);
          
        default: // "todos"
          return true;
      }
    });
  };

  const imagenesFiltradas = filterImagenes(imagenes);

  const months = [
    { value: "0", label: "Enero" },
    { value: "1", label: "Febrero" },
    { value: "2", label: "Marzo" },
    { value: "3", label: "Abril" },
    { value: "4", label: "Mayo" },
    { value: "5", label: "Junio" },
    { value: "6", label: "Julio" },
    { value: "7", label: "Agosto" },
    { value: "8", label: "Septiembre" },
    { value: "9", label: "Octubre" },
    { value: "10", label: "Noviembre" },
    { value: "11", label: "Diciembre" },
  ];

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
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Imágenes de la Obra: {obra ? obra.nombre_obra : ""}
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Box sx={{ mb: 2 }}>
          <TextField
            select
            label="Filtrar por"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              if (e.target.value !== "por_mes") {
                setSelectedMonth("");
              }
            }}
            fullWidth
          >
            <MenuItem value="todos">Todas</MenuItem>
            <MenuItem value="hoy">Hoy</MenuItem>
            <MenuItem value="ultimo_mes">Imágenes del último mes</MenuItem>
            <MenuItem value="ultimos_6_meses">Últimos 6 meses</MenuItem>
            <MenuItem value="por_mes">Por Mes</MenuItem>
          </TextField>
        </Box>

        {filter === "por_mes" && (
          <Box sx={{ mb: 2 }}>
            <TextField
              select
              label="Seleccionar Mes"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              fullWidth
            >
              {months.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}

        {imagenesFiltradas.length === 0 ? (
          <Typography>
            No hay imágenes disponibles con el filtro seleccionado.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {imagenesFiltradas.map((img) => {
              const downloadUrl = img.imagen.startsWith("http")
                ? img.imagen
                : `http://127.0.0.1:8000${img.imagen}`;
              return (
                <Grid item xs={12} sm={6} md={4} key={img.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={downloadUrl}
                      alt="Imagen de obra"
                    />
                    <CardContent>
                      <Typography variant="body1">
                        {img.descripcion || "Sin descripción"}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {img.fecha
                          ? new Date(img.fecha).toLocaleDateString("es-ES")
                          : "Sin fecha"}
                      </Typography>
                    </CardContent>
                    <Box sx={{ textAlign: "center", p: 1 }}>
                      <Button
                        variant="contained"
                        color="white"
                        onClick={() => downloadImage(downloadUrl, `imagen_${img.id}.jpg`)}
                        startIcon={<Download size={16} />}
                      >
                        Descargar
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default VerImagenesObra;
