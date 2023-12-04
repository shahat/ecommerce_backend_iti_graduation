const { google } = require("googleapis");

const oauthClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRECT,
  "http://localhost:4000/auth/google/callback"
);

module.exports = { oauthClient };
