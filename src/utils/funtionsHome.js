export async function fetchDatos(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Hubo un problema con la petición Fetch de ${url}: ${response.status}`);
    }
    return response.json();
  }
  
  export function mapOptions(options, data, labelKey) {
    const instOptMap = new Map();
    data.forEach(item => {
      instOptMap.set(item.id, item[labelKey]);
    });
  
    const mappedOptions = options.map(it => {
      const itemName = instOptMap.get(it[`${labelKey}_id`]);
      return {
        ...it,
        [labelKey]: itemName || `${labelKey} no encontrado`,
      };
    });
  
    return mappedOptions;
  }
  
  export function createMap(data, labelKey) {
    const map = new Map();
    data.forEach(item => {
      map.set(item.id, item[labelKey]);
    });
    return map;
  }