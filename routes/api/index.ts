import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import express from "express";

const router = express.Router();
// routes
import authRoutes from "./auth";
import recipesRoutes from "./recipes";
import tagsRoutes from "./tags";
import email from "./email";
import recipeScrapper from "./recipeScrapper";

router.use(express.json({ limit: "50mb" }));
router.use(express.urlencoded({ extended: true, limit: "50mb" }));
router.use(cors());
router.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
router.use(morgan("dev"));

router.use("/recipes", recipesRoutes);
router.use("/auth", authRoutes);
router.use("/tags", tagsRoutes);
router.use("/email", email);
router.use("/scrapper", recipeScrapper);

export default router;
