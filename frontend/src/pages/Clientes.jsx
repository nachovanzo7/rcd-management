  import React, { useState, useEffect, useContext } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { Typography } from '@mui/material';
  import Tabla from '../components/Table';
  import { Button, IconButton, Menu, MenuItem } from '@mui/material';
  import MoreVertIcon from '@mui/icons-material/MoreVert';
  import VisibilityIcon from '@mui/icons-material/Visibility';
  import EditIcon from '@mui/icons-material/Edit';
  import DeleteIcon from '@mui/icons-material/Delete';
  import AddIcon from '@mui/icons-material/Add';
  import { Link } from 'react-router-dom';
  import { AuthContext } from '../pages/context/AuthContext';

  const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const navigate = useNavigate();
    // Extraemos el token desde el AuthContext
    const { token } = useContext(AuthContext);

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';


    useEffect(() => {
      if (!token) return; // Si no hay token, no se realiza la petición
      fetch(`${API_URL}/api/clientes/aprobados/`, {
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
        .then((data) => setClientes(data))
        .catch((error) => console.error('Error al obtener clientes:', error));
    }, [token]);

    const eliminarCliente = (id) => {
      const confirmacion = window.confirm("¿Seguro que deseas eliminar este cliente?");
      if (confirmacion) {
        fetch(`${API_URL}/api/clientes/${id}/eliminar/`, {
          method: 'DELETE',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Error HTTP: ${res.status}`);
            }
            return res.text();
          })
          .then(() => {
            // Actualizamos el estado eliminando el cliente
            setClientes(clientes.filter((cliente) => cliente.id !== id));
          })
          .catch((error) => console.error("Error al eliminar cliente:", error));
      }
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCliente, setSelectedCliente] = useState(null);

    const handleMenuOpen = (event, cliente) => {
      setAnchorEl(event.currentTarget);
      setSelectedCliente(cliente);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
      setSelectedCliente(null);
    };

    const columnasClientes = [
      { field: 'nombre', headerName: 'Nombres', flex: 1 },
      { field: 'fecha_ingreso', headerName: 'Fecha de ingreso', flex: 1 },
      { field: 'email', headerName: 'Email', flex: 1 },
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
          Listado de Clientes
        </Typography>
        <Tabla
          datos={clientes}
          columnas={columnasClientes}
          filtroClave="nombre"
          filtroPlaceholder="Nombre del cliente"
        />

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { handleMenuClose(); navigate(`/detallescliente?id=${selectedCliente?.id}`); }}>
            <VisibilityIcon /> Ver detalles
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate(`/editarcliente?id=${selectedCliente?.id}`); }}>
            <EditIcon /> Editar
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); eliminarCliente(selectedCliente?.id); }}>
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
          to="/altacliente"
          style={{ marginTop: '20px' }}
        >
          Añadir Cliente
        </Button>
      </div>
    );
  };

  export default Clientes;
