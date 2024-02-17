import { Box, Typography, Button } from '@mui/material';
import { organizarDatosPorFecha } from '../utils/common';
import { useTheme } from '@emotion/react';
import { useState } from 'react';
import MyItem from './MyItem';


const ListView = ({ data, setDatos, ListView, viewAll }) => {
    const datosOrganizados = organizarDatosPorFecha(data)
    let datosLimitados
    const [showMaintenanceStates, setShowMaintenanceStates] = useState(
        Object.keys(datosOrganizados).reduce((acc, key) => {
            acc[key] = false;
            return acc;
        }, {})
    );
    const theme = useTheme()

    const toggleMaintenance = (key) => {
        setShowMaintenanceStates((prevStates) => ({
            ...prevStates,
            [key]: !prevStates[key],
        }));
    };

    if (!viewAll) {
        datosLimitados = Object.fromEntries(Object.entries(datosOrganizados).slice(0, 1));
    } else {
        datosLimitados = datosOrganizados
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap="1rem"
            sx={{
                width: "100%",
                alignItems: 'center',
                paddingTop: "1rem",
                paddingBottom: "1rem"
            }}>
            {


                Object.keys(datosLimitados).map((key, index) => (
                    <Box
                        key={index}
                        display="flex"
                        flexDirection="column"
                        sx={{
                            backgroundColor: theme.palette.primary.secondary,
                            gap: '1rem',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            width: '95%',
                            boxSizing: 'border-box',
                            border: '1px solid ' + theme.palette.primary.main,
                        }}
                    >
                        <Box display="flex" justifyContent="space-around" alignItems="center">
                            <Typography><strong>Fecha: </strong>{key}</Typography>
                            <Button
                                size="small"
                                variant='contained'
                                onClick={() => toggleMaintenance(key)}>
                                {datosOrganizados[key].length}
                            </Button>

                        </Box>
                        {
                            showMaintenanceStates[key] && (
                                datosOrganizados[key].map((item, index) => (
                                    <MyItem key={index} item={item} setDatos={setDatos} />
                                ))
                            )
                        }
                    </Box>
                ))


            }
        </Box>
    )
}

export default ListView;