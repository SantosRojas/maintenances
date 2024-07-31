import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { Container, Paper, Autocomplete, Box, Button, TextField, Typography, IconButton } from "@mui/material"
import { formatDate, handleAddComponent } from "../utils/common"
import ListadoRepuestos from "../components/ListadoRepuestos"
import Exito from "../components/Exito"
import Error from "../components/Error"
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { FormSkeleton } from "../components/skeleton";
import Warning from "../components/Warning";
import MyInput from "../components/MyInput";
import LoadingModal from "../components/LoadingModal";

const AddMantos = () => {

    const tipos = [
        {
            id: 1,
            tipo: "Preventivo"
        },
        {
            id: 2,
            tipo: "Preventivo-Correctivo"
        },
        {
            id: 3,
            tipo: "Correctivo"
        }
    ]

    //VARIABLES PARA EL FORMULARIO
    const [serie, setSerie] = useState("")
    const [qr, setQr] = useState("")
    const [modelo, setModelo] = useState(null)
    const [tipoMantenimiento, setTipoMantenimiento] = useState(tipos[0]);
    const [repuestoCambiado, setRepuestoCambiado] = useState(null)
    const [repuestosCambiados, setRepuestosCambiados] = useState([])
    const [institucion, setInstitucion] = useState(null)
    const [servicio, setServicio] = useState(null)
    const [comentarios, setComentarios] = useState("")
    const [date, setDate] = useState(formatDate(undefined, true))
    const [softwareVersion, setSoftwareVersion] = useState(null)
    const [workHours,setWorkHours] = useState("")

    const [servicioInput, setServicioInput] = useState("")
    const [institucionIput, setInstitucionInput] = useState("")
    const [softwareVersionInput, setSoftwareVersionInput] = useState("")


    //VARIABLES EL FETCH
    const [instituciones, setInstituciones] = useState(null)
    const [servicios, setServicios] = useState(null)
    const [modelos, setModelos] = useState(null)
    const [repuestos, setRepuestos] = useState(null);
    const [softwareVersions,setSoftwareVersions] = useState([])
    const [dataLoaded, setDataLoaded] = useState(false); // Nuevo estado para controlar la carga de datos
    const [loading, setLoading] = useState(false);
    const objetCurrentUser = localStorage.getItem("currentUser");
    const currentUser = JSON.parse(objetCurrentUser);


    const [showForm, setShowForm] = useState(true)
    const [exito, setExito] = useState(true)
    const [warning, setWarning] = useState(false)
    const [errorSerie, setErrorSerie] = useState(false)

    const navigate = useNavigate()

    // Pedir datos al servidor
    useEffect(() => {
        // Realiza las solicitudes de datos una vez cuando el componente se monta
        Promise.all([
            fetch("https://ssttapi.mibbraun.pe/instituciones").then((response) => response.json()),
            fetch("https://ssttapi.mibbraun.pe/servicios").then((response) => response.json()),
            fetch("https://ssttapi.mibbraun.pe/tipos").then((response) => response.json()),
            fetch("https://ssttapi.mibbraun.pe/repuestos").then((response) => response.json()),
            fetch(`https://ssttapi.mibbraun.pe/lastmaintenace/${currentUser.id}`).then((response) => response.json()),
            fetch("https://ssttapi.mibbraun.pe/softwareversion").then((response) => response.json())

        ])
            .then(([institucionesData, serviciosData, modelosData, repuestosData, lastMaintenanceData, softwareVersionsData]) => {
                setInstituciones(institucionesData);
                setServicios(serviciosData);
                setModelos(modelosData);
                setRepuestos(repuestosData)
                setRepuestosCambiados([repuestosData[repuestosData.length - 1].repuesto])
                setSoftwareVersions(softwareVersionsData)
                setSoftwareVersion(softwareVersionsData[0])

                if (lastMaintenanceData.length !== 0) {
                    //seteamos los ultimos datos
                    const { modelo_id, institucion_id, servicio_id, fecha_registro } = lastMaintenanceData[0];
                    const fechaActual = formatDate(undefined, true)

                    if (fechaActual === fecha_registro.split("T")[0]) {
                        setModelo(modelosData.find(m => m.id === modelo_id))
                        setInstitucion(institucionesData.find(i => i.id === institucion_id))
                        setServicio(serviciosData.find(s => s.id === servicio_id))
                    }
                }

                setDataLoaded(true);// Marca los datos como cargados
            })
            .catch((error) => console.error(error));
    }, [currentUser.id]);


    useEffect(() => {
        if (tipoMantenimiento && repuestos) {
            const newRepuestosCambiados = tipoMantenimiento.tipo !== "Preventivo"
                ? []
                : [repuestos[0].repuesto];
            setRepuestosCambiados(newRepuestosCambiados);
        }
    }, [tipoMantenimiento, repuestos]);


    const sendData = (dataToSend) => {
        fetch("https://ssttapi.mibbraun.pe/mantenimientos", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        })
            .then(resp => {
                if (resp.status === 200) {
                    setExito(true);
                } else {
                    setExito(false);
                }
                return resp.json()
            })
            .then(data => {
                setLoading(false);
                setShowForm(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                setExito(false); // Puedes configurar esto según tus necesidades
            });

    }


    const handleAddData = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            let newInstitucion = institucion
            let newServicio = servicio
            let newSoftwareVersion = softwareVersion

            const isDiferentInst = institucion ? institucionIput !== institucion.institucion : true
            const isDiferentServ = servicio ? servicioInput !== servicio.servicio : true
            const isDiferentSoft = softwareVersion ? softwareVersionInput !== softwareVersion.software_version : true


            if (isDiferentInst) {
                newInstitucion = instituciones.find(inst => inst.institucion === institucionIput.trim().toUpperCase())

                if (newInstitucion) {
                    setInstitucion(newInstitucion)
                } else {
                    console.log("Agregando nueva institucion")
                    newInstitucion = await handleAddComponent({ institucion: institucionIput.trim().toUpperCase() })
                    setInstitucion(newInstitucion)
                    setInstituciones(prevState => [...prevState, newInstitucion])

                }

            }

            if (isDiferentServ) {
                newServicio = servicios.find(serv => serv.servicio === servicioInput.trim())
                if (newServicio) {
                    setServicio(newServicio)

                } else {
                    console.log("Agregado nuevo servicio")
                    newServicio = await handleAddComponent({ servicio: servicioInput.trim() })
                    setServicio(newServicio)
                    setServicios(prevState => [...prevState, newServicio])

                }
            }

            if (isDiferentSoft) {
                newSoftwareVersion = softwareVersions.find(soft => soft.software_version === softwareVersionInput.trim())
                if (newSoftwareVersion) {
                    setSoftwareVersion(newSoftwareVersion)

                } else {
                    console.log("Agregado nuevo softwareversion")
                    newSoftwareVersion = await handleAddComponent({ software_version: softwareVersionInput.trim() })
                    setSoftwareVersion(newSoftwareVersion)
                    setSoftwareVersions(prevState => [...prevState, newSoftwareVersion])

                }
            }



            const dataToSend = {
                "serie": serie,
                "qr": qr,
                "modelo_id": modelo.id,
                "tipo_mantenimiento": tipoMantenimiento.tipo,
                "repuestos_cambiados": repuestosCambiados.join(', '),
                "institucion_id": newInstitucion.id,
                "servicio_id": newServicio.id,
                "responsable_id": currentUser.id,
                "comentarios": comentarios,
                "fecha_registro": date,
                "software_version":newSoftwareVersion.software_version,
                "work_hours": workHours
            };
            console.log(dataToSend);

            const response = await fetch("https://ssttapi.mibbraun.pe/mantenimientos");
            const data = await response.json();

            // Verificar si la serie coincide para la misma fecha
            const serieCoincide = data.some((registro) => registro.serie === dataToSend.serie && formatDate(registro.fecha_registro, true) === dataToSend.fecha_registro);

            if (serieCoincide) {
                setLoading(false)
                setShowForm(false);
                setExito(false)
                setWarning(true)
                // Realizar acciones adicionales si la serie coincide.
            } else {
                sendData(dataToSend)
            }

        } catch (error) {
            console.error("Error al obtener los mantenimientos:", error);
            setLoading(false)
            setExito(false)
        }
    };


    const handleDeleteItem = (indexToDelete) => {
        // Crea una nueva matriz sin el elemento en el índice dado
        const updatedItems = repuestosCambiados.filter((_, index) => index !== indexToDelete);
        setRepuestosCambiados(updatedItems);
    };

    const handleAcept = () => {
        setShowForm(true)
    }

    return (
        <Container maxWidth="xs" style={{ display: "flex" }}>
            <Paper
                elevation={3}
                sx={
                    { display: "flex", marginTop: "1rem", flexDirection: "column", gap: "1rem", padding: ".5rem", width: "100%", alignItems: "center" }
                }>
                <Box
                    display="flex"
                    gap="1rem"
                    justifyContent="center"
                    alignItems="center"
                >
                    <IconButton color="primary" aria-label="arrow-back" onClick={e => navigate("/home")}>
                        <ArrowBackRoundedIcon fontSize="large" />
                    </IconButton>

                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>Ver Registros</Typography>

                </Box>
                {
                    showForm ? (
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>
                            {
                                (dataLoaded) ? (
                                    <form onSubmit={handleAddData} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                        <MyInput
                                            label={"Serie"}
                                            value={serie}
                                            setValue={setSerie}
                                            error={errorSerie}
                                            setError={() => setErrorSerie(false)}
                                            helperText={errorSerie ? "Se aceptan 6 cifras como maximo " : ""}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setSerie(value);
                                                setErrorSerie(value.length > 6)
                                            }}

                                        />

                                        <MyInput
                                            label={"Qr"}
                                            value={qr}
                                            setValue={setQr}
                                            onChange={(e) => setQr(e.target.value)}
                                        />


                                        <Autocomplete
                                            size="small"
                                            id="modelo"
                                            options={modelos}
                                            getOptionLabel={(option) => option.modelo}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            value={modelo}
                                            onChange={(_, value) => setModelo(value)}
                                            renderInput={(params) => <TextField {...params} label="Modelo de bomba" fullWidth required />}
                                        />

                                        <Autocomplete
                                            size="small"
                                            id="tipo"
                                            options={tipos}
                                            getOptionLabel={(option) => option.tipo}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            value={tipoMantenimiento}
                                            onChange={(_, value) => setTipoMantenimiento(value)}
                                            renderInput={(params) => <TextField {...params} label="Tipo de mantenimiento" fullWidth required />}
                                        />

                                        {
                                            tipoMantenimiento !== null && (
                                                (tipoMantenimiento.tipo !== "Preventivo") && (
                                                    <div style={{ width: "100%" }}>
                                                        <Autocomplete
                                                            size="small"
                                                            id="repuestos"
                                                            options={repuestos}
                                                            getOptionLabel={(option) => option.repuesto}
                                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                                            value={repuestoCambiado}
                                                            onChange={(_, value) => {
                                                                setRepuestoCambiado(value)
                                                                if (value !== null && !repuestosCambiados.includes(value.repuesto)) setRepuestosCambiados([value.repuesto, ...repuestosCambiados])
                                                            }}
                                                            renderInput={(params) => <TextField {...params} label="Repuestos cambiados" fullWidth required />}
                                                        />
                                                        {
                                                            repuestosCambiados.length > 0 && <ListadoRepuestos listado={repuestosCambiados} handleDeleteItem={handleDeleteItem} />
                                                        }
                                                    </div>
                                                )
                                            )
                                        }



                                        <Autocomplete
                                            freeSolo
                                            id="institucion"
                                            size="small"
                                            options={instituciones}
                                            getOptionLabel={(option) => option.institucion || ""}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            onInputChange={(_, value) => setInstitucionInput(value)}
                                            value={institucion}
                                            onChange={(_, value) => value ? setInstitucion(value) : setInstitucion(null)}
                                            renderInput={(params) => <TextField {...params} label="Institucion" fullWidth required />}
                                        />

                                        <Autocomplete
                                            freeSolo
                                            id="servicios"
                                            size="small"
                                            options={servicios}
                                            getOptionLabel={(option) => option.servicio || ""}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            value={servicio}
                                            onInputChange={(_, value) => setServicioInput(value)}
                                            onChange={(_, value) => value ? setServicio(value) : setServicio(null)}
                                            renderInput={(params) => <TextField {...params} label="Servicio" fullWidth required />}
                                        />


                                        <Autocomplete
                                            freeSolo
                                            id="software"
                                            size="small"
                                            options={softwareVersions}
                                            getOptionLabel={(option) => option.software_version || ""}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            value={softwareVersion}
                                            onInputChange={(_, value) => setSoftwareVersionInput(value)}
                                            onChange={(_, value) => value ? setSoftwareVersion(value) : setSoftwareVersion(null)}
                                            renderInput={(params) => <TextField {...params} label="Version de software" fullWidth required />}
                                        />

                                        <TextField size="small" type="text" value={workHours} label="Horas de trabajo" onChange={(e) => setWorkHours(e.target.value)} required />


                                        <TextField size="small" type="date" value={date} label="Fecha" onChange={(e) => setDate(e.target.value)} required />

                                        <TextField size="small" type="text" value={comentarios} label="Comentarios" onChange={(e) => setComentarios(e.target.value)} />

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={errorSerie}
                                            sx={{ fontWeight: "bold" }} >Agregar</Button>

                                        {loading && (
                                            <LoadingModal loading={loading} setLoading={setLoading} message="Agregando mantenimiento"/>
                                        )}
                                    </form>
                                ) : <FormSkeleton />
                            }
                        </Box>
                    ) : (
                        exito ? (
                            <Exito handleAcept={handleAcept} message="Registrado con éxito" />
                        ) : (
                            warning ? (
                                <Warning setShowForm={setShowForm} />
                            ) : < Error setShowForm={setShowForm} />

                        )
                    )
                }
            </Paper>
        </Container>
    )
}

export default AddMantos;