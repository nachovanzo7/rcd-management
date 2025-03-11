import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
  Paper,
  Checkbox,
  TextField,
  useMediaQuery,
  FormControlLabel,
} from "@mui/material";
import { useFormStore } from "../context/FormContext";

const opcionesPuntoLimpio = ["Si hay", "No hay"];
const titulosColumnas = [
  "Correcta",
  "A mejorar (Con observaciones)",
  "Incorrecta",
  "No aplica",
];
const titulosFilas = [
  "Ubicación",
  "Estructura",
  "Tipo de Contenedor",
  "Estado Contenedores (bolsones, etc)",
  "Señalética",
];

const Page4 = () => {
  const { data, updateData } = useFormStore();
  const pageIndex = "page4";

  const storedData = data[pageIndex] || {};
  const [formData, setFormData] = useState({
    puntosLimpiosEdificio: storedData.puntosLimpiosEdificio || "",
    grillaPuntosLimpiosPisos: storedData.grillaPuntosLimpiosPisos || {},
    puntosLimpiosEdificioObservaciones:
      storedData.puntosLimpiosEdificioObservaciones || "",
  });

  const grillaVisiblePage3 = data.page3?.grillaVisible || [];
  const puntosLimpiosPage3 = data.page3?.puntosLimpiosList || [];
  const puntosParaPage4 = puntosLimpiosPage3.filter(
    (_, index) => !grillaVisiblePage3[index]
  );

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    updateData(pageIndex, updated);
  };

  const handleGridCheckboxChange = (row, col) => {
    const newValue = titulosColumnas[col];
    setFormData((prevState) => {
      const updatedGrid = {
        ...prevState.grillaPuntosLimpiosPisos,
        [row]: newValue,
      };
      const updated = { ...prevState, grillaPuntosLimpiosPisos: updatedGrid };
      updateData(pageIndex, updated);
      return updated;
    });
  };

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Puntos limpios por pisos en edificio (complementarios)
      </Typography>
      
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Punto limpio por pisos</InputLabel>
        <Select
          value={formData.puntosLimpiosEdificio}
          onChange={(e) => {
            if (e.target.value === "No hay") {
              handleChange("grillaPuntosLimpiosPisos", {});
              handleChange("puntosLimpiosEdificioObservaciones", "");
            }
            handleChange("puntosLimpiosEdificio", e.target.value);
          }}
        >
          {opcionesPuntoLimpio.map((op, index) => (
            <MenuItem key={index} value={op}>
              {op}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {formData.puntosLimpiosEdificio === "Si hay" && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            ¿Cómo se encuentran estos puntos limpios?
          </Typography>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
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
                  {titulosColumnas.map((titulo, colIndex) => (
                    <Grid
                      item
                      xs={2.25}
                      key={colIndex}
                      sx={{
                        textAlign: "center",
                        fontWeight: "bold",
                        p: 1,
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
                      }}
                    >
                      {fila}
                    </Grid>
                    {titulosColumnas.map((_, colIndex) => (
                      <Grid
                        item
                        xs={2.25}
                        key={colIndex}
                        sx={{ textAlign: "center", p: 1 }}
                      >
                        <Checkbox
                          checked={
                            formData.grillaPuntosLimpiosPisos[fila] ===
                            titulosColumnas[colIndex]
                          }
                          onChange={() =>
                            handleGridCheckboxChange(fila, colIndex)
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
                          checked={
                            formData.grillaPuntosLimpiosPisos[fila] === opcion
                          }
                          onChange={() =>
                            handleGridCheckboxChange(fila, colIndex)
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

          <Typography variant="h6" sx={{ mt: 2 }}>
            Puntos limpios intermedios / por pisos - Otras observaciones
          </Typography>
          <TextField
            label="Observaciones"
            fullWidth
            multiline
            rows={4}
            value={formData.puntosLimpiosEdificioObservaciones}
            onChange={(e) =>
              handleChange("puntosLimpiosEdificioObservaciones", e.target.value)
            }
          />
        </>
      )}
    </Box>
  );
};

export default Page4;
