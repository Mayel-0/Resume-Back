import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (to, code) => {
  await transporter.sendMail({
    from: `"Portfolio Admin" <${process.env.SMTP_USER}>`,
    to,
    subject: "Code de connexion",
    text: `Ton code de connexion est : ${code}\n\nIl expire dans 10 minutes.`,
  });
};
