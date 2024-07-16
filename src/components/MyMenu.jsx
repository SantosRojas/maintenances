import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import { searchOptions } from '../utils/constants';
const options = searchOptions
const defaultSelectedOption = options[0].key;

export function MyMenu ({setCurrentOption}) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);

    };

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleSelectedOption = (optionSelected) => {
        console.log(optionSelected)
        setCurrentOption(optionSelected)
        handleClose()
    };

    return (
        <div>
            <IconButton
                color='primary'
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                onClick={handleClick}
                title='Buscar'
            >
                <SearchIcon fontSize="large" />
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
                        key={option.id}
                        selected={option.labelMenu === defaultSelectedOption}
                        onClick={(e) => handleSelectedOption(option.key)}
                    >
                        {option.labelMenu}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}