// step-1 =>  require nongoose , express , and also define the routes
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express();
const authRouter = require("./routes/authRouter");
const productRouter = require("./routes/product");
const ordersRouter = require("./routes/orders");
const reviewsRouter = require("./routes/reviews");
const cartRouter = require("./routes/cart");
const wishRouter = require("./routes/wishlist");
const usersRouter = require("./routes/usersRouter");
// schedule Function to delete old guest carts
const deleteOldCarts = require("./helpers/schedule");
const connectDB = require("./config/db");
const errorHandler = require("./middlewares/error");
const nodemailer = require("nodemailer");
const usersModel = require("./models/user");
const emailRecoveryRoute = require("./routes/emailRecovery");
const resetCodeRoute = require("./routes/resetCode");
const resetPasswordRoute = require("./routes/resetPassword");

// Connect to DB
connectDB();

// Express App

const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());
deleteOldCarts();

// app.post("/emailRecovery", async (req, res) => {
//   const { email } = req.body;
//   // console.log("received email from frontend", email);

//   try {
//     const foundUser = await usersModel.findOne({ email });
//     console.log("foundUser", foundUser);
//     if (!foundUser) {
//       return res
//         .status(401)
//         .json({ message: "Sorry, user does not exist. Please signup first" });
//     }
//     const resetCode = Math.floor(1000 + Math.random() * 9000);
//     console.log("found user before setting in the DB", foundUser);

//     foundUser.passwordResetCode = resetCode;
//     console.log(foundUser, "after addding resetCodePass");

//     foundUser.passwordResetCodeExpires = new Date(Date.now() + 5 * 60 * 1000);
//     await foundUser.save({ validateBeforeSave: false });

//     console.log("resetCode before sending email", resetCode);
//     await sendEmail(foundUser.email, resetCode);

//     res.status(200).json({
//       resetCode,
//       message: "Password reset code has been sent successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: "Internal server error" });
//   }
// });

// app.post("/resetCode", async (req, res) => {
//   const { enteredCode } = req.body;
//   console.log("enteredCode From reset Code", enteredCode);

//   if (!enteredCode) {
//     return res.status(400).json({ message: "Code is required" });
//   } else {
//     try {
//       const user = await usersModel.findOne({ passwordResetCode: enteredCode });
//       console.log("is the user exist with the entered code? ->", user);

//       if (user) {
//         const codeCreatedAt = user.passwordResetCodeExpires;
//         const timeDifference = (new Date() - codeCreatedAt) / (1000 * 60);

//         if (timeDifference <= 5) {
//           // Code is valid, proceed to the next stage
//           return res
//             .status(200)
//             .json({ message: "Code is valid", userId: user._id });
//         } else {
//           // Code has expired, inform the user
//           return res
//             .status(400)
//             .json({ message: "Code has expired. Please request a new code" });
//         }
//       } else {
//         // Invalid code, inform the user
//         return res.status(400).json({ message: "Invalid code" });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   }
// });

// app.post("/resetCode", async (req, res) => {
//   const { enteredCode } = req.body;
//   console.log("enteredCode From reset Code", enteredCode);

//   if (!enteredCode) {
//     return res.status(400).json({ message: "Code is required" });
//   } else {
//     try {
//       const user = await usersModel.findOne({ passwordResetCode: enteredCode });
//       console.log("is the user exist with the entered code? ->", user);

//       if (user) {
//         const codeCreatedAt = user.passwordResetCodeExpires;
//         const currentTime = new Date();
//         const timeDifference = (currentTime - codeCreatedAt) / (1000 * 60);

//         if (timeDifference <= 5) {
//           // Code is valid, proceed to the next stage
//           return res
//             .status(200)
//             .json({ message: "Code is valid", userId: user._id });
//         } else {
//           // Code has expired, inform the user
//           return res
//             .status(400)
//             .json({ message: "Code has expired. Please request a new code" });
//         }
//       } else {
//         // Invalid code, inform the user
//         return res.status(400).json({ message: "Invalid code" });
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   }
// });

// app.patch("/resetPassword", async (req, res) => {
//   const { userPassword, enteredCode } = req.body;
//   const { password, confirmPassword } = userPassword;

//   console.log("ENTERED CODE From reset", enteredCode);

//   if (!password || !confirmPassword) {
//     return res
//       .status(400)
//       .json({ message: "Password and confirm password are required" });
//   }
//   if (!passwordRegx.test(password) || !passwordRegx.test(confirmPassword)) {
//     return res.status(404).json({
//       message:
//         "Password Should be at Least 8 Characters, One Lower Case Letter, One Uppercase Letter, Special Character",
//     });
//   }

//   try {
//     const user = await usersModel.findOne({ passwordResetCode: enteredCode });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: "Passwords do not match" });
//     }
//     console.log("passBeforeHash", password);
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const updatedUser = await usersModel.findOneAndUpdate(
//       { passwordResetCode: enteredCode },
//       {
//         $set: {
//           password: hashedPassword,
//           // confirmPassword: hashedPassword, // Make sure this is necessary for your use case
//           passwordResetCode: undefined,
//           passwordResetCodeExpires: undefined,
//         },
//       },
//       { new: true }
//     );
//     console.log("UPDATED USER", updatedUser);
//     //  console.log('ENTERED CODE',enteredCode)

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     console.log("passAfterHash", hashedPassword);

//     res.status(200).json({ message: "Password has been reset successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

// Routes

app.use("/users", authRouter);
app.use("/product", productRouter);
app.use("/orders", ordersRouter);
app.use("/reviews", reviewsRouter);
app.use("/cart", cartRouter);
app.use("/wish", wishRouter);
app.use("/emailRecovery", emailRecoveryRoute);
app.use("/resetCode", resetCodeRoute);
app.use("/resetPassword", resetPasswordRoute);

// handle not found not found middleware
app.use("*", function (req, res, next) {
  res.status(404).json({ message: "notfound" });
});

app.use("/", (req, res) => {
  return res.json({
    message: "Welcome to the Node.js REST API using ExpressJS and MongoDB",
  });
});

app.use(errorHandler);

// const sendEmail = async (recipientEmail, resetCode) => {
//   const message = `We have received a password reset request.\nPlease use the below code to reset your password.\n\n ${resetCode}\n\n This reset password code will be valid only for 5 minutes.`;
//   // console.log("resetCode from sendEmail function", resetCode);

//   return new Promise((resolve, reject) => {
//     let transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       auth: {
//         user: "mostafa.i.elsayed95@gmail.com",
//         pass: "tektctetqeipznho",
//       },
//     });
//     const mail_configs = {
//       from: "ITI Students",
//       to: recipientEmail,
//       subject: "Password change request received",
//       text: message,
//     };

//     transporter.sendMail(mail_configs, function (error, info) {
//       if (error) {
//         console.log(error);
//         return reject({
//           message: "An error has error and email did not send to the user",
//         });
//       }
//       return resolve({ message: "Email has been sent successfully" });
//     });
//   });
// };

const server = app.listen(port, () =>
  console.log(`Server started listening on ${port}`)
);

process.on("unhandledRejection", (error, promise) => {
  console.log(`Logged Error: ${error}`);
  server.close(() => process.exit(1));
});
