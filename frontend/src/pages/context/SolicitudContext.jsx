import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const SolicitudesContext = createContext();

const allowedRoles = ["superadmin", "coordinador", "coordinadorlogistico"];

export const SolicitudesProvider = ({ children, token }) => {
  const [pendingSolicitudes, setPendingSolicitudes] = useState([]);
  const { role } = useContext(AuthContext);

  const fetchSolicitudesPendientes = () => {
    if (!token || !allowedRoles.includes(role)) return;

    Promise.all([
      fetch("http://127.0.0.1:8000/api/clientes/solicitudes/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }).then((res) => res.ok ? res.json() : []),

      fetch("http://127.0.0.1:8000/api/obras/solicitudes/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }).then((res) => res.ok ? res.json() : []),

      fetch("http://127.0.0.1:8000/api/coordinacionretiro/lista/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }).then((res) => res.ok ? res.json() : []),
    ])
      .then(([clientesSolicitudes, obrasSolicitudes, coordinacionesSolicitudes]) => {
        const allSolicitudes = [
          ...clientesSolicitudes,
          ...obrasSolicitudes,
          ...coordinacionesSolicitudes,
        ];

        const pendientes = allSolicitudes.filter(
          (sol) => sol.estado && sol.estado.toLowerCase() === "pendiente"
        );
        setPendingSolicitudes(pendientes);
      })
      .catch((error) => {
        console.error("Error al consultar solicitudes:", error);
        setPendingSolicitudes([]);
      });
  };

  useEffect(() => {
    fetchSolicitudesPendientes();
    const intervalId = setInterval(fetchSolicitudesPendientes, 5000);
    return () => clearInterval(intervalId);
  }, [token, role]);

  return (
    <SolicitudesContext.Provider
      value={{ pendingSolicitudes, fetchSolicitudesPendientes, setPendingSolicitudes }}
    >
      {children}
    </SolicitudesContext.Provider>
  );
};