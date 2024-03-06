import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';

const options = [
  "Agregar Servicio",
  "Agregar Institucion",
  "Agregar Repuesto",
  "Cerrar Session"
];

const defaultSelectedOption = options[0];

export default function AddSi() {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

  };

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleSelectedOption = (optionSelected) => {
    if(optionSelected === options[0]){
      navigate("/addc/servicio")
    }
    else if(optionSelected === options[1]){
      navigate("/addc/institucion")
    }
    else if(optionSelected === options[2]){
      navigate("/addc/repuesto")
    }else{
      navigate("/",{ replace: true })
    }
    handleClose()
    console.log(optionSelected)
  };

  return (
    <div>
      <IconButton
        color="primary"
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        onClick={handleClick}
        title='Buscar'
      >
        <MoreVertIcon fontSize="large" />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === defaultSelectedOption}
            onClick={(e) => handleSelectedOption(option)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
