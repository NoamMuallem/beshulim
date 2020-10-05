//setting up midelware to express for authentication BEFORE routing
//this function is going to run BEFORE the routing
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    //if thar is a token replace str 'Brear' with nothing, if not replace() will throw an error that we can catch
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, process.env.TOKKEN_SECRET);
    //the token contains the user id
    //search for a user with that
    //id and that have this token in his tokens array
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new Error("התחברות נכשלה"); //will triger catch
    }
    //addind the new user we found to the requst so that the rout hendler can use it
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ msg: e.message });
  }
};

module.exports = auth;
