import { useEffect, useState } from "react";
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
    Checkbox,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import HomeRepairServiceIcon from '@mui/icons-material/HomeRepairService';
import { CheckCircle, CircleOutlined } from "@mui/icons-material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { EditForm } from "./EditForm";


const MyItem = ({ item, setDatos, showDoneIcon, instituciones, servicios, modelos, repuestos, softwareVersions }) => {
    const [showDetails, setShowDetails] = useState(false)
    const theme = useTheme()
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [openDialogResult, setOpenDialogResult] = useState(false)
    const [exitoDelete, setExitoDelete] = useState(false)
    const [checkedIcon, setCheckedIcon] = useState(false)
    const [showFormEdit, setShowFormEdit] = useState(false)
    const [data, setData] = useState(null)


    useEffect(() => {
        setData(item)

    }, [item])


    const handleDelete = () => {
        // Abre el diálogo de confirmación
        setOpenDialog(true);
    };

    const confirmDelete = async () => {
        // Realiza la eliminación después de la confirmación
        setOpenDialog(false);

        try {
            const response = await fetch(`https://ssttapi.mibbraun.pe/mantenimientos/${data.id}`, {
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
        data && (
            !showFormEdit ? (
                <Box>
                    <Box
                        display="flex"
                        flexDirection="column"
                        sx={{
                            border: '1px solid ' + theme.palette.primary.main,
                            gap: '1rem',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    >
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{
                                width: "100%",
                            }}>
                            <Typography variant='p' sx={{ fontWeight: 'bold' }}>{data.serie}</Typography>
                            <Typography variant='p' sx={{ fontWeight: 'bold' }}>{data.qr}</Typography>
                            <Typography variant='p' sx={{ fontWeight: 'bold' }}>{data.modelo}</Typography>
                            {showDoneIcon &&
                                <Checkbox
                                    checked={checkedIcon}
                                    onChange={() => setCheckedIcon(prevState => !prevState)}
                                    aria-label="Done report"
                                    icon={<CircleOutlined />}
                                    checkedIcon={< CheckCircle />} />}

                            <IconButton color={data.tipo_mantenimiento !== "Preventivo" ? 'error' : 'info'} aria-label="add-mantos" onClick={(e) => setShowDetails(!showDetails)} title="Mostrar detalles">
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
                                    <Typography><strong>Institucion:</strong> {data.institucion}</Typography>
                                    <Typography><strong>Servicio:</strong> {data.servicio}</Typography>
                                    {
                                        data.repuestos_cambiados !== "Ninguno" && (
                                            <Box>
                                                <Typography><strong>Repuestos Cambiados:</strong></Typography>
                                                <List>
                                                    {
                                                        data.repuestos_cambiados.split(',').map((rep, index) => (
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

                                    <Typography> <strong>Mantenimiento:</strong> {data.tipo_mantenimiento}</Typography>
                                    <Typography> <strong>Version de software:</strong> {data.software_version}</Typography>
                                    <Typography> <strong>Horas de trabajo:</strong> {data.work_hours}</Typography>
                                    {data.comentarios !== "" && (
                                        <Typography><strong>Comentarios:</strong> {data.comentarios}</Typography>
                                    )}
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center">
                                        <Button variant="contained" onClick={(e) => setShowFormEdit(true)} startIcon={<EditIcon />} >Editar</Button>
                                        <Button variant="contained" color="error" onClick={(e) => handleDelete()} startIcon={<DeleteIcon />}>Eliminar</Button>
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
                                    if (exitoDelete) setDatos((prevDatos) => prevDatos.filter(dato => dato.id !== data.id))
                                }} autoFocus>
                                    Ok
                                </Button>
                            </DialogActions>
                        </Dialog>

                    </Box>
                </Box >
            ) : (
                <EditForm
                    setData={setData}
                    mantenimiento={data}
                    instituciones={instituciones}
                    servicios={servicios}
                    modelos={modelos}
                    repuestos={repuestos}
                    softwareVersions={softwareVersions}
                    setShowFormEdit={setShowFormEdit}
                />
            )
        )
    )
}

export default MyItem;