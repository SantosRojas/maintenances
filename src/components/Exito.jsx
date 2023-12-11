import { CheckCircle } from "@mui/icons-material";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


const Exito = ({ setShowForm }) => {
    const navigate = useNavigate()
    const handleHome = (event) => {
        navigate("/home")
    }

    const handleRegister = (event) => {
        setShowForm(true);
        navigate("/add")
    }
    return (

        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Typography variant="h6" gutterBottom>
                Incidencia registrada con éxito
            </Typography>
            <CheckCircle color="primary" style={{ fontSize: 48 }} />
            <Box display="flex" justifyContent="center" mt={2}>
                <Button variant="contained" color="primary" style={{ marginRight: '1rem' }} onClick={handleHome}>
                    Ver Registros
                </Button>
                <Button variant="contained" color="primary" style={{ marginLeft: '1rem' }} onClick={handleRegister}>
                    Registrar otra
                </Button>
            </Box>
        </Box>
    );
};

export default Exito;