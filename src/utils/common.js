export function formatDate(dateString, separator = '-') {
  const inputDate = dateString ? new Date(dateString) : new Date();

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, '0');
  const date = String(inputDate.getDate()).padStart(2, '0');

  return `${year}${separator}${month}${separator}${date}`;
}


export const organizarDatosPorFecha = (datos) => {
  const datosOrganizados = {};

  datos.forEach((manto) => {
    const fechaRegistro = formatDate(manto.fecha_registro);

    if (!datosOrganizados[fechaRegistro]) {
      datosOrganizados[fechaRegistro] = [];
    }

    datosOrganizados[fechaRegistro].push(manto);
  });

  return datosOrganizados;
};

export const organizarJerarquia = (lista) => {
  const resultado = {};

  lista.forEach((objeto) => {
    const { fecha_registro, institucion, servicio, tipo_mantenimiento, modelo } = objeto;
    const fechaF= formatDate(fecha_registro)
    if (!resultado[fechaF]) {
      resultado[fechaF] = {};
    }

    if (!resultado[fechaF][institucion]) {
      resultado[fechaF][institucion] = {};
    }

    if (!resultado[fechaF][institucion][servicio]) {
      resultado[fechaF][institucion][servicio] = {};
    }

    if (!resultado[fechaF][institucion][servicio][tipo_mantenimiento]) {
      resultado[fechaF][institucion][servicio][tipo_mantenimiento] = {};
    }

    if (!resultado[fechaF][institucion][servicio][tipo_mantenimiento][modelo]) {
      resultado[fechaF][institucion][servicio][tipo_mantenimiento][modelo] = [];
    }

    resultado[fechaF][institucion][servicio][tipo_mantenimiento][modelo].push(objeto);
  });

  return resultado;
};