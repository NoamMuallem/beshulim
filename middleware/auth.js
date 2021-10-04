const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    //get the user id from jwt
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, process.env.TOKKEN_SECRET);

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

module.exports = auth;
