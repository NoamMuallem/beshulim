const ignoreFavicon = (req: any, res: any, next: Function) => {
  if (req.originalUrl === "/favicon.ico") {
    res.status(204).json({ nope: true });
  } else {
    next();
  }
};

export default ignoreFavicon;
