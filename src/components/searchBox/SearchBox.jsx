import { Autocomplete, Box, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { Clear } from "@mui/icons-material";
import { useInitialShowFilter } from "../../utils/constants";

export const SearchBox = ({ autocompleteOptions, currentOption, setCurrentOption,searchTerm, onChangeSearchTerm }) => {
    const [showFilter, setShowFilter] = useState(useInitialShowFilter())
    useEffect(() => {
        onChangeValue(currentOption, true)
        console.log("cambiando opcion")
    }, [currentOption])

    const handleCloseFilter = (key) => {
        onChangeValue(key, false)
        onChangeSearchTerm(key,null)
        setCurrentOption("")
    }

    const onChangeValue = (key, value) => {
        setShowFilter((prevState) => ({
            ...prevState,
            [key]: value
        }))
    }

    return (
        <Box
        sx = {{
            width:"100%"
        }}
        >
            {autocompleteOptions.map((autocompleteOption, index) => (
                showFilter[autocompleteOption.key] && (
                    <Box
                        key={index}
                        display="flex"
                        gap="1rem"
                        padding="1rem"
                        boxSizing="border-box"
                        sx={{
                            width: "100%"
                        }}
                    >
                        <Autocomplete
                            size="small"
                            fullWidth
                            value={searchTerm[autocompleteOption.key]}
                            options={autocompleteOption.options}
                            getOptionLabel={option => option[autocompleteOption.key] || ""}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderInput={(params) => (
                                <TextField {...params} label={autocompleteOption.label} fullWidth required />
                            )}
                            onChange={(_, value) => {
                                onChangeSearchTerm(autocompleteOption.key,value)
                            }}
                        />

                        <IconButton
                            onClick={(e) => handleCloseFilter(autocompleteOption.key)}
                            title={`Borrar busqueda por ${autocompleteOption.key}`}
                            color="primary">
                            <Clear />
                        </IconButton>
                    </Box>
                )
            ))}
        </Box>
    );
};
