import config from "../config";
import sgmail from "@sendgrid/mail";
import generatePassword from "password-generator";
import jwt from "jsonwebtoken";
import userSchema from "../models/userModel";

sgmail.setApiKey(config.SENDGRID_API_KEY!);

export const sendEmailVerification = async (user: typeof userSchema) => {
  const token = jwt.sign({ _id: user._id }, config.TOKKEN_SECRET!);
  await sgmail.send({
    to: user.email,
    from: "thedude072@gmail.com",
    subject: "email verification from bishulim",
    text: `localhost:5000/api/email/${token}`,
  });
};

export const sendPasswordReset = async (user: typeof userSchema) => {
  const password = generatePassword(12, false);
  user.password = password;
  await user.save();
  await sgmail.send({
    to: user.email,
    from: "thedude072@gmail.com",
    subject: "password reset",
    text: `סיסמתך החדשה היא: ${password}`,
  });
};

export const sendCancelationEmail = (email: string, name: string) => {
  sgmail.send({
    to: email,
    from: "thedude072@gmail.com",
    subject: "goodbye",
    text: `good bye, ${name}, your user and all your data has bean deleted from our system.`,
  });
};
