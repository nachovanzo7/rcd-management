import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Button,
  Box,
  TableContainer,
} from '@mui/material';
import { AuthContext } from '../pages/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ListarUsuarios = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/usuarios/listar/', {
      headers: { Authorization: `Token ${token}` },
    })
      .then(res => res.json())
      .then(data => setUsuarios(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Error:", err);
        setUsuarios([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <Container maxWidth="md">
      <Paper sx={{ padding: 4, mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Lista de Usuarios
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((usuario) => (
                  <TableRow key={usuario.email}>
                    <TableCell>{usuario.id}</TableCell>
                    <TableCell>{usuario.username}</TableCell>
                    <TableCell>{usuario.email}</TableCell>
                    <TableCell>{usuario.rol}</TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/editarusuario/${usuario.email}`)}
                        sx={{
                          backgroundColor: "#abbf9d",
                          "&:hover": { backgroundColor: "#d1e063" },
                          color: "white",
                          borderColor: "#abbf9d",
                        }}
                      >
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button
            variant="contained"
            onClick={() => navigate('/altausuario')}
            sx={{
              backgroundColor: "#abbf9d",
              "&:hover": { backgroundColor: "#d1e063" },
            }}
          >
            Añadir Usuario
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ListarUsuarios;
