import axios from '../../utils/axios';
import { AuthFormData, LoginData } from '../../utils/customTypes';

const register = async (userData: AuthFormData) => {
  const res = await axios.post('/api/auth/register', userData);
  return res.data;
};
const login = async (userData: AuthFormData) => {
  const res = await axios.post<LoginData>('/api/auth/login', userData);

  if (res) {
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('username', res.data.username);
  }
  return res.data;
};

const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
