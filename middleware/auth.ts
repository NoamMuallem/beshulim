import AuthMiddelwareController from "../controllers/authMiddlewareController";

const auth = async (req: any, res: any, next: Function) => {
  try {
    //get the user id from jwt
    const token: string = req.header("x-auth-token");

    const user = await AuthMiddelwareController.getUserFromToken(token);

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    res.status(401).send({ msg: e.message });
  }
};

export default auth;
