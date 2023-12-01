const express = require("express");
const router = express.Router();
const {
    getOneAdmin,
    addAdmin,
    login,
    modifyAdmin,
    removeAdmin,
} = require("../controller/admin.js");
const { tokenValidate } = require("../middlewares/isTokenValid.js");



// router.get("/tokenValidator", isTokenValid); //token=>headers
router.get("/", tokenValidate, getOneAdmin); //token=>headers
router.post("/register", tokenValidate, addAdmin); // email=>body
router.post("/login", login); // email, password=>body
router.patch("/", tokenValidate, modifyAdmin); // token=>headers, updates=>body 
router.delete("/:id", tokenValidate, removeAdmin);

module.exports = router;
