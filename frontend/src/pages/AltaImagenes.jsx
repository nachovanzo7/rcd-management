import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  CircularProgress,
  TextField,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../pages/context/AuthContext";

const AltaImagenes = () => {
  const [obra, setObra] = useState(null);

  const [selectedFiles, setSelectedFiles] = useState([
    { file: null, descripcion: "", fecha: null },
  ]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const obraId = queryParams.get("obraId");

  useEffect(() => {
    if (obraId && token) {
      fetch(`http://127.0.0.1:8000/api/obras/${obraId}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error al obtener la obra");
          return res.json();
        })
        .then((data) => {
          setObra(data);
        })
        .catch((error) => {
          console.error("Error:", error);
          setErrorMessage("No se pudo cargar la información de la obra.");
        });
    }
  }, [obraId, token]);

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index].file = file;
      return newFiles;
    });
  };

  const handleDescriptionChange = (index, value) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index].descripcion = value;
      return newFiles;
    });
  };

  const handleFechaChange = (index, newValue) => {
    setSelectedFiles((prev) => {
      const newFiles = [...prev];
      newFiles[index].fecha = newValue;
      return newFiles;
    });
  };


  const handleAddImage = () => {
    setSelectedFiles((prev) => [
      ...prev,
      { file: null, descripcion: "", fecha: null },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0 || !selectedFiles.some((item) => item.file)) {
      setErrorMessage("Debes agregar al menos una imagen.");
      return;
    }
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    const formData = new FormData();

    selectedFiles.forEach((item) => {
      if (item.file) {
        formData.append("imagenes", item.file);
        formData.append("descripciones", item.descripcion);
        formData.append(
          "fechas",
          item.fecha ? item.fecha.toISOString().split("T")[0] : ""
        );
      }
    });

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/fotos/obras/${obraId}/agregar-imagenes/`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Error al subir las imágenes.");
      } else {
        setSuccessMessage("Imágenes agregadas correctamente.");
        // Redirigir a la página "Ver Imágenes" de la obra
        navigate(`/verimagenes?obraId=${obraId}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Error de red. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Agregar Imágenes a la Obra
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        {obra ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              {obra.nombre_obra}
            </Typography>
            <form onSubmit={handleSubmit}>
              {selectedFiles.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    border: "1px solid #ccc",
                    p: 2,
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle1">
                    Imagen {index + 1}
                  </Typography>
                  <TextField
                    type="file"
                    onChange={(e) => handleFileChange(index, e)}
                    inputProps={{ accept: "image/*" }}
                    fullWidth
                  />
                  <TextField
                    label="Descripción"
                    fullWidth
                    value={item.descripcion}
                    onChange={(e) =>
                      handleDescriptionChange(index, e.target.value)
                    }
                    sx={{ mb: 1, mt: 1 }}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Fecha"
                      value={item.fecha}
                      onChange={(newValue) =>
                        handleFechaChange(index, newValue)
                      }
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                </Box>
              ))}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleAddImage}
                  sx={{
                    backgroundColor: "#abbf9d",
                    color: "white",
                    borderColor: "#abbf9d",
                    "&:hover": {
                      backgroundColor: "#d1e063",
                      borderColor: "#d1e063",
                    },
                  }}
                >
                  Agregar Otra Imagen
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={isLoading}
                  sx={{
                    backgroundColor: "#a8c948",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#d1e063",
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    "Subir Imágenes"
                  )}
                </Button>
              </Box>
            </form>
          </Box>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default AltaImagenes;