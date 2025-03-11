import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useFormStore } from "../context/FormContext";

const opcionesPlastico = ["Aplica", "No Aplica"];
const opcionesCheck = [
  "Acopio a granel",
  "En volqueta",
  "En bolson azul",
  "Poco accesible",
  "Vacío",
  "Lleno (Coordinar retiro)",
  "Se está reutilizando en obra",
  "Contiene residuos que no corresponden",
  "Otro",
];

const Page8 = () => {
  const { data, updateData } = useFormStore();
  const pageIndex = "page8";

  const defaultPage8 = {
    plastico: "No Aplica",
    plasticoOpciones: {},
    plasticoOtro: "",
    plasticoObservaciones: "",
  };

  const [formData, setFormData] = useState(data[pageIndex] || defaultPage8);

  useEffect(() => {
    if (!data[pageIndex] || Object.keys(data[pageIndex]).length === 0) {
      updateData(pageIndex, defaultPage8);
    }
  }, [data, pageIndex, updateData]);

  useEffect(() => {
    updateData(pageIndex, formData);
  }, [formData, pageIndex, updateData]);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleCheckboxChange = (option) => {
    setFormData((prevData) => {
      const updatedChecks = {
        ...prevData.plasticoOpciones,
        [option]: !prevData.plasticoOpciones[option],
      };
      return { ...prevData, plasticoOpciones: updatedChecks };
    });
  };

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Plástico
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Seleccione una opción</InputLabel>
        <Select
          value={formData.plastico}
          onChange={(e) => {
            const value = e.target.value;
            handleChange("plastico", value);
            if (value === "No Aplica") {
              handleChange("plasticoOpciones", {});
              handleChange("plasticoOtro", "");
              handleChange("plasticoObservaciones", "");
            }
          }}
        >
          {opcionesPlastico.map((op, index) => (
            <MenuItem key={index} value={op}>
              {op}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {formData.plastico === "Aplica" && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Estado del plástico
          </Typography>
          {isMobile ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {opcionesCheck.map((op, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={!!formData.plasticoOpciones[op]}
                      onChange={() => handleCheckboxChange(op)}
                    />
                  }
                  label={op}
                />
              ))}
            </Box>
          ) : (
            <FormGroup>
              {opcionesCheck.map((op, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={!!formData.plasticoOpciones[op]}
                      onChange={() => handleCheckboxChange(op)}
                    />
                  }
                  label={op}
                />
              ))}
            </FormGroup>
          )}

          {formData.plasticoOpciones["Otro"] && (
            <TextField
              label="Especificar otro"
              fullWidth
              sx={{ mt: 2 }}
              value={formData.plasticoOtro}
              onChange={(e) => handleChange("plasticoOtro", e.target.value)}
            />
          )}

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Plástico - Otras observaciones / Sugerencias / Acciones a tomar
          </Typography>
          <TextField
            label="Observaciones"
            fullWidth
            multiline
            rows={4}
            value={formData.plasticoObservaciones}
            onChange={(e) => handleChange("plasticoObservaciones", e.target.value)}
          />
        </>
      )}
    </Box>
  );
};

export default Page8;
