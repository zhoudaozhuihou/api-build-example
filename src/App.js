import React from 'react';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { Route, Switch, Redirect } from 'react-router-dom';
import Navigation from './components/Navigation';
import ApiCatalog from './pages/ApiCatalog';
import LowCode from './pages/LowCode';
import CategorySelectorDemo from './components/CategorySelectorDemo';

// 创建主题
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
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
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          backgroundColor: '#f5f5f5',
        },
      },
    },
  },
});

function AppContent() {
  return (
    <>
      <Navigation />
      <Container maxWidth="lg" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <Switch>
          <Route path="/catalog" component={ApiCatalog} />
          <Route path="/lowcode" component={LowCode} />
          <Route path="/category-demo" component={CategorySelectorDemo} />
          <Route exact path="/">
            <Redirect to="/catalog" />
          </Route>
        </Switch>
      </Container>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Switch>
        <Route path="*" component={AppContent} />
      </Switch>
    </ThemeProvider>
  );
}

export default App; 