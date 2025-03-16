import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Button,
} from "@mui/material";

const gridFields = [
  "grillaPuntosLimpiosPisos",
  "grilla",
  "escombro_checks",
  "plastico_opciones",
  "papel_carton_opciones",
  "metales_opciones",
  "madera_opciones",
  "mezclados_opciones",
  "puntoAcopioGrid",
  "puntoAcopioOpciones",
  "punto_limpio_grid", // Este campo agrupa los datos de Punto Limpio
];

const baseColor = "#abbf9d";
const simplePaperBackground = "#e8f0e2";
const gridPaperBackground = "#d0e1cf";
const arrayPaperBackground = "#c2d4bb";
const textColor = "#000";

const fieldTitleMap = {
  obra_nombre: "Nombre de la Obra",
  tecnico_nombre: "Responsable Técnico",
  fecha: "Fecha Realizado",
  motivo_de_visita: "Motivo de Visita",
  otro_motivo: "Otro Motivo",
  participante_jornal_ambiental: "Jornal Ambiental",
  participante_operario: "Operarios",
  participante_oficina_tecnica: "Oficina Técnica",
  participante_observaciones: "Observaciones de Participantes",
  limpieza_general_en_terreno: "Limpieza General en Terreno",
  limpieza_general_en_pisos: "Limpieza General en Pisos",
  limpieza_general_observaciones: "Observaciones de Limpieza",
  logistica_de_obra: "Logística de Obra",
  logistica_de_obra_observaciones: "Observaciones de Logística",
  punto_limpio: "Punto Limpio",
  punto_limpio_grid: "Datos de Punto Limpio",
  acopioContenedores: "Punto de Acopio - Contenedores Llenos",
  grilla: "Observaciones de Punto Acopio",
  acciones_tomadas: "Acciones Tomadas",
  otras_observaciones: "Otras Observaciones",
  escombro_limpio: "Escombro Limpio",
  escombro_checks: "Estado de Escombro Limpio",
  escombro_otro_texto: "Otro Estado - Escombro Limpio",
  escombro_observaciones: "Observaciones - Escombro Limpio",
  plastico: "Plástico",
  plastico_opciones: "Estado de Plástico",
  plastico_otro: "Otro Estado - Plástico",
  plastico_observaciones: "Observaciones - Plástico",
  papel_carton: "Papel y Cartón",
  papel_carton_opciones: "Estado de Papel y Cartón",
  papel_carton_otro: "Otro Estado - Papel y Cartón",
  papel_carton_observaciones: "Observaciones - Papel y Cartón",
  metales: "Metales",
  metales_opciones: "Estado de Metales",
  metales_otro_texto: "Otro Estado - Metales",
  metales_observaciones: "Observaciones - Metales",
  madera: "Madera",
  madera_opciones: "Estado de Madera",
  madera_otro: "Otro Estado - Madera",
  madera_observaciones: "Observaciones - Madera",
  mezclados: "Mezclados",
  gridSelection: "Estado de Materiales Mezclados",
  mezclados_opciones: "Estado de Mezclados",
  mezclados_otro: "Otro Estado - Mezclados",
  mezclados_observaciones: "Observaciones - Mezclados",
  puntoAcopio: "Punto Acopio - Materiales Peligrosos",
  puntoAcopioGrid: "Observaciones de Materiales Peligrosos",
  puntoAcopioOpciones: "Estado de Materiales Peligrosos",
  puntoAcopioOtro: "Otro Estado - Materiales Peligrosos",
  puntoAcopioObservaciones: "Observaciones - Materiales Peligrosos",
};

const displayFieldName = (key) => {
  if (fieldTitleMap[key]) {
    return fieldTitleMap[key];
  }
  return key
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Función auxiliar: si el valor es "no hay" o "no aplica", retorna true.
const isNoHayOrNoAplica = (value) => {
  if (typeof value !== "string") return false;
  const lower = value.trim().toLowerCase();
  return lower === "no hay" || lower === "no aplica";
};

// Renderiza un campo simple en Paper. 
// Si el valor es vacío, no se renderiza. 
// Si el valor es "No hay" o "No aplica", se aplica fondo naranja.
const renderSimpleField = (label, value, fieldKey) => {
  if (typeof value === "string" && value.trim() === "") {
    return null;
  }
  let backgroundColor = simplePaperBackground;
  if (isNoHayOrNoAplica(value)) {
    backgroundColor = "#ffecb3";
  }
  return (
    <Paper sx={{ p: 2, backgroundColor, mb: 2 }} key={fieldKey}>
      <Typography variant="h6" sx={{ color: textColor }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: textColor }}>
        {value}
      </Typography>
    </Paper>
  );
};

