import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Contexts
import { LanguageProvider } from './context/LanguageContext';
import { UserProvider } from './context/UserContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import SchemeFinder from './pages/SchemeFinder';
import ChannelPartners from './pages/ChannelPartners';
import AIAssistant from './pages/AIAssistant';
import Calculator from './pages/Calculator';
import Applications from './pages/Applications';

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#0f5132',
      dark: '#0a3622',
      light: '#15803d'
    },
    secondary: {
      main: '#10b981'
    }
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
  },
  shape: {
    borderRadius: 12
  }
});

export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <LanguageProvider>
        <UserProvider>
          <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/schemes" element={<SchemeFinder />} />
                  <Route path="/partners" element={<ChannelPartners />} />
                  <Route path="/assistant" element={<AIAssistant />} />
                  <Route path="/calculator" element={<Calculator />} />
                  <Route path="/applications" element={<Applications />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </UserProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
