import React, { Fragment, useEffect, useState } from 'react';
import { AppRegistrationRounded } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Typography, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/store';
import { AuthFormData } from '../utils/customTypes';
import { registerThunk, reset } from '../feature/auth/authSlice';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState<
    AuthFormData & { confirmPassword: string }
  >({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const { username, password, confirmPassword } = formData;

  const dispatch = useAppDispatch();
  const { isLoading, isSuccess, isError, message } = useAppSelector(
    store => store.auth
  );
  const navigate = useNavigate();
  useEffect(() => {
    if (isError) {
      alert(message);
      dispatch(reset());
    }
    if (isSuccess) {
      alert('User created, redirecting..');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      dispatch(reset());
    }
  }, [isSuccess, isError, message, dispatch, navigate]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
    } else {
      const formData = {
        username: username.toLowerCase(),
        password,
      };
      dispatch(registerThunk(formData));
    }
  };
  return (
    <Fragment>
      <form onSubmit={onSubmitHandler}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          maxWidth={400}
          height={400}
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
            <AppRegistrationRounded fontSize="large" />
            <Typography variant="h4" textAlign="center">
              Register
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
          <TextField
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
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
            REGISTER
          </LoadingButton>

          <Link to={'/login'}>Already have an account? Login</Link>
        </Box>
      </form>
    </Fragment>
  );
};

export default RegisterForm;
