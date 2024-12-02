import React from 'react';
import { Box, AppBar, Toolbar, Container } from '@mui/material';
import Logo from '../shared/Logo';

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Logo size="medium" />
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>

      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Logo size="small" />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
