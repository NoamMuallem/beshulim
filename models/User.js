const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Recipe = require("./Recipe");
const { sendEmailVerification } = require("../emails/send-email");
require("dotenv").config();

// Create Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  register_date: {
    type: Date,
    default: Date.now,
  },
});

//setting relationship between tasks and user, not an actual filed in user, therefore virtual
UserSchema.virtual("recipes", {
  ref: "Recipe", //just so mongoose can figure out what is owned by what and their relations
  localField: "_id",
  foreignField: "owner", //he fields that connects the 2 documents (like in sql keys)
});

//setting relationship between tasks and user, not an actual filed in user, therefore virtual
UserSchema.virtual("tags", {
  ref: "Tag", //just so mongoose can figure out what is owned by what and their relations
  localField: "_id",
  foreignField: "owner", //he fields that connects the 2 documents (like in sql keys)
});

//generating user authentication token SPECIFIC OBJECT METHODS LIVE IN METHODS
UserSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id }, process.env.TOKKEN_SECRET);

  return token;
};

//user login MODEL FUNCTION LIVE IN STATICS
UserSchema.statics.findByCredentials = async (email, password) => {
  //look for user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("unable to login");
  }
  //is was found by email, check if password is like on the db
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("unable to login");
  }
  return user;
};

//hash the plain text password
UserSchema.pre("save", async function (next) {
  const user = this;

  //if thar is a new password(by creating or updating), we have to hash it:
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  //if email is changed resend email verification
  if (user.isModified("email")) {
    user.confirmed = false;
    sendEmailVerification(user);
  }

  //when we done, not gone save the user if not called
  next();
});

//make sure hat when we send user back it will not contain the password and tokens
UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tags;

  return userObject;
};

//delete user tasks when user is removed
UserSchema.pre("remove", async function (next) {
  const user = this;
  await Recipe.deleteMany({ owner: user._id });
  next();
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