const renderGridField = (label, value, fieldKey) => {
  if (fieldKey === "grilla" && !hasMeaningfulDataInObject(value)) {
    return null;
  }
  return (
    <Paper sx={{ p: 2, backgroundColor: gridPaperBackground, mb: 2 }} key={fieldKey}>
      <Typography variant="h6" sx={{ mb: 1, color: textColor }}>
        {label}
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(value).map(([subKey, subValue]) => (
          <Grid item xs={6} key={subKey}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: textColor }}>
              {subKey}
            </Typography>
            <Typography variant="body2" sx={{ color: textColor }}>
              {isNoHayOrNoAplica(subValue) ? <span style={{ color: "orange" }}>{subValue}</span> : subValue}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

const renderArrayField = (label, value, fieldKey) => (
  <Paper sx={{ p: 2, backgroundColor: arrayPaperBackground, mb: 2 }} key={fieldKey}>
    <Typography variant="h6" sx={{ mb: 1, color: textColor }}>
      {label}
    </Typography>
    <Grid container spacing={2}>
      {value.map((item, index) => (
        <Grid item xs={12} key={index}>
          <Typography variant="body2" sx={{ color: isNoHayOrNoAplica(item) ? "orange" : textColor }}>
            {item}
          </Typography>
        </Grid>
      ))}
    </Grid>
  </Paper>
);

// Determina si un objeto (grid) tiene al menos un valor significativo.
const hasMeaningfulDataInObject = (obj) => {
  if (!obj || typeof obj !== "object") return false;
  return Object.values(obj).some((v) => {
    if (typeof v !== "string") return true;
    const lower = v.trim().toLowerCase();
    return lower !== "" && lower !== "no hay" && lower !== "no aplica";
  });
};

const hasData = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0)
    return false;
  return true;
};

const DetallesFormulario = () => {
  const { pk } = useParams();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch(`${API_URL}/api/formularios/detalle/${pk}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al cargar el formulario");
        }
        return res.json();
      })
      .then((data) => {
        // Agrupar datos de punto limpio en "punto_limpio_grid" si corresponde
        if (
          data &&
          data.punto_limpio === "Hay" &&
          (data.punto_limpio_ubicacion ||
            data.punto_limpio_estructura ||
            data.punto_limpio_tipo_contenedor ||
            data.punto_limpio_estado_contenedor ||
            data.punto_limpio_señaletica ||
            data.punto_limpio_observaciones) &&
          !data.punto_limpio_grid
        ) {
          const puntoLimpioGrid = {
            "Ubicación de Punto Limpio": data.punto_limpio_ubicacion || "",
            "Estructura de Punto Limpio": data.punto_limpio_estructura || "",
            "Tipo de Contenedor - Punto Limpio": data.punto_limpio_tipo_contenedor || "",
            "Estado de Contenedor - Punto Limpio": data.punto_limpio_estado_contenedor || "",
            "Señaletica - Punto Limpio": data.punto_limpio_señaletica || "",
            "Observaciones - Punto Limpio": data.punto_limpio_observaciones || "",
          };
          data.punto_limpio_grid = puntoLimpioGrid;
          delete data.punto_limpio_ubicacion;
          delete data.punto_limpio_estructura;
          delete data.punto_limpio_tipo_contenedor;
          delete data.punto_limpio_estado_contenedor;
          delete data.punto_limpio_señaletica;
          delete data.punto_limpio_observaciones;
        }
        setFormulario(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [pk]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" sx={{ textAlign: "center", mt: 4 }}>
        {error}
      </Typography>
    );
  }

  if (!formulario) {
    return (
      <Typography variant="h6" color="error" sx={{ textAlign: "center", mt: 4 }}>
        Formulario no encontrado
      </Typography>
    );
  }

  const renderedComponents = [];
  const renderedKeys = new Set();
  const entries = Object.entries(formulario);

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    if (["id", "obra", "tecnico"].includes(key)) continue;
    if (!hasData(value)) continue;
    // Si es "puntoAcopioObservaciones" y el campo "puntoAcopio" es "No Aplica", omitirlo.
    if (
      key === "puntoAcopioObservaciones" &&
      formulario.puntoAcopio &&
      formulario.puntoAcopio.trim().toLowerCase() === "no aplica"
    ) {
      continue;
    }
    // Si es "puntoAcopioGrid" y es un arreglo vacío, omitirlo.
    if (
      key === "puntoAcopioGrid" &&
      Array.isArray(value) &&
      value.every(
        (item) => !item || (typeof item === "string" && item.trim() === "")
      )
    ) {
      continue;
    }
    // Si encontramos "punto_limpio", renderizamos ese campo y, de inmediato, inyectamos "punto_limpio_grid" si existe
    if (key === "punto_limpio") {
      renderedComponents.push(renderSimpleField(displayFieldName(key), value, key));
      renderedKeys.add(key);
      if (formulario.punto_limpio === "Hay" && hasData(formulario["punto_limpio_grid"])) {
        renderedComponents.push(
          renderGridField(displayFieldName("punto_limpio_grid"), formulario["punto_limpio_grid"], "punto_limpio_grid")
        );
        renderedKeys.add("punto_limpio_grid");
      }
      continue;
    }
    if (renderedKeys.has(key)) continue;
    if (gridFields.includes(key)) {
      if (Array.isArray(value)) {
        renderedComponents.push(renderArrayField(displayFieldName(key), value, key));
      } else if (typeof value === "object") {
        if (key === "grilla") {
          if (!hasMeaningfulDataInObject(value)) continue;
        }
        renderedComponents.push(renderGridField(displayFieldName(key), value, key));
      }
    } else if (typeof value === "object") {
      renderedComponents.push(renderGridField(displayFieldName(key), value, key));
    } else {
      renderedComponents.push(renderSimpleField(displayFieldName(key), value, key));
    }
    renderedKeys.add(key);
  }

  return (
    <Box sx={{ p: 2 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Volver
      </Button>
      <Typography variant="h4" sx={{ mb: 2, textAlign: "center", color: textColor }}>
        Detalles Del Formulario
      </Typography>
      <Box>{renderedComponents}</Box>
    </Box>
  );
};

export default DetallesFormulario;
