const express = require("express");
const router = express.Router();
const userRouter = require('./users.js')
const { signUp, signIn, logOut } = require("../controller/authController");
const {
    createUser,
    getAllUsers,
    getOneUser,
    updateOneUser,
    deleteOneUser,
  } = require("../controller/user.js");

router.use("/", userRouter)
router.post("/signup", signUp);
router.post("/signup/:id", signUp);
router.post("/signin", signIn);
router.get("/logout", logOut);




module.exports = router;
