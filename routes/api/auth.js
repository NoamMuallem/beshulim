const { Router } = require("express");
const auth = require("../../middleware/auth");
// User Model
const User = require("../../models/User");
//email sending api
const { sendPasswordReset } = require("../../emails/send-email");
//router
const router = Router();
//hashing password for compairisent
const bcrypt = require("bcryptjs");

/**
 * @route   POST api/auth/register
 * @desc    Register new user
 * @access  Public
 */

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  let user = await User.findOne({ email });
  try {
    if (user) {
      throw new Error("כתובת המייל כבר בשימוש");
    }
    user = new User({ name, email, password, confirmed: false });
    const token = await user.generateAuthToken();
    user = await user.save();
    //returns a promise but we are not interested to await for it
    res.status(201).send({
      user: user,
      token,
    });
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
});

/**
 * @route   POST api/auth/login
 * @desc    Login user
 * @access  Public
 */

router.post("/login", async (req, res) => {
  let token = null;
  let user = null;
  try {
    user = await User.findByCredentials(req.body.email, req.body.password);
    token = await user.generateAuthToken();
    res.send({
      user,
      token,
    });
  } catch (e) {
    res.status(400).send({ msg: "כתובת המייל או סיסמא שגויים" });
  }
});

/**
 * @route   GET api/auth/user
 * @desc    Get user data
 * @access  Private
 */

router.get("/user", auth, async (req, res) => {
  try {
    //send user from auth middleware back
    res.json(req.user);
  } catch (e) {
    //return 400 and massage
    res.status(400).json({ msg: "משתמש לא קיים" });
  }
});

/**
 * @route   Delete api/auth/user
 * @desc    Dlete user data
 * @access  Private
 */

router.delete("/user", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.json({ msg: "משתמש נמחק בהצלחה" });
  } catch (e) {
    //return 400 and massage
    res.status(400).json({ msg: "לא הייתה אפשרות למחוק את המשתמש" });
  }
});

/**
 * @route   Patch api/auth/user
 * @desc    update user data
 * @access  Private
 */

router.patch("/user", auth, async (req, res) => {
  //what fileds to update
  const keys = Object.keys(req.body);
  try {
    const user = req.user;

    if (req.body["password"]) {
      //change password, have to chack if correct current password provided
      if (
        !(await bcrypt.compare(req.body.currentPassword, req.user.password))
      ) {
        throw new Error("סיסמא שגוייה");
      }
    } else if (req.body["email"]) {
      //change email, have to check that email is not taken
      const tempUser = await User.findOne({ email: req.body.email });
      if (tempUser) {
        throw new Error("כתובת המייל כבר בשימוש");
      }
    }
    keys.forEach((key) => (user[key] = req.body[key]));
    //using save to take adventage of the pre save middleware and hash password
    await user.save();
    res.json(user).status(204);
  } catch (e) {
    //return 400 and massage
    res.status(400).json({ msg: e.message });
  }
});

/**
 * @route   Patch api/auth/user/password
 * @desc    send a new password mail to user
 * @access  Public
 */
router.get("/user/password/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      throw new Error("לא קיים משתמש עם מייל זה");
    }
    sendPasswordReset(user);
    res.status(200).send({ msg: "מייל עם סיסמא חדשה נשלח" });
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
});

module.exports = router;
