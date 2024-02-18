import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import VisibilityIcon from '@mui/icons-material/Visibility';

const options = [
  "Buscar por Serie",
  "Buscar por Institucion",
  "Buscar por Fecha",
  "Buscar por Responsable"
];

const defaultSelectedOption = options[0];

export default function MiMenu({ setSearchLabel }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

  };

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleSelectedOption = (optionSelected) => {
    handleClose()
    setSearchLabel(optionSelected)
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
        <VisibilityIcon fontSize="large" />
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
