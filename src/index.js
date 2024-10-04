import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import {rgba } from 'polished';
import { getColorFromLocalStorage } from './utils/common';


const AppWithThemePicker = () => {
  const [primaryColor, setPrimaryColor] = useState(getColorFromLocalStorage()); // Estado para el color principal

  // Crear tema dinámico basado en el color seleccionado
  const theme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: primaryColor,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-start"

        sx={{
          width: "100%",
          minHeight: "100vh",
          backgroundColor: rgba(theme.palette.primary.main,0.2)
        }} >
        <App setPrimaryColor ={setPrimaryColor} />
      </Box>
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AppWithThemePicker />
  </React.StrictMode>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
