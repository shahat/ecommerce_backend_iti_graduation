const express = require("express");
const router = express.Router();
const { getGoogleUrl } = require("../controller/getGoogleOauthUrl");

router.get("/", getGoogleUrl);

module.exports = router;
