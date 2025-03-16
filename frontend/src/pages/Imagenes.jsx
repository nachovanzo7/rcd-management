import React, { useState, useEffect, useContext } from "react";
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Alert, 
  CircularProgress 
} from "@mui/material";
import Tabla from "../components/Table"; // Asegúrate de tener este componente
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/context/AuthContext";

const Imagenes = () => {
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/api/obras/aprobadas/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener las obras");
        return res.json();
      })
      .then((data) => {
        setObras(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("No se pudieron cargar las obras.");
        setLoading(false);
      });
  }, [token]);

  const handleAgregarImagenes = (obraId) => {
    navigate(`/altaimagenes?obraId=${obraId}`);
  };

  const handleVerImagenes = (obraId) => {
    navigate(`/verimagenes?obraId=${obraId}`);
  };

  // Definición de columnas para la tabla
  const columnas = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "nombre_obra", headerName: "Obra", flex: 1 },
    { field: "localidad", headerName: "Localidad", flex: 1 },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            onClick={() => handleAgregarImagenes(params.row.id)}
            sx={{
              backgroundColor: "#abbf9d",
              color: "white",
              "&:hover": {
                backgroundColor: "#abbf9d",
              },
              fontSize: ".7rem",
              padding: "10px 20px",
              textTransform: "none",
            }}
          >
            Agregar imagenes
          </Button>
          <Button
            variant="contained"
            onClick={() => handleVerImagenes(params.row.id)}
            sx={{
              backgroundColor: "#2D2E80",
              color: "white",
              "&:hover": {
                backgroundColor: "#2D2E80",
              },
              fontSize: ".7rem",
              padding: "12px 20px",
              textTransform: "none",
            }}
          >
            Ver imagenes
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Lista de Obras
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Tabla
            datos={obras}
            columnas={columnas}
            filtroClave="nombre_obra"
            filtroPlaceholder="Buscar obra..."
            getRowId={(row) => row.id}
          />
        )}
      </Box>
    </Container>
  );
};

export default Imagenes;
