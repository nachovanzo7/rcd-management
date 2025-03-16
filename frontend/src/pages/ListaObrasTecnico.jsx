import React, { useEffect, useState, useContext } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormStore } from "./context/FormContext";
import { AuthContext } from "./context/AuthContext";

const ObrasList = () => {
  const [obras, setObras] = useState([]);
  const navigate = useNavigate();
  const { data, updateData } = useFormStore();
  
  // Obtenemos user, role, token
  const { user, role, token } = useContext(AuthContext);
  // email se obtiene directamente de user?.email
  const email = user?.email;
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    const authToken = sessionStorage.getItem('token');

    fetch(`${API_URL}/api/obras/aprobadas/`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${authToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        // Si el rol es "tecnico", filtramos aquellas obras 
        // cuya tecnico_email coincide con user?.email
        if (role === "tecnico" && email) {
          const obrasTecnico = data.filter(
            (obra) => obra.tecnico_email === email
          );
          setObras(obrasTecnico);
        } else {
          // Caso contrario (rol distinto de tecnico), mostramos todas
          setObras(data);
        }
      })
      .catch((err) => console.error("Error al obtener obras aprobadas:", err));
  }, [role, token, email]);

  const handleSelectObra = (obra) => {
    updateData("page1", {
      ...data.page1,
      obra: obra.nombre_obra,
      obraId: obra.id,
      direccion: obra.direccion,
      obrasDisponibles: obras,
    });

    updateData("pageIndex", 0);

    setTimeout(() => {
      navigate("../Formularios");
    }, 100);
  };

  return (
    <Container>
      <Typography variant="h4" align="center" sx={{ my: 3 }}>
        Obras Aprobadas
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Obra</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell align="center">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {obras.length > 0 ? (
              obras.map((obra) => (
                <TableRow key={obra.id}>
                  <TableCell>{obra.nombre_obra}</TableCell>
                  <TableCell>{obra.direccion}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: "#abbf9d",
                        "&:hover": {
                          backgroundColor: "#d1e063",
                        },
                      }}
                      onClick={() => handleSelectObra(obra)}
                    >
                      Seleccionar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No hay obras disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ObrasList;
