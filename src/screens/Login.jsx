import { Box, Button, Chip, CircularProgress, Container, Modal, Paper, TextField, Typography } from "@mui/material";
import FaceIcon from '@mui/icons-material/Face';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorPopupOpen, setErrorPopupOpen] = useState(false);
    const [textError, setTextError] = useState("Usuario o contraseña no válidos.")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    

    const handleEmailChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleLogin = (e) => {
        e.preventDefault()
        setLoading(true);
        fetch("https://ssttapi.mibbraun.pe/login", {
            method: 'POST',
            mode: "cors",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.id > 0) {
                    var objetoJSON = JSON.stringify(data);
                    // Guardar la cadena JSON en localStorage
                    localStorage.setItem("currentUser", objetoJSON);
                    setLoading(false);
                    setUsername("")
                    setPassword("")
                    navigate('/home')
                } else {
                    setTextError("Usuario no registrado")
                    setErrorPopupOpen(true);
                }
            })
            .catch(error => {
                setTextError("Usuario o contraseña incorrectos")
                setErrorPopupOpen(true);
            });
    };

    const closeErrorPopup = () => {
        setErrorPopupOpen(false);
    };
    return (
        <Container maxWidth="xs" sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
            <Paper sx={{ width: "100%", display: "flex", flexDirection: "column", gap:"1rem", alignItems: "center", padding: "1rem 2rem" }} elevation={3}>
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
                        autoComplete="email"
                        value={username}
                        onChange={handleEmailChange}
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
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Button style={{ marginTop: "1rem", padding: ".7rem", fontWeight: "bold" }}
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
                        <Typography variant="h6" color="error">{textError}</Typography>
                        <Button variant="contained" color="primary" onClick={closeErrorPopup}>Cerrar</Button>
                    </div>
                </Modal>
            </Paper>


        </Container>
    )
}

export default Login;