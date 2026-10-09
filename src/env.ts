import "dotenv/config";
import { z } from "zod";

// Variables d'environnement validées au démarrage : s'il en manque une
// indispensable, le serveur s'arrête tout de suite avec un message clair
// plutôt que de planter plus tard sur une requête.
// Une ligne "SMTP_USER=" laissée vide dans le .env vaut "non renseigné"
const optionalString = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional(),
);

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  // Sans SMTP le serveur démarre quand même, mais la connexion admin
  // (code envoyé par e-mail) ne fonctionnera pas.
  SMTP_USER: optionalString,
  SMTP_PASS: optionalString,
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
  console.error(`❌ Variables d'environnement manquantes ou invalides : ${missing}`);
  process.exit(1);
}

export const env = parsed.data;
