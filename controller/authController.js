const usersModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

// Generate token
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

/* =========================== signUp =========================== */

const signUp = async (req, res) => {
  console.log("inside the sign up ");
  const { email } = req.body;
  console.log("req.body", req.body);
  const userId = req.param.id;

  if (!email) {
    return res.status(400).json({ message: "please provide your user email " });
  }
  const user = await usersModel.findOne({ email });
  try {
    if (user)
      return res
        .status(404)
        .json({ message: " You have an accout please signIn " });
    if (userId) {
      req.body._id = userId;
    }
    const newUser = await usersModel.create(req.body);
    const token = generateToken(newUser._id);
    res.cookie("authenticate", token);
    console.log("token", token);
    return res.status(201).json({
      token: token,
      message: " user is saved is saved ",
      data: { user: newUser },
    });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// // =========================== signIn ===========================

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
    console.log("password", password);
    console.log("userPassword", user.password);

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

module.exports = { signUp, signIn, logOut, protect, restrict };
