import React from 'react';
import { useTheme } from '@mui/material/styles'; // Importar correctamente useTheme desde MUI
import { Box } from '@mui/material';
import { saveColorToLocalStorage } from '../utils/common';

const ColorPicker = ({ setPrimaryColor }) => {
    const theme = useTheme();

    // Lista de colores predeterminados
    const colorOptions = ['#f8c471','#ec561a', '#17a589', '#4CAF50', '#09cade', '#2196F3', '#7253db', '#34495e'];

    // Maneja la selección de color
    const handleColorSelect = (color) => {
        setPrimaryColor(color); // Actualiza el color principal
        saveColorToLocalStorage(color)
    };

    return (
        <Box display="flex" gap=".5rem" justifyContent="center" alignItems="center" mt={2} sx={{ width: "100%", boxSizing: "border-box" }}>
            {colorOptions.map((color) => (
                <Box
                    key={color}
                    onClick={() => handleColorSelect(color)} // Maneja el clic en cada círculo
                    sx={{
                        width: '25px',
                        height: '25px',
                        borderRadius: '50%',
                        backgroundColor: color,
                        cursor: 'pointer',
                        border: color === theme.palette.primary.main ? '2px solid black' : '2px solid transparent', // Resaltar el color seleccionado
                        transition: 'border 0.3s ease',
                    }}
                />
            ))}
        </Box>
    );
};

export default ColorPicker;
