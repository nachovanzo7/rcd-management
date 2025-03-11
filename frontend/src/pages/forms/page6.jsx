import React, { useState, useEffect } from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useFormStore } from "../context/FormContext";

const Page6 = () => {
  const { data, updateData } = useFormStore();
  const pageIndex = "page6";

  const [formData, setFormData] = useState({
    accionesTomadas: data[pageIndex]?.accionesTomadas || "",
    otrasObservaciones: data[pageIndex]?.otrasObservaciones || "",
  });

  useEffect(() => {
    updateData(pageIndex, formData);
  }, [formData, pageIndex, updateData]);

  const handleChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  return (
    <Box sx={{ width: "90%", margin: "auto", mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Acciones tomadas - Gestiones realizadas el día de la visita. Ej: Se movió punto limpio / Se colocó señalética / etc.
      </Typography>
      <TextField
        label="Acciones tomadas"
        fullWidth
        multiline
        rows={4}
        value={formData.accionesTomadas}
        onChange={(e) => handleChange("accionesTomadas", e.target.value)}
        sx={{ mb: 3 }}
      />

      <Typography variant="h6" sx={{ mb: 2 }}>
        Otras observaciones generales
      </Typography>
      <TextField
        label="Otras observaciones"
        fullWidth
        multiline
        rows={4}
        value={formData.otrasObservaciones}
        onChange={(e) => handleChange("otrasObservaciones", e.target.value)}
      />
    </Box>
  );
};

export default Page6;
