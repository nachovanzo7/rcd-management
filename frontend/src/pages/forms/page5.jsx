import React, { useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Grid,
  Checkbox,
  useMediaQuery,
  FormControlLabel,
  Box,
} from "@mui/material";
import { useFormStore } from "../context/FormContext";

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

const Page5 = () => {
  const { data, updateData } = useFormStore();

  const defaultPage5 = {
    grilla: titulosFilas.reduce((acc, fila) => {
      acc[fila] = "";
      return acc;
    }, {}),
    acopioContenedores: "",
    observaciones: "",
  };

  const page5Data = data.page5 || defaultPage5;

  // Inicializa page5 en el estado global si aún no existe.
  useEffect(() => {
    if (!data.page5 || !data.page5.grilla) {
      updateData("page5", { ...defaultPage5, ...data.page5 });
    }
  }, [data.page5, updateData]);

  const handleDropdownChange = (event) => {
    updateData("page5", { ...page5Data, acopioContenedores: event.target.value });
  };

  const handleObservationChange = (event) => {
    updateData("page5", { ...page5Data, observaciones: event.target.value });
  };

  const handleCheckboxChange = (fila, colIndex) => {
    updateData("page5", {
      ...page5Data,
      grilla: {
        ...page5Data.grilla,
        [fila]: titulosColumnas[colIndex],
      },
    });
  };

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <div>
      <FormControl fullWidth margin="normal">
        <InputLabel>
          Lugar de acopio de contenedores llenos para su traspaso al camión de retiro
        </InputLabel>
        <Select
          value={page5Data.acopioContenedores || ""}
          onChange={handleDropdownChange}
        >
          <MenuItem value="Si hay">Si hay</MenuItem>
          <MenuItem value="No hay">No hay</MenuItem>
        </Select>
      </FormControl>

      {page5Data.acopioContenedores === "Si hay" && (
        <>
          <Typography variant="h6" sx={{ mt: 3 }}>
            ¿Cómo se encuentra el Punto de Acopio?
          </Typography>
          {!isMobile ? (
            <Grid container spacing={1} sx={{ mt: 2 }}>
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
                    xs={2.25}
                    key={index}
                    sx={{ textAlign: "center", fontWeight: "bold", p: 1 }}
                  >
                    {titulo}
                  </Grid>
                ))}
              </Grid>
              {titulosFilas.map((fila) => (
                <Grid container item key={fila} alignItems="center">
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
                        checked={page5Data.grilla?.[fila] === titulosColumnas[colIndex]}
                        onChange={() => handleCheckboxChange(fila, colIndex)}
                      />
                    </Grid>
                  ))}
                </Grid>
              ))}
            </Grid>
          ) : (
            titulosFilas.map((fila) => (
              <Box
                key={fila}
                sx={{
                  border: "1px solid gray",
                  borderRadius: 1,
                  p: 1,
                  mb: 1,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                  {fila}
                </Typography>
                {titulosColumnas.map((opcion, colIndex) => (
                  <FormControlLabel
                    key={colIndex}
                    control={
                      <Checkbox
                        checked={page5Data.grilla?.[fila] === opcion}
                        onChange={() => handleCheckboxChange(fila, colIndex)}
                      />
                    }
                    label={opcion}
                  />
                ))}
              </Box>
            ))
          )}

          <TextField
            label="Punto de Acopio - Observaciones / Sugerencias / Acciones a tomar"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={page5Data.observaciones || ""}
            onChange={handleObservationChange}
          />
        </>
      )}
    </div>
  );
};

export default Page5;
