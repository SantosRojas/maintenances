import { Close } from "@mui/icons-material";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useRef } from "react";

const MyInput = ({label,value,setValue,error = false,setError=() => {}, helperText="",onChange}) => {
    const inputRef = useRef(null);
    return (
        <TextField
            error={error}
            size="small"
            type="number"
            value={value}
            label={label}
            helperText={helperText}
            onChange={onChange}
            inputRef={inputRef}
            InputProps={{
                endAdornment: value && (
                    <InputAdornment position="end">
                        <IconButton onClick={() => {
                            setValue('')
                            setError()
                            inputRef.current.focus()
                        }}>
                            <Close color="primary" />
                        </IconButton>
                    </InputAdornment>
                )
            }}
            required />
    )
}

export default MyInput;