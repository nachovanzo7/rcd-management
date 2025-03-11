import React from "react";
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Typography,
  Grid,
  Paper,
  useMediaQuery,
} from "@mui/material";
import { useFormStore } from "../context/FormContext";

const opcionesLogistica = [
  "Correcta",
  "Aceptable (con observaciones)",
  "Incorrecta",
  "Otro",
];
const titulosColumnas = [
  "Participa Activamente",
  "Participa (puede mejorar)",
  "Poca Participación",
  "Falta Mayor Capacitación",
  "No Participan",
  "No hay",
];
const titulosFilas = [
  "Jornal Ambiental",
  "Operarios",
  "Oficina Técnica (jefe de obra, capataz, etc.)",
];
const titulosLimpiezaColumnas = [
  "Correcta",
  "Aceptable (con observaciones)",
  "Incorrecta",
  "No aplica",
];
const titulosLimpiezaFilas = ["En terreno", "Por pisos"];

const Page2 = () => {
  const { data, updateData } = useFormStore();
  const pageIndex = "page2";

  const defaultFormData = {
    logistica: "",
    logisticaObservaciones: "",
    logisticaEspecificar: "",
    participantesObservaciones: "",
    limpiezaObservaciones: "",
    participacion: {},
    limpieza: {},
  };

  const formData = { ...defaultFormData, ...data[pageIndex] };

  const handleChange = (field, value) => {
    updateData(pageIndex, { ...formData, [field]: value });
  };

  const handleCheckboxChange = (field, row, col, columns) => {
    handleChange(field, {
      ...formData[field],
      [row]: columns[col],
    });
  };

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      <h2>Formulario Técnico - Página 2</h2>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Participantes de Obra
      </Typography>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        {!isMobile ? (
          <Grid container spacing={1}>
            <Grid container item>
              <Grid
                item
                xs={3}
                sx={{ fontWeight: "bold", textAlign: "center", p: 1 }}
              >
                -
              </Grid>
              {titulosColumnas.map((titulo, index) => (
                <Grid
                  item
                  xs={1.5}
                  key={index}
                  sx={{
                    textAlign: "center",
                    borderBottom: "1px solid gray",
                    p: 1,
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                  }}
                >
                  {titulo}
                </Grid>
              ))}
            </Grid>
            {titulosFilas.map((fila, rowIndex) => (
              <Grid container item key={rowIndex} alignItems="center">
                <Grid
                  item
                  xs={3}
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    p: 1,
                    borderRight: "1px solid gray",
                  }}
                >
                  {fila}
                </Grid>
                {titulosColumnas.map((_, colIndex) => (
                  <Grid
                    item
                    xs={1.5}
                    key={colIndex}
                    sx={{ textAlign: "center", p: 1 }}
                  >
                    <Checkbox
                      checked={
                        formData.participacion[fila] ===
                        titulosColumnas[colIndex]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          "participacion",
                          fila,
                          colIndex,
                          titulosColumnas
                        )
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            ))}
          </Grid>
        ) : (
          titulosFilas.map((fila, rowIndex) => (
            <Box
              key={rowIndex}
              sx={{
                border: "1px solid gray",
                borderRadius: 1,
                p: 1,
                mb: 1,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                {fila}
              </Typography>
              {titulosColumnas.map((opcion, colIndex) => (
                <FormControlLabel
                  key={colIndex}
                  control={
                    <Checkbox
                      checked={formData.participacion[fila] === opcion}
                      onChange={() =>
                        handleCheckboxChange(
                          "participacion",
                          fila,
                          colIndex,
                          titulosColumnas
                        )
                      }
                    />
                  }
                  label={opcion}
                />
              ))}
            </Box>
          ))
        )}
      </Paper>
      <TextField
        label="Participantes de obra - Observaciones"
        fullWidth
        sx={{ mt: 2, mb: 2 }}
        value={formData.participantesObservaciones}
        onChange={(e) =>
          handleChange("participantesObservaciones", e.target.value)
        }
      />

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Limpieza General de Obra
      </Typography>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        {!isMobile ? (
          <Grid container spacing={1}>
            <Grid container item>
              <Grid
                item
                xs={3}
                sx={{ fontWeight: "bold", textAlign: "center", p: 1 }}
              >
                -
              </Grid>
              {titulosLimpiezaColumnas.map((titulo, index) => (
                <Grid
                  item
                  xs={1.8}
                  key={index}
                  sx={{
                    textAlign: "center",
                    borderBottom: "1px solid gray",
                    p: 1,
                    fontSize: "0.85rem",
                    fontWeight: "bold",
                  }}
                >
                  {titulo}
                </Grid>
              ))}
            </Grid>
            {titulosLimpiezaFilas.map((fila, rowIndex) => (
              <Grid container item key={rowIndex} alignItems="center">
                <Grid
                  item
                  xs={3}
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    p: 1,
                    borderRight: "1px solid gray",
                  }}
                >
                  {fila}
                </Grid>
                {titulosLimpiezaColumnas.map((_, colIndex) => (
                  <Grid
                    item
                    xs={1.8}
                    key={colIndex}
                    sx={{ textAlign: "center", p: 1 }}
                  >
                    <Checkbox
                      checked={
                        formData.limpieza[fila] ===
                        titulosLimpiezaColumnas[colIndex]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          "limpieza",
                          fila,
                          colIndex,
                          titulosLimpiezaColumnas
                        )
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            ))}
          </Grid>
        ) : (
          titulosLimpiezaFilas.map((fila, rowIndex) => (
            <Box
              key={rowIndex}
              sx={{
                border: "1px solid gray",
                borderRadius: 1,
                p: 1,
                mb: 1,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", mb: 1 }}
              >
                {fila}
              </Typography>
              {titulosLimpiezaColumnas.map((opcion, colIndex) => (
                <FormControlLabel
                  key={colIndex}
                  control={
                    <Checkbox
                      checked={formData.limpieza[fila] === opcion}
                      onChange={() =>
                        handleCheckboxChange(
                          "limpieza",
                          fila,
                          colIndex,
                          titulosLimpiezaColumnas
                        )
                      }
                    />
                  }
                  label={opcion}
                />
              ))}
            </Box>
          ))
        )}
      </Paper>
      <TextField
        label="Limpieza General - Observaciones"
        fullWidth
        sx={{ mt: 2, mb: 2 }}
        value={formData.limpiezaObservaciones}
        onChange={(e) =>
          handleChange("limpiezaObservaciones", e.target.value)
        }
      />

      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Logística de Obra
      </Typography>
      {opcionesLogistica.map((op, index) => (
        <FormControlLabel
          key={index}
          control={
            <Checkbox
              checked={formData.logistica === op}
              onChange={() => handleChange("logistica", op)}
            />
          }
          label={op}
        />
      ))}
      {formData.logistica === "Otro" && (
        <TextField
          label="Especificar"
          fullWidth
          sx={{ mt: 2, mb: 2 }}
          value={formData.logisticaEspecificar}
          onChange={(e) =>
            handleChange("logisticaEspecificar", e.target.value)
          }
        />
      )}
      <TextField
        label="Logística de obra - Observaciones"
        fullWidth
        sx={{ mt: 2, mb: 2 }}
        value={formData.logisticaObservaciones}
        onChange={(e) =>
          handleChange("logisticaObservaciones", e.target.value)
        }
      />
    </Box>
  );
};

export default Page2;
