import { CheckCircle } from "@mui/icons-material";
import { Box, Typography, Button } from "@mui/material";


const Exito = ({ handleAcept, message = "Exito" }) => {

    return (

        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="1rem" padding="1rem">
            <CheckCircle color="primary" style={{ fontSize: 48 }} />
            <Typography variant="h6" gutterBottom>
                {message}
            </Typography>
            <Button variant="contained" color="primary" style={{ marginRight: '1rem' }} onClick={(e) => handleAcept()}>
                Aceptar
            </Button>
        </Box>
    );
};

export default Exito;