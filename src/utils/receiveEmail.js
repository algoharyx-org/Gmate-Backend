import nodemailer from "nodemailer";
import { config } from "../config/env.js";

const receiveEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: 465,
    secure: true,
    auth: {
      user: config.emailUsername,
      pass: config.emailPassword,
    },
  });
  const emailOptions = {
    from: options.email,
    to: config.emailUsername,
    subject: options.subject,
    text: options.message,
    html: `<div style="background-color:#F6F5F5;padding:2%;margin:2%"><h2>${options.subject}</h2><p>${options.message}</p></div>`,
  };

  await transporter.sendMail(emailOptions);
};

export default receiveEmail;
