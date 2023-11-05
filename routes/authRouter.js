const express = require("express");
const router = express.Router();
const {
  signUp,
  signIn,
  logOut,
  forgotPassword,
} = require("../controller/authController");

router.post("/signup", signUp);
router.post("/signup/:id", signUp);
router.post("/signin", signIn);
router.get("/logout", logOut);
router.post("/forgotPassword", forgotPassword);
module.exports = router;
