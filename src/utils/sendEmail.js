import nodemailer from "nodemailer";
import { config } from "../config/env";

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: config.emailHost,
    port: config.emailPort,
    secure: true,
    auth: {
      user: config.emailUsername,
      pass: config.emailPassword,
    },
  });
  const image = `<img src="cid:image@nodemailer.com" alt="GMATE Logo" width="350px" height="350px" style="display: block;margin: auto; border-radius: 50%;">`;
  const emailOptions = {
    from: `"${config.appName}" <${config.emailUsername}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: `<div style="background-color:#F6F5F5;padding:2%;margin:2%"><h1>${options.subject}</h1><p>${options.message}</p></div>`,
    attachments: [
      {
        filename: "logo.png",
        path: "./public/logo.png",
        cid: "cid:image@nodemailer.com",
      },
    ],
  };

  await transporter.sendMail(emailOptions);
};

export default sendMail;
