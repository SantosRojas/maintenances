import * as React from 'react';
import { Box, Icon, Typography } from '@mui/material';
import { TreeView } from '@mui/x-tree-view/TreeView';
import { organizarJerarquia } from '../utils/common';
import { CloseSquare, MinusSquare, PlusSquare, StyledTreeItem } from './TreeHandlers';
import CropSquareIcon from '@mui/icons-material/CropSquare';


const TreeNode = ({ id, label, children, others }) => (
  <StyledTreeItem key={id} nodeId={id} label={label}>
    {children && children.length > 0 ? children.map((child) => (
      <TreeNode key={child.id} {...child} />
    )) : <Box>
      <Typography id="tipomanto"><strong>Mantenimiento: </strong>{others.tipo_mantenimiento}</Typography>
      {
        others.tipo_mantenimiento !== "Preventivo" && (
          <>
            <Typography id="repT" fontWeight='bold'>Repuestos Cambiados:</Typography>
            <div style={{ paddingLeft: ".5rem", paddingBottom: "1rem", display: "flex", flexDirection: "column" }}>
              {others.repuestos_cambiados.split(',').map((repuesto, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  gap="0.5rem">
                  <Icon>
                    <CropSquareIcon fontSize='small' />
                  </Icon>
                  <Typography variant='p'>{repuesto}</Typography>
                </Box>
              ))}
            </div>
          </>
        )
      }

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
    label: <div style={{ padding: ".5rem 0" }}><Typography><strong>{fecha}</strong> - {Object.entries(instituciones).length} Instituciones</Typography></div>,
    children: Object.entries(instituciones).map(([institucion, servicios]) => ({
      id: `${fecha}-${institucion}`,
      label: <div style={{ padding: ".5rem 0" }}><Typography><strong>{institucion} </strong>- {Object.entries(servicios).length} Servicios</Typography></div>,
      children: Object.entries(servicios).map(([servicio, modelos]) => ({
        id: `${fecha}-${institucion}-${servicio}`,
        label: <div style={{ padding: ".5rem 0" }}><Typography><strong>{servicio}</strong> - {Object.entries(modelos).length} Tipos</Typography></div>,
        children: Object.entries(modelos).map(([modelo, objetos]) => ({
          id: `${fecha}-${institucion}-${servicio}-${modelo}`,
          label: <div style={{ padding: ".5rem 0" }}><Typography><strong>{modelo}</strong>  - {objetos.length} Bombas</Typography></div>,
          children: objetos.map((objeto) => ({
            id: `${fecha}-${institucion}-${servicio}-${modelo}-${objeto.serie}`,
            label: (
              <Box
                display="flex"
                width="95%"
                justifyContent="space-between"
                margin=".5rem 0"
                paddingRight="0.5rem "
                style={{
                  borderRight: '.5rem solid ' + (objeto.tipo_mantenimiento !== "Preventivo" ? '#4A235A' : '#9B59B6')
                }}
                title="Mostrar detalles">
                <Typography variant="p">
                  <strong>{objeto.serie}</strong>
                </Typography>
                <Typography variant="p">
                  {objeto.qr}
                </Typography>
              </Box>
            ),
            others: { repuestos_cambiados: objeto.repuestos_cambiados, tipo_mantenimiento: objeto.tipo_mantenimiento }
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
