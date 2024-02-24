import { Container, Paper, IconButton, Box, Button, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import CustomizedTreeView from "../components/CustomizedTreeView";
import { useNavigate } from "react-router-dom";
import MiMenu from "../components/MiMenu";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import ListView from "../components/ListView";
import { ListSkeleton } from "../components/skeleton";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { formatDate, handleDownloadExcel } from "../utils/common";
import SearchOffIcon from '@mui/icons-material/SearchOff';
import AddSi from "../components/AddSi";

const Home = () => {
  const [datos, setDatos] = useState([])
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState(null)
  const [searchLabel, setSearchLabel] = useState("")
  const [optionsAutocomplete, setOptionsAutocomplete] = useState(null)
  const [isTreeView, setIsTreeView] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false);
  const [viewAll, setViewAll] = useState(false)
  const optionsKey = useMemo(() => ({
    "Buscar por Serie": "serie",
    "Buscar por Institucion": "institucion_id",
    "Buscar por Fecha": "fecha_registro",
    "Buscar por Responsable": "responsable_id"
  }), []);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const responseMantenimientos = await fetch("https://ssttapi.mibbraun.pe/mantenimientos");
        if (!responseMantenimientos.ok) {
          throw new Error('Hubo un problema con la petición Fetch de mantenimientos: ' + responseMantenimientos.status);
        }
        const dataMantenimientos = await responseMantenimientos.json();

        let keyToMap;
        if (searchLabel === "Buscar por Serie") {
          keyToMap = "serie";
        } else if (searchLabel === "Buscar por Institucion") {
          keyToMap = "institucion_id";
        } else if (searchLabel === "Buscar por Fecha") {
          keyToMap = "fecha_registro";
        } else {
          keyToMap = "responsable_id";
        }

        const options = Array.from(new Set(dataMantenimientos.map(item => item[keyToMap])))
          .map(key => {
            const item = dataMantenimientos.find(item => item[keyToMap] === key);
            return {
              id: item.id,
              [keyToMap]: key
            };
          });

        const responseInstituciones = await fetch("https://ssttapi.mibbraun.pe/instituciones");
        if (!responseInstituciones.ok) {
          throw new Error('Hubo un problema con la petición Fetch de instituciones: ' + responseInstituciones.status);
        }
        const dataInstituciones = await responseInstituciones.json();


        const responseResponsables = await fetch("https://ssttapi.mibbraun.pe/usuarios");
        if (!responseResponsables.ok) {
          throw new Error('Hubo un problema con la petición Fetch de Responsables: ' + responseResponsables.status);
        }
        const dataResponsables = await responseResponsables.json();

        setOptionsAutocomplete(options)

        if (searchLabel === "Buscar por Institucion") {
          const instOptMap = new Map();
          dataInstituciones.forEach(institucion => {
            instOptMap.set(institucion.id, institucion.institucion);
          });

          const optionsInstConNombres = options.map(it => {
            const nombreInstitucionOption = instOptMap.get(it.institucion_id);
            return {
              ...it,
              institucion: nombreInstitucionOption || 'Institución no encontrada',
            };
          });
          setOptionsAutocomplete(optionsInstConNombres)
        }
        if (searchLabel === "Buscar por Responsable") {
          const resptOptMap = new Map();
          dataResponsables.forEach(tecnico => {
            resptOptMap.set(tecnico.id, tecnico.usuario);
          });

          const optionsRespConNombres = options.map(it => {
            const nombreRespOption = resptOptMap.get(it.responsable_id);
            return {
              ...it,
              responsable: nombreRespOption || 'Responsable no encontrado',
            };
          });
          setOptionsAutocomplete(optionsRespConNombres)
          console.log(optionsRespConNombres)
        }

        if (searchLabel === "Buscar por Fecha") {
          let optionsFechas = [...options].reverse()
          options.forEach(objeto => {
            objeto.fecha = formatDate(objeto.fecha_registro);
          });
          setOptionsAutocomplete(optionsFechas)
        }

        let dataFiltrada = [...dataMantenimientos]
        if (searchLabel !== "" && searchTerm !== null) {
          dataFiltrada = dataMantenimientos.filter(data => data[keyToMap] === searchTerm[keyToMap])
        }

        const institucionesMap = new Map();
        dataInstituciones.forEach(institucion => {
          institucionesMap.set(institucion.id, institucion.institucion);
        });


        const dataConNombres = dataFiltrada.map(mantenimiento => {
          const nombreInstitucion = institucionesMap.get(mantenimiento.institucion_id);
          return {
            ...mantenimiento,
            institucion: nombreInstitucion || 'Institución no encontrada',
          };
        });

        // Mover la actualización de datos después de obtener los datos
        setDatos(dataConNombres);
        setDataLoaded(true)
      } catch (error) {
        console.error('Error al obtener y procesar los datos:', error);
      }
    };

    // Eliminar datos de la dependencia
    fetchData();
  }, [searchLabel, optionsKey, searchTerm]);


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
      <Paper elevation={3}
        sx={{ width: "100%" }}>
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
            gap="1rem"
          >
            <IconButton color="primary" aria-label="views" onClick={(e) => setIsTreeView(!isTreeView)} title="Cambiar vista">
              {
                !isTreeView ? (
                  <AccountTreeIcon />
                ) : (
                  <FormatListNumberedIcon />
                )
              }
            </IconButton>
            <IconButton color="primary" aria-label="download-file" onClick={(e) => handleDownloadExcel(datos)} title="Descargar excel">
              <FileDownloadIcon fontSize="large" />
            </IconButton>
            <MiMenu setSearchLabel={setSearchLabel} />
            {
              searchLabel !== "" && (
                <IconButton color="primary" aria-label="quit search" onClick={(e) => setSearchLabel("")} title="Quitar busqueda">
                  <SearchOffIcon fontSize="large" />
                </IconButton>
              )
            }
            <IconButton color="primary" aria-label="add-mantos" onClick={(e) => navigate("/add")} title="Registrar manto">
              <AddCircleIcon fontSize="large" />
            </IconButton>

            <AddSi />
          </Box>

          {
            searchLabel !== "" && optionsAutocomplete !== null && (
              <Box
                display="flex"
                padding=".5rem"
                boxSizing="border-box"
                width="100%">
                <Autocomplete
                  size="small"
                  fullWidth
                  id="autocomplete"
                  options={optionsAutocomplete}
                  getOptionLabel={(option) => {
                    return searchLabel === "Buscar por Fecha"
                      ? option[optionsKey[searchLabel].replace("_registro", "")]
                      : option[optionsKey[searchLabel].replace("_id", "")]
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  value={searchTerm}
                  onChange={(_, value) => { setSearchTerm(value) }}
                  renderInput={(params) => <TextField {...params} label={searchLabel} fullWidth required />}
                />
              </Box>
            )
          }
          {
            (dataLoaded) ? (
              isTreeView ? (
                <CustomizedTreeView data={[...datos].reverse()} viewAll={viewAll} />
              ) : (
                <ListView data={[...datos].reverse()} setDatos={setDatos} viewAll={viewAll} />
              )
            ) : (
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "95%",
                paddingTop: "1rem",
                paddingBottom: "1rem"
              }}>
                <ListSkeleton />
              </Box>
            )
          }
          {(datos.length > 1 && searchLabel !== "Buscar por Fecha") && (
            <Button variant="contained" onClick={(e) => setViewAll(!viewAll)}>
              {
                viewAll ? (
                  <Typography>
                    Ver menos
                  </Typography>
                ) : (
                  <Typography>
                    Ver todos ({datos.length})
                  </Typography>
                )
              }
            </Button>
          )}

        </Box>
      </Paper>
    </Container>
  )
}

export default Home;