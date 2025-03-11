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

const opcionesEscombro = ["Aplica", "No Aplica"];
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

const Page7 = () => {
  const { data, updateData } = useFormStore();
  const pageIndex = "page7";

  const defaultPage7 = {
    escombro: "",
    escombroChecks: {},
    escombroOtroTexto: "",
    escombroObservaciones: "",
  };

  const [formData, setFormData] = useState(data[pageIndex] || defaultPage7);

  useEffect(() => {
    if (!data[pageIndex] || Object.keys(data[pageIndex]).length === 0) {
      updateData(pageIndex, defaultPage7);
    }
  }, [data, pageIndex, updateData]);

  useEffect(() => {
    updateData(pageIndex, formData);
  }, [formData, pageIndex, updateData]);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (option) => {
    setFormData((prevData) => {
      const updatedChecks = {
        ...prevData.escombroChecks,
        [option]: !prevData.escombroChecks[option],
      };
      return { ...prevData, escombroChecks: updatedChecks };
    });
  };

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Escombro Limpio
      </Typography>
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Seleccione una opción</InputLabel>
        <Select
          value={formData.escombro}
          onChange={(e) => {
            const value = e.target.value;
            handleChange("escombro", value);
            if (value === "No Aplica") {
              handleChange("escombroChecks", {});
              handleChange("escombroOtroTexto", "");
              handleChange("escombroObservaciones", "");
            }
          }}
        >
          {opcionesEscombro.map((op, index) => (
            <MenuItem key={index} value={op}>
              {op}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {formData.escombro === "Aplica" && (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Estado del escombro
          </Typography>
          {isMobile ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {opcionesCheck.map((op, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={!!formData.escombroChecks[op]}
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
                      checked={!!formData.escombroChecks[op]}
                      onChange={() => handleCheckboxChange(op)}
                    />
                  }
                  label={op}
                />
              ))}
            </FormGroup>
          )}

          {formData.escombroChecks["Otro"] && (
            <TextField
              label="Especificar otro"
              fullWidth
              sx={{ mt: 2 }}
              value={formData.escombroOtroTexto}
              onChange={(e) =>
                handleChange("escombroOtroTexto", e.target.value)
              }
            />
          )}

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Escombro - Otras observaciones / Sugerencias / Acciones a tomar
          </Typography>
          <TextField
            label="Observaciones"
            fullWidth
            multiline
            rows={4}
            value={formData.escombroObservaciones}
            onChange={(e) =>
              handleChange("escombroObservaciones", e.target.value)
            }
          />
        </>
      )}
    </Box>
  );
};

export default Page7;
