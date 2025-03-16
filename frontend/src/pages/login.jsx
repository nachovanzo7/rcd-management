import React, { useState, useContext } from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  InputAdornment,
  CircularProgress,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import section4 from "../assets/section4.jpg"; 
import { ChevronLeft } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para el error
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(""); // Limpiar error antes de hacer la solicitud

    console.log("Datos a enviar:", { email, password });
    try {
      const response = await fetch(`${API_URL}/api/usuarios/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        login({ email: data.email, rol: data.rol }, data.token);
        navigate("/");
      } else {
        const errorText = await response.json();
        setErrorMessage(errorText.detail || "Error al iniciar sesión. Verifica tus credenciales.");
      }
    } catch (error) {
      setErrorMessage("Error en la red. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1000, // Asegura que se muestre encima
        backgroundImage: `url(${section4})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "hidden",
      }}
    >
      <Button
          onClick={() => navigate(-1)}
          sx={{
            position: "absolute",
            top: 20,
            left: 20,
            minWidth: "auto",
            padding: 1,
            color: "white",
          }}
        >
          <ChevronLeft />
        </Button>

      <Paper
        elevation={3}
        sx={{
          padding: 4,
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Fondo semitransparente
          backdropFilter: "blur(4px)",
          maxWidth: "600px", // Ancho limitado
          width: "100%",
          textAlign: "center",
          borderRadius: "8px", // Bordes redondeados
        }}
      >



        <Typography variant="h5" gutterBottom sx={{ color: "#fff" }}>
          Iniciar Sesión
        </Typography>
        
        {errorMessage && (
          <Alert 
            severity="error" 
            sx={{
              backgroundColor: "rgba(255, 0, 0, 0.2)",
              color: "#ffcccc",
              marginBottom: 2,
              fontSize: "14px",
              borderRadius: "6px",
            }}
          >
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#fff" }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  sx: {
                    color: "#fff",
                    "&.Mui-focused": { color: "#fff" },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#fff" },
                    "&:hover fieldset": { borderColor: "#fff" },
                    "&.Mui-focused fieldset": { borderColor: "#fff" },
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#fff" }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  sx: {
                    color: "#fff",
                    "&.Mui-focused": { color: "#fff" },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#fff" },
                    "&:hover fieldset": { borderColor: "#fff" },
                    "&.Mui-focused fieldset": { borderColor: "#fff" },
                  },
                  "& .MuiInputBase-input": {
                    color: "#fff",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{
                  marginTop: "20px",
                  backgroundColor: "#abbf9d",
                  "&:hover": { backgroundColor: "#d1e063" },
                  color: "#ffffff",
                  padding: "8px 16px", 
                  fontSize: "16px", 
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  "&.Mui-disabled": {
                    color: "#ffffff",
                    backgroundColor: "#abbf9d",
                    opacity: 0.8,
                  },
                }}
                fullWidth
              >
                {isLoading ? (
              <>
                <CircularProgress size={20} sx={{ color: "#ffffff" }} />
                Cargando...
              </>
            ) : (
                "Iniciar Sesión"
              )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginForm;
