import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Checkbox,
  CircularProgress,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel
} from "@mui/material";
import { useFormStore } from "../context/FormContext";

const titulosColumnas = [
  "Correcta",
  "A mejorar (Con observaciones)",
  "Incorrecta",
  "No aplica"
];
const titulosFilas = [
  "Ubicacion",
  "Estructura",
  "Tipo de Contenedor",
  "Estado de Contenedores (bolsones, etc)",
  "Señalética"
];

const Page3 = () => {
  const { data, updateData } = useFormStore();
  const pageIndex = "page3";

  const [puntoLimpioSelect, setPuntoLimpioSelect] = useState(
    data[pageIndex]?.puntoLimpioSelect || "No Hay"
  );

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    grillaPuntosLimpios:
      data[pageIndex]?.grillaPuntosLimpios ||
      Array(titulosFilas.length).fill(""),
    puntoLimpioObservaciones: data[pageIndex]?.puntoLimpioObservaciones || ""
  });

  const handlePuntoLimpioSelect = (e) => {
    setPuntoLimpioSelect(e.target.value);
    if (e.target.value === "No Hay") {
      setFormData({
        grillaPuntosLimpios: Array(titulosFilas.length).fill(""),
        puntoLimpioObservaciones: ""
      });
    }
  };

  const handleCheckboxChange = (filaIndex, colIndex) => {
    const newGrilla = [...formData.grillaPuntosLimpios];
    newGrilla[filaIndex] = titulosColumnas[colIndex]; // Guarda la opción seleccionada
    setFormData({ ...formData, grillaPuntosLimpios: newGrilla });
  };

  const handleObservationChange = (e) => {
    setFormData({ ...formData, puntoLimpioObservaciones: e.target.value });
  };

  useEffect(() => {
    updateData(pageIndex, {
      ...formData,
      puntoLimpioSelect
    });
  }, [formData, puntoLimpioSelect]);

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Evaluación General de los Puntos Limpios
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            ¿Hay punto limpio?
          </Typography>
          <FormControl sx={{ mb: 2, minWidth: 200 }}>
            <InputLabel id="puntoLimpioSelect-label">Punto Limpio</InputLabel>
            <Select
              labelId="puntoLimpioSelect-label"
              id="puntoLimpioSelect"
              value={puntoLimpioSelect}
              label="Punto Limpio"
              onChange={handlePuntoLimpioSelect}
            >
              <MenuItem value="Hay">Hay</MenuItem>
              <MenuItem value="No Hay">No Hay</MenuItem>
            </Select>
          </FormControl>

          {puntoLimpioSelect === "Hay" && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Estado General de los Puntos Limpios
              </Typography>
              <Paper elevation={3} sx={{ p: 2 }}>
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
                        sx={{ textAlign: "center", fontWeight: "bold", p: 1 }}
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
                        sx={{ fontWeight: "bold", textAlign: "center", p: 1 }}
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
                              formData.grillaPuntosLimpios[rowIndex] ===
                              titulosColumnas[colIndex]
                            }
                            onChange={() =>
                              handleCheckboxChange(rowIndex, colIndex)
                            }
                          />
                        </Grid>
                      ))}
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              <Typography variant="h6" sx={{ mt: 2 }}>
                Observaciones Generales
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={formData.puntoLimpioObservaciones}
                onChange={handleObservationChange}
              />
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default Page3;
