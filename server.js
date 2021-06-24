const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const cors = require("cors");
require("dotenv").config();

// middleware
app.use(express.json());
app.use(cors());

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    pass: process.env.WORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});
transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
});

app.post("/send", function (req, res) {
  const pushout = `
  <ul>
  <li>Full Name: ${req.body.mailerState.name}</li>
  <li>Email: ${req.body.mailerState.email}</li>
  <li>Message: ${req.body.mailerState.message}</li>
  </ul>
  `;
  let mailOptions = {
    from: `${req.body.mailerState.name} <${req.body.mailerState.email}>`,
    to: process.env.EMAIL,
    subject: `Message from: ${req.body.mailerState.email}`,
    text: `${req.body.mailerState.message}`,
    html: pushout, // html body
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      res.json({
        status: "fail",
      });
    } else {
      console.log("== Message Sent ==");
      res.json({
        status: "success",
      });
    }
  });
});

app.get("/", (req, res) => res.send("welcome to a live server"));
app.listen(process.env.PORT || 3005, () => {
  console.log('Server is running on port: 3005' );
});
