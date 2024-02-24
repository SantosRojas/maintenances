import { useTheme } from '@emotion/react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CircularProgress, IconButton, TextField, Typography, Box, Button, Modal, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useEffect, useState } from 'react';

const EditComponentItem = ({ dato, llave,setDatos }) => {
    const theme = useTheme();
    const [component, setComponent] = useState("");
    const [newComponent, setNewComponent] = useState(dato[llave]);
    const [loading, setLoading] = useState(false);
    const [edit, setEdit] = useState(false);
    const [showComponent, setShowComponent] = useState(true);
    const [exito, setExito] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteMessage, setDeleteMessage] = useState(null);
    const [openDialogResult, setOpenDialogResult] = useState(false)
    const [exitoDelete, setExitoDelete] = useState(false)

    useEffect(() => {
        setComponent(dato[llave])
        setNewComponent(dato[llave])
    }, [dato, llave])

    const keyMap = {
        "servicio": "servicios",
        "institucion": "instituciones",
        "repuesto": "repuestos"
    };

    const handleEditData = (id) => {
        setEdit(true);
    };

    const EditData = (e) => {
        e.preventDefault();
        setLoading(true);

        const dataToSend = {
            [llave]: newComponent
        };

        fetch(`https://ssttapi.mibbraun.pe/${keyMap[llave]}/${dato["id"]}`, {
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
                setShowComponent(false);
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
                setExito(false);
            });
    };

    const handleConfirm = () => {
        setComponent(newComponent)
        setEdit(false)
        setShowComponent(true)
    }

    const confirmDelete = async () => {
        // Realiza la eliminación después de la confirmación
        setOpenDialog(false);

        try {
            const response = await fetch(`https://ssttapi.mibbraun.pe/${keyMap[llave]}/${dato["id"]}`, {
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

    const handleDelete = () => {
        // Abre el diálogo de confirmación
        setOpenDialog(true);
    };

    return (
        <Box
            width="100%"
            display="flex"
            flexDirection="column"
            gap="1rem"
            sx={{
                backgroundColor: theme.palette.primary.back,
                padding: '0.5rem',
                borderRadius: '4px',
                width: '100%',
                boxSizing: 'border-box',
                border: '1px solid',
                borderColor: theme.palette.primary.main
            }}
            marginBottom="1rem"
        >
            {showComponent && (
                <>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        gap='1rem'
                    >
                        <Typography>{component}</Typography>
                        <Box
                            display="flex"
                            gap="1rem"
                        >
                            <IconButton color="primary" aria-label="edit" onClick={() => handleEditData(dato["id"])}>
                                <EditIcon fontSize="large" />
                            </IconButton>
                            <IconButton color="primary" aria-label="delete" onClick={(e) => handleDelete()}>
                                <DeleteIcon fontSize="large" />
                            </IconButton>
                        </Box>
                    </Box>

                    {edit && (
                        <form onSubmit={EditData} style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>

                            <TextField
                                size="small"
                                value={newComponent}
                                label={llave}
                                onChange={(e) => setNewComponent(e.target.value)}
                                required
                            />

                            <Button type="submit" variant="contained" sx={{ fontWeight: "bold" }}>Editar</Button>

                            {loading && (
                                <Modal
                                    open={loading}
                                    onClose={() => setLoading(false)}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                        <CircularProgress />
                                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                            Editando {llave} ...
                                        </Typography>
                                    </Box>
                                </Modal>
                            )}
                        </form>
                    )}
                </>
            )}

            {!showComponent && (
                <>
                    {exito ? (
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                        >
                            <Typography>El {llave} {dato[llave]} se modificó con éxito</Typography>
                            <Button variant="contained" color="primary" onClick={(e) => handleConfirm()}>Ok</Button>
                        </Box>
                    ) : (
                        <Box
                            display="flex"
                            flexDirection="column"
                        >
                            <Typography>Ocurrió un error al modificar el {llave} {dato[llave]}</Typography>
                            <Button variant="contained" color="primary" onClick={(e) => handleConfirm()} >Ok</Button>
                        </Box>
                    )}
                </>
            )}

            {/* Diálogo de confirmación */}
            <Dialog open={openDialog} onClose={cancelDelete}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que deseas eliminar {dato[llave]}?
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
                        if (exitoDelete) setDatos((prevDatos) => prevDatos.filter(it => it.id !== dato.id))
                    }} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EditComponentItem;
