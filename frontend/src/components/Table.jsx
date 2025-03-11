import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField } from '@mui/material';
import '../styles/Table.css';

const Tabla = ({ datos = [], columnas = [], filtroClave, filtroPlaceholder }) => {
  const [filtro, setFiltro] = React.useState("");

  const datosFiltrados = datos.filter((dato) =>
    dato[filtroClave]?.toString().toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="table-container">
        <TextField
          fullWidth
          label={`Filtrar por ${filtroPlaceholder}`}
          variant="outlined"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="search-input"
        />
        <div style={{ height: 500, width: '100%' }}>
          <DataGrid
            rows={datosFiltrados}
            columns={columnas}
            autoHeight={false}
            disableColumnMenu
            disableSelectionOnClick
            pageSizeOptions={[]}
            paginationMode="client"
            hideFooter
            scrollbarSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default Tabla;
