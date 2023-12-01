const usersModel = require("../models/user");
const bcrypt = require("bcryptjs");

const resetPassword = async (req, res) => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

  const { userPassword, enteredCode } = req.body;
  const { password, confirmPassword } = userPassword;

  console.log("ENTERED CODE From reset", enteredCode);

  if (!password || !confirmPassword) {
    return res
      .status(400)
      .json({ message: "Password and confirm password are required" });
  }
  if (!passwordRegex.test(password) || !passwordRegex.test(confirmPassword)) {
    return res.status(400).json({
      message:
        "Password Should be at Least 8 Characters, One Lower Case Letter, One Uppercase Letter, Special Character",
    });
  }

  try {
    const user = await usersModel.findOne({ passwordResetCode: enteredCode });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Password and confirm password do not match" });
    }
    console.log("passBeforeHash", password);
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await usersModel.findOneAndUpdate(
      { passwordResetCode: enteredCode },
      {
        $unset: {
          passwordResetCode: "",
          passwordResetCodeExpires: "",
        },
      },
      { new: true }
    );
    console.log("UPDATED USER", updatedUser);
  

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = resetPassword;
