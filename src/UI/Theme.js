import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#fff',
      main: '#fff',
      // dark: '#fff',
      contrastText: '#fff',
    },
    secondary: {
      // light: '#fff',
      main: '#ddd',
      // dark: '#fff',
      contrastText: '#000',
    },
  },
});

export const Theme = ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>;
