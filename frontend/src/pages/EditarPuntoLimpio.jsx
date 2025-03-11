import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
  Box,
  IconButton,
  MenuItem,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Anvil, TreeDeciduous, CupSoda, TriangleAlert, TrendingUpDown, Recycle } from 'lucide-react';

const steps = ["Información General", "Detalles del Material", "Clasificación y Observaciones"];

const EditarPuntoLimpio = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    obra: "",
    ubicacion: "",
    accesibilidad: "en_planta_baja",
    cantidad: "",
    metros_cuadrados: "",
    estructura: "",
    tipo_contenedor: "",
    puntaje: "",
    senaletica: true,
    observaciones: "",
    clasificacion: "correcta",
    materiales: {},
  });

  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    if (id) {
      fetch(`http://127.0.0.1:8000/api/puntos-limpios/${id}/`)
        .then((response) => response.json())
        .then((data) => {
          setFormData({
            ...data,
            materiales: data.materiales || {},
          });
        })
        .catch((error) => console.error("Error al obtener datos del punto limpio:", error));
    }
  }, [id]);

  const validate = () => {
    let newErrors = {};

    if (!formData.obra) {
      newErrors.obra = "Debe seleccionar una obra.";
    }
    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = "La ubicación es obligatoria.";
    }
    if (!/^[0-9]+$/.test(formData.cantidad)) {
      newErrors.cantidad = "Debe ser un número válido.";
    }
    if (!/^[0-9]+$/.test(formData.metros_cuadrados)) {
      newErrors.metros_cuadrados = "Debe ser un número válido.";
    }
    if (!formData.tipo_contenedor.trim()) {
      newErrors.tipo_contenedor = "El tipo de contenedor es obligatorio.";
    }
    if (!formData.fecha_ingreso || isNaN(new Date(formData.fecha_ingreso).getTime())) {
      newErrors.fecha_ingreso = "Fecha de ingreso no válida.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleNext = () => setActiveStep((prevStep) => prevStep + 1);
  const handleBack = () => setActiveStep((prevStep) => prevStep - 1);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleMaterialQuantityChange = (materialType, quantity) => {
    setFormData(prevState => ({
      ...prevState,
      materiales: {
        ...prevState.materiales,
        [materialType]: quantity,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/puntos-limpios/${id}/actualizar/`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Punto Limpio actualizado con éxito.");
        navigate("/listapuntolimpio");
      } else {
        console.error("Error al actualizar el Punto Limpio.");
      }
    } catch (error) {
      console.error("Error en la petición:", error);
    }
  };

  const theme = createTheme({ palette: { primary: { main: '#a8c948' } } });
  const materialTypes = [
    { value: "escombro_limpio", label: "Escombro Limpio", icon: <Recycle /> },
    { value: "plastico", label: "Plástico", icon: <CupSoda /> },
    { value: "metales", label: "Metales", icon: <Anvil /> },
    { value: "madera", label: "Madera", icon: <TreeDeciduous /> },
    { value: "mezclados", label: "Mezclados", icon: <TrendingUpDown /> },
    { value: "peligrosos", label: "Peligrosos", icon: <TriangleAlert /> },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ padding: 6, marginTop: 6, borderRadius: 3 }}>
        <Typography variant="h3" gutterBottom>
          Editar Punto Limpio
        </Typography>
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
              <Step key={index}><StepLabel>{label}</StepLabel></Step>
            ))}
          </Stepper>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {activeStep === 1 && (
                <Grid item xs={12}>
                  <Typography variant="h6">Materiales y Cantidades</Typography>
                  <Grid container spacing={2}>
                    {materialTypes.map((material) => (
                      <Grid item xs={12} sm={6} key={material.value}>
                        <Box display="flex" alignItems="center">
                          <IconButton>{material.icon}</IconButton>
                          <Typography sx={{ marginLeft: 1 }}>{material.label}</Typography>
                        </Box>
                        <TextField
                          label="Cantidad"
                          type="number"
                          value={formData.materiales[material.value] || ""}
                          onChange={(e) => handleMaterialQuantityChange(material.value, e.target.value)}
                          fullWidth
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}
            </Grid>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {activeStep !== 0 && <Grid item xs={6}><Button onClick={handleBack}>Atrás</Button></Grid>}
              {activeStep < steps.length - 1 && <Grid item xs={6} sx={{ textAlign: "right" }}><Button onClick={handleNext}>Siguiente</Button></Grid>}
              {activeStep === steps.length - 1 && <Grid item xs={6} sx={{ textAlign: "right" }}><Button type="submit" variant="contained" color="primary">Guardar Cambios</Button></Grid>}
            </Grid>
          </form>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default EditarPuntoLimpio;
