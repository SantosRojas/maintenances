import { Box, Button, Typography } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from "react-router-dom";

const Error = ({ setShowForm}) => {
    const navigate = useNavigate()
    const handleRegister = (event) => {
        setShowForm(true);
        navigate("/add")
    }
    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            < ErrorOutlineIcon color="error" style={{ fontSize: 48 }} />
            <Typography variant="h6" color="error" gutterBottom>
                ¡Upps, hubo un error!
            </Typography>
            <Button variant="contained" color="primary" style={{ marginLeft: '1rem' }} onClick={handleRegister}>
                Intentar otra vez
            </Button>
        </Box>
    );
};

export default Error;