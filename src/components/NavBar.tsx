import React, { Fragment, useState } from 'react';
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
import Cart from './Cart';
import {
  addCartThunk,
  clearCartInLocal,
  reset,
} from '../feature/cart/cartSlice';
import { logoutThunk } from '../feature/auth/authSlice';

const NavBar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cartQuantity, cartItems } = useAppSelector(state => state.cart);
  const { user } = useAppSelector(state => state.auth);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleCheckout = () => {
    alert('Proceeding to checkout!');
    setIsCartOpen(false);
    dispatch(reset());
    dispatch(clearCartInLocal());
    if (user?.username) dispatch(addCartThunk());
  };
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
                  onClick={() => {
                    dispatch(logoutThunk());
                    dispatch(reset());
                    dispatch(clearCartInLocal());
                  }}
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
            <IconButton
              sx={{ position: 'relative' }}
              onClick={() => setIsCartOpen(true)}
            >
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
                {cartQuantity}
              </div>
            </IconButton>
          </Box>
        </Box>
        {/* Cart Component */}
        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onCheckout={handleCheckout}
        />
      </Container>
    </AppBar>
  );
};

export default NavBar;
