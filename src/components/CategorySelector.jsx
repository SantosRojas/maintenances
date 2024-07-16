import React, { useState } from 'react';
import { FormControl, FormGroup, FormControlLabel, Radio } from '@mui/material';

const CategorySelector = ({setCategoria}) => {
    const [selectedValue, setSelectedValue] = useState('fecha_registro');

    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
        setCategoria(event.target.value)
        console.log(event.target.value)
    };

    const radios = [
        { id: 'fecha_registro', label: 'Fecha' },
        { id: 'institucion', label: 'Institucion' },
        { id: 'modelo', label: 'Modelo' },
    ];

    return (
        <FormControl
         component="fieldset"
         >
            <FormGroup row>
                {radios.map((radio) => (
                    <FormControlLabel
                        key={radio.id}
                        control={
                            <Radio
                                checked={selectedValue === radio.id}
                                onChange={handleRadioChange}
                                value={radio.id}
                                name="radio-button"
                            />
                        }
                        label={radio.label}
                    />
                ))}
            </FormGroup>
        </FormControl>
    );
};

export default CategorySelector;