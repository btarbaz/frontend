import React, { Fragment, useEffect } from 'react';
import NavBar from '../components/NavBar';
import ProductList from '../components/product/ProductList';
import { useAppDispatch } from '../app/store';
import { getProducts } from '../feature/cart/cartSlice';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProducts());

    return () => {};
  }, [dispatch]);

  return (
    <Fragment>
      <NavBar />
      <ProductList />
    </Fragment>
  );
};

export default Home;
