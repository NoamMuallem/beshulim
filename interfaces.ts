export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  confirmed: boolean;
  tokens: Array<{ token: string; _id: string }>;
}

export interface IRecipe {
  _id: string;
  tags: string[];
  name: string;
  owner: string;
  createdAt: Date;
  updatedAtL: Date;
}

export interface IJETUserPayload {
  _id: string;
}
