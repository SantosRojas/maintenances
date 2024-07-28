import ExcelJS from "exceljs"

export function formatDate(dateString, firstYear = false, separator = '-') {
  const inputDate = dateString ? new Date(dateString) : new Date(); // Usar fecha actual si no se proporciona ninguna cadena

  const year = inputDate.getUTCFullYear();
  const month = String(inputDate.getUTCMonth() + 1).padStart(2, '0');
  const date = String(inputDate.getUTCDate()).padStart(2, '0');

  if (firstYear) {
    return `${year}${separator}${month}${separator}${date}`;
  } else {
    return `${date}${separator}${month}${separator}${year}`;
  }
}


export const organizarJerarquia = (lista) => {
  const resultado = {};

  lista.forEach((objeto) => {
    const { fecha_registro, institucion, servicio, modelo } = objeto;
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

    if (!resultado[fechaF][institucion][servicio][modelo]) {
      resultado[fechaF][institucion][servicio][modelo] = [];
    }

    resultado[fechaF][institucion][servicio][modelo].push(objeto);
  });

  return resultado;
};


export const handleDownloadExcel = async (data, filename = 'Mantenimientos') => {
  const dataReducida = data.map(seleccionarCampos)
  try {
    // Crea un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Definir las cabeceras
    const headers = Object.keys(dataReducida[0]);
    worksheet.addRow(headers);

    // Agregar datos
    dataReducida.forEach(obj => {
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

const seleccionarCampos = (objeto) => {
  return {
    serie: objeto.serie,
    qr: objeto.qr,
    modelo: objeto.modelo,
    tipo_mantenimiento: objeto.tipo_mantenimiento,
    repuestos_cambiados: objeto.repuestos_cambiados,
    institucion: objeto.institucion,
    servicio: objeto.servicio,
    fecha_registro: objeto.fecha_registro,
    fecha_actualizacion: objeto.fecha_actualizacion,
    comentarios: objeto.comentarios

  };
};


export const initialOptions = (options, value) => {
  return options.reduce((acc, option) => {
    acc[option.key] = value;
    return acc;
  }, {});

}

export function getUniqueFields(arr, field) {
  return [...new Set(arr.map(obj => obj[field]))];
}

export function assignIds(arr, field) {
  return arr.map((element, index) => ({
    id: index + 1,
    [field]: element
  }));
}


export const organizarDatosPorCategoria = (datos, category) => {
  const dataSortByDate = datos.sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro));
  const datosOrganizados = dataSortByDate.reduce((obj, manto) => {
    let categoryValue = manto[category]
    if (category === "fecha_registro") {
      categoryValue = formatDate(manto[category])
    }
    obj[categoryValue] = obj[categoryValue] || [];
    obj[categoryValue].push(manto);
    return obj;
  }, {});

  return datosOrganizados;
};

export async function fetchDatos(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Hubo un problema con la petición Fetch de ${url}: ${response.status}`);
  }
  return response.json();
}


export const handleAddComponent = async (component) => {
  let ruta = ""
  let key = Object.keys(component)[0];

  switch (key) {
    case "institucion":
      ruta = "instituciones";
      break;

    case "servicio":
      ruta = "servicios";
      break;
    default:
      ruta = "softwareversion";
      break;
  }


  try {
    const response = await fetch(`https://ssttapi.mibbraun.pe/${ruta}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(component)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const serverResponse = await response.json();
    const newComponentAdded = { id: serverResponse.insertId, ...component };
    return newComponentAdded;

  } catch (err) {
    console.error('Error:', err); // Puedes configurar esto según tus necesidades
    throw err;
  }
};