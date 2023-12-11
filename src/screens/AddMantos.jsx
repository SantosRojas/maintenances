import { useEffect, useState } from "react"
import { Container, Paper, Autocomplete, Box, Button, CircularProgress, Modal, TextField, Typography } from "@mui/material"
import Variants from "../components/skeletonForm"
import { formatDate, getCurrentDate } from "../utils/common"
import ListadoRepuestos from "../components/ListadoRepuestos"
import Exito from "../components/Exito"
import Error from "../components/Error"

const AddMantos = () => {

    //VARIABLES PARA EL FORMULARIO
    const [serie, setSerie] = useState("")
    const [qr, setQr] = useState("")
    const [modelo, setModelo] = useState(null)
    const [tipoMantenimiento, setTipoMantenimiento] = useState(null)
    const [repuestoCambiado, setRepuestoCambiado] = useState(null)
    const [repuestosCambiados, setRepuestoCambiados] = useState([])
    const [institucion, setInstitucion] = useState(null)
    const [servicio, setServicio] = useState(null)
    const [comentarios, setComentarios] = useState("")


    //VARIABLES EL FETCH
    const [instituciones, setInstituciones] = useState(null)
    const [servicios, setServicios] = useState(null)
    const [modelos, setModelos] = useState(null)
    const [repuestos, setRepuestos] = useState(null);
    const [dataLoaded, setDataLoaded] = useState(false); // Nuevo estado para controlar la carga de datos
    const [loading, setLoading] = useState(false);
    const objetCurrentUser = localStorage.getItem("currentUser");
    const currentUser = JSON.parse(objetCurrentUser);

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
    const [showForm, setShowForm] = useState(true)
    const [exito, setExito] = useState(true)

    useEffect(() => {

        // Realiza las solicitudes de datos una vez cuando el componente se monta
        Promise.all([
            fetch("https://ssttapi.mibbraun.pe/instituciones").then((response) => response.json()),
            fetch("https://ssttapi.mibbraun.pe/servicios").then((response) => response.json()),
            fetch("https://ssttapi.mibbraun.pe/tipos").then((response) => response.json()),
            fetch("https://ssttapi.mibbraun.pe/repuestos").then((response) => response.json())
        ])
            .then(([institucionesData, serviciosData, modelosData, repuestosData]) => {
                setInstituciones(institucionesData);
                setServicios(serviciosData);
                setModelos(modelosData);
                setRepuestos(repuestosData)
                setDataLoaded(true);// Marca los datos como cargados
            })
            .catch((error) => console.error(error));
    }, []);


    const handleAddData = (e) => {
        e.preventDefault();
        setLoading(true);
        const fecha = formatDate()
        const dataToSend = {
            "serie": serie,
            "qr": qr,
            "modelo": modelo.tipo,
            "tipo_mantenimiento": tipoMantenimiento.tipo,
            "repuestos_cambiados": repuestosCambiados.join(', '),
            "institucion": institucion.institucion,
            "servicio": servicio.servicio,
            "responsable": currentUser.usuario,
            "comentarios": comentarios,
            "fecha_registro": fecha
        }

        console.log(dataToSend)


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
                console.log(data);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
                setExito(false); // Puedes configurar esto según tus necesidades
            });

        console.log("agreganddo data")
    };

    const handleDeleteItem = (indexToDelete) => {
        // Crea una nueva matriz sin el elemento en el índice dado
        const updatedItems = repuestosCambiados.filter((_, index) => index !== indexToDelete);
        setRepuestoCambiados(updatedItems);
      };

    return (
        <Container maxWidth="xs" style={{ display: "flex", alignItems: "center", minHeight: "100vh" }}>
            <Paper
                elevation={3}
                sx={
                    { display: "flex", marginTop: "1rem", flexDirection: "column", gap: "1rem", padding: "1rem", width: "100%", alignItems: "center" }
                }>
                {
                    showForm ? (
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>
                    {
                        (dataLoaded) ? (
                            <form onSubmit={handleAddData} style={{ display: "flex", flexDirection: "column", "gap": "1rem" }}>

                                <TextField
                                    type="number"
                                    value={serie}
                                    label="Serie"
                                    onChange={(e) => setSerie(e.target.value)}
                                    required />

                                <TextField
                                    type="number"
                                    value={qr}
                                    label="Qr"
                                    onChange={(e) => setQr(e.target.value)}
                                    required />

                                <Autocomplete
                                    id="modelo"
                                    options={modelos}
                                    getOptionLabel={(option) => option.tipo}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={modelo}
                                    onChange={(_, value) => setModelo(value)}
                                    renderInput={(params) => <TextField {...params} label="Modelo de bomba" fullWidth required />}
                                />

                                <Autocomplete
                                    id="tipo"
                                    options={tipos}
                                    getOptionLabel={(option) => option.tipo}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={tipoMantenimiento}
                                    onChange={(_, value) => setTipoMantenimiento(value)}
                                    renderInput={(params) => <TextField {...params} label="Tipo de mantenimiento" fullWidth required />}
                                />

                                <div style={{width:"100%"}}>
                                    <Autocomplete
                                        id="repuestos"
                                        options={repuestos}
                                        getOptionLabel={(option) => option.repuesto}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        value={repuestoCambiado}
                                        onChange={(_, value) => {
                                            console.log(value)
                                            setRepuestoCambiado(value)
                                            if (value !== null && !repuestosCambiados.includes(value.repuesto)) setRepuestoCambiados([value.repuesto,...repuestosCambiados])
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Repuestos cambiados" fullWidth required />}
                                    />
                                    {
                                        repuestosCambiados.length>0 && <ListadoRepuestos listado={repuestosCambiados} handleDeleteItem={handleDeleteItem} />
                                    }
                                </div>

                                <Autocomplete
                                    id="institucion"
                                    options={instituciones}
                                    getOptionLabel={(option) => option.institucion}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={institucion}
                                    onChange={(_, value) => setInstitucion(value)}
                                    renderInput={(params) => <TextField {...params} label="Institucion" fullWidth required />}
                                />

                                <Autocomplete
                                    id="servicios"
                                    options={servicios}
                                    getOptionLabel={(option) => option.servicio}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    value={servicio}
                                    onChange={(_, value) => setServicio(value)}
                                    renderInput={(params) => <TextField {...params} label="Servicio" fullWidth required />}
                                />


                                <TextField type="text" value={comentarios} label="Comentarios" onChange={(e) => setComentarios(e.target.value)} />

                                <Button type="submit" variant="contained" sx={{ marginTop: "1rem", padding: "1rem", fontWeight: "bold" }} >Agregar</Button>

                                {loading && (
                                    <Modal
                                        open={loading}
                                        onClose={() => setLoading(false)}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                            <CircularProgress />
                                            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                                Agregando incidencia
                                            </Typography>
                                        </Box>
                                    </Modal>
                                )}
                            </form>
                        ) : <Variants />
                    }
                </Box>
                    ):(
                        exito ? (
                            <Exito setShowForm = {setShowForm} />
                        ):(< Error setShowForm = {setShowForm} />)
                    )
                }
            </Paper>
        </Container>
    )
}

export default AddMantos;