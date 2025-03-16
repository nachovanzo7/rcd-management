// Solicitudes.jsx
import React, { useState, useEffect, useContext } from 'react';
import Tabla from '../components/Table';
import { Button, Tab, Tabs, Box, Alert, CircularProgress, Typography } from '@mui/material';
import { AuthContext } from '../pages/context/AuthContext';

const Solicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [value, setValue] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingSolicitudId, setLoadingSolicitudId] = useState(null);
  const { token } = useContext(AuthContext);


  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const tokenLocal = sessionStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    if (!token) return;

    Promise.all([
      fetch(`${API_URL}/api/clientes/solicitudes/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      }).then((res) => res.json()),
      fetch(`${API_URL}/api/obras/solicitudes/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      }).then((res) => res.json()),
      fetch(`${API_URL}/api/coordinacionretiro/lista/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
        },
      }).then((res) => res.json()),
    ])
      .then(([clientesSolicitudes, obrasSolicitudes, coordinacionesSolicitudes]) => {
        // Mapeo para solicitudes de clientes
        const clientesData = clientesSolicitudes.map((item) => ({
          ...item,
          tipo: 'cliente',
          id: item.cliente_id
            ? `cliente-${item.cliente_id}`
            : `cliente-${item.cliente?.cliente_id || Math.random()}`,
          nombre:
            item.cliente_nombre ||
            (item.cliente && item.cliente.cliente_nombre) ||
            'Sin nombre',
          solicitante: "Alta Cliente",
          fecha: formatDate(item.cliente?.fecha_solicitud || item.fecha_solicitud),
        }));

        // Mapeo para solicitudes de obra
        const obrasData = obrasSolicitudes.map((item) => ({
          ...item,
          tipo: 'obra',
          id: item.obra ? `obra-${item.obra}` : `obra-${Math.random()}`,
          nombre: item.obra?.nombre_obra || item.nombre_obra || 'Sin nombre',
          solicitante: "Alta obra",
          fecha: formatDate(item.fecha_solicitud),
        }));

        // Mapeo para solicitudes de coordinación
        const coordinacionesData = coordinacionesSolicitudes.map((item) => ({
          ...item,
          tipo: 'coordinacion',
          id: `coordinacion-${item.id}`,
          nombre: item.nombre_obra ? (item.obra.nombre_obra || item.nombre_obra || 'Sin obra') : 'Sin obra',
          solicitante: "Coordinacion retiro",
          fecha: formatDate(item.fecha_solicitud),
        }));

        // Se combinan todas las solicitudes
        setSolicitudes([...clientesData, ...obrasData, ...coordinacionesData]);
      })
      .catch((error) => {
        console.error('Error al obtener solicitudes:', error);
        setErrorMessage('Ocurrió un error al cargar las solicitudes. Por favor, intenta nuevamente.');
      });
  }, [token]);

  const aceptarSolicitud = (id) => {
    const solicitud = solicitudes.find((sol) => sol.id === id);
    if (!solicitud) {
      setErrorMessage("Solicitud no encontrada.");
      return;
    }

    setLoadingSolicitudId(id);
    let url = "";
    if (solicitud.tipo === "cliente") {
      const clientId = id.split('-')[1];
      url = `http://127.0.0.1:8000/api/clientes/solicitudes/${clientId}/aprobar/`;
    } else if (solicitud.tipo === "obra") {
      const obraId = id.split('-')[1];
      url = `http://127.0.0.1:8000/api/obras/solicitudes/${obraId}/aprobar/`;
    } else if (solicitud.tipo === "coordinacion") {
      const coordId = id.split('-')[1];
      url = `http://127.0.0.1:8000/api/coordinacionretiro/${coordId}/aceptar/`;
    }

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setSolicitudes(
            solicitudes.map((sol) =>
              sol.id === id
                ? {
                    ...sol,
                    estado: "aceptado",
                    fecha: formatDate(new Date().toISOString()),
                    horaAceptacion: new Date().toLocaleTimeString(),
                  }
                : sol
            )
          );
          setErrorMessage('');
        } else {
          setErrorMessage("Ocurrió un error al aprobar la solicitud. Por favor, inténtalo de nuevo.");
        }
      })
      .catch((error) => {
        console.error("Error en red:", error);
        setErrorMessage("Error de red. Por favor, inténtalo de nuevo.");
      })
      .finally(() => {
        setLoadingSolicitudId(null);
      });
  };

  const rechazarSolicitud = (id) => {
    const solicitud = solicitudes.find((sol) => sol.id === id);
    if (!solicitud) {
      setErrorMessage("Solicitud no encontrada.");
      return;
    }
    setLoadingSolicitudId(id);
    let url = "";
    if (solicitud.tipo === "cliente") {
      const clientId = id.split('-')[1];
      url = `${API_URL}/api/clientes/solicitudes/${clientId}/rechazar/`;
    } else if (solicitud.tipo === "obra") {
      const obraId = id.split('-')[1];
      url = `${API_URL}/api/obras/solicitudes/${obraId}/rechazar/`;
    } else if (solicitud.tipo === "coordinacion") {
      const coordId = id.split('-')[1];
      url = `${API_URL}/api/coordinacionretiro/solicitudes/${coordId}/rechazar/`;
    }

    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setSolicitudes(
            solicitudes.map((sol) =>
              sol.id === id ? { ...sol, estado: "rechazado" } : sol
            )
          );
          setErrorMessage('');
        } else {
          setErrorMessage("Ocurrió un error al rechazar la solicitud. Por favor, inténtalo de nuevo.");
        }
      })
      .catch((error) => {
        console.error("Error en red:", error);
        setErrorMessage("Error de red. Por favor, inténtalo de nuevo.");
      })
      .finally(() => {
        setLoadingSolicitudId(null);
      });
  };

  const marcarComoTerminada = (id) => {
    const solicitud = solicitudes.find((sol) => sol.id === id);
    if (!solicitud) {
      setErrorMessage("Solicitud no encontrada.");
      return;
    }
    setLoadingSolicitudId(id);
    let url = "";
    if (solicitud.tipo === "cliente") {
      const clientId = id.split('-')[1];
      url = `${API_URL}/api/clientes/solicitudes/${clientId}/terminar/`;
    } else if (solicitud.tipo === "obra") {
      const obraId = id.split('-')[1];
      url = `${API_URL}/api/obras/solicitudes/${obraId}/terminar/`;
    } else if (solicitud.tipo === "coordinacion") {
      const coordId = id.split('-')[1];
      url = `${API_URL}/api/coordinacionretiro/${coordId}/terminar/`;
    }
    
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          setSolicitudes(
            solicitudes.map((sol) =>
              sol.id === id ? { ...sol, estado: "terminado" } : sol
            )
          );
          setErrorMessage('');
        } else {
          setErrorMessage("Ocurrió un error al marcar la solicitud como terminada. Por favor, inténtalo de nuevo.");
        }
      })
      .catch((error) => {
        console.error("Error en red:", error);
        setErrorMessage("Error de red. Por favor, inténtalo de nuevo.");
      })
      .finally(() => {
        setLoadingSolicitudId(null);
      });
  };

  // Columnas para cada pestaña
  const columnasPendientes = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'solicitante', headerName: 'Solicitante', flex: 1 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          {loadingSolicitudId === params.row.id ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Button onClick={() => aceptarSolicitud(params.row.id)} style={{ color: '#a8c948' }}>
                Aceptar
              </Button>
              <Button onClick={() => rechazarSolicitud(params.row.id)} style={{ color: '#f44336' }}>
                Rechazar
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const columnasAceptadas = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'solicitante', headerName: 'Solicitante', flex: 1 },
    { field: 'fecha', headerName: 'Hora de Aceptación', flex: 1 },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 1,
      align: 'center',
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {loadingSolicitudId === params.row.id ? (
            <CircularProgress size={24} />
          ) : (
            <Button onClick={() => marcarComoTerminada(params.row.id)} style={{ color: '#abbf9d' }}>
              Marcar como Terminado
            </Button>
          )}
        </div>
      ),
    },
  ];

  const columnasTerminadas = [
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'solicitante', headerName: 'Solicitante', flex: 1 },
  ];

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
    setErrorMessage('');
  };

  return (
    <div className="solicitudes-container">
      <Typography variant="h4" sx={{ textAlign: 'center', mb: 4 }}>
        Solicitudes de Aprobación
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {errorMessage}
        </Alert>
      )}

