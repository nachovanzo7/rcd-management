import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Tabla from '../components/Table';
import { Button, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import '../styles/EmpresasGestoras.css';

const EmpresasGestoras = () => {
  const [empresas, setEmpresas] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    fetch('http://127.0.0.1:8000/api/empresas/lista/', {
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
      .then((data) => setEmpresas(data))
      .catch((error) => console.error('Error al obtener empresas:', error));
  }, [token]);

  const eliminarEmpresa = async (id) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar esta empresa?");
    if (confirmacion) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/empresas/eliminar/${id}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        // Actualiza el estado eliminando la empresa eliminada
        setEmpresas(empresas.filter((empresa) => empresa.id !== id));
      } catch (error) {
        console.error('Error al eliminar la empresa:', error);
        alert('Error al eliminar la empresa');
      }
    }
  };

  const handleMenuOpen = (event, empresa) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmpresa(empresa);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmpresa(null);
  };

  const columnasEmpresas = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'ubicacion', headerName: 'Ubicación', flex: 1 },
    { field: 'contacto', headerName: 'Contacto', flex: 1 },
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
        Empresas Gestoras
      </Typography>
      <Tabla
        datos={empresas}
        columnas={columnasEmpresas}
        filtroClave="nombre"
        filtroPlaceholder="Nombre de la empresa"
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate(`/detalleempresa?id=${selectedEmpresa?.id}`);
          }}
        >
          <VisibilityIcon /> Ver detalles
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate(`/editarempresasgestoras?id=${selectedEmpresa?.id}`);
          }}
        >
          <EditIcon /> Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            eliminarEmpresa(selectedEmpresa?.id);
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
        to="/altaempresas"
        style={{ marginTop: '20px' }}
      >
        Añadir Empresa
      </Button>
    </div>
  );
};

export default EmpresasGestoras;
