import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Informes = () => {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    fetch(`${API_URL}/api/formularios/listar/`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al cargar los formularios");
        }
        return res.json();
      })
      .then((data) => {
        setFormularios(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" sx={{ textAlign: "center", mt: 4 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Container>
      <Typography variant="h4" align="center" sx={{ my: 3 }}>
        Listado de Formularios
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fecha</TableCell>
              <TableCell>Obra</TableCell>
              <TableCell>Técnico</TableCell>
              <TableCell align="center">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formularios.length > 0 ? (
              formularios.map((formulario) => (
                <TableRow key={formulario.id}>
                  <TableCell>{formulario.fecha || "N/A"}</TableCell>
                  <TableCell>{formulario.obra_nombre || "N/A"}</TableCell>
                  <TableCell>{formulario.tecnico_nombre || "N/A"}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#abbf9d",
                        "&:hover": {
                          backgroundColor: "#d1e063",
                        },
                      }}
                      onClick={() => navigate(`/formularios/detalle/${formulario.id}`)}
                    >
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No hay formularios disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Informes;
