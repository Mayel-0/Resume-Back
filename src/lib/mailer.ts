import nodemailer from "nodemailer";
import { env } from "../env.js";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Utilise SSL sur le port 465
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS, // Doit être un Mot de passe d'application sans espaces
  },
});

// Test automatique de la connexion SMTP au démarrage du serveur
transporter.verify((error) => {
  if (error) {
    console.error("❌ Erreur de connexion SMTP :", error.message);
  } else {
    console.log("✅ Connexion au serveur SMTP réussie !");
  }
});

export const sendOtpEmail = async (to: string, code: string): Promise<void> => {
  await transporter.sendMail({
    from: `"Portfolio Admin" <${env.SMTP_USER}>`,
    to,
    subject: "Code de connexion",
    text: `Ton code de connexion est : ${code}\n\nIl expire dans 10 minutes.`,
  });
};
