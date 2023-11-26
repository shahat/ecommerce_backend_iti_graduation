const express = require("express");
const router = express.Router();
const userRouter = require("./users.js");
const {
    getAllAdmins,
    addAdmin,
    login,
    logOut,
    modifyAdmin,
    removeAdmin,
} = require("../controller/admin.js");

// router.get("/", getAllAdmins);
router.post("/register", addAdmin);
router.post("/login", login);
router.get("/logout", logOut);
// router.patch("/", modifyAdmin);
// router.delete("/", removeAdmin);

module.exports = router;
