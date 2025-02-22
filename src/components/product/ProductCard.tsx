import React, { useMemo } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAppDispatch, useAppSelector } from '../../app/store';
import {
  addCartThunk,
  decreaseCartQuantity,
  increaseCartQuantity,
} from '../../feature/cart/cartSlice';

interface ProductCardProps {
  _id: string;
  image: string;
  title: string;
  price: number;
  description?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  _id,
  image,
  title,
  price,
  description,
}) => {
  const dispatch = useAppDispatch();
  const { cartItems } = useAppSelector(state => state.cart);
  const { user } = useAppSelector(state => state.auth);

  const quantity = useMemo(() => {
    return cartItems.find(item => item._id === _id)?.quantity || 0;
  }, [cartItems, _id]);

  return (
    <Card sx={{ maxWidth: 345, m: 2, boxShadow: 3 }}>
      {/* Product Image */}
      <CardMedia
        component="img"
        height="200"
        image={image}
        alt={title}
        sx={{ objectFit: 'cover' }}
      />

      {/* Product Details */}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          ${price.toFixed(2)}
        </Typography>
      </CardContent>

      {/* Action Buttons */}
      <CardActions sx={{}}>
        <div style={{ marginTop: 'auto' }}>
          {quantity === 0 ? (
            <Button
              variant="contained"
              startIcon={<ShoppingCartIcon />}
              onClick={() => {
                dispatch(increaseCartQuantity({ _id, title, price }));
                if (user?.username) dispatch(addCartThunk());
              }}
              sx={{ width: '100%', height: '50px' }}
            >
              Add to Cart
            </Button>
          ) : (
            <div
              style={{
                gap: '.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  gap: '.5rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    dispatch(decreaseCartQuantity({ _id, title, price }));
                    if (user?.username) dispatch(addCartThunk());
                  }}
                >
                  -
                </Button>
                <div>
                  <span style={{ fontSize: '20px' }}> {quantity} </span>{' '}
                </div>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    dispatch(increaseCartQuantity({ _id, title, price }));
                    if (user?.username) dispatch(addCartThunk());
                  }}
                >
                  +
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
