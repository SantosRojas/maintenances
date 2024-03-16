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
  const [optionsAutocomplete, setOptionsAutocomplete] = useState([])
  const [isTreeView, setIsTreeView] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false);
  const [viewAll, setViewAll] = useState(false)
  const objetCurrentUser = localStorage.getItem("currentUser");
  const currentUser = JSON.parse(objetCurrentUser);

  const [dataMantenimientos, setDataMantenimientos] = useState([]);
  const [dataInstituciones, setDataInstituciones] = useState([]);
  const [dataServicios, setDataServicios] = useState([]);
  const [dataModelos, setDataModelos] = useState([]);

  const optionsKey = useMemo(() => ({
    "Buscar por Serie": "serie",
    "Buscar por Institucion": "institucion_id",
    "Buscar por Servicio": "servicio_id",
    "Buscar por Fecha": "fecha_registro",
    "Buscar por Modelo": "modelo_id"
  }), []);

  const urlMantos = `https://ssttapi.mibbraun.pe/mantenimientos/responsableid/${currentUser.id}`

  async function fetchDatos(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Hubo un problema con la petición Fetch de ${url}: ${response.status}`);
    }
    return response.json();
  }

  function mapOptions(options, data, labelKey,) {
    const instOptMap = new Map();
    data.forEach(item => {
      instOptMap.set(item.id, item[labelKey]);
    });

    const mappedOptions = options.map(it => {
      const itemName = instOptMap.get(it[`${labelKey}_id`]);
      return {
        ...it,
        [labelKey]: itemName || `${labelKey} no encontrado`,
      };
    });

    return mappedOptions;
  }

  function createMap(data, labelKey) {
    const map = new Map();
    data.forEach(item => {
      map.set(item.id, item[labelKey]);
    });
    return map;
  }

  useEffect(() => {

    const fetchData = async () => {
      try {
        const [
          dataMants,
          dataInsts,
          dataServs,
          dataMods,
        ] = await Promise.all([
          fetchDatos(urlMantos),
          fetchDatos("https://ssttapi.mibbraun.pe/instituciones"),
          fetchDatos("https://ssttapi.mibbraun.pe/servicios"),
          fetchDatos("https://ssttapi.mibbraun.pe/tipos"),
        ]);
        setDataMantenimientos(dataMants)
        setDataInstituciones(dataInsts)
        setDataServicios(dataServs)
        setDataModelos(dataMods)

        console.log('pidiendo datois')
        setDataLoaded(true)


      } catch (error) {
        console.error('Error al obtener y procesar los datos:', error);
      }
    };

    if (!dataLoaded) {
      fetchData();
    }

    if (dataMantenimientos.length>0) {
      const options = Array.from(new Set(dataMantenimientos.map(item => item[optionsKey[searchLabel]])))
        .map(key => {
          const item = dataMantenimientos.find(item => item[optionsKey[searchLabel]] === key);
          return {
            id: item.id,
            [optionsKey[searchLabel]]: key
          };
        });

      let filteredOptions = options;

      if (searchLabel === "Buscar por Institucion") {
        filteredOptions = mapOptions(options, dataInstituciones, 'institucion');
      } else if (searchLabel === "Buscar por Servicio") {
        filteredOptions = mapOptions(options, dataServicios, 'servicio');
      } else if (searchLabel === "Buscar por Modelo") {
        filteredOptions = mapOptions(options, dataModelos, 'modelo');
      } else {
        filteredOptions = filteredOptions.map(objeto => {
          const fechaFormateada = formatDate(objeto.fecha_registro);
          return {
            ...objeto,
            fecha: fechaFormateada
          };
        }).reverse();
      }

      setOptionsAutocomplete(filteredOptions);


      let dataFiltrada = (searchLabel !== "" && searchTerm !== null)
        ? dataMantenimientos.filter(data => data[optionsKey[searchLabel]] === searchTerm[optionsKey[searchLabel]])
        : [...dataMantenimientos];



      const institucionesMap = createMap(dataInstituciones, 'institucion');
      const serviciosMap = createMap(dataServicios, 'servicio');
      const modelosMap = createMap(dataModelos, 'modelo');

      const dataConNombres = dataFiltrada.map(mantenimiento => {
        const nombreInstitucion = institucionesMap.get(mantenimiento.institucion_id);
        const nombreServicio = serviciosMap.get(mantenimiento.servicio_id);
        const nombreModelo = modelosMap.get(mantenimiento.modelo_id);

        return {
          ...mantenimiento,
          institucion: nombreInstitucion || 'Institución no encontrada',
          servicio: nombreServicio || 'Servicio no encontrado',
          modelo: nombreModelo || 'Modelo no encontrado'
        };
      });

      // Mover la actualización de datos después de obtener los datos
      setDatos(dataConNombres);
      setDataLoaded(true)
    }
  }, [searchLabel, optionsKey, searchTerm, urlMantos, dataLoaded, dataMantenimientos, dataInstituciones, dataServicios, dataModelos]);


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
            gap=".5rem"
          >
            {
              datos.length > 0 && (
                <>
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
                </>
              )
            }
            <IconButton color="primary" aria-label="add-mantos" onClick={(e) => navigate("/add")} title="Registrar manto">
              <AddCircleIcon fontSize="large" />
            </IconButton>

            <AddSi />
          </Box>

          {
            searchLabel !== "" && optionsAutocomplete.length>0 && (
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
                      ? (option && option[optionsKey[searchLabel]?.replace("_registro", "")]) || "" // Manejo de undefined
                      : (option && option[optionsKey[searchLabel]?.replace("_id", "")]) || ""; // Manejo de undefined
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