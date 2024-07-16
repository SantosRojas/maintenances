import { useMemo } from "react";

export const urlMantos = (userId) => `https://ssttapi.mibbraun.pe/mantenimientos/responsableid/${userId}`;

export const searchOptions = [
  { id: 6, key: "fecha_registro", labelSearch: "Fecha de registro", labelMenu: "Buscar por Fecha" },
  { id: 2, key: "institucion", labelSearch: "Institucion", labelMenu: "Buscar por institucion" },
  { id: 3, key: "servicio", labelSearch: "Servicio", labelMenu: "Buscar por servicio" },
  { id: 4, key: "modelo", labelSearch: "Modelo", labelMenu: "Buscar por Modelo" },
  { id: 5, key: "tipo_mantenimiento", labelSearch: "Tipo de mantenimiento", labelMenu: "Buscar por mantenimiento" },
  { id: 1, key: "serie", labelSearch: "Serie", labelMenu: "Buscar por serie" }
];

const createInitialData = (initialValue) => {
  return searchOptions.reduce((obj, item) => {
    obj[item.key] = initialValue;
    return obj;
  }, {});
};

export function useInitialData() {
  const data = useMemo(() => createInitialData([]), []);
  return data;
}

export function useInitialSearchTerm() {
  const data = useMemo(() => createInitialData(null), []);
  return data;
}

export function useInitialShowFilter() {
  const data = useMemo(() => createInitialData(false), []);
  return data;
}
