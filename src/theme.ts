import { createTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createTheme' {
  interface Theme {
    navHeight: number;
    brandSidebarWidth: number;
    tabletBrandSidebarWidth: number;
    backgroundColor: string;
  }

  // allow configuration using `createTheme`
  interface ThemeOptions {
    navHeight: number;
    brandSidebarWidth: number;
    tabletBrandSidebarWidth: number;
    backgroundColor: string;
  }
}

declare module '@material-ui/core/styles/createBreakpoints' {
  interface BreakpointOverrides {
    xs: true;
    sm: true;
    md: true;
    lg: true;
    xl: false;
  }
}

const BREAKPOINTS = {
  values: {
    xs: 0,
    sm: 375,
    md: 768,
    lg: 1024,
  },
};

const tabletBrandSidebarWidth = 160;

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
        maxWidth: `calc(100vw - ${tabletBrandSidebarWidth}px)`,
        [defaultTheme.breakpoints.down('md')]: {
          width: '100vw',
          maxWidth: '550px',
        },
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
      outlined: {
        backgroundColor: 'white',
        border: '1px solid #8891AA',
        [defaultTheme.breakpoints.down('md')]: {
          '&:hover': {
            backgroundColor: 'white',
          },
        },
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
    MuiTooltip: {
      tooltip: {
        fontSize: '0.9rem',
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
  tabletBrandSidebarWidth,
  backgroundColor: '#f4f4f6',
  breakpoints: BREAKPOINTS,
});
