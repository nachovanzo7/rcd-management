import React, { useState, useEffect, useContext } from "react";
import { Button, IconButton, Menu, MenuItem, Box, Tabs, Tab, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useNavigate, Link } from "react-router-dom";
import Tabla from "../components/Table";
import { AuthContext } from "../pages/context/AuthContext";

const PuntoLimpio = () => {
  const [puntosLimpios, setPuntosLimpios] = useState([]);
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const { token, role } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return; 

    // Por defecto se usa el endpoint de puntos limpios general
    let url = "http://localhost:8000/api/puntolimpio/lista/";
    // Si el usuario logueado tiene rol "cliente", usamos el endpoint que filtra por el cliente
    if (role === "cliente") {
      url = "http://localhost:8000/api/clientes/puntos-limpios/";
    }
    console.log("Fetching puntos limpios desde:", url);

    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Puntos limpios recibidos:", data);
        setPuntosLimpios(Array.isArray(data) ? data : []);
      })
      .catch((error) => console.error("Error al obtener puntos limpios:", error));
  }, [token, role]);

  const toggleEstado = (id) => {
    const punto = puntosLimpios.find((p) => p.id === id);
    if (!punto) return;
    const newEstado = punto.estado.trim().toLowerCase() === "activo" ? "inactivo" : "activo";

    fetch(`http://127.0.0.1:8000/api/puntos-limpios/modificar/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
      body: JSON.stringify({ estado: newEstado }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setPuntosLimpios((prev) =>
          prev.map((p) => (p.id === id ? { ...p, estado: newEstado } : p))
        );
      })
      .catch((error) => {
        console.error("Error al actualizar el estado del punto limpio:", error);
      });
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPunto, setSelectedPunto] = useState(null);

  const handleMenuOpen = (event, punto) => {
    setAnchorEl(event.currentTarget);
    setSelectedPunto(punto);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPunto(null);
  };

  const columnasPuntosLimpios = [
    { field: "nombre_obra", headerName: "Nombre de la Obra", flex: 1 },
    { field: "tipo_contenedor", headerName: "Tipo de Contenedor", flex: 1 },
    { field: "estado", headerName: "Estado", flex: 1 },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      sortable: false,
      align: "center",
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
      <Typography variant="h4" align="center" sx={{ my: 3 }}>
        Puntos Limpios
      </Typography>

      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={handleChangeTab}
          aria-label="Puntos Limpios"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            "& .MuiTab-root": {
              color: "#000000",
            },
            "& .Mui-selected": {
              backgroundColor: "#abbf9d",
              color: "#ffff",
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#abbf9d",
            },
          }}
        >
          <Tab label="Activos" />
          <Tab label="Inactivos" />
        </Tabs>

        {value === 0 && (
          <div>
            <Tabla
              datos={puntosLimpios.filter(
                (p) =>
                  p.estado && p.estado.trim().toLowerCase() === "activo"
              )}
              columnas={columnasPuntosLimpios}
              filtroClave="id"
              filtroPlaceholder="Buscar por nombre de obra"
            />
          </div>
        )}

        {value === 1 && (
          <div>
            <Tabla
              datos={puntosLimpios.filter(
                (p) =>
                  p.estado && p.estado.trim().toLowerCase() === "inactivo"
              )}
              columnas={columnasPuntosLimpios}
              filtroClave="nombre_obra"
              filtroPlaceholder="Buscar por nombre de obra"
            />
          </div>
        )}
      </Box>

      <Button
        variant="contained"
        sx={{
          marginTop: "20px",
          backgroundColor: "#abbf9d",
          "&:hover": {
            backgroundColor: "#d1e063",
          },
        }}
        startIcon={<AddIcon />}
        component={Link}
        to="/altapuntolimpio"
      >
        Añadir Punto Limpio
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate(`/detallespuntolimpio?id=${selectedPunto?.id}`);
          }}
        >
          <VisibilityIcon /> Ver detalles
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            toggleEstado(selectedPunto?.id);
          }}
        >
          {selectedPunto?.estado.trim().toLowerCase() === "activo" ? (
            <ToggleOffIcon />
          ) : (
            <ToggleOnIcon />
          )}
          Cambiar estado
        </MenuItem>
      </Menu>
    </div>
  );
};

export default PuntoLimpio;
