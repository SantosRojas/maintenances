import { useMemo, useState, useEffect } from "react";
import { Container, Paper, Box, IconButton, Button, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CustomizedTreeView from "../components/CustomizedTreeView";
import ListView from "../components/ListView";
import AddSi from "../components/AddSi";
import { ListSkeleton } from "../components/skeleton";
import { assignIds, formatDate, getUniqueFields, handleDownloadExcel, organizarDatosPorCategoria } from "../utils/common";
import { searchOptions, urlMantos, useInitialData, useInitialSearchTerm } from "../utils/constants";
import { useNavigate } from "react-router-dom";
import { fetchDatos } from "../utils/funtionsHome";
import { SearchBox } from "../components/searchBox/SearchBox";
import { MyMenu } from "../components/MyMenu";
import CategorySelector from "../components/CategorySelector";

const Home = () => {
  const [isTreeView, setIsTreeView] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [currentOption, setCurrentOption] = useState("");
  const [data, setData] = useState(useInitialData())
  const [dataMantenimientos, setDataMantenimientos] = useState([]);
  const [searchTerm, setSearchTerm] = useState(useInitialSearchTerm());
  const [dataLoaded, setDataLoaded] = useState(false);
  const [categoria, setCategoria] = useState("fecha_registro")

  const navigate = useNavigate();

  const objetCurrentUser = useMemo(() => JSON.parse(localStorage.getItem("currentUser")), []);
  // const [dataInstituciones, setDataInstituciones] = useState([]);
  // const [dataServicios, setDataServicios] = useState([]);
  // const [dataModelos, setDataModelos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataMants, dataInsts, dataServs, dataMods] = await Promise.all([
          fetchDatos(urlMantos(objetCurrentUser.id)),
          fetchDatos("https://ssttapi.mibbraun.pe/instituciones"),
          fetchDatos("https://ssttapi.mibbraun.pe/servicios"),
          fetchDatos("https://ssttapi.mibbraun.pe/tipos"),
        ]);

        const dataMantsWname = dataMants.map(dato => ({
          ...dato,
          institucion: dataInsts.find(inst => inst.id === dato.institucion_id).institucion,
          servicio: dataServs.find(serv => serv.id === dato.servicio_id).servicio,
          modelo: dataMods.find(mod => mod.id === dato.modelo_id).modelo,
        }));


        const uniqueSeries = getUniqueFields(dataMants, "serie");
        const uniqueInstitutionsId = getUniqueFields(dataMants, "institucion_id");
        const uniqueServicesId = getUniqueFields(dataMants, "servicio_id");
        const uniqueModelsId = getUniqueFields(dataMants, "modelo_id");
        const uniqueTipoMantto = getUniqueFields(dataMants, "tipo_mantenimiento");
        const uniqueDatesRegister = getUniqueFields(dataMants, "fecha_registro");

        setDataMantenimientos(dataMantsWname);
        setData({
          serie: assignIds(uniqueSeries, "serie").reverse(),
          institucion: dataInsts.filter(obj => uniqueInstitutionsId.includes(obj.id)),
          servicio: dataServs.filter(obj => uniqueServicesId.includes(obj.id)),
          modelo: dataMods.filter(obj => uniqueModelsId.includes(obj.id)),
          tipo_mantenimiento: assignIds(uniqueTipoMantto, "tipo_mantenimiento"),
          fecha_registro: assignIds(uniqueDatesRegister.map(date => formatDate(date)), "fecha_registro").reverse()
        });
        setDataLoaded(true);
      } catch (error) {
        console.error('Error al obtener y procesar los datos:', error);
      }
    };

    if (!dataLoaded) {
      fetchData();
    }
  }, [dataLoaded, objetCurrentUser.id]);

  const autocompleteOptions = searchOptions.map(option => ({
    key: option.key,
    label: option.labelSearch,
    options: dataLoaded ? data[option.key] : []
  }))

  const onChangeSearchTerm = (key, value) => {
    setSearchTerm(prevState => ({
      ...prevState,
      [key]: value ? value : null  // Ensure value is not undefined
    }));
  }

  let dataMantenimientosFiltered = dataMantenimientos

  const filters = {
    fecha_registro: dato => formatDate(dato.fecha_registro) === searchTerm.fecha_registro.fecha_registro,
    serie: dato => dato.serie === searchTerm.serie.serie,
    institucion: dato => dato.institucion_id === searchTerm.institucion.id,
    servicio: dato => dato.servicio_id === searchTerm.servicio.id,
    tipo_mantenimiento: dato => dato.tipo_mantenimiento === searchTerm.tipo_mantenimiento.tipo_mantenimiento,
    modelo: dato => dato.modelo_id === searchTerm.modelo.id,
  };

  Object.keys(filters).forEach(key => {
    if (searchTerm[key] !== null) {
      dataMantenimientosFiltered = dataMantenimientosFiltered.filter(filters[key]);
    }
  });

  const toggleTreeView = () => {
    setIsTreeView(!isTreeView);
    setCategoria("fecha_registro")
  };

  const categoryCount = useMemo(() => {
    const datosOrg = organizarDatosPorCategoria(dataMantenimientosFiltered,categoria)
    return Object.keys(datosOrg).length

},[categoria,dataMantenimientosFiltered])


  return (
    <Container maxWidth="sm" sx={{ display: "flex", justifyItems: "center", alignItems: "center", marginTop: "1rem", marginBottom: "1rem" }}>
      <Paper elevation={3} sx={{ width: "100%" }}>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" paddingBottom="1rem">
          <Box display="flex" justifyContent="center" alignItems="center" gap=".5rem">
            {dataMantenimientos.length > 0 && (
              <>
                <IconButton color="primary" aria-label="views" onClick={toggleTreeView} title="Cambiar vista">
                  {isTreeView ? <FormatListNumberedIcon /> : <AccountTreeIcon />}
                </IconButton>
                <IconButton color="primary" aria-label="download-file" onClick={() => handleDownloadExcel(dataMantenimientosFiltered)} title="Descargar excel">
                  <FileDownloadIcon fontSize="large" />
                </IconButton>
                <MyMenu setCurrentOption={setCurrentOption} />
              </>
            )}
            <IconButton color="primary" aria-label="add-mantos" onClick={() => navigate("/add")} title="Registrar manto">
              <AddCircleIcon fontSize="large" />
            </IconButton>
            <AddSi />
          </Box>

          <SearchBox
            autocompleteOptions={autocompleteOptions}
            currentOption={currentOption}
            setCurrentOption={setCurrentOption}
            searchTerm={searchTerm}
            onChangeSearchTerm={onChangeSearchTerm} />

          {dataLoaded ? (
            isTreeView ? (
              <CustomizedTreeView data={[...dataMantenimientosFiltered].reverse()} viewAll={viewAll} />
            ) : (
              <>
                <CategorySelector setCategoria={setCategoria} />
                <ListView data={[...dataMantenimientosFiltered].reverse()} setDatos={setDataMantenimientos} viewAll={viewAll} categoria={categoria} />
              </>
            )
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "95%", paddingTop: "1rem", paddingBottom: "1rem" }}>
              <ListSkeleton />
            </Box>
          )}

          {categoryCount > 1 && (
            <Button variant="contained" onClick={() => setViewAll(!viewAll)}>
              <Typography>
                {viewAll ? "Ver menos" : `Ver todos (${categoryCount})`}
              </Typography>
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Home;
