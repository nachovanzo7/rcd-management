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

const opcionesPapelCarton = [
  "Vacio (no se ha clasificado o no se está generando)",
  "Lleno (cambiar contenedor, trasladar a punto de acopio, coordinar retiro)",
  "Falta proteccion intemperie",
  "Contiene residuos que no corresponden",
  "Sucio y/o contaminado",
  "Poca compactacion",
  "Poco accesible",
  "No está implementada la fracción",
  "Otro",
];

const Page9 = () => {
  const { data, updateData } = useFormStore();
  const pageIndex = "page9";

  const storedData = data[pageIndex] || {};
  const formData = {
    papelCarton: storedData.papelCarton ?? "No Aplica",
    papelCartonOpciones: storedData.papelCartonOpciones ?? [],
    papelCartonObservaciones: storedData.papelCartonObservaciones ?? "",
    papelCartonOtro: storedData.papelCartonOtro ?? "",
  };

  const handleChange = (field, value) => {
    updateData(pageIndex, { ...formData, [field]: value });
  };

  const handleCheckboxChange = (option) => {
    const newOpciones = formData.papelCartonOpciones.includes(option)
      ? formData.papelCartonOpciones.filter((item) => item !== option)
      : [...formData.papelCartonOpciones, option];
    handleChange("papelCartonOpciones", newOpciones);
  };

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Papel y Cartón
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Seleccionar</InputLabel>
        <Select
          value={formData.papelCarton}
          onChange={(e) => handleChange("papelCarton", e.target.value)}
        >
          <MenuItem value="Aplica">Aplica</MenuItem>
          <MenuItem value="No aplica">No aplica</MenuItem>
        </Select>
      </FormControl>

      {formData.papelCarton === "Aplica" && (
        <>
          <Box sx={{ mb: 3 }}>
            {isMobile ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {opcionesPapelCarton.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={formData.papelCartonOpciones.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                      />
                    }
                    label={option}
                  />
                ))}
              </Box>
            ) : (
              <FormGroup>
                {opcionesPapelCarton.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={formData.papelCartonOpciones.includes(option)}
                        onChange={() => handleCheckboxChange(option)}
                      />
                    }
                    label={option}
                  />
                ))}
              </FormGroup>
            )}

            {formData.papelCartonOpciones.includes("Otro") && (
              <TextField
                label="Especificar Otro"
                fullWidth
                sx={{ mt: 2 }}
                value={formData.papelCartonOtro}
                onChange={(e) => handleChange("papelCartonOtro", e.target.value)}
              />
            )}
          </Box>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Papel y Cartón - Otras observaciones / Sugerencias / Acciones a tomar
          </Typography>
          <TextField
            label="Observaciones"
            fullWidth
            multiline
            rows={4}
            value={formData.papelCartonObservaciones}
            onChange={(e) =>
              handleChange("papelCartonObservaciones", e.target.value)
            }
          />
        </>
      )}
    </Box>
  );
};

export default Page9;
