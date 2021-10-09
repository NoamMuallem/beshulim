import { Router } from "express";
import auth from "../../middleware/auth";

const router = Router();
/**
 * @route   GET api/tags
 * @desc    Get User tags
 * @access  Private
 */

router.get("/", auth, async (req: any, res: any) => {
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

export default router;
