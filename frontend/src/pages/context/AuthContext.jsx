import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    const storedRole = sessionStorage.getItem("role");

    if (storedToken && storedUser && storedRole) {
      setToken(storedToken);
      setUser(storedUser);
      setRole(storedRole);
    }
    setLoading(false); // ✅ Indica que ya terminó la carga
  }, []);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);

    const roleMapping = {
      super_administrador: "superadmin",
      coordinador_obra: "coordinador",
      coordinador_logistico: "coordinadorlogistico",
      supervisor_obra: "supervisor",
      tecnico: "tecnico",
      cliente: "cliente",
    };

    const mappedRole = roleMapping[userData.rol] || userData.rol;
    setRole(mappedRole);

    sessionStorage.setItem("token", tokenData);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("role", mappedRole);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
