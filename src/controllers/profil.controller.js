import { db } from "../db/index.js";
import { profile } from "../db/schema.ts";

export const getProfil = async (req, res) => {
  try {
    const profilData = await db.select().from(profile);
    res.status(200).json(profilData);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération du profil" });
  }
};

export const updateProfil = async (req, res) => {
  const { name, title, description, email, phone, address } = req.body;

  try {
    const updatedProfil = await db
      .update(profile)
      .set({ name, title, description, email, phone, address })
      .where(profile.id.eq(1)) // Assuming there's only one profile with id=1
      .returning();

    if (updatedProfil.length === 0) {
      return res.status(404).json({ error: "Profil non trouvé" });
    }

    res.status(200).json(updatedProfil[0]);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour du profil" });
  }
};
