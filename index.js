import app from "./src/app.js"; // Ajuste le chemin si ton index.js est dans /src
import "dotenv/config";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
