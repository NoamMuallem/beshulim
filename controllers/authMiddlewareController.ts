import config from "../config";
import { IJETUserPayload } from "interfaces.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export default class AuthMiddelwareController {
  static async getUserFromToken(token: string) {
    const decoded = jwt.verify(token, config.TOKKEN_SECRET!) as IJETUserPayload;

    //find user with that id that have an active seesion (with that token)
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error("התחברות נכשלה"); //will triger catch
    }

    return user;
  }
}
