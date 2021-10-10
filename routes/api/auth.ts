import { Router } from "express";
import auth from "../../middleware/auth";
import User from "../../models/userModel.js";
import { sendPasswordReset } from "../../emails/send-email";
import { IUser } from "../../interfaces";
import UserController from "../../controllers/userController";

const router = Router();

/**
 * @route   POST api/auth/register
 * @desc    Register new user
 * @access  Public
 */

router.post("/register", async (req: any, res: any) => {
  const { name, email, password } = req.body;

  try {
    const registeredUser = await UserController.registerNewUser(
      name,
      email,
      password
    );
    res.status(201).send(registeredUser);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

/**
 * @route   POST api/auth/login
 * @desc    Login user
 * @access  Public
 */

router.post("/login", async (req: any, res: any) => {
  try {
    const { user, token } = await UserController.login(
      req.body.email,
      req.body.password
    );
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

router.get("/user", auth, async (req: any, res: any) => {
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

router.delete("/user", auth, async (req: any, res: any) => {
  try {
    await UserController.deleteUser(req.user);
    res.json({ msg: "משתמש נמחק בהצלחה" });
  } catch (e) {
    res.status(400).json({ msg: "לא הייתה אפשרות למחוק את המשתמש" });
  }
});

/**
 * @route   Patch api/auth/user
 * @desc    update user data
 * @access  Private
 */

router.patch("/user", auth, async (req: any, res: any) => {
  try {
    const user = await UserController.updateUser(req.body, req.user);
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
router.get("/user/password/:email", async (req: any, res: any) => {
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

/**
 * @route   Post api/auth/user/logout
 * @desc    Delete user session by removing token from user token array
 * @access  private
 */
router.post("/user/logout", auth, async (req: any, res: any) => {
  try {
    const user: IUser = req.user;

    const newTokens = user.tokens.filter((token) => token.token !== req.token); //keep all tokens that dont belong to this session
    console.log(newTokens);
    req.user.tokens = newTokens;
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

/**
 * @route   Delete api/auth/user
 * @desc    Delete user and all asociated uaer data with it
 * @access  private
 */
router.delete("/user", auth, async (req: any, res: any) => {
  try {
    await req.user.remove();

    res.send(req.user);
  } catch {
    res.status(500).send();
  }
});

export default router;
