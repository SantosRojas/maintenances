import { Autocomplete, Box, Container, IconButton, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditComponentItem from "../components/EditComponentItem";
import { ListSkeleton } from "../components/skeleton";

const EditComponents = () => {
    const navigate = useNavigate();
    const { key } = useParams();
    const [search, setSearch] = useState(false);
    const [searchLabel, setSearchLabel] = useState(null);
    const [datos, setDatos] = useState([]);
    

    const keyMap = {
        "servicio": "servicios",
        "institucion": "instituciones",
        "repuesto": "repuestos"
    };

    const endUrl = keyMap[key];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseComponents = await fetch(`https://ssttapi.mibbraun.pe/${endUrl}`);
                if (!responseComponents.ok) {
                    throw new Error(`Hubo un problema con la petición Fetch de ${key}s` + responseComponents.status);
                }
                const dataComponents = await responseComponents.json();

                let dataFiltrada = [...dataComponents];
                if (search && searchLabel) {
                    dataFiltrada = dataComponents.filter(data => data[key] === searchLabel[key]);
                    console.log(dataFiltrada)
                }
                setDatos(dataFiltrada);
            } catch (error) {
                console.error('Error al obtener y procesar los datos:', error);
            }
        };

        // Llamada a la función fetchData
        fetchData();
    }, [searchLabel, endUrl, key, search]);

    const handleClick = () => {
        setSearch(true);
    };

    const handleSearchOff = () => {
        setSearch(false);
        setSearchLabel("");
    };

    

    return (
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                justifyItems: "center",
                alignItems: "center",
                marginTop: "1rem",
                marginBottom: "1rem"
            }}
        >
            <Paper elevation={3} sx={{ width: "100%" }}>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    paddingBottom="1rem"
                >
                    <Box display="flex"
                        justifyContent="center"
                        alignItems="center"
                        gap="1.2rem"
                    >
                        <IconButton color="primary" aria-label="arrow-back" onClick={() => navigate(`/addc/${key}`)}>
                            <ArrowBackRoundedIcon fontSize="large" />
                        </IconButton>
                        <Typography variant="h6">Editar {key}</Typography>
                        <IconButton
                            color="primary"
                            aria-label="more"
                            id="long-button"
                            onClick={handleClick}
                            title='Buscar'
                        >
                            <SearchIcon fontSize="large" />
                        </IconButton>
                        {search && (
                            <IconButton color="primary" aria-label="quit search" onClick={handleSearchOff} title="Quitar búsqueda">
                                <SearchOffIcon fontSize="large" />
                            </IconButton>
                        )}
                    </Box>

                    {search && datos.length > 0 && (
                        <Box
                            display="flex"
                            flexDirection="column"
                            padding=".5rem"
                            boxSizing="border-box"
                            width="100%"
                        >
                            <Autocomplete
                                size="small"
                                fullWidth
                                id="autocomplete-comp"
                                options={datos}
                                getOptionLabel={(option) => option && option[key] ? option[key] : ""}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                value={searchLabel || null}
                                onChange={(_, value) => { setSearchLabel(value) }}
                                renderInput={(params) => <TextField {...params} label={key} fullWidth required />}
                            />
                            
                        </Box>
                    )}

                    <Box
                        width="95%">
                        {datos.length > 0 ? (
                            datos.map((dato, index) => (
                                <EditComponentItem key={index} dato={dato} llave = {key} setDatos = {setDatos}/>
                            ))
                        ) : (
                            <ListSkeleton />
                        )}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default EditComponents;
