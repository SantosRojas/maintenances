import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { Container, Paper, Box, Button, CircularProgress, Modal, TextField, Typography, IconButton } from "@mui/material"
import Exito from "../components/Exito"
import Error from "../components/Error"
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditIcon from '@mui/icons-material/Edit';

const AddComponents = () => {
    const { key } = useParams();

    //VARIABLES PARA EL FORMULARIO
    const [component, setComponent] = useState("")
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(true)
    const [exito, setExito] = useState(true)

    const navigate = useNavigate()

    const keyMap = {
        "servicio":"servicios",
        "institucion":"instituciones",
        "repuesto":"repuestos"
    }


    const sendData = (dataToSend) => {

        fetch(`https://ssttapi.mibbraun.pe/${keyMap[key]}`, {
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
    }

    const handleAddData = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const dataToSend = {
            [key]: component
        };

        console.log(dataToSend);

        try {
            sendData(dataToSend)

        } catch (error) {
            console.error("Error:", error);
            setLoading(false)
            setExito(false)
        }
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
                        <ArrowBackRoundedIcon fontSize="large"/>
                    </IconButton>

                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>{key.toUpperCase()}S</Typography>
                    <IconButton color="primary" aria-label="edit-components" onClick={(e) => navigate(`/editc/${key}`)} title="Editar componentes">
                        <EditIcon fontSize="large" />
                    </IconButton>

                </Box>
                {
                    showForm ? (
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>
                            <form onSubmit={handleAddData} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                                <TextField
                                    size="small"
                                    value={component}
                                    label={key}
                                    onChange={(e) => setComponent(e.target.value)}
                                    required />

                                <Button type="submit" variant="contained" sx={{ fontWeight: "bold" }} >Agregar</Button>

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
                                                Agregando {key}
                                            </Typography>
                                        </Box>
                                    </Modal>
                                )}
                            </form>
                        </Box>
                    ) : (
                        exito ? (
                            <Exito setShowForm={setShowForm} message={key} />
                        ) : (
                            < Error setShowForm={setShowForm} />
                        )
                    )
                }
            </Paper>
        </Container>
    )
}

export default AddComponents;