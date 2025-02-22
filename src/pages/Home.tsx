import React, { Fragment, useEffect } from 'react';
import NavBar from '../components/NavBar';
import ProductList from '../components/product/ProductList';
import { useAppDispatch, useAppSelector } from '../app/store';
import { getCartThunk, getProducts } from '../feature/cart/cartSlice';

const Home: React.FC = () => {
  const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProducts());
    if (user?.username) dispatch(getCartThunk());
    return () => {};
  }, [dispatch, user]);

  return (
    <Fragment>
      <NavBar />
      <ProductList />
    </Fragment>
  );
};

export default Home;
