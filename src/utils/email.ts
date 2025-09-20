import nodemailer from "nodemailer";

if (!process.env.APP_EMAIL) throw new Error("APP_EMAIL is Missing");
if (!process.env.APP_PASSWORD) throw new Error("APP_PASSWORD is Missing");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

export const sendEmail = (email: string, subject: string, content: string) => {
  if (!email || !subject || !content)
    throw new Error("Email, subject and content are required");
  const mailOptions = {
    from: process.env.APP_EMAIL,
    to: email,
    subject,
    text: `${content}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.log(error);
    else console.log(`Email sent ${info.response}`);
  });
};
