import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import {
  addCartThunk,
  removeFromCart,
  saveCartInLocal,
} from '../feature/cart/cartSlice';
import { useAppDispatch, useAppSelector } from '../app/store';
import { CartItem } from '../utils/customTypes';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];

  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  cartItems,
  onCheckout,
}) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <Box sx={{ width: 350, p: 2 }}>
        {/* Cart Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6">Shopping Cart</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        {/* Cart Items */}
        <List>
          {cartItems.length === 0 ? (
            <Typography variant="body1" sx={{ mt: 2 }}>
              Your cart is empty.
            </Typography>
          ) : (
            cartItems.map(item => (
              <ListItem key={item._id} sx={{ py: 1 }}>
                <ListItemText
                  primary={item.title}
                  secondary={`$${item.price} x ${item.quantity}`}
                />
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => {
                    dispatch(removeFromCart(item._id));
                    if (user?.username) dispatch(addCartThunk());
                    dispatch(saveCartInLocal());
                  }}
                >
                  Remove
                </Button>
              </ListItem>
            ))
          )}
        </List>

        <Divider />

        {/* Cart Footer */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Total: ${totalPrice.toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={cartItems.length === 0}
            onClick={onCheckout}
          >
            Checkout
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Cart;
