import React, { useEffect } from "react";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; 
import section4 from "../assets/section6.png";
import recurso from "../assets/recurso.png";



const Landing = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; 
    };
  }, []);

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1000,
        backgroundImage: `url(${section4})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "hidden",
        paddingTop: "60px",
        marginBottom: "50px", 
      }}
    >
     
      <img
        src={recurso}
        alt="Recurso"
        style={{
          position: "absolute",
          top: "0px",
          left: "0px",
          width: "120px",
          height: "auto",
          zIndex: 1100,
        }}
      />


    <Paper
      elevation={3}
      sx={{
        padding: "40px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        backdropFilter: "blur(6px)",
        maxWidth: "600px",
        width: "100%",
        textAlign: "center",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: "translateY(-50px)", 
      }}
    >
        {/* Logo más pequeño */}
        <img
          src={logo}
          alt="Logo"
          style={{ maxWidth: "70%", height: "auto", marginBottom: "20px" }}
        />

        {/* Texto debajo del logo más conciso */}
        <Typography variant="h5" sx={{ color: "#fff", mb: 4 }}>
          Inicie sesión o regístrese como cliente para continuar.
        </Typography>

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Button
              variant="contained"
              component={Link}
              to="/login"
              aria-label="Iniciar sesión"
              sx={{
                backgroundColor: "#abbf9d",
                color: "#fff",
                padding: "8px 16px", // Botón más pequeño
                fontSize: "16px", // Aumentar el tamaño de fuente
                borderRadius: "20px", // Bordes redondeados
                "&:hover": {
                  backgroundColor: "#d1e063",
                },
              }}
              fullWidth
            >
              Iniciar Sesión
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              component={Link}
              to="/registrocliente"
              aria-label="Registrarse"
              sx={{
                backgroundColor: "#abbf9d",
                color: "#fff",
                padding: "8px 16px", // Botón más pequeño
                fontSize: "16px", // Aumentar el tamaño de fuente
                borderRadius: "20px", // Bordes redondeados
                "&:hover": {
                  backgroundColor: "#d1e063",
                },
              }}
              fullWidth
            >
              Registrarse
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Landing;
