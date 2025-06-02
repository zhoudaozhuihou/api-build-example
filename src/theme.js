import { createTheme } from '@material-ui/core/styles';

// 黑红白配色方案
export const colorPalette = {
  red: {
    main: '#e53935',     // 主红色
    light: '#ff6f60',    // 浅红色
    dark: '#ab000d',     // 深红色
    lighter: '#ffcdd2',  // 更浅的红色
    transparent: 'rgba(229, 57, 53, 0.1)', // 半透明红色
  },
  black: {
    main: '#212121',     // 主黑色
    light: '#484848',    // 浅黑色
    dark: '#000000',     // 深黑色
    grey: '#757575',     // 灰色
    lightGrey: '#bdbdbd', // 浅灰色
  },
  white: {
    main: '#ffffff',     // 主白色
    off: '#f5f5f5',      // 灰白色
    dark: '#e0e0e0',     // 暗白色
    paper: '#fafafa',    // 纸色
  },
  // 辅助色
  accent: {
    blue: '#29b6f6',     // 蓝色点缀
    green: '#66bb6a',    // 绿色成功
    yellow: '#ffca28',   // 黄色警告
    purple: '#9575cd',   // 紫色点缀
  },
};

// 暗色模式主题
export const darkTheme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: colorPalette.red.main,
      light: colorPalette.red.light,
      dark: colorPalette.red.dark,
      contrastText: colorPalette.white.main,
    },
    secondary: {
      main: colorPalette.black.light,
      light: colorPalette.black.lightGrey,
      dark: colorPalette.black.dark,
      contrastText: colorPalette.white.main,
    },
    error: {
      main: colorPalette.red.main,
    },
    warning: {
      main: colorPalette.accent.yellow,
    },
    info: {
      main: colorPalette.accent.blue,
    },
    success: {
      main: colorPalette.accent.green,
    },
    background: {
      default: colorPalette.black.main,
      paper: colorPalette.black.light,
    },
    text: {
      primary: colorPalette.white.main,
      secondary: colorPalette.white.dark,
      disabled: colorPalette.black.lightGrey,
    },
    divider: colorPalette.black.grey,
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          backgroundColor: colorPalette.black.main,
        },
      },
    },
    MuiButton: {
      root: {
        borderRadius: 24,
        padding: '8px 24px',
      },
      contained: {
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.25)',
        '&:hover': {
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.35)',
        },
      },
      containedPrimary: {
        background: `linear-gradient(45deg, ${colorPalette.red.dark} 0%, ${colorPalette.red.main} 100%)`,
        '&:hover': {
          background: `linear-gradient(45deg, ${colorPalette.red.main} 0%, ${colorPalette.red.light} 100%)`,
        },
      },
      outlined: {
        borderWidth: '1px',
      },
      outlinedPrimary: {
        borderColor: colorPalette.red.main,
        '&:hover': {
          backgroundColor: `${colorPalette.red.main}15`,
        },
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: 12,
      },
      elevation1: {
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)',
      },
      elevation2: {
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
      },
      elevation3: {
        boxShadow: '0 7px 20px rgba(0, 0, 0, 0.25)',
      },
      elevation4: {
        boxShadow: '0 9px 25px rgba(0, 0, 0, 0.3)',
      },
      elevation6: {
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
      },
    },
    MuiTableCell: {
      root: {
        borderBottom: `1px solid ${colorPalette.black.light}`,
      },
      head: {
        fontWeight: 600,
      },
    },
    MuiChip: {
      root: {
        borderRadius: 12,
      },
    },
    MuiTextField: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 12,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colorPalette.red.main,
            borderWidth: 2,
          },
        },
        '& .MuiInputLabel-outlined.Mui-focused': {
          color: colorPalette.red.main,
        },
      },
    },
    MuiSelect: {
      outlined: {
        borderRadius: 12,
      },
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: colorPalette.black.dark,
      },
    },
    MuiDrawer: {
      paper: {
        backgroundColor: colorPalette.black.dark,
      },
    },
  },
});

// 亮色模式主题
export const lightTheme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: colorPalette.red.main,
      light: colorPalette.red.light,
      dark: colorPalette.red.dark,
      contrastText: colorPalette.white.main,
    },
    secondary: {
      main: colorPalette.black.main,
      light: colorPalette.black.light,
      dark: colorPalette.black.dark,
      contrastText: colorPalette.white.main,
    },
    error: {
      main: colorPalette.red.main,
    },
    warning: {
      main: colorPalette.accent.yellow,
    },
    info: {
      main: colorPalette.accent.blue,
    },
    success: {
      main: colorPalette.accent.green,
    },
    background: {
      default: colorPalette.white.off,
      paper: colorPalette.white.main,
    },
    text: {
      primary: colorPalette.black.main,
      secondary: colorPalette.black.light,
      disabled: colorPalette.black.lightGrey,
    },
    divider: colorPalette.white.dark,
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 500,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          backgroundColor: colorPalette.white.off,
        },
      },
    },
    MuiButton: {
      root: {
        borderRadius: 24,
        padding: '8px 24px',
      },
      contained: {
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
        '&:hover': {
          boxShadow: '0 6px 15px rgba(0, 0, 0, 0.2)',
        },
      },
      containedPrimary: {
        background: `linear-gradient(45deg, ${colorPalette.red.dark} 0%, ${colorPalette.red.main} 100%)`,
        '&:hover': {
          background: `linear-gradient(45deg, ${colorPalette.red.main} 0%, ${colorPalette.red.light} 100%)`,
        },
      },
      outlined: {
        borderWidth: '1px',
      },
      outlinedPrimary: {
        borderColor: colorPalette.red.main,
        '&:hover': {
          backgroundColor: `${colorPalette.red.main}15`,
        },
      },
    },
    MuiPaper: {
      rounded: {
        borderRadius: 12,
      },
      elevation1: {
        boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
      },
      elevation2: {
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
      },
      elevation3: {
        boxShadow: '0 7px 20px rgba(0, 0, 0, 0.15)',
      },
      elevation4: {
        boxShadow: '0 9px 25px rgba(0, 0, 0, 0.15)',
      },
      elevation6: {
        boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
      },
    },
    MuiTableCell: {
      root: {
        borderBottom: `1px solid ${colorPalette.white.dark}`,
      },
      head: {
        fontWeight: 600,
      },
    },
    MuiChip: {
      root: {
        borderRadius: 12,
      },
    },
    MuiTextField: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 12,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colorPalette.red.main,
            borderWidth: 2,
          },
        },
        '& .MuiInputLabel-outlined.Mui-focused': {
          color: colorPalette.red.main,
        },
      },
    },
    MuiSelect: {
      outlined: {
        borderRadius: 12,
      },
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: colorPalette.black.main,
      },
    },
    MuiDrawer: {
      paper: {
        backgroundColor: colorPalette.black.dark,
      },
    },
  },
});

export default {
  lightTheme,
  darkTheme,
  colorPalette
}; 