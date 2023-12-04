const { getGoogleUser } = require("../utils/getGoogleUser");
const {
  updateOrCreateUserFromOauth,
} = require("../utils/updateOrCreateUserGoogle");
const jwt = require("jsonwebtoken");

const googleAuthCallback = async (req, res) => {
  const { code } = req.query;
  const oauthUserInfo = await getGoogleUser({ code });
  console.log("AY 7AGAAAAAA", oauthUserInfo); // Log the user info to verify

  const updatedUser = await updateOrCreateUserFromOauth({ oauthUserInfo });

  const { _id: id, email } = updatedUser;
  jwt.sign({ id, email }, process.env.JWT_SECRET, (err, token) => {
    if (err) {
      res.sendStatus(500);
    }
    res.redirect(`http://localhost:5173/login?token=${token}`);
  });
};

module.exports = { googleAuthCallback };
