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
      <Typography id="">{others.modelo}</Typography>
      <Typography id="repT">Repuestos Cambiados:</Typography>
      <div style={{paddingLeft:"1rem",paddingBottom:"1rem",display:"flex",flexDirection:"column"}}>
        {others.repuestos_cambiados.split(',').map((repuesto,index)=>(
          <Typography key={index} variant='p'> - {repuesto}</Typography>
        ))}
      </div>
      
    </Box>}
  </StyledTreeItem>
);


const CustomizedTreeView = ({ data,viewAll}) => {
  // Organiza los datos
  const datosOrdenados = data.sort((a, b) => new Date(b.fecha_registro) - new Date(a.fecha_registro));
  const datosOrganizados = organizarJerarquia(datosOrdenados);
  let datosLimitados

  if (!viewAll){
    datosLimitados = Object.fromEntries(Object.entries(datosOrganizados).slice(0, 1));
  }else{
    datosLimitados = datosOrganizados
  }
  
  // Crea la estructura para el TreeView
  const datosTreeView = Object.entries(datosLimitados).map(([fecha, instituciones]) => ({
    id: fecha,
    label: `Fecha: ${fecha} - Nh: ${Object.entries(instituciones).length}`,
    children: Object.entries(instituciones).map(([institucion, servicios]) => ({
      id: `${fecha}-${institucion}`,
      label: `Institución: ${institucion} - Nh: ${Object.entries(servicios).length}`,
      children: Object.entries(servicios).map(([servicio, mantenimientos]) => ({
        id: `${fecha}-${institucion}-${servicio}`,
        label: `Servicio: ${servicio} - Nh: ${Object.entries(mantenimientos).length}`,
        children: Object.entries(mantenimientos).map(([mantenimiento, objetos]) => ({
          id: `${fecha}-${institucion}-${servicio}-${mantenimiento}`,
          label: `Tipo Mantenimiento: ${mantenimiento}  - Nh: ${objetos.length}`,
          children: objetos.map((objeto) => ({
            id: `${fecha}-${institucion}-${servicio}-${mantenimiento}-${objeto.serie}`,
            label: `Serie: ${objeto.serie}`,
            others: { qr: `Qr: ${objeto.qr}`, repuestos_cambiados: objeto.repuestos_cambiados, modelo: `Modelo: ${objeto.modelo}` }
          })),
        })),
      })),
    })),
  }));

  // Renderiza el TreeView
  return (
    <Box sx={{ marginBottom:"1rem", flexGrow: 1, width: "100%" }}>
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
