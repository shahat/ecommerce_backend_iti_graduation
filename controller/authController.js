const usersModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const user = require("../models/user");
const crypto = require("crypto");

// Generate token
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

/* =========================== signUp =========================== */

const signUp = async (req, res) => {
  const { email } = req.body;

  const userId = req.param.id;
  console.log("req.body from signup fun", req.body);

  if (!email) {
    return res.status(400).json({ message: "please provide your email" });
  }
  const user = await usersModel.findOne({ email });
  try {
    if (user)
      return res
        .status(404)
        .json({ message: " You have an accout please signin " });

    if (userId) {
      req.body._id = userId;
    }
    const newUser = await usersModel.create(req.body);
    const token = generateToken(newUser._id);
    res.cookie("authenticate", token);
    res.status(201).json({
      token: token,
      message: " user is saved is saved ",
      data: { user: newUser },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// =========================== signIn ===========================

const signIn = async (req, res) => {
  console.log("request is RECEIVED from signin funtcion ");
  const { email, password } = req.body;

  // Check if email & password are present in the request body
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide your email and password" });
  }

  // Check if the user with the given email exists in our DB
  const user = await usersModel.findOne({ email }).select("+password");

  if (!user) {
    return res
      .status(404)
      .json({ message: "Provided user does not exist, please sign up first" });
  }

  try {
    const isValid = await bcrypt.compare(password, user.password);
    // console.log(isValid);
    console.log('password',password);
    console.log('userPassword',user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ token: generateToken(user._id), user: user });
  } catch (error) {
    // Handle any errors related to bcrypt.compare() here
    console.error("Error comparing passwords:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// =========================== logout ===========================

const logOut = async (req, res) => {
  res.clearCookie("authenticate");
  res.json({ message: "signout success" });
};

// =========================== protect ===========================

const protect = async (req, res, next) => {
  // step 1 => read the token && check if is it exist
  // check the authentication header exist in request
  // step 2 => validate the token
  // step 3 => if the user exist
  // step 4 => if the user changed the password after the token is issued

  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "please login first" });
  }
  try {
    let decode = await promisify(jwt.verify)(
      authorization,
      process.env.JWT_SECRET
    );
    req.id = decode.id;
    // Check if the user exists in the database
    const user = await usersModel.findById(decode.id);
    if (!user) {
      throw new Error("User not found");
    }
    // Check if the user has changed their password since the token was issued
    // if (user.passwordChangedAt > decode.iat) {
    //   throw new Error("Password has changed");
    // }
    req.user = user;
    console.log(req.user);
    next();
  } catch (error) {
    // Use a more specific error message in the catch block
    if (error.message === "User not found") {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  }
};
/*
 else if (error.message === "Password has changed") {
      res.status(401).json({ message: "Password has changed" });
    }
    */
// =========================== restrict ===========================

const restrict = (role) => {
  console.log(role);
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    next();
  };
};

const forgotPassword = async (req, res, next) => {
  let resetToken;

  try {
    // 1. Get user based on the provided email
    const user = await usersModel.findOne({ email: req.body.email });

    if (!user) {
      // If no user is found, throw a 404 error
      const error = new Error(
        "Sorry, we could not find the user with the given email"
      );
      error.status = 404;
      throw error;
    }

    // 2. Generate a random reset token
    // resetToken = user.createResetPasswordToken();

    // 3. Send the token back to the user's email
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/users/resetPassword/${resetToken}`;
    const message = `We have received a password reset request. Please use the below code to reset your password\n\n${resetUrl}\n\n This reset password link will be valid only for 10 minutes`;

    // 4. Send the email to the user
    // await sendEmail({
    //   email: user.email,
    //   subject: "Password change request received",
    //   message: message,
    // });

    // 5. Respond to the client indicating that the password reset link is sent
    res.status(200).json({
      status: "success",
      message: "Password reset code is sent to the user email",
    });

    // 6. Save the changes to the user document
    // await user.save({ validateBeforeSave: false });
  } catch (error) {
    // Handle errors that occurred during user retrieval or token generation
    console.log(error);

    // Respond with an appropriate status code and error message
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });

    // Exit the function to prevent further execution
    return;
  }
};

const resetPassword = async (req, res, next) => {
  //1. IF THE USER EXIST WITH THE GIVEN TOKEN & TOKEN HAS NOT EXPIRED

  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  // const user = await usersModel.findOne({
  //   passwordResetToken: token,
  //   passwordResetTokenExpires: { $gt: Date.now() },
  // });

  if (!user) {
    const error = new Error("Token is invalid or has expired", 400);
    next(error);
  }

  // 2. RESETTING THE USER PASSWORD
  // user.password = req.body.password;
  // user.confirmPassword = req.body.confirmPassword;
  // user.passwordResetToken = undefined;
  // user.passwordResetTokenExpires = undefined;
  // user.passwordChangedAt = Date.now();

  // user.save();

  // 3. LOGIN THE USER

  const loginToken = generateToken(user._id);
  res.status(200).json({
    status: "success",
    token: loginToken,
  });
};

module.exports = {
  signUp,
  signIn,
  logOut,
  protect,
  restrict,
  forgotPassword,
};
