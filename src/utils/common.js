export function formatDate(dateString, firstYear=false, separator = '-') {
  const inputDate = dateString ? new Date(dateString) : new Date();

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, '0');
  const date = String(inputDate.getDate()).padStart(2, '0');

  if (firstYear){
    return `${year}${separator}${month}${separator}${date}`;
  }else{
    return `${date}${separator}${month}${separator}${year}`;
  }
}


export const organizarDatosPorFecha = (datos) => {
  const datosOrganizados = datos.reduce((obj, manto) => {
    const fechaRegistro = formatDate(manto.fecha_registro);
    obj[fechaRegistro] = obj[fechaRegistro] || [];
    obj[fechaRegistro].push(manto);
    return obj;
  }, {});

  const datosOrdenados = Object.fromEntries(
    Object.entries(datosOrganizados).sort((a, b) => new Date(b[0]) - new Date(a[0]))
  );

  return datosOrdenados;
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