import React from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  FormGroup,
  useMediaQuery,
} from "@mui/material";
import { useFormStore } from "../context/FormContext";

const opcionesMetales = [
  "A granel",
  "En cajon prefabricado",
  "Se reutiliza en obra",
  "Mucha cantidad (coordinar retiro)",
  "Poco accesible",
  "Otro",
];

const Page10 = () => {
  const { data, updateData } = useFormStore();
  const pageIndex = "page10";

  const storedData = data[pageIndex] || {};
  const formData = {
    metales: storedData.metales ?? "No Aplica",
    metalesOpciones: storedData.metalesOpciones ?? [],
    metalesOtroTexto: storedData.metalesOtroTexto ?? "",
    metalesObservaciones: storedData.metalesObservaciones ?? "",
  };

  const handleChange = (field, value) => {
    updateData(pageIndex, { ...formData, [field]: value });
  };

  const handleCheckboxChange = (option) => {
    const newOpciones = formData.metalesOpciones.includes(option)
      ? formData.metalesOpciones.filter((item) => item !== option)
      : [...formData.metalesOpciones, option];
    handleChange("metalesOpciones", newOpciones);
  };

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Metales
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Seleccionar</InputLabel>
        <Select
          value={formData.metales}
          onChange={(e) => handleChange("metales", e.target.value)}
        >
          <MenuItem value="Aplica">Aplica</MenuItem>
          <MenuItem value="No aplica">No aplica</MenuItem>
        </Select>
      </FormControl>

      {formData.metales === "Aplica" && (
        <>
          {isMobile ? (
            <Box sx={{ mb: 3, display: "flex", flexDirection: "column", gap: 1 }}>
              {opcionesMetales.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={formData.metalesOpciones.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                    />
                  }
                  label={option}
                />
              ))}
            </Box>
          ) : (
            <FormGroup sx={{ mb: 3 }}>
              {opcionesMetales.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={formData.metalesOpciones.includes(option)}
                      onChange={() => handleCheckboxChange(option)}
                    />
                  }
                  label={option}
                />
              ))}
            </FormGroup>
          )}

          {formData.metalesOpciones.includes("Otro") && (
            <TextField
              label="Especificar otro"
              fullWidth
              sx={{ mt: 2, mb: 3 }}
              value={formData.metalesOtroTexto}
              onChange={(e) => handleChange("metalesOtroTexto", e.target.value)}
            />
          )}

          <Typography variant="h6" sx={{ mb: 2 }}>
            Metales - Otras observaciones / Sugerencias / Acciones a tomar
          </Typography>
          <TextField
            label="Observaciones"
            fullWidth
            multiline
            rows={4}
            value={formData.metalesObservaciones}
            onChange={(e) => handleChange("metalesObservaciones", e.target.value)}
          />
        </>
      )}
    </Box>
  );
};

export default Page10;
