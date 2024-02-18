import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, CircularProgress, Container, Modal, Paper, TextField, Typography } from "@mui/material";
import FaceIcon from '@mui/icons-material/Face';

const Login = () => {
    const [errorPopupOpen, setErrorPopupOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("Usuario o contraseña incorrectos.");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        setLoading(true);
        fetch("https://ssttapi.mibbraun.pe/login", {
            method: 'POST',
            mode: "cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "username": username,
                "password": e.target.password.value
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Usuario o contraseña incorrectos.");
            }
            return response.json();
        })
        .then(data => {
            // Se recibió una respuesta exitosa del servidor
            var objetoJSON = JSON.stringify(data);
            // Guardar la cadena JSON en localStorage
            localStorage.setItem("currentUser", objetoJSON);
            setLoading(false);
            navigate('/home');
        })
        .catch(error => {
            // Error al comunicarse con el servidor o credenciales incorrectas
            setLoading(false);
            setErrorMessage(error.message);
            setErrorPopupOpen(true);
        });
    };

    const closeErrorPopup = () => {
        setErrorPopupOpen(false);
    };

    return (
        <Container maxWidth="xs" sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
            <Paper sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", padding: "1rem 2rem" }} elevation={3}>
                <Chip sx={{ width: "5rem" }} icon={<FaceIcon />} label="Login" color="primary" />
                {loading && (
                    <CircularProgress/>
                )}
                <Box component="form" onSubmit={handleLogin}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Usuario"
                        name="username"
                        autoComplete="username"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Contraseña"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        style={{ marginTop: "1rem", padding: ".7rem", fontWeight: "bold" }}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Iniciar sesión
                    </Button>
                </Box>
                <Modal open={errorPopupOpen} onClose={closeErrorPopup}>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'white',
                        padding: '16px',
                        textAlign: 'center',
                        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                        borderRadius: '10px',
                    }}>
                        <Typography variant="h6" color="error">{errorMessage}</Typography>
                        <Button variant="contained" color="primary" onClick={closeErrorPopup}>Cerrar</Button>
                    </div>
                </Modal>
            </Paper>
        </Container>
    );
}

export default Login;
