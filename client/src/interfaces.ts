export interface IUser {
  name: string;
  email: string;
  password?: string;
  token: string;
}

export interface IRecipe {
  name: string;
  ingredients: string;
  directions: string;
  tags: string[];
  _id?: string;
  createdAt?: string;
}
