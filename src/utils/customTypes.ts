export type AuthFormData = {
  username: string;
  password: string;
};

export type LoginData = {
  token: string;
  username: string;
};

export type CartItem = {
  _id: string;
  quantity: number;
  title: string;
  price: number;
};

export type ProductsType = {
  _id: string;
  title: string;
  price: number;
  description: string;
};
