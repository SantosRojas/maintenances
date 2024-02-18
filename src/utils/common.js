import ExcelJS from "exceljs"

export function formatDate(dateString, firstYear = false, separator = '-') {
  const inputDate = dateString ? new Date(dateString) : new Date();

  const year = inputDate.getFullYear();
  const month = String(inputDate.getMonth() + 1).padStart(2, '0');
  const date = String(inputDate.getDate()).padStart(2, '0');

  if (firstYear) {
    return `${year}${separator}${month}${separator}${date}`;
  } else {
    return `${date}${separator}${month}${separator}${year}`;
  }
}


export const organizarDatosPorFecha = (datos) => {
  const dataSortByDate = datos.sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro));
  const datosOrganizados = dataSortByDate.reduce((obj, manto) => {
    const fechaRegistro = formatDate(manto.fecha_registro);
    obj[fechaRegistro] = obj[fechaRegistro] || [];
    obj[fechaRegistro].push(manto);
    return obj;
  }, {});

  return datosOrganizados;
};


export const organizarJerarquia = (lista) => {
  const resultado = {};

  lista.forEach((objeto) => {
    const { fecha_registro, institucion, servicio, tipo_mantenimiento } = objeto;
    const fechaF = formatDate(fecha_registro);

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
      resultado[fechaF][institucion][servicio][tipo_mantenimiento] = [];
    }

    resultado[fechaF][institucion][servicio][tipo_mantenimiento].push(objeto);
  });

  return resultado;
};


export const handleDownloadExcel = async (data, filename = 'Mantenimientos') => {
  try {
    // Crea un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Definir las cabeceras
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);

    // Agregar datos
    data.forEach(obj => {
      const row = [];
      headers.forEach(header => {
        row.push(obj[header]);
      });
      worksheet.addRow(row);
    });

    // Guardar el libro de Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${formatDate()}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);

    console.log('Archivo Excel descargado satisfactoriamente.');
  } catch (err) {
    console.error('Error al descargar el archivo Excel:', err);
  }
};

