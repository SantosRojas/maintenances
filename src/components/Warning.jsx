import { Box, Button, Typography } from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';

const Warning = ({ setShowForm}) => {
    const handleRegister = (event) => {
        setShowForm(true);    }
    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            < WarningIcon color="error" style={{ fontSize: 48 }} />
            <Typography variant="h6" color="error" gutterBottom>
            La bomba ya fue registrada el dia de hoy
            </Typography>
            <Button variant="contained" color="primary" style={{ marginLeft: '1rem' }} onClick={handleRegister}>
                Intentar otra vez
            </Button>
        </Box>
    );
};

export default Warning;