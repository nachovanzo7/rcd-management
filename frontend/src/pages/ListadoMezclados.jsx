import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Tabla from '../components/Table';
import { Typography, Button, IconButton, Menu, MenuItem, Alert } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { AuthContext } from '../pages/context/AuthContext';
import dayjs from 'dayjs';

const ListaMezclados = () => {
  const [mezclados, setMezclados] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { role, token } = useContext(AuthContext);
  const successMessage = location.state?.successMessage || "";
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    // Endpoint para obtener todos los mezclados
    const url = `${API_URL}/api/mezclados/lista/`;
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`, 
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setMezclados(data);
      })
      .catch((err) => console.error("Error al obtener mezclados:", err));
  }, [role, token]);

  const eliminarMezclado = (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar este mezclado?");
    if (confirmacion) {
      fetch(`http://127.0.0.1:8000/api/mezclados/${id}/eliminar/`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          "Authorization": `Token ${token}` 
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
          }
          return res.text();
        })
        .then(() => {
          setMezclados(mezclados.filter((mezclado) => mezclado.id !== id));
        })
        .catch((err) => console.error("Error al eliminar mezclado:", err));
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMezclado, setSelectedMezclado] = useState(null);

  const handleMenuOpen = (event, mezclado) => {
    setAnchorEl(event.currentTarget);
    setSelectedMezclado(mezclado);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedMezclado(null);
  };

  const columnasMezclados = [
    { field: 'nombre_obra', headerName: 'Obra', flex: 1 },
    { field: 'pesaje', headerName: 'Pesaje (kg)', flex: 1 },
    { 
      field: 'fecha_registro', 
      headerName: 'Fecha Registro', 
      flex: 1,
      renderCell: (params) => dayjs(params.value).format('DD/MM/YYYY')
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <IconButton onClick={(event) => handleMenuOpen(event, params.row)}>
          <MoreVertIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <div>
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
        Lista de Mezclados
      </Typography>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      <Tabla
        datos={mezclados}
        columnas={columnasMezclados}
        filtroClave="nombre_obra"
        filtroPlaceholder="Nombre de la obra"
      />
      
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { 
          handleMenuClose(); 
          navigate(`/detallesmezclados?id=${selectedMezclado?.id}`); 
        }}>
          <VisibilityIcon /> Ver detalles
        </MenuItem>
        <MenuItem onClick={() => { 
          handleMenuClose(); 
          navigate(`/editarmezclado?id=${selectedMezclado?.id}`); 
        }}>
          <EditIcon /> Editar
        </MenuItem>
        <MenuItem onClick={() => { 
          handleMenuClose(); 
          eliminarMezclado(selectedMezclado?.id); 
        }}>
          <DeleteIcon style={{ color: 'red' }} /> Eliminar
        </MenuItem>
      </Menu>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        component={Link}
        to="/altamezclados"
        sx={{
          marginTop: '20px',
          backgroundColor: '#abbf9d',
          '&:hover': { backgroundColor: '#d1e063' },
        }}
      >
        Añadir Mezclado
      </Button>
    </div>
  );
};

export default ListaMezclados;
