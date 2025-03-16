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

const ListaDeObras = () => {
  const [obras, setObras] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { role, token } = useContext(AuthContext);

  const successMessage = location.state?.successMessage || "";

  useEffect(() => {
    // Por defecto se usa el endpoint de obras aprobadas
    let url = "http://127.0.0.1:8000/api/obras/aprobadas/";
    // Si el usuario tiene rol "cliente", se usa el endpoint que filtra por el usuario logueado
    if (role === "cliente") {
      url = "http://127.0.0.1:8000/api/clientes/obras/";
    }
    
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
        setObras(data);
      })
      .catch((err) => console.error("Error al obtener obras:", err));
  }, [role, token]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const eliminarObra = (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar esta obra?");
    if (confirmacion) {
      fetch(`${API_URL}/api/obras/${id}/eliminar/`, {
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
          setObras(obras.filter((obra) => obra.id !== id));
        })
        .catch((err) => console.error("Error al eliminar obra:", err));
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedObra, setSelectedObra] = useState(null);

  const handleMenuOpen = (event, obra) => {
    setAnchorEl(event.currentTarget);
    setSelectedObra(obra);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedObra(null);
  };

  const columnasObras = [
    { field: 'nombre_obra', headerName: 'Nombre', flex: 1 },
    { field: 'direccion', headerName: 'Dirección', flex: 1 },
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
        Lista de Obras
      </Typography>
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      
      {/* Si el componente Tabla no muestra los datos, prueba descomentando el bloque de abajo para renderizar una tabla simple */}
      {/*
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre de Obra</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          {obras.map(obra => (
            <tr key={obra.id}>
              <td>{obra.id}</td>
              <td>{obra.nombre_obra}</td>
              <td>{obra.direccion}</td>
            </tr>
          ))}
        </tbody>
      </table>
      */}
      
      {/* Componente Tabla */}
      <Tabla
        datos={obras}
        columnas={columnasObras}
        filtroClave="id"
        filtroPlaceholder="Nombre de la obra"
      />
      
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => { 
          handleMenuClose(); 
          navigate(`/detallesobra?id=${selectedObra?.id}`); 
        }}>
          <VisibilityIcon /> Ver detalles
        </MenuItem>
        <MenuItem onClick={() => { 
          handleMenuClose(); 
          navigate(`/editarobra?id=${selectedObra?.id}`); 
        }}>
          <EditIcon /> Editar
        </MenuItem>
        <MenuItem onClick={() => { 
          handleMenuClose(); 
          eliminarObra(selectedObra?.id); 
        }}>
          <DeleteIcon style={{ color: 'red' }} /> Eliminar
        </MenuItem>
      </Menu>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        component={Link}
        to="/altaobra"
        sx={{
          marginTop: '20px',
          backgroundColor: '#abbf9d',
          '&:hover': { backgroundColor: '#d1e063' },
        }}
      >
        Añadir Obra
      </Button>
    </div>
  );
};

export default ListaDeObras;
