import { Router } from "express";
import TagsController from "../../controllers/tagsController";
import auth from "../../middleware/auth";

const router = Router();
/**
 * @route   GET api/tags
 * @desc    Get User tags
 * @access  Private
 */

router.get("/", auth, async (req: any, res: any) => {
  try {
    const tags = await TagsController.getUserTags(req.user);

    res.send(tags);
  } catch (e) {
    res.status(500).send({ msg: e.message });
  }
});

export default router;
