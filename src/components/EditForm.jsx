import { useEffect, useMemo, useState } from "react";
import { Autocomplete, Box, Button, TextField } from "@mui/material";
import { formatDate } from "../utils/common";
import ListadoRepuestos from "../components/ListadoRepuestos";
import Exito from "../components/Exito";
import Error from "../components/Error";
import MyInput from "../components/MyInput";
import LoadingModal from "./LoadingModal";

export const EditForm = ({ setData, mantenimiento, instituciones, servicios, modelos, repuestos, softwareVersions, setShowFormEdit }) => {
    const [serie, setSerie] = useState("");
    const [qr, setQr] = useState("");
    const [modelo, setModelo] = useState(null);
    const [tipoMantenimiento, setTipoMantenimiento] = useState(null);
    const [repuestoCambiado, setRepuestoCambiado] = useState(null);
    const [repuestosCambiados, setRepuestoCambiados] = useState([]);
    const [institucion, setInstitucion] = useState(null);
    const [servicio, setServicio] = useState(null);
    const [comentarios, setComentarios] = useState("");
    const [softwareVersion, setSoftwareVersion] = useState(null)
    const [workHours, setWorkHours] = useState("")
    const [date, setDate] = useState(formatDate());
    const [loading, setLoading] = useState(false);
    const [errorSerie, setErrorSerie] = useState(false)
    const [showForm, setShowForm] = useState(true);
    const [exito, setExito] = useState(true);


    const tipos = useMemo(() => [
        { id: 1, tipo: "Preventivo" },
        { id: 2, tipo: "Preventivo-Correctivo" },
        { id: 3, tipo: "Correctivo" }
    ], []);


    useEffect(() => {
        console.log("seteando datos")
        setSerie(mantenimiento.serie);
        setQr(mantenimiento.qr);
        setModelo(modelos.find((modelo) => modelo.id === mantenimiento.modelo_id));
        setTipoMantenimiento(tipos.find((tipo) => tipo.tipo === mantenimiento.tipo_mantenimiento));
        setInstitucion(instituciones.find((inst) => inst.id === mantenimiento.institucion_id));
        setServicio(servicios.find((serv) => serv.id === mantenimiento.servicio_id));
        setSoftwareVersion(softwareVersions.find((soft) => soft.software_version === mantenimiento.software_version));
        setWorkHours(mantenimiento.work_hours);
        setComentarios(mantenimiento.comentarios);
        setDate(formatDate(mantenimiento.fecha_registro, true));
        const repuestosResponse = mantenimiento.repuestos_cambiados.split(', ')
        setRepuestoCambiados(repuestosResponse)
        setRepuestoCambiado(repuestos.find((repuesto) => repuesto.repuesto === repuestosResponse[repuestosResponse.length - 1]))

    }, [mantenimiento, instituciones, servicios, modelos, repuestos, softwareVersions, tipos])


    const handleEditData = (e) => {
        e.preventDefault();
        setLoading(true);

        const dataToSend = {
            "id": mantenimiento.id,
            "serie": serie,
            "qr": qr,
            "modelo_id": modelo.id,
            "tipo_mantenimiento": tipoMantenimiento.tipo,
            "repuestos_cambiados": repuestosCambiados.join(', '),
            "institucion_id": institucion.id,
            "servicio_id": servicio.id,
            "comentarios": comentarios,
            "fecha_registro": date,
            "software_version": softwareVersion.software_version,
            "work_hours": workHours
        };

        fetch(`https://ssttapi.mibbraun.pe/mantenimientos/${mantenimiento.id}`, {
            method: "PATCH",
            mode: "cors",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        })
            .then((resp) => {
                if (resp.status === 200) {
                    setData(prevState => ({
                        ...prevState,
                        serie: serie,
                        qr: qr,
                        modelo_id: modelo.id,
                        modelo: modelo.modelo,
                        tipo_mantenimiento: tipoMantenimiento.tipo,
                        repuestos_cambiados: repuestosCambiados.join(', '),
                        institucion_id: institucion.id,
                        institucion: institucion.institucion,
                        servicio_id: servicio.id,
                        servicio: servicio.servicio,
                        comentarios: comentarios,
                        fecha_registro: date,
                        software_version: softwareVersion.software_version,
                        work_hours: workHours

                    }))
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

    const handleAcept = () => {
        setShowFormEdit(false)
    }


    return (
        <Box
            sx={{
                width: "100%",
                borderTop: "2px solid yellow",
                borderBottom: "2px solid yellow",
                padding: "2rem 0"
            }}
        >

            {
                showForm ? (
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>
                        <form onSubmit={handleEditData} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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

                            <Autocomplete
                                id="software"
                                size="small"
                                options={softwareVersions}
                                getOptionLabel={(option) => option.software_version}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                value={softwareVersion}
                                onChange={(_, value) => setSoftwareVersion(value)}
                                renderInput={(params) => <TextField {...params} label="Version de software" fullWidth required />}
                            />

                            <TextField size="small" type="text" value={workHours} label="Horas de trabajo" onChange={(e) => setWorkHours(e.target.value)} />

                            <TextField size="small" type="date" value={date} label="Fecha" onChange={(e) => setDate(e.target.value)} required />

                            <TextField size="small" type="text" value={comentarios} label="Comentarios" onChange={(e) => setComentarios(e.target.value)} />

                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                gap="1rem"
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{ fontWeight: "bold", flexBasis: '45%' }}
                                    disabled={errorSerie}
                                >
                                    Editar
                                </Button>
                                <Button
                                    color="info"
                                    variant="contained"
                                    sx={{ fontWeight: "bold", flexBasis: '45%' }}
                                    onClick={() => setShowFormEdit(false)}
                                >
                                    Cancelar
                                </Button>
                            </Box>
                        </form>

                        {loading && (
                            <LoadingModal loading={loading} setLoading={setLoading} message="Editando mantenimiento" />
                        )}
                    </Box>
                ) : (
                    exito ? (
                        <Exito handleAcept={handleAcept} message="Editado con exito" />
                    ) : (< Error setShowForm={setShowForm} />)
                )
            }
        </Box>

    );
};

