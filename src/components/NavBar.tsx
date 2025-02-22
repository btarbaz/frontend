import React, { Fragment } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Typography,
} from '@mui/material';
import { ShoppingCartSharp } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../app/store';

import { logoutThunk } from '../feature/auth/authSlice';

const NavBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);

  return (
    <AppBar sx={{ p: 1.5 }} color="inherit">
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'sans-serif',
              fontWeight: 500,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            E-Commerce Store
          </Typography>

          <Box style={{ display: 'flex' }}>
            {user ? (
              <Fragment>
                <Button sx={{ color: 'black' }}>{user.username}</Button>
                <Button
                  sx={{ color: 'red' }}
                  onClick={() => dispatch(logoutThunk())}
                >
                  Logout
                </Button>
              </Fragment>
            ) : (
              <Fragment>
                <Button href="/login" sx={{ color: 'black' }}>
                  Login
                </Button>
                <Button href="/register" sx={{ color: 'black' }}>
                  Register
                </Button>
              </Fragment>
            )}
            <IconButton sx={{ position: 'relative' }}>
              <ShoppingCartSharp />
              <div
                style={{
                  color: 'black',
                  width: '1.5rem',
                  height: '1.5rem',
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  transform: 'translate(25%, 25%)',
                  fontSize: '15px',
                }}
              >
                {3}
              </div>
            </IconButton>
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
};

export default NavBar;
