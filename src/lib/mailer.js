import nodemailer from "nodemailer";
import "dotenv/config";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Utilise SSL sur le port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Doit être un Mot de passe d'application sans espaces
  },
});

// Test automatique de la connexion SMTP au démarrage du serveur
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Erreur de connexion SMTP :", error.message);
  } else {
    console.log("✅ Connexion au serveur SMTP réussie !");
  }
});

export const sendOtpEmail = async (to, code) => {
  await transporter.sendMail({
    from: `"Portfolio Admin" <${process.env.SMTP_USER}>`,
    to,
    subject: "Code de connexion",
    text: `Ton code de connexion est : ${code}\n\nIl expire dans 10 minutes.`,
  });
};
