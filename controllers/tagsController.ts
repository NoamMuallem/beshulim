import UserSchema from "../models/userModel";

export default class TagsController {
  static async getUserTags(user: typeof UserSchema) {
    await user
      .populate({
        path: "tags",
        match: { count: { $gt: 0 } },
        options: { sort: { date: -1 } },
        select: "name",
      })
      .execPopulate();

    return user.tags;
  }
}
