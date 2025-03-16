import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Tabla from '../components/Table';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  Button, 
  Tabs, 
  Tab, 
  Box, 
  Typography 
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import AddIcon from '@mui/icons-material/Add';

const Transportistas = () => {
  const [transportistas, setTransportistas] = useState([]);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  // Acceder al token desde el contexto
  const { token } = useContext(AuthContext);
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    if (!token) {
      console.log('No hay token, redirigiendo al login');
      navigate('/login'); // Redirigir al login si no hay token
      return;
    }
  
    fetch(`${API_URL}/api/transportistas/lista/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`, // Añadimos el token a la cabecera
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setTransportistas(data))
      .catch((error) => {
        console.error('Error al obtener transportistas:', error);
        alert('Ocurrió un error al obtener los transportistas.');
      });
  }, [token, navigate]);
  
  const toggleEstado = (id) => {
    const transportista = transportistas.find((t) => t.id === id);
    const newEstado = transportista.estado === 'activo' ? 'inactivo' : 'activo';

    fetch(`${API_URL}/api/transportistas/modificar/${id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify({ estado: newEstado }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setTransportistas((prevTransportistas) =>
          prevTransportistas.map((t) =>
            t.id === id ? { ...t, estado: newEstado } : t
          )
        );
      })
      .catch((error) => {
        console.error("Error al actualizar el estado del transportista:", error);
      });
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTransportista, setSelectedTransportista] = useState(null);

  const handleMenuOpen = (event, transportista) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransportista(transportista);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTransportista(null);
  };

  const columnasTransportistas = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'contacto', headerName: 'Contacto', flex: 1 },
    { field: 'tipo_material', headerName: 'Tipo de Material', flex: 1 },
    { field: 'estado', headerName: 'Estado', flex: 1 },
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

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: '20px' }}>
        Transportistas
      </Typography>
      <Box sx={{ width: '100%' }}>
        <Tabs
          value={value}
          onChange={handleChangeTab}
          aria-label="Transportistas"
          textColor="inherit"
          indicatorColor="inherit"
          sx={{
            '& .MuiTab-root': { 
              color: 'black',
              transition: 'background-color 0.3s ease',
              '&:active': { backgroundColor: '#abbf9d' },
            },
            '& .Mui-selected': {
              backgroundColor: '#abbf9d',
              color: 'white',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#abbf9d',
            },
          }}
        >
          <Tab label="Activos" />
          <Tab label="Inactivos" />
        </Tabs>

        {value === 0 && (
          <div>
            <Tabla
              datos={transportistas.filter((t) => t.estado === 'activo')}
              columnas={columnasTransportistas}
              filtroClave="nombre"
              filtroPlaceholder="Nombre del transportista"
            />
          </div>
        )}

        {value === 1 && (
          <div>
            <Tabla
              datos={transportistas.filter((t) => t.estado === 'inactivo')}
              columnas={columnasTransportistas}
              filtroClave="nombre"
              filtroPlaceholder="Nombre del transportista"
            />
          </div>
        )}
      </Box>

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
        onClick={() => navigate('/altatransportistas')}
      >
        Añadir Transportista
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate(`/detalletransportista?id=${selectedTransportista?.id}`);
          }}
        >
          <VisibilityIcon /> Ver detalles
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate(`/editartransportista?id=${selectedTransportista?.id}`);
          }}
        >
          <EditIcon /> Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            toggleEstado(selectedTransportista?.id);
          }}
        >
          {selectedTransportista?.estado === 'activo' ? <ToggleOffIcon /> : <ToggleOnIcon />} Cambiar estado
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Transportistas;
