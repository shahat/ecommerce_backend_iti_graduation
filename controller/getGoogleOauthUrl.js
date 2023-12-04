const { getGoogleOauthUrl } = require("../utils/getGoogleOauthUrl");

const getGoogleUrl = (req, res) => {
  const url = getGoogleOauthUrl();
  res.status(200).json({ url });
};

module.exports = { getGoogleUrl };
