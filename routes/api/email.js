const { Router } = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel.js");
const ignoreFavicon = require("../../middleware/ignore-favicon");
require("dotenv").config();
const router = Router();

router.get("/:token", ignoreFavicon, async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.TOKKEN_SECRET);
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

module.exports = router;
