import { E_ERROR } from "./enum";

// ERRORS
export interface IMsg {
  msg: string | any;
}

// AUTH
export interface IUser {
  name?: string;
  email: string;
  password: string;
  confirmed?: boolean;
  shoppingList?: Array<string>;
}

export interface IUserTags extends Array<string> {}

export interface IError {
  id: E_ERROR;
  msg: IMsg;
}

export interface IConfigHeaders {
  headers: {
    [index: string]: string;
  };
}

// Recipe
export interface IRecipe {
  _id?: string;
  name: string;
  directions: string;
  tags: { [key: string]: number };
  image: any | undefined;
  date?: Date;
}

export interface IIngredient {
  name: string;
  units: string;
  amount: number;
}

// <<<<<<<<<<<>>>>>>>>>>>>
// <<<<<<< REDUX >>>>>>>>>
// <<<<<<<<<<<>>>>>>>>>>>>

export interface IAuthFunction {
  name?: string;
  email: string;
  password: string;
}

export interface IReturnErrors {
  msg: {
    msg: string | any;
  };
  status: string;
  id: any;
}

export interface IAction {
  type: string;
  payload?: any;
}
