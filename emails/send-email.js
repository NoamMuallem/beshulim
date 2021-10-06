const config = require("../config");
const sgmail = require("@sendgrid/mail");
const generatePassword = require("password-generator");
const jwt = require("jsonwebtoken");

sgmail.setApiKey(config.SENDGRID_API_KEY);

const sendEmailVerification = async (user) => {
  const token = jwt.sign({ _id: user._id }, config.TOKKEN_SECRET);
  await sgmail.send({
    to: user.email,
    from: "thedude072@gmail.com",
    subject: "email verification from bishulim",
    text: `localhost:5000/api/email/${token}`,
  });
};

const sendPasswordReset = async (user) => {
  const password = generatePassword(12, false);
  user.password = password;
  await user.save();
  await sgmail.send({
    to: user.email,
    from: "thedude072@gmail.com",
    subject: "email verification from bishulim",
    text: `סיסמתך החדשה היא: ${password}`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgmail.send({
    to: email,
    from: "thedude072@gmail.com",
    subject: "goodbye",
    text: `good bye, ${name}, your user and all your data has bean deleted from our system.`,
  });
};

module.exports = {
  sendEmailVerification,
  sendCancelationEmail,
  sendPasswordReset,
};
