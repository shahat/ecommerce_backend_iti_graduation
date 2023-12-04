const userModel = require("../models/user");

const updateOrCreateUserFromOauth = async ({ oauthUserInfo }) => {
  const { id: googleId, email } = oauthUserInfo;

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    const result = await userModel.findOneAndUpdate(
      { email },
      { $set: { googleId } },
      { returnOriginal: false }
    );
    return result.value;
  } else {
    const result = await userModel.insertOne({ email, googleId });
    return result.ops[0];
  }
};

module.exports = { updateOrCreateUserFromOauth };
