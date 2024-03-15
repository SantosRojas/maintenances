import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Autocomplete, Box, Button, CircularProgress, Modal, TextField, Typography, IconButton } from "@mui/material";
import { formatDate } from "../utils/common";
import ListadoRepuestos from "../components/ListadoRepuestos";
import Exito from "../components/Exito";
import Error from "../components/Error";
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useParams} from "react-router-dom";
import { FormSkeleton } from "../components/skeleton";

const Edit = () => {
    const { id } = useParams();

    const [serie, setSerie] = useState("");
    const [qr, setQr] = useState("");
    const [modelo, setModelo] = useState(null);
    const [tipoMantenimiento, setTipoMantenimiento] = useState(null);
    const [repuestoCambiado, setRepuestoCambiado] = useState(null);
    const [repuestosCambiados, setRepuestoCambiados] = useState([]);
    const [institucion, setInstitucion] = useState(null);
    const [servicio, setServicio] = useState(null);
    const [comentarios, setComentarios] = useState("");
    const [date, setDate] = useState(formatDate());
    const [dataLoaded, setDataLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line
    const [mantenimiento, setMantenimiento] = useState(null);

    //VARIABLES EL FETCH
    const [instituciones, setInstituciones] = useState(null)
    const [servicios, setServicios] = useState(null)
    const [modelos, setModelos] = useState(null)
    const [repuestos, setRepuestos] = useState(null);
    

    const tipos = useMemo(() => [
        { id: 1, tipo: "Preventivo" },
        { id: 2, tipo: "Preventivo-Correctivo" },
        { id: 3, tipo: "Correctivo" }
    ], []); 

    const [showForm, setShowForm] = useState(true);
    const [exito, setExito] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        Promise.all([
            fetch("https://ssttapi.mibbraun.pe/instituciones").then((response) => response.json()),
            fetch("https://ssttapi.mibbraun.pe/servicios").then((response) => response.json()),
            fetch("https://ssttapi.mibbraun.pe/tipos").then((response) => response.json()),
            fetch("https://ssttapi.mibbraun.pe/repuestos").then((response) => response.json()),
            fetch(`https://ssttapi.mibbraun.pe/mantenimientos/${id}`).then((response) => response.json())
        ])
            .then(([institucionesData, serviciosData, modelosData, repuestosData, mantenimientoData]) => {
                setInstituciones(institucionesData);
                setServicios(serviciosData);
                setModelos(modelosData);
                setRepuestos(repuestosData);
                setMantenimiento(mantenimientoData[0]);
                setSerie(mantenimientoData[0].serie);
                setQr(mantenimientoData[0].qr);
                setModelo(modelosData.find((modelo) => modelo.id === mantenimientoData[0].modelo_id));
                setTipoMantenimiento(tipos.find((tipo) => tipo.tipo === mantenimientoData[0].tipo_mantenimiento));
                setInstitucion(institucionesData.find((inst) => inst.id === mantenimientoData[0].institucion_id));
                setServicio(serviciosData.find((serv) => serv.id === mantenimientoData[0].servicio_id));
                setComentarios(mantenimientoData[0].comentarios);
                setDate(formatDate(mantenimientoData[0].fecha_registro,true));
                const repuestosResponse = mantenimientoData[0].repuestos_cambiados.split(', ')
                setRepuestoCambiados(repuestosResponse)
                setRepuestoCambiado(repuestosData.find((repuesto) => repuesto.repuesto===repuestosResponse[repuestosResponse.length-1]))
                setDataLoaded(true);
            })
            .catch((error) => console.error(error));
    }, [id,tipos]);

    

    const handleEditData = (e) => {
        e.preventDefault();
        setLoading(true);

        const dataToSend = {
            "id":id,
            "serie":serie,
            "qr":qr,
            "modelo_id": modelo.id,
            "tipo_mantenimiento": tipoMantenimiento.tipo,
            "repuestos_cambiados": repuestosCambiados.join(', '),
            "institucion_id": institucion.id,
            "servicio_id": servicio.id,
            "comentarios": comentarios,
            "fecha_registro": date
        };

        fetch(`https://ssttapi.mibbraun.pe/mantenimientos/${id}`, {
            method: "PATCH",
            mode: "cors",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        })
            .then((resp) => {
                if (resp.status === 200) {
                    setExito(true);
                } else {
                    setExito(false);
                }
                return resp.json();
            })
            .then((data) => {
                setLoading(false);
                setShowForm(false);
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                setExito(false);
            });
    };

    const handleDeleteItem = (indexToDelete) => {
        // Crea una nueva matriz sin el elemento en el índice dado
        const updatedItems = repuestosCambiados.filter((_, index) => index !== indexToDelete);
        setRepuestoCambiados(updatedItems);
    };


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
                        <ArrowBackRoundedIcon />
                    </IconButton>

                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>Edit Maintenance</Typography>

                </Box>
                {
                    showForm ? (
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>
                            {
                                (dataLoaded) ? (
                                    <form onSubmit={handleEditData} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                                        <TextField
                                            size="small"
                                            type="number"
                                            value={serie}
                                            label="Serie"
                                            onChange={(e) => setSerie(e.target.value)}
                                            required />

                                        <TextField
                                            size="small"
                                            type="number"
                                            value={qr}
                                            label="Qr"
                                            onChange={(e) => setQr(e.target.value)}
                                            required />

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
                                                    if (value !== null && !repuestosCambiados.includes(value.repuesto)) setRepuestoCambiados([value.repuesto, ...repuestosCambiados])
                                                }}
                                                renderInput={(params) => <TextField {...params} label="Repuestos cambiados" fullWidth required />}
                                            />
                                            {
                                                repuestosCambiados.length > 0 && <ListadoRepuestos listado={repuestosCambiados} handleDeleteItem={handleDeleteItem} />
                                            }
                                        </div>

                                        <Autocomplete
                                            id="institucion"
                                            size="small"
                                            options={instituciones}
                                            getOptionLabel={(option) => option.institucion}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            value={institucion}
                                            onChange={(_, value) => setInstitucion(value)}
                                            renderInput={(params) => <TextField {...params} label="Institucion" fullWidth required />}
                                        />

                                        <Autocomplete
                                            id="servicios"
                                            size="small"
                                            options={servicios}
                                            getOptionLabel={(option) => option.servicio}
                                            isOptionEqualToValue={(option, value) => option.id === value.id}
                                            value={servicio}
                                            onChange={(_, value) => setServicio(value)}
                                            renderInput={(params) => <TextField {...params} label="Servicio" fullWidth required />}
                                        />


                                        <TextField size="small" type="date" value={date} label="Fecha" onChange={(e) => setDate(e.target.value)} required />

                                        <TextField size="small" type="text" value={comentarios} label="Comentarios" onChange={(e) => setComentarios(e.target.value)} />

                                        <Button type="submit" variant="contained" sx={{ fontWeight: "bold" }} >Editar</Button>

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
                                                        Editando incidencia
                                                    </Typography>
                                                </Box>
                                            </Modal>
                                        )}
                                    </form>
                                ) : <FormSkeleton />
                            }
                        </Box>
                    ) : (
                        exito ? (
                            <Exito setShowForm={setShowForm} textAux="Seguir Editando"/>
                        ) : (< Error setShowForm={setShowForm} />)
                    )
                }
            </Paper>
        </Container>

    );
};

export default Edit;
