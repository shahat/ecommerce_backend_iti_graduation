const nodemailer = require("nodemailer");

const sendEmail = async (recipientEmail, resetCode) => {
  const message = `We have received a password reset request.\nPlease use the below code to reset your password.\n\n ${resetCode}\n\n This reset password code will be valid only for 5 minutes.`;

  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      auth: {
        user: "mostafa.i.elsayed95@gmail.com",
        pass: "tektctetqeipznho",
      },
    });

    const mailConfigs = {
      from: "ITI Students",
      to: recipientEmail,
      subject: "Password change request received",
      text: message,
    };

    transporter.sendMail(mailConfigs, function (error, info) {
      if (error) {
        console.log(error);
        return reject({
          message: "An error occurred, and the email did not send to the user",
        });
      }
      return resolve({ message: "Email has been sent successfully" });
    });
  });
};

module.exports = sendEmail;
