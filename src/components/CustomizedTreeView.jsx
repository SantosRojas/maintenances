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
      <Typography id="qr">{others.qr}</Typography>
      <Typography id="repT">Repuestos Cambiados:</Typography>
      <div style={{paddingLeft:"1rem",paddingBottom:"1rem",display:"flex",flexDirection:"column"}}>
        {others.repuestos_cambiados.split(',').map((repuesto,index)=>(
          <Typography key={index} variant='p'> - {repuesto}</Typography>
        ))}
      </div>
      
    </Box>}
  </StyledTreeItem>
);


const CustomizedTreeView = ({ data }) => {
  const datosOrganizados = organizarJerarquia(data);
  const datosTreeView = Object.entries(datosOrganizados).map(([fecha, instituciones]) => ({
    id: fecha,
    label: `Fecha: ${fecha}`,
    children: Object.entries(instituciones).map(([institucion, servicios]) => ({
      id: `${fecha}-${institucion}`,
      label: `Institución: ${institucion}`,
      children: Object.entries(servicios).map(([servicio, mantenimientos]) => ({
        id: `${fecha}-${institucion}-${servicio}`,
        label: `Servicio: ${servicio}`,
        children: Object.entries(mantenimientos).map(([mantenimiento, modelos]) => ({
          id: `${fecha}-${institucion}-${servicio}-${mantenimiento}`,
          label: `Tipo Mantenimiento: ${mantenimiento}`,
          children: Object.entries(modelos).map(([modelo, objetos]) => ({
            id: `${fecha}-${institucion}-${servicio}-${mantenimiento}-${modelo}`,
            label: `Modelo: ${modelo}`,
            children: objetos.map((objeto) => ({
              id: `${fecha}-${institucion}-${servicio}-${mantenimiento}-${modelo}-${objeto.serie}`,
              label: `Serie: ${objeto.serie}`,
              others: { qr: `Qr: ${objeto.qr}`, repuestos_cambiados: objeto.repuestos_cambiados }
            })),
          })),
        })),
      })),
    })),
  }));

  return (
    <Box sx={{ minHeight: 270, flexGrow: 1, width: "100%" }}>
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

