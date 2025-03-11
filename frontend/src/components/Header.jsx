import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "../styles/header.css";
import logoImage from "../assets/isologo.png";

const Header = ({ opacity, isLoggedIn }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const noBackButtonRoutes = [
    "/",
    "/clientes",
    "/listadeobras",
    "/solicitudes",
    "/coordinaciones",
    "/transportistas",
    "/empresasgestoras",
    "/capacitaciones",
    "/informes",
    "/obraslist",
    "/puntolimpio"
  ];

  const showBackIcon = !noBackButtonRoutes.includes(location.pathname);

  const handleBackClick = () => {
    navigate(-1); 
  };

  const headerText = isLoggedIn
    ? "Gestión de residuos de obra"
    : "Bienvenido – Inicia Sesión o Regístrate";

  return (
    <header className="site-header" style={{ opacity }}>
      <div className="header-container">
        {showBackIcon && (
          <button className="header-back-button" onClick={handleBackClick}>
            <ArrowBackIcon sx={{ color: "#fff", fontSize: 30 }} />
          </button>
        )}
        <h1 className="site-title">{headerText}</h1>
        <img src={logoImage} alt="Logo" className="header-logo" />
      </div>
    </header>
  );
};

export default Header;
