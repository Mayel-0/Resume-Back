import { env } from "./env.js";
import app from "./app.js";

console.log("SMTP USER:", env.SMTP_USER ? "Chargé" : "Manquant");
console.log("SMTP PASS:", env.SMTP_PASS ? "Chargé" : "Manquant");

app.listen(env.PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${env.PORT}`);
});
