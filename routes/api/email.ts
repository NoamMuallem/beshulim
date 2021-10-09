import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";
import ignoreFavicon from "../../middleware/ignore-favicon";
import config from "../../config";
import { IJETUserPayload } from "../../interfaces";

const router = Router();

router.get("/:token", ignoreFavicon, async (req: any, res: any) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, config.TOKKEN_SECRET!) as IJETUserPayload;
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error("קרתה תקלה, המייל לא אושר");
    }
    user.confirmed = true;
    await user.save();
    res.json({
      msg: "המייל אושר!",
      link: "https://beshulim.herokuapp.com/email-verified",
    });
  } catch (e) {
    res.json({ msg: e });
  }
});

export default router;
