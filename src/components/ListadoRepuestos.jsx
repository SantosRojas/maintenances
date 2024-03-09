import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Delete } from '@mui/icons-material';
import { useTheme } from '@emotion/react';

const style = {
    width: '100%',
    bgcolor: 'background.paper',
};

export default function ListadoRepuestos({ listado,handleDeleteItem }) {
    const theme = useTheme()
    return (
        <List sx={style} component="nav" aria-label="mailbox folders">
            {
                listado.map((item, index) => (
                    <div key={index}>
                        <ListItem>
                            <ListItemText primary={item} />
                            <ListItemIcon sx={{
                                color:theme.palette.primary.main,
                                cursor: "pointer"
                            }} onClick={e=>{
                                handleDeleteItem(index)
                            }}
                            
                            title={`Eliminar ${item}`}>
                                <Delete />
                            </ListItemIcon>
                        </ListItem>
                        <Divider />
                    </div>
                ))
            }


        </List>
    );
}