<Box
  sx={{
    "& .MuiTab-root": {
      color: "black", // Color para los tabs no seleccionados
      transition: "background-color 0.3s ease",
      "&:active": { backgroundColor: "#abbf9d" },
    },
    "& .Mui-selected": {
      backgroundColor: "#abbf9d",
      color: "#ffff",
    },
    "& .MuiTabs-indicator": { backgroundColor: "#abbf9d" },
  }}
>
  <Tabs value={value} onChange={handleChangeTab} aria-label="Solicitudes">
    <Tab label="Pendientes" />
    <Tab label="Aceptadas" />
    <Tab label="Terminadas" />
  </Tabs>
</Box>

        {value === 0 && (
          <div>
            <Tabla
              datos={solicitudes.filter(
                (sol) => sol.estado?.toLowerCase() === 'pendiente'
              )}
              columnas={columnasPendientes}
              filtroClave="nombre"
              filtroPlaceholder="Nombre del cliente"
              getRowId={(row) => row.id}
            />
          </div>
        )}

        {value === 1 && (
          <div>
            <Tabla
              datos={solicitudes.filter(
                (sol) => sol.estado?.toLowerCase() === 'aceptado'
              )}
              columnas={columnasAceptadas}
              filtroClave="nombre"
              filtroPlaceholder="Nombre del cliente"
              getRowId={(row) => row.id}
            />
          </div>
        )}

        {value === 2 && (
          <div>
            <Tabla
              datos={solicitudes.filter((sol) => sol.estado === 'terminado')}
              columnas={columnasTerminadas}
              filtroClave="nombre"
              filtroPlaceholder="Nombre del cliente"
              className="tabla-terminadas"
              getRowId={(row) => row.id}
            />
          </div>
        )}
    </div>
  );
};

export default Solicitudes;
