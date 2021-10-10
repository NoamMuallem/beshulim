import User, { UserSchema } from "../models/userModel";
import bcrypt from "bcryptjs";

export default class UserController {
  static async registerNewUser(name: string, email: string, password: string) {
    let user = await User.findOne({ email });
    if (user) {
      throw new Error("כתובת המייל כבר בשימוש");
    }
    user = new User({ name, email, password, confirmed: false });
    const token = await user.generateAuthToken();

    return {
      user: user,
      token,
    };
  }

  static async login(email: string, password: string) {
    let token = null;
    let user = null;
    //will throw an error if no user with that credentials is found
    user = await User.findByCredentials(email, password);
    token = await user.generateAuthToken();
    return { user, token };
  }

  static async deleteUser(user: typeof UserSchema) {
    await user.remove();
  }

  static async updateUser(payload: Object, user: typeof UserSchema) {
    //what fileds to update
    const keys = Object.keys(payload);
    console.log("got password:", payload.password);
    console.log("got currentPassword:", payload.currentPassword);

    if (payload["password"]) {
      //change password, have to chack if correct current password provided
      if (!(await bcrypt.compare(payload.currentPassword, user.password))) {
        throw new Error("סיסמא שגוייה");
      }
      //change email, have to check that email is not taken
    } else if (payload["email"]) {
      const tempUser = await User.findOne({ email: payload.email });
      if (tempUser) {
        throw new Error("כתובת המייל כבר בשימוש");
      }
    }
    keys.forEach((key) => (user[key] = payload[key]));
    //using save to take adventage of the pre save middleware and hash password
    await user.save();
    return user;
  }
}
