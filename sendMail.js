const nodemailer = require("nodemailer");

const sendForgotPasswordEmail = async (email, token) => {
  try {
    // Create a transporter object
   let mailTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});
    // mail details
    const mailDetails = {
      from: `${process.env.EMAIL}`,
      to: `${email}`,
      subject: "Password Reset",
      html: `
            <h1>Reset your password</h1>
            <p>Click the link below to reset your password,
            
           <a href='https://example.com/reset-password/${token}'> Reset Password </a> 
           </p>
            
           `,
    };

    // send mail
    await mailTransport.sendMail(mailDetails);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { sendForgotPasswordEmail };
