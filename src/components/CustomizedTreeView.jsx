import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { organizarJerarquia } from '../utils/common';
import { CloseSquare, MinusSquare, PlusSquare, StyledTreeItem } from './TreeHandlers';

const TreeNode = ({ id, label, children, others }) => (
  <StyledTreeItem key={id} nodeId={id} label={label}>
    {children && children.length > 0 ? children.map((child) => (
      <TreeNode key={child.id} {...child} />
    )) : <Box>
      <Typography id="tipomanto">{others.tipo_mantenimiento}</Typography>
      <Typography id="repT">Repuestos Cambiados:</Typography>
      <div style={{ paddingLeft: "1rem", paddingBottom: "1rem", display: "flex", flexDirection: "column" }}>
        {others.repuestos_cambiados.split(',').map((repuesto, index) => (
          <Typography key={index} variant='p'> - {repuesto}</Typography>
        ))}
      </div>

    </Box>}
  </StyledTreeItem>
);


const CustomizedTreeView = ({ data, viewAll }) => {
  // Organiza los datos
  const datosOrdenados = data.sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro));
  const datosOrganizados = organizarJerarquia(datosOrdenados);
  let datosLimitados

  if (!viewAll) {
    datosLimitados = Object.fromEntries(Object.entries(datosOrganizados).slice(0, 1));
  } else {
    datosLimitados = datosOrganizados
  }

  // Crea la estructura para el TreeView
  const datosTreeView = Object.entries(datosLimitados).map(([fecha, instituciones]) => ({
    id: fecha,
    label: <div style={{padding:".5rem 0"}}><Typography>{fecha} - Nh: {Object.entries(instituciones).length}</Typography></div>,
    children: Object.entries(instituciones).map(([institucion, servicios]) => ({
      id: `${fecha}-${institucion}`,
      label: <div style={{padding:".5rem 0"}}><Typography>{institucion} - Nh: {Object.entries(servicios).length}</Typography></div>,
      children: Object.entries(servicios).map(([servicio, modelos]) => ({
        id: `${fecha}-${institucion}-${servicio}`,
        label: <div style={{padding:".5rem 0"}}><Typography>{servicio} - Nh: {Object.entries(modelos).length}</Typography></div>,
        children: Object.entries(modelos).map(([modelo, objetos]) => ({
          id: `${fecha}-${institucion}-${servicio}-${modelo}`,
          label: <div style={{padding:".5rem 0"}}><Typography>{modelo}  - Nh: {objetos.length}</Typography></div>,
          children: objetos.map((objeto) => ({
            id: `${fecha}-${institucion}-${servicio}-${modelo}-${objeto.serie}`,
            label: (
              <div style={{display:"flex", width:"100%",justifyContent:"space-between",padding:".5rem 0"}}>
                <Typography variant="p">
                  <strong>{objeto.serie}</strong>
                </Typography>
                <Typography variant="p">
                {objeto.qr}
                </Typography>
              </div>
            ),
            others: { repuestos_cambiados: objeto.repuestos_cambiados, tipo_mantenimiento: `Mantenimiento: ${objeto.tipo_mantenimiento}` }
          })),
        })),
      })),
    })),
  }));

  // Renderiza el TreeView
  return (
    <Box sx={{ marginBottom: "1rem", flexGrow: 1, width: "100%" }}>
      <TreeView
        aria-label="customized"
        defaultExpanded={Object.keys(datosOrganizados)}
        defaultCollapseIcon={<MinusSquare />}
        defaultExpandIcon={<PlusSquare />}
        defaultEndIcon={<CloseSquare />}
        sx={{ overflowX: 'hidden' }}
      >
        {datosTreeView.map((node) => (
          <TreeNode
            key={node.id}
            {...node}
          />
        ))}
      </TreeView>
    </Box>
  );
};

export default CustomizedTreeView;
