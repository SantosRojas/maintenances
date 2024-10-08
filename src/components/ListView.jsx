import { Box, Typography, Button, Checkbox } from '@mui/material';
import { useTheme } from '@emotion/react';
import { useEffect, useState } from 'react';
import MyItem from './MyItem';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { organizarDatosPorCategoria, setUrl } from '../utils/common';


const ListView = ({ data, setDatos, viewAll, categoria,instituciones, servicios, modelos }) => {
    const datosOrganizados = organizarDatosPorCategoria(data, categoria)
    const [showDoneIcon, setShowDoneIcon] = useState(false)

    //VARIABLES EL FETCH
    const [repuestos, setRepuestos] = useState(null);
    const [softwareVersions, setSoftwareVersions] = useState([])
    useEffect(() => {
        Promise.all([
            fetch(setUrl("repuestos")).then((response) => response.json()),
            fetch(setUrl("softwareversion")).then((response) => response.json())
        ])
            .then(([repuestosData, softwareVersionsData]) => {
                setRepuestos(repuestosData);
                setSoftwareVersions(softwareVersionsData)
            })
            .catch((error) => console.error(error));
    }, []);

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
                            gap: '1rem',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            width: '95%',
                            boxSizing: 'border-box',
                            border: '1px solid ' + theme.palette.primary.main,
                        }}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography><strong>{key}</strong></Typography>
                            {
                                showMaintenanceStates[key] && <Checkbox
                                    onChange={() => setShowDoneIcon(prevState => !prevState)}
                                    aria-label="show help"
                                    icon={<VisibilityOff color='primary' fontSize="large" />}
                                    checkedIcon={<Visibility fontSize="large" />} />
                            }
                            <Button
                                size="small"
                                variant='contained'
                                onClick={() => toggleMaintenance(key)}
                                title='Visualizar registros'>
                                {datosOrganizados[key].length}
                            </Button>

                        </Box>
                        {
                            showMaintenanceStates[key] && (
                                datosOrganizados[key].map((item, index) => (
                                    <MyItem 
                                    key={index} 
                                    item={item} 
                                    setDatos={setDatos} 
                                    showDoneIcon={showDoneIcon}
                                    instituciones ={instituciones}
                                    servicios ={servicios}
                                    modelos = {modelos}
                                    repuestos = {repuestos}
                                    softwareVersions ={softwareVersions}
                                     />
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