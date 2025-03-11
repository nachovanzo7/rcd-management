import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../pages/context/AuthContext";

// Tipos de Material disponibles
const materialOptions = [
  { value: "escombro_limpio", label: "Escombro limpio" },
  { value: "plastico", label: "Plástico" },
  { value: "papel_carton", label: "Papel y cartón" },
  { value: "metales", label: "Metales" },
  { value: "madera", label: "Madera" },
  { value: "mezclados", label: "Mezclados" },
  { value: "peligrosos", label: "Peligrosos" },
];

// Estado inicial del formulario
const initialFormState = {
  obra: "",
  descripcion: "",
  fechaSolicitud: null,
  cantidad: "",
  comentarios: "",
  tipoMaterial: "",
  transportista: "",
  empresaGestora: "",
};

const FormularioCoordinaciones = () => {
  const { role, user, token } = useContext(AuthContext);
  const [obras, setObras] = useState([]);
  const [transportistas, setTransportistas] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Obtener lista de obras aprobadas
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/obras/aprobadas/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        let obrasArray = Array.isArray(data) ? data : data.results || [];
        setObras(obrasArray);
      })
      .catch((err) => {
        console.error("Error al obtener obras:", err);
        setErrorMessage("Error al obtener obras. Intenta nuevamente.");
      });
  }, [token]);

  const [empresasGestoras, setEmpresasGestoras] = useState([]);

// Obtener lista de empresas gestoras
useEffect(() => {
  fetch("http://127.0.0.1:8000/api/empresas/lista/", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setEmpresasGestoras(data);
    })
    .catch((err) => {
      console.error("Error al obtener empresas gestoras:", err);
      setErrorMessage("Error al obtener empresas gestoras.");
    });
}, [token]);

  // Obtener lista de transportistas
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/transportistas/lista", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTransportistas(data);
      })
      .catch((err) => {
        console.error("Error al obtener transportistas:", err);
        setErrorMessage("Error al obtener transportistas.");
      });
  }, [token]);

  // Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };
  
    if (name === "tipoMaterial") {
      // Buscar transportista y empresa gestora correspondiente
      const transportistaAsignado = transportistas.find(
        (t) => t.tipo_material === value
      );
      const empresaGestoraAsignada = empresasGestoras.find(
        (e) => e.tipo_material === value
      );
  
      newFormData.transportista = transportistaAsignado?.id || "";
      newFormData.empresaGestora = empresaGestoraAsignada?.id || "";
    }
  
    setFormData(newFormData);
  };

  // Manejar envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    const today = new Date().toISOString().split("T")[0];

    const payload = {
      obra: formData.obra ? parseInt(formData.obra, 10) : null,
      descripcion: formData.descripcion,
      fecha_solicitud: today,
      cantidad: formData.cantidad,
      comentarios: formData.comentarios,
      tipo_material: formData.tipoMaterial,
      transportista: formData.transportista
        ? parseInt(formData.transportista, 10)
        : null,
        empresa_tratamiento: formData.empresaGestora
        ? parseInt(formData.empresaGestora, 10)
        : null,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/coordinacionretiro/registro/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        navigate("/", {
          state: { successMessage: "Solicitud enviada con éxito." },
        });
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (err) {
          errorData = { detail: await response.text() };
        }
        setErrorMessage(
          "Error al enviar la solicitud: " + JSON.stringify(errorData)
        );
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      setErrorMessage("Error de red. Intenta nuevamente.");
    }
  };

  const handleReset = () => {
    setFormData(initialFormState);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
        Solicitud de Coordinación
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              select
              label="Obra"
              fullWidth
              name="obra"
              value={formData.obra}
              onChange={handleChange}
              required
            >
              {obras.map((obra) => (
                <MenuItem key={obra.id} value={obra.id}>
                  {obra.nombre_obra || obra.nombre || "Sin nombre"}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              label="Tipo de Material"
              fullWidth
              name="tipoMaterial"
              value={formData.tipoMaterial}
              onChange={handleChange}
              required
            >
              {materialOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Descripción"
              fullWidth
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Cantidad"
              fullWidth
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Comentarios"
              fullWidth
              multiline
              rows={4}
              name="comentarios"
              value={formData.comentarios}
              onChange={handleChange}
            />
          </Grid>

          <Grid container spacing={2} justifyContent="center" sx={{ marginTop: "20px" }}>
            <Grid item>
              <Button type="submit" variant="contained">
                Enviar Coordinación
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={handleReset}>
                Limpiar Formulario
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default FormularioCoordinaciones;
