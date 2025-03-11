import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Tabla from "../components/Table";
import {
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { AuthContext } from "../pages/context/AuthContext";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const allowedRoles = ["superadmin", "coordinador", "coordinadorlogistico"];

const ListaDeCoordinaciones = () => {
  const [coordinaciones, setCoordinaciones] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCoordinacion, setSelectedCoordinacion] = useState(null);
  const [showVincularMessage, setShowVincularMessage] = useState(false);
  const { token, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.successMessage || "";

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/coordinacionretiro/aceptadas/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        setCoordinaciones(data);
        setShowVincularMessage(
          data.some((coord) => !coord.transportista || !coord.empresa_tratamiento)
        );
      })
      .catch((err) =>
        console.error("Error al obtener coordinaciones aceptadas:", err)
      );
  }, [token]);
  

  const handleMenuOpen = (event, coordinacion) => {
    setAnchorEl(event.currentTarget);
    setSelectedCoordinacion(coordinacion);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCoordinacion(null);
  };

  const columnasCoordinaciones = [
    { field: "nombre_obra", headerName: "Obra", flex: 1 },
    { field: "tipo_material", headerName: "Tipo de Material", flex: 1 },
    { field: "transportista_nombre", headerName: "Transportista", flex: 1 },
    { field: "fecha_solicitud", headerName: "Fecha de Solicitud", flex: 1 },
    { field: "fecha_retiro", headerName: "Fecha de Retiro", flex: 1 },
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

  return (
    <div>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 4 }}>
        Lista de Coordinaciones Aceptadas
      </Typography>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {showVincularMessage && role !== "supervisor" && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Hay coordinaciones sin Transportista o Empresa de Tratamiento.
          ¡Vincúlalos!
        </Alert>
      )}

      <Tabla
        datos={coordinaciones}
        columnas={columnasCoordinaciones}
        filtroClave="obra"
        filtroPlaceholder="Buscar por obra"
      />

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate(`/detallescoordinacion?id=${selectedCoordinacion?.id}`);
          }}
        >
          <VisibilityIcon sx={{ mr: 1 }} /> Ver detalles
        </MenuItem>

        {allowedRoles.includes(role) && (
          <>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate(`/editarcoordinacion?id=${selectedCoordinacion?.id}`);
              }}
            >
              <EditIcon sx={{ mr: 1 }} /> Editar
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose(); /* lógica eliminar aquí */
              }}
            >
              <DeleteIcon sx={{ color: "red", mr: 1 }} /> Eliminar
            </MenuItem>
          </>
        )}
      </Menu>

      {/* El botón solo se muestra si el rol NO es "tecnico" */}
      {role !== "tecnico" && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/altacoordinaciones"
          sx={{
            marginTop: "20px",
            backgroundColor: "#abbf9d",
            "&:hover": { backgroundColor: "#d1e063" },
          }}
        >
          Añadir Coordinación
        </Button>
      )}
    </div>
  );
};

export default ListaDeCoordinaciones;
