import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Tabla from '../components/Table';
import { Button, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';

const Capacitaciones = () => {
  const [capacitaciones, setCapacitaciones] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCapacitacion, setSelectedCapacitacion] = useState(null);

  const { token, role, user } = useContext(AuthContext); 
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    if (!token) return; 
    
    fetch(`${API_URL}/api/capacitaciones/lista/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`, 
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Filtrar si es tecnico
        if (role === 'tecnico' && user?.email) {
          const filtradas = data.filter(
            (cap) => cap.tecnico_email === user.email
          );
          setCapacitaciones(filtradas);
        } else {
          setCapacitaciones(data);
        }
      })
      .catch((error) => console.error('Error al obtener capacitaciones:', error));
  }, [token, role, user]);

  const eliminarCapacitacion = (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar esta capacitación?");
    if (confirmacion) {
      fetch(`${API_URL}/api/capacitaciones/${id}/eliminar/`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
          }
          return res.text();
        })
        .then(() => {
          setCapacitaciones(
            capacitaciones.filter((capacitacion) => capacitacion.id !== id)
          );
        })
        .catch((error) => console.error("Error al eliminar capacitación:", error));
    }
  };

  const handleMenuOpen = (event, capacitacion) => {
    setAnchorEl(event.currentTarget);
    setSelectedCapacitacion(capacitacion);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCapacitacion(null);
  };

  const columnasCapacitaciones = [
    { field: 'fecha', headerName: 'Fecha', flex: 1 },
    { field: 'motivo', headerName: 'Motivo', flex: 1 },
    { field: 'obra_nombre', headerName: 'Obra', flex: 1 },
    { field: 'tecnico_nombre', headerName: 'Técnico', flex: 1 },
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
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        Listado de Capacitaciones
      </Typography>

      <Tabla
        datos={capacitaciones}
        columnas={columnasCapacitaciones}
        filtroClave="obra_nombre"
        filtroPlaceholder="Obra"
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem 
          onClick={() => {
            handleMenuClose();
            navigate(`/detallescapacitaciones?id=${selectedCapacitacion?.id}`);
          }}
        >
          <VisibilityIcon /> Ver detalles
        </MenuItem>

        <MenuItem 
          onClick={() => {
            handleMenuClose();
            eliminarCapacitacion(selectedCapacitacion?.id);
          }}
        >
          <DeleteIcon style={{ color: 'red' }} /> Eliminar
        </MenuItem>
      </Menu>

      <Button
        variant="contained"
        sx={{
          marginTop: '20px',
          backgroundColor: '#abbf9d',
          '&:hover': {
            backgroundColor: '#d1e063',
          },
        }}
        startIcon={<AddIcon />}
        component={Link}
        to="/altacapacitaciones"
        style={{ marginTop: '20px' }}
      >
        Añadir Capacitación
      </Button>
    </div>
  );
};

export default Capacitaciones;
