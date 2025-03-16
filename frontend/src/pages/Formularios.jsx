import React, { useState, Component } from "react";
import { Button, Box, Alert } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useFormStore } from "../pages/context/FormContext";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// Carga dinámica de las páginas del formulario
const pages = import.meta.glob("../pages/forms/*.jsx", { eager: true });

const pageComponents = Object.entries(pages)
  .sort(([a], [b]) => {
    const numA = parseInt(a.match(/\d+/)?.[0] || "0", 10);
    const numB = parseInt(b.match(/\d+/)?.[0] || "0", 10);
    return numA - numB;
  })
  .map(([, module]) => module.default);

// Componente ErrorBoundary para capturar errores en la renderización de cada página
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error.message || "Ocurrió un error inesperado." };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            Lo sentimos, ocurrió un error: {this.state.errorMessage}
          </Alert>
        </Box>
      );
    }
    return this.props.children;
  }
}

const Formularios = () => {
  const { data, updateData } = useFormStore();
  const [pageIndex, setPageIndex] = useState(0);
  const [globalError, setGlobalError] = useState("");
  const navigate = useNavigate();

  const CurrentPage = pageComponents[pageIndex];
  if (!CurrentPage) return <div>No se encontró la página</div>;

  // Función para transformar los datos del store al formato esperado por la API
  const transformData = (globalData) => {
    const page1Data = globalData["page1"] || {};
    const page2Data = globalData["page2"] || {};
    const page3Data = globalData["page3"] || {};
    const page4Data = globalData["page4"] || {};
    const page5Data = globalData["page5"] || {};
    const page6Data = globalData["page6"] || {};
    const page7Data = globalData["page7"] || {};
    const page8Data = globalData["page8"] || {};
    const page9Data = globalData["page9"] || {};
    const page10Data = globalData["page10"] || {};
    const page11Data = globalData["page11"] || {};
    const page12Data = globalData["page12"] || {};
    const page13Data = globalData["page13"] || {};

    // Para la página 3: si se selecciona "Hay", se extraen los datos de la grilla
    const puntoLimpioSeleccionado = page3Data.puntoLimpioSelect === "Hay";
    const grilla = Array.isArray(page3Data.grillaPuntosLimpios)
      ? page3Data.grillaPuntosLimpios
      : [];

    // Depuración: imprime los datos de Page1
    console.log("Datos de Page1:", page1Data);

    return {
      // Página 1: se asigna el id del técnico en el campo "tecnico" (no "tecnico_id")
      tecnico: page1Data.tecnico ? parseInt(page1Data.tecnico, 10) : null,
      obra: page1Data.obraId || page1Data.obra || "",
      fecha: page1Data.fecha ? dayjs(page1Data.fecha).format("YYYY-MM-DD") : "",
      motivo_de_visita: Array.isArray(page1Data.motivos)
        ? page1Data.motivos.join(", ")
        : page1Data.motivos || "",
      otro_motivo: page1Data.otroMotivo || "",

      // Página 2:
      logistica_de_obra: page2Data.logistica || "",
      logistica_de_obra_observaciones: page2Data.logisticaObservaciones || "",
      participante_jornal_ambiental: page2Data.participacion?.["Jornal Ambiental"] || "",
      participante_operario: page2Data.participacion?.["Operarios"] || "",
      participante_oficina_tecnica: page2Data.participacion?.["Oficina Técnica (jefe de obra, capataz, etc.)"] || "",
      participante_observaciones: page2Data.participantesObservaciones || "",
      limpieza_general_en_terreno: page2Data.limpieza?.["En terreno"] || "",
      limpieza_general_en_pisos: page2Data.limpieza?.["Por pisos"] || "",
      limpieza_general_observaciones: page2Data.limpiezaObservaciones || "",

      // Página 3 (Punto Limpio):
      punto_limpio: page3Data.puntoLimpioSelect || "No Hay",
      punto_limpio_ubicacion: puntoLimpioSeleccionado && grilla[0] ? grilla[0] : "",
      punto_limpio_estructura: puntoLimpioSeleccionado && grilla[1] ? grilla[1] : "",
      punto_limpio_tipo_contenedor: puntoLimpioSeleccionado && grilla[2] ? grilla[2] : "",
      punto_limpio_estado_contenedor: puntoLimpioSeleccionado && grilla[3] ? grilla[3] : "",
      punto_limpio_senaletica: puntoLimpioSeleccionado && grilla[4] ? grilla[4] : "",
      punto_limpio_observaciones: puntoLimpioSeleccionado ? (page3Data.puntoLimpioObservaciones || "") : "",

      // Página 4:
      puntos_limpios_por_pisos: page4Data.puntosLimpiosEdificio || "No hay",
      grillaPuntosLimpiosPisos: page4Data.grillaPuntosLimpiosPisos || {},
      punto_limpio_edificio_observaciones: page4Data.puntosLimpiosEdificioObservaciones || "",

      // Página 5:
      acopioContenedores: page5Data.acopioContenedores || "",
      grilla: page5Data.grilla || {},
      observaciones: page5Data.observaciones || "",

      // Página 6:
      acciones_tomadas: page6Data.accionesTomadas || "",
      otras_observaciones: page6Data.otrasObservaciones || "",

      // Página 7 (Escombro):
      escombro_limpio: page7Data.escombro || "No Aplica",
      escombro_checks: page7Data.escombroChecks || [],
      escombro_otro_texto: page7Data.escombroOtroTexto || "",
      escombro_observaciones: page7Data.escombroObservaciones || "",

      // Página 8 (Plástico):
      plastico: page8Data.plastico || "No Aplica",
      plastico_opciones: page8Data.plasticoOpciones || [],
      plastico_otro: page8Data.plasticoOtro || "",
      plastico_observaciones: page8Data.plasticoObservaciones || "",

      // Página 9 (Papel y Cartón):
      papel_y_carton: page9Data.papelCarton || "No Aplica",
      papel_carton_opciones: page9Data.papelCartonOpciones || [],
      papel_carton_otro: page9Data.papelCartonOtro || "",
      papel_carton_observaciones: page9Data.papelCartonObservaciones || "",

      // Página 10 (Metales):
      metales: page10Data.metales || "No Aplica",
      metales_opciones: page10Data.metalesOpciones || [],
      metales_otro_texto: page10Data.metalesOtroTexto || "",
      metales_observaciones: page10Data.metalesObservaciones || "",

      // Página 11 (Madera):
      madera: page11Data.madera || "No Aplica",
      madera_opciones: page11Data.maderaOpciones || [],
      madera_otro: page11Data.maderaOtro || "",
      madera_observaciones: page11Data.maderaObservaciones || "",

      // Página 12 (Mezclados):
      mezclados: page12Data.mezclados || "No Aplica",
      gridSelection: page12Data.gridSelection || {},
      mezclados_opciones: page12Data.mezcladosOpciones || [],
      mezclados_otro: page12Data.mezcladosOtro || "",
      mezclados_observaciones: page12Data.mezcladosObservaciones || "",

      // Página 13 (Punto Acopio):
      puntoAcopio: page13Data.puntoAcopio || "No Aplica",
      puntoAcopioGrid: page13Data.puntoAcopioGrid || [],
      puntoAcopioOpciones: page13Data.puntoAcopioOpciones || [],
      puntoAcopioOtro: page13Data.puntoAcopioOtro || "",
      puntoAcopioObservaciones: page13Data.puntoAcopioObservaciones || "No hay",
    };
  };

  const handleNext = async (values) => {
    const currentPageKey = `page${pageIndex + 1}`;
    updateData(currentPageKey, values);

    if (pageIndex < pageComponents.length - 1) {
      setPageIndex(pageIndex + 1);
    } else {
      const allData = useFormStore.getState().data;
      const finalData = transformData(allData);

      // Depuración: muestra el valor del técnico y el payload final
      console.log("Datos de Page1 transformados:", allData["page1"]);
      console.log("Payload final a enviar:", finalData);

      if (!finalData.tecnico) {
        setGlobalError("No se ha seleccionado un técnico. Por favor, verifica tus datos.");
        return;
      }
      if (
        !finalData.fecha ||
        finalData.fecha.trim() === "" ||
        !finalData.motivo_de_visita ||
        finalData.motivo_de_visita.trim() === ""
      ) {
        setGlobalError("La fecha y el motivo de la visita son campos obligatorios.");
        return;
      }
      if (!finalData.obra) {
        console.error("No se encontró un ID de obra en los datos.");
        setGlobalError("No se encontró una obra seleccionada. Por favor, verifica tus datos.");
        return;
      }

      const token = sessionStorage.getItem("token");
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';


      try {
        const response = await fetch(`${API_URL}/api/formularios/crear/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify(finalData),
        });

        const responseData = await response.json();

        if (!response.ok) {
          console.error("Error en la respuesta:", responseData);
          throw new Error("Error al guardar el formulario");
        }

        console.log("Registro creado:", responseData);
        useFormStore.setState({ data: {} });
        navigate("/");
      } catch (error) {
        console.error("Error al guardar el formulario:", error);
        setGlobalError("Ocurrió un error al guardar el formulario. Por favor, inténtalo nuevamente más tarde.");
      }
    }
  };

  const handlePrev = () => {
    if (pageIndex === 0) {
      navigate("/obraslist");
    } else {
      setPageIndex(pageIndex - 1);
    }
  };

  return (
    <Box sx={{ width: "100%", textAlign: "center", mt: 4 }}>
      {globalError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {globalError}
        </Alert>
      )}
      <ErrorBoundary>
        <CurrentPage
          saveData={handleNext}
          defaultValues={useFormStore.getState().data[`page${pageIndex + 1}`] || {}}
        />
      </ErrorBoundary>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button variant="contained" color="success" startIcon={<ArrowBack />} onClick={handlePrev}>
          Anterior
        </Button>
        <Button variant="contained" color="success" endIcon={<ArrowForward />} onClick={() => handleNext({})}>
          {pageIndex === pageComponents.length - 1 ? "Guardar Formulario" : "Siguiente"}
        </Button>
      </Box>
    </Box>
  );
};

export default Formularios;
