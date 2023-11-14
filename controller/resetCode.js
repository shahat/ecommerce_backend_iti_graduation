const usersModel = require("../models/user");

const resetCode = async (req, res) => {
  const { enteredCode } = req.body;
  console.log("enteredCode From reset Code", enteredCode);

  if (!enteredCode) {
    return res.status(400).json({ message: "Code is required" });
  } else {
    try {
      const user = await usersModel.findOne({ passwordResetCode: enteredCode });
      console.log("is the user exist with the entered code? ->", user);

      if (user) {
        const codeCreatedAt = user.passwordResetCodeExpires;
        const currentTime = new Date();
        const timeDifference = (currentTime - codeCreatedAt) / (1000 * 60);

        if (timeDifference <= 5) {
          // Code is valid, proceed to the next stage
          return res
            .status(200)
            .json({ message: "Code is valid, proceed to reset password", userId: user._id });
        } else {
          // Code has expired, inform the user
          return res
            .status(400)
            .json({ message: "Code has expired. Please request a new code" });
        }
      } else {
        // Invalid code, inform the user
        return res.status(400).json({ message: "Invalid code" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
};
module.exports = resetCode;
