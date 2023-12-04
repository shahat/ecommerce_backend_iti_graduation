const express = require("express");
const { googleAuthCallback } = require("../controller/googleAuthCallback");
const router = express.Router();

router.get("/auth/google/callback", googleAuthCallback);

module.exports = router;
