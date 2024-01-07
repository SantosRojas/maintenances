import { Box, Button, Typography } from "@mui/material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Error = ({ setShowForm}) => {
    const handleRegister = (event) => {
        setShowForm(true);    }
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