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
      main: '#444',
    },
    secondary: {
      light: '#000',
      main: '#ddd',
      contrastText: '#000',
    },
    accent: {
      main: '#005DAA',
      contrastText: '#fff',
    },
    accent2: {
      main: '#FFD200',
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
    },
    MuiTypography: {
      h3: {
        fontSize: '2rem',
      },
    },
    MuiCssBaseline: {
      '@global': {
        html: {
          fontSize: 16,
          WebkitFontSmoothing: 'auto',
          cursor: 'default',
        },
        body: {
          '--color--accent-main': '#005DAA',
          '--color--accent-dark': '#a41034',
          backgroundColor: '#f5f5f5',
        },
        b: {
          fontWeight: '900',
        },
        p: {
          marginTop: 0,
          '&:last-of-type': {
            marginBottom: 0,
          },
        },

        '.color--accent-main': {
          color: '#005DAA',
        },
        '.color--accent-dark': {
          color: '#a41034',
        },

        '.margin-top--extra-small': {
          marginTop: '0.2rem',
        },
        '.margin-top--small': {
          marginTop: '0.8rem',
        },
        '.margin-top--medium': {
          marginTop: '1rem',
        },
        '.margin-top--large': {
          marginTop: '2rem',
        },
        '.margin-top--extra-large': {
          marginTop: '6rem',
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
