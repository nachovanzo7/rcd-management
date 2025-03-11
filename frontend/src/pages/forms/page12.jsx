import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Grid,
  Checkbox,
  FormControlLabel,
  Radio,
  TextField,
  FormGroup,
  useMediaQuery,
} from "@mui/material";
import { useFormStore } from "../context/FormContext";

const opcionesCheckbox = [
  "Presencia de materiales valorizables",
  "Se hizo retiro",
  "Contiene residuos peligrosos",
  "No se hizo retiro",
  "Otro",
];

const Page12 = () => {
  const { data, updateData } = useFormStore();
  const pageIndex = "page12";

  const defaultPage12 = {
    mezclados: "",
    gridSelection: null,
    mezcladosOpciones: [],
    mezcladosOtro: "",
    mezcladosObservaciones: "",
  };

  const storedData = data[pageIndex] || defaultPage12;
  const formData = {
    mezclados: storedData.mezclados ?? "No Aplica",
    gridSelection: storedData.gridSelection ?? null,
    mezcladosOpciones: storedData.mezcladosOpciones ?? [],
    mezcladosOtro: storedData.mezcladosOtro ?? "",
    mezcladosObservaciones: storedData.mezcladosObservaciones ?? "",
  };

  const handleChange = (field, value) => {
    updateData(pageIndex, { ...formData, [field]: value });
  };

  const handleCheckboxChange = (option) => {
    const newOpciones = formData.mezcladosOpciones.includes(option)
      ? formData.mezcladosOpciones.filter((item) => item !== option)
      : [...formData.mezcladosOpciones, option];
    handleChange("mezcladosOpciones", newOpciones);
  };

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Mezclados
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Seleccionar</InputLabel>
        <Select
          value={formData.mezclados}
          onChange={(e) => handleChange("mezclados", e.target.value)}
        >
          <MenuItem value="Aplica">Aplica</MenuItem>
          <MenuItem value="No aplica">No aplica</MenuItem>
        </Select>
      </FormControl>

      {formData.mezclados === "Aplica" && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Seleccione una opción:
          </Typography>
          {isMobile ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
              {["Correcto", "Aceptable (con observaciones)", "Incorrecto"].map(
                (titulo, index) => (
                  <Box key={index} sx={{ textAlign: "center" }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {titulo}
                    </Typography>
                    <Radio
                      checked={formData.gridSelection === titulo}
                      onChange={() => handleChange("gridSelection", titulo)}
                    />
                  </Box>
                )
              )}
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
              {["Correcto", "Aceptable (con observaciones)", "Incorrecto"].map(
                (titulo, index) => (
                  <Grid item xs={4} key={index} sx={{ textAlign: "center" }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {titulo}
                    </Typography>
                    <Radio
                      checked={formData.gridSelection === titulo}
                      onChange={() => handleChange("gridSelection", titulo)}
                    />
                  </Grid>
                )
              )}
            </Grid>
          )}

          {isMobile ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
              {opcionesCheckbox.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={formData.mezcladosOpciones.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                    />
                  }
                  label={option}
                />
              ))}
            </Box>
          ) : (
            <FormGroup sx={{ mb: 2 }}>
              {opcionesCheckbox.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={formData.mezcladosOpciones.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          )}

          {/* Si "Otro" está seleccionado, se muestra textbox para especificar */}
          {formData.mezcladosOpciones.includes("Otro") && (
            <TextField
              label="Especificar Otro"
              fullWidth
              sx={{ mt: 2, mb: 3 }}
              value={formData.mezcladosOtro}
              onChange={(e) => handleChange("mezcladosOtro", e.target.value)}
            />
          )}

          {/* Observaciones generales */}
          <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
            Mezclados - Otras observaciones / Sugerencias / Acciones a tomar
          </Typography>
          <TextField
            label="Observaciones"
            fullWidth
            multiline
            rows={4}
            value={formData.mezcladosObservaciones}
            onChange={(e) =>
              handleChange("mezcladosObservaciones", e.target.value)
            }
          />
        </>
      )}
    </Box>
  );
};

export default Page12;
