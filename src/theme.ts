import { createMuiTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    navHeight: number;
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    navHeight: number;
  }
}

const defaultTheme = createMuiTheme();

export default createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        'html, body, #root': {
          height: '100%',
          background: '#f4f4f6',
        },
      },
    },
    MuiContainer: {
      root: {
        width: '800px',
      },
    },
    MuiButton: {
      root: {
        borderRadius: '4px',
        textTransform: 'none',
        color: 'rgb(40, 42, 43)',
        fontSize: '0.9rem',
        transition: defaultTheme.transitions.create(['background-color', 'box-shadow', 'border', 'color'], {
          duration: defaultTheme.transitions.duration.short,
        }),
      },
      text: {
        padding: '6px 14px',
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      },
      outlinedPrimary: {
        border: '2px solid #027AC5',
        '&:hover': {
          border: '2px solid rgb(1, 85, 137)',
        },
      },
      startIcon: {
        marginRight: '6px',
      },
    },
    MuiInputBase: {
      root: {
        fontSize: '0.9rem',
      },
    },
    MuiSelect: {
      root: {
        padding: '0.85em',
      },
    },
    MuiDialogActions: {
      root: {
        padding: '16px',
      },
    },
    MuiTextField: {
      root: {
        color: 'rgb(40, 42, 43)',
      },
    },
    MuiInputLabel: {
      root: {
        color: 'rgb(40, 42, 43)',
        fontSize: '1.1rem',
        marginBottom: '0.2em',
        fontWeight: 500,
      },
    },
    MuiOutlinedInput: {
      notchedOutline: {
        borderColor: 'rgb(136, 140, 142)',
      },
    },
    MuiTypography: {
      gutterBottom: {
        marginBottom: '36px',
      },
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      color: '#121C2D',
      fontSize: '2rem',
      fontWeight: 700,
    },
    body1: {
      color: '#121C2D',
      fontSize: '0.9rem',
      lineHeight: '1.5rem',
    },
  },
  palette: {
    primary: {
      main: '#0263E0',
    },
  },
  navHeight: 100,
});
