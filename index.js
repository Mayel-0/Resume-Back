import app from "./src/app.js"; // Ajuste le chemin si ton index.js est dans /src
import "dotenv/config";

const PORT = process.env.PORT || 3000;
console.log("SMTP USER:", process.env.SMTP_USER ? "Chargé" : "Manquant");
console.log("SMTP PASS:", process.env.SMTP_PASS ? "Chargé" : "Manquant");

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
