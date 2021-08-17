import { createTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createTheme' {
  interface Theme {
    navHeight: number;
    brandSidebarWidth: number;
    backgroundColor: string;
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    navHeight: number;
    brandSidebarWidth: number;
    backgroundColor: string;
  }
}

const defaultTheme = createTheme();

export default createTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        'html, body, #root': {
          height: '100%',
        },
      },
    },
    MuiContainer: {
      root: {
        width: '950px',
      },
    },
    MuiButton: {
      root: {
        borderRadius: '4px',
        textTransform: 'none',
        color: 'rgb(40, 42, 43)',
        fontSize: '0.9rem',
        fontWeight: 600,
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
    MuiTableCell: {
      head: {
        background: '#F4F4F6',
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
    h3: {
      color: '#121C2D',
      fontSize: '1.25rem',
      fontWeight: 700,
      lineHeight: '1.75rem',
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
    text: {
      secondary: '#606B85',
    },
  },
  navHeight: 100,
  brandSidebarWidth: 250,
  backgroundColor: '#f4f4f6',
});
