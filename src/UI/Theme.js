import React from 'react';
import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    fontFamily: `"Merriweather", serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  palette: {
    primary: {
      light: '#fff',
      main: '#fff',
      // dark: '#fff',
      contrastText: '#fff',
    },
    secondary: {
      light: '#000',
      main: '#ddd',
      // dark: '#fff',
      contrastText: '#000',
    },
  },
  overrides: {
    'MuiInput-root': {
      fontFamily: 'inherit',
    },
    MuiButton: {
      // Name of the rule
      text: {
        fontFamily: 'inherit',
      },
      containedPrimary: {
        color: 'black',
      },
    },
    MuiCssBaseline: {
      '@global': {
        html: {
          fontSize: 16,
          WebkitFontSmoothing: 'auto',
        },
        body: {
          backgroundColor: '#fff',
        },
      },
    },
  },
});

export const Theme = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);
