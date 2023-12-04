const express = require("express");
const router = express.Router();
const resetPassword = require("../controller/resetPassword");

router.patch('/',resetPassword)

module.exports = router;
