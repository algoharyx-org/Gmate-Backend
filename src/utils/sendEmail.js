import nodemailer from "nodemailer";
import { config } from "../config/env.js";

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: 465,
    secure: true,
    auth: {
      user: config.emailUsername,
      pass: config.emailPassword,
    },
  });
  const image = `<img src="./public/logo.png" alt="GMATE Logo" width="350px" height="350px" style="display: block;margin: auto; border-radius: 50%;">`;
  const emailOptions = {
    from: config.emailFrom,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<div style="background-color:#F6F5F5;padding:2%;margin:2%"><h1>${options.subject}</h1><p>${options.message}</p></div>`,
  };

  await transporter.sendMail(emailOptions);
};

export default sendMail;
