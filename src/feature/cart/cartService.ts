import axios from '../../utils/axios';
import { CartItem } from '../../utils/customTypes';

const addCart = async (cartItems: CartItem[] | []) => {
  const res = await axios.post('/api/cart/add', cartItems);
  return res.data;
};

const getCart = async () => {
  const res = await axios.get('/api/cart/');
  return res.data;
};
const cartService = {
  addCart,
  getCart,
};

export default cartService;
