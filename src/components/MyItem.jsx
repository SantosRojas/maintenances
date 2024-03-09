import { useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    Icon,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useNavigate } from "react-router-dom";
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';


const MyItem = ({ item, setDatos }) => {
    const [showDetails, setShowDetails] = useState(false)
    const theme = useTheme()
    const navigate = useNavigate()
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [openDialogResult, setOpenDialogResult] = useState(false)
    const [exitoDelete, setExitoDelete] = useState(false)


    const handleDelete = () => {
        // Abre el diálogo de confirmación
        setOpenDialog(true);
    };

    const confirmDelete = async () => {
        // Realiza la eliminación después de la confirmación
        setOpenDialog(false);

        try {
            const response = await fetch(`https://ssttapi.mibbraun.pe/mantenimientos/${item.id}`, {
                method: "DELETE",
                mode: "cors",
            });

            if (response.status === 200) {
                // Aquí puedes manejar la eliminación exitosa
                console.log("Elemento eliminado con éxito");
                setDeleteMessage("Elemento eliminado con éxito");
                setExitoDelete(true);
                setOpenDialogResult(true);
            } else {
                // Aquí puedes manejar la eliminación fallida
                console.log("Error al eliminar el elemento");
                setDeleteMessage("Error al eliminar el elemento");
                setExitoDelete(false);
                setOpenDialogResult(true);
            }
        } catch (error) {
            // Manejar errores de red u otros errores
            console.error("Error en la solicitud DELETE:", error);
            setDeleteMessage("Error al eliminar el elemento");
            setExitoDelete(false);
            setOpenDialogResult(true);
        }
    };

    const cancelDelete = () => {
        // Cancela la eliminación y cierra el diálogo
        setOpenDialog(false);
    };

    return (
        <Box>
            <Box
                display="flex"
                flexDirection="column"
                sx={{
                    backgroundColor: theme.palette.primary.back,
                    gap: '1rem',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    width: '100%',
                    boxSizing: 'border-box',
                    borderLeft: '.5rem solid ' + (item.tipo_mantenimiento !== "Preventivo" ? '#4A235A' : '#9B59B6')
                }}
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                        width: "100%",
                    }}>
                    <Typography variant='p' sx={{ fontWeight: 'bold' }}>{item.serie}</Typography>
                    <Typography variant='p' sx={{ fontWeight: 'bold' }}>{item.qr}</Typography>
                    <Typography variant='p' sx={{ fontWeight: 'bold' }}>{item.modelo}</Typography>
                    <IconButton color="primary" aria-label="add-mantos" onClick={(e) => setShowDetails(!showDetails)} title="Mostrar detalles">
                        {showDetails ? (
                            <ArrowDropUpIcon fontSize="large" />
                        ) : (
                            <ArrowDropDownIcon fontSize="large" />
                        )}
                    </IconButton>
                </Box>
                {
                    showDetails && (
                        <>
                            <Typography><strong>Institucion:</strong> {item.institucion}</Typography>
                            <Typography><strong>Servicio:</strong> {item.servicio}</Typography>
                            {
                                item.repuestos_cambiados !== "Ninguno" && (
                                    <Box>
                                <Typography><strong>Repuestos Cambiados:</strong></Typography>
                                <List>
                                    {
                                        item.repuestos_cambiados.split(',').map((rep, index) => (
                                            <ListItem key={index} disablePadding>
                                                <Box
                                                    display="flex"
                                                    gap="1rem">
                                                    <Icon color="primary">
                                                        <HomeRepairServiceIcon />
                                                    </Icon>
                                                    <ListItemText >{rep}</ListItemText>
                                                </Box>

                                            </ListItem>
                                        ))
                                    }
                                </List>
                            </Box>
                                )
                            }

                            <Typography> <strong>Mantenimiento:</strong> {item.tipo_mantenimiento}</Typography>
                            {item.comentarios !== "" && (
                                <Typography><strong>Comentarios:</strong> {item.comentarios}</Typography>
                            )}
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center">
                                <Button variant="contained" onClick={(e) => navigate(`/edit/${item.id}`)}>Editar</Button>
                                <Button variant="contained" color="error" onClick={(e) => handleDelete()}>Eliminar</Button>
                            </Box>
                        </>
                    )
                }
                {/* Diálogo de confirmación */}
                <Dialog open={openDialog} onClose={cancelDelete}>
                    <DialogTitle>Confirmar Eliminación</DialogTitle>
                    <DialogContent>
                        <Typography>
                            ¿Estás seguro de que deseas eliminar este elemento?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={cancelDelete}>Cancelar</Button>
                        <Button onClick={confirmDelete} color="error">
                            Eliminar
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openDialogResult}
                    onClose={() => setOpenDialogResult(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        Respuesta
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            {deleteMessage}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(e) => {
                            setOpenDialogResult(false)
                            if (exitoDelete) setDatos((prevDatos) => prevDatos.filter(dato => dato.id !== item.id))
                        }} autoFocus>
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>

            </Box>
        </Box >
    )
}

export default MyItem;