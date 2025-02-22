import { Box } from '@mui/material';
import React from 'react';
import ProductCard from './ProductCard';
import { useAppSelector } from '../../app/store';

const ProductList: React.FC = () => {
  const { products } = useAppSelector(state => state.cart);
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        p: 10,
        mt: '2px',
      }}
    >
      {products &&
        products.map((product, index) => (
          <ProductCard
            key={index}
            _id={product._id}
            image={'product.png'}
            title={product.title}
            price={product.price}
            description={product.description}
          />
        ))}
    </Box>
  );
};

export default ProductList;
