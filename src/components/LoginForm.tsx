import { LoginRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { TextField, Typography, Box } from '@mui/material';
import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { loginThunk, reset } from '../feature/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../app/store';
import { AuthFormData } from '../utils/customTypes';
import { getCartThunk } from '../feature/cart/cartSlice';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<AuthFormData>({
    username: '',
    password: '',
  });
  const { username, password } = formData;

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, isSuccess, user, isError, message } = useAppSelector(
    store => store.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
      dispatch(reset());
    }

    if (isSuccess || user?.username) {
      dispatch(getCartThunk());
      navigate('/');
    }
  }, [isSuccess, user, isError, message, dispatch, navigate]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const userData = {
      username: username.toLowerCase(),
      password,
    };
    dispatch(loginThunk(userData));
  };
  return (
    <Fragment>
      <form onSubmit={onSubmitHandler}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          maxWidth={400}
          height={350}
          alignItems="center"
          justifyContent={'center'}
          margin="auto"
          mt={13}
          p={3}
          borderRadius={5}
          rowGap={'10px'}
          boxShadow={
            '0px 2px 4px 2px rgb(0 0 0 / 20%), 0px 4px 5px 2px rgb(0 0 0 / 14%), 0px 1px 10px 2px rgb(0 0 0 / 12%)'
          }
        >
          <Box display={'flex'} flexDirection={'row'} alignItems="center">
            <LoginRounded fontSize="large" />
            <Typography variant="h4" textAlign="center">
              Login
            </Typography>
          </Box>
          <TextField
            variant="outlined"
            label="Username"
            name="username"
            type="username"
            required
            value={username}
            onChange={onChangeHandler}
            sx={{ width: '300px' }}
          />
          <TextField
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            required
            value={password}
            onChange={onChangeHandler}
            sx={{ width: '300px' }}
          />
          <LoadingButton
            loading={isLoading}
            variant="outlined"
            type="submit"
            sx={{ mt: 3, width: '200px' }}
            size={'large'}
          >
            LOGIN
          </LoadingButton>
          <Link to={'/register'}>No account yet? Register</Link>
        </Box>
      </form>
    </Fragment>
  );
};

export default LoginForm;
