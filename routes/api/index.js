const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const express = require("express");
const router = express.Router();
// routes
const authRoutes = require("./auth.js");
const recipesRoutes = require("./recipes.js");
const tagsRoutes = require("./tags.js");
const email = require("./email.js");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
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

module.exports = router;
