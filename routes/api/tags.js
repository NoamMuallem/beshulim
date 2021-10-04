const { Router } = require("express");
const auth = require("../../middleware/auth");
const router = Router();
const User = require("../../models/userModel.js");
const Tag = require("../../models/tagModel.js");

/**
 * @route   GET api/tags
 * @desc    Get User tags
 * @access  Private
 */

router.get("/", auth, async (req, res) => {
  try {
    await req.user
      .populate({
        path: "tags",
        match: { count: { $gt: 0 } },
        options: { sort: { date: -1 } },
        select: "name",
      })
      .execPopulate();

    res.send(req.user.tags);
  } catch (e) {
    res.status(500).send({ msg: e.message });
  }
});

module.exports = router;
