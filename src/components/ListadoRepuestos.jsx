import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Delete } from '@mui/icons-material';

const style = {
    width: '100%',
    bgcolor: 'background.paper',
};

export default function ListadoRepuestos({ listado,handleDeleteItem }) {
    return (
        <List sx={style} component="nav" aria-label="mailbox folders">
            {
                listado.map((item, index) => (
                    <div key={index}>
                        <ListItem>
                            <ListItemText primary={item} />
                            <ListItemIcon onClick={e=>{
                                handleDeleteItem(index)
                            }}>
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
