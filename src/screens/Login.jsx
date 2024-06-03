import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, CircularProgress, Container, IconButton, InputAdornment, Modal, Paper, TextField, Typography } from "@mui/material";
import FaceIcon from '@mui/icons-material/Face';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
    const [formState, setFormState] = useState({
        errorPopupOpen: false,
        errorMessage: "Usuario o contraseña incorrectos.",
        loading: false,
        showPassword: false, // Nuevo estado para controlar la visibilidad de la contraseña
    });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const username = e.target.username.value;
        const password = e.target.password.value;

        if (!username || !password) {
            setFormState({ ...formState, errorMessage: "Por favor, ingrese usuario y contraseña.", errorPopupOpen: true });
            return;
        }

        setFormState({ ...formState, loading: true });

        try {
            const response = await fetch("https://ssttapi.mibbraun.pe/login", {
                method: 'POST',
                mode: "cors",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "username": username,
                    "password": password
                })
            });

            if (!response.ok) {
                throw new Error("Usuario o contraseña incorrectos.");
            }

            const data = await response.json();
            localStorage.setItem("currentUser", JSON.stringify(data));
            setFormState({ ...formState, loading: false });
            navigate('/home');
        } catch (error) {
            setFormState({ ...formState, loading: false, errorMessage: error.message, errorPopupOpen: true });
        }
    };

    const toggleShowPassword = () => {
        setFormState({ ...formState, showPassword: !formState.showPassword });
    };

    const closeErrorPopup = () => {
        setFormState({ ...formState, errorPopupOpen: false });
    };

    return (
        <Container maxWidth="xs" sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
            <Paper sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center", padding: "1rem 2rem" }} elevation={3}>
                <Chip sx={{ width: "5rem" }} icon={<FaceIcon />} label="Login" color="primary" />
                {formState.loading && <CircularProgress />}
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
                        type={formState.showPassword ? 'text' : 'password'}
                        id="password"
                        autoComplete="current-password"
                        // Agregar icono para mostrar/ocultar contraseña
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        color="primary"
                                        aria-label="toggle password visibility"
                                        onClick={toggleShowPassword}
                                    >
                                        {formState.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
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
                <Modal open={formState.errorPopupOpen} onClose={closeErrorPopup}>
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
                        <Typography variant="h6" color="error">{formState.errorMessage}</Typography>
                        <Button variant="contained" color="primary" onClick={closeErrorPopup}>Cerrar</Button>
                    </div>
                </Modal>
            </Paper>
        </Container>
    );
}

export default Login;
