import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import config from "../config";
import { IJETUserPayload } from "interfaces.js";

const auth = async (req: any, res: any, next: Function) => {
  try {
    //get the user id from jwt
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, config.TOKKEN_SECRET!) as IJETUserPayload;

    //find user with that id that have an active seesion (with that token)
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error("התחברות נכשלה"); //will triger catch
    }

    //append user and token to req object for easy access in future handlers
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ msg: e.message });
  }
};

export default auth;
