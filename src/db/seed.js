import { db } from "./index.js";
import {
  profile,
  sections,
  timeline,
  skillCategories,
  skillItems,
  socials,
  projects,
  projectTags,
  projectTechStack,
} from "./schema.js";

async function seed() {
  console.log("🌱 Seeding...");

  // ─── Profile ───────────────────────────────────────────────
  await db.insert(profile).values({
    firstName: "Maël",
    lastName: "LLADO",
    role: "Étudiant en informatique · Développeur web & backend",
    location: "Bordeaux, France",
    tagline:
      "Développeur curieux et polyvalent, du front-end en React au back-end en Node.js/Go, avec une sensibilité cybersécurité.",
    portraitUrl: "/images/portrait.png",
  });

  // ─── Sections ──────────────────────────────────────────────
  await db.insert(sections).values([
    {
      sectionId: "apropos",
      index: "01",
      title: "À propos de moi",
      order: 1,
      html: `Bonjour, je m'appelle <strong>Maël LLADO.</strong> Je suis actuellement étudiant à l'école privée <strong>Ynov Campus Bordeaux</strong>, après avoir obtenu mon <strong>Baccalauréat Professionnel SN (Systèmes Numériques), option RISC</strong>, avec la <strong>mention Très Bien</strong>, au lycée polyvalent Jean-Monnet de Libourne.`,
    },
    {
      sectionId: "parcours",
      index: "02",
      title: "Parcours et expériences",
      order: 2,
      html: `Passionné d'informatique depuis le collège, j'ai orienté mon parcours vers la programmation. Lors de mes stages chez <strong>Snark Factory</strong>, j'ai découvert le développement web et appris le <strong>HTML, CSS, SCSS et le JavaScript</strong>, en réalisant plusieurs sites en <strong>Vue.js.</strong>`,
    },
    {
      sectionId: "projets-perso",
      index: "03",
      title: "Projets personnels",
      order: 3,
      html: `En autodidacte, j'ai appris le <strong>Python</strong> et développé un de mes plus gros projets : un logiciel de <strong>reconnaissance faciale</strong>, présenté à l'oral de mon Bac. J'ai aussi expérimenté <strong>la programmation de jeux vidéo avec Unreal Engine 5</strong>.`,
    },
    {
      sectionId: "objectifs",
      index: "04",
      title: "Objectifs",
      order: 4,
      html: `Mon objectif est de continuer à apprendre et à acquérir de l'expérience dans différents domaines de l'informatique. Je souhaite devenir <strong>polyvalent</strong>, aussi bien en <strong>développement web, full-stack</strong> qu'en <strong>programmation de jeux vidéo</strong>. J'ai également une première expérience en <strong>cybersécurité</strong>, grâce à mes trois années de Bac Pro SN RISC et à ma participation à des <strong>CTF</strong>.`,
    },
  ]);

  // ─── Timeline ──────────────────────────────────────────────
  await db.insert(timeline).values([
    {
      period: "Aujourd'hui",
      title: "Ynov Campus Bordeaux",
      subtitle: "Étudiant en informatique",
      order: 1,
      text: "Cursus informatique : développement web, algorithmique, Golang, projets d'équipe et Ydays.",
    },
    {
      period: "Baccalauréat",
      title: "Bac Pro SN option RISC",
      subtitle: "Lycée Jean-Monnet, Libourne — Mention Très Bien",
      order: 2,
      text: "Systèmes numériques, réseaux, installation et sécurité informatique.",
    },
    {
      period: "Stages",
      title: "Snark Factory",
      subtitle: "Développement web",
      order: 3,
      text: "Découverte du développement web : HTML, CSS, SCSS, JavaScript et réalisation de sites en Vue.js.",
    },
    {
      period: "Stages",
      title: "Maintenance & boutique spécialisée",
      subtitle: "Support et matériel informatique",
      order: 4,
      text: "Maintenance informatique et conseil en boutique, pour élargir mes compétences techniques.",
    },
  ]);

  // ─── Skill categories ──────────────────────────────────────
  const cats = await db
    .insert(skillCategories)
    .values([
      { title: "Langages", order: 1 },
      { title: "Front-end", order: 2 },
      { title: "Back-end & données", order: 3 },
      { title: "Autres", order: 4 },
    ])
    .returning();

  await db
    .insert(skillItems)
    .values([
      ...["Golang", "Python", "JavaScript", "HTML", "CSS / SCSS", "SQL"].map(
        (label, i) => ({ categoryId: cats[0].id, label, order: i + 1 }),
      ),
      ...["Vue.js", "React", "Vite", "GSAP", "Responsive design"].map(
        (label, i) => ({ categoryId: cats[1].id, label, order: i + 1 }),
      ),
      ...[
        "Go (net/http)",
        "Node.js",
        "PostgreSQL",
        "APIs REST",
        "Authentification A2F",
      ].map((label, i) => ({ categoryId: cats[2].id, label, order: i + 1 })),
      ...[
        "Git & GitHub",
        "Cybersécurité / CTF",
        "Linux",
        "Nginx / PM2",
        "Raspberry Pi / NAS",
      ].map((label, i) => ({ categoryId: cats[3].id, label, order: i + 1 })),
    ]);

  // ─── Socials ───────────────────────────────────────────────
  await db.insert(socials).values([
    {
      label: "LinkedIn",
      handle: "llado-mael",
      href: "https://www.linkedin.com/in/llado-mael-54008a384/",
      icon: "linkedin",
      order: 1,
    },
    {
      label: "Github",
      handle: "Mayel-0",
      href: "https://github.com/Mayel-0",
      icon: "github",
      order: 2,
    },
    {
      label: "Gmail",
      handle: "llado.mael33@gmail.com",
      href: "mailto:llado.mael33@gmail.com",
      icon: "mail",
      order: 3,
    },
    {
      label: "Instagram",
      handle: "mayel__0",
      href: "https://www.instagram.com/mayel__0/",
      icon: "instagram",
      order: 4,
    },
  ]);

  // ─── Projects ──────────────────────────────────────────────
  const projs = await db
    .insert(projects)
    .values([
      {
        slug: "eldoria",
        title: "Projet_Red: Eldoria",
        year: "Ynov B1",
        visibility: "Public",
        order: 1,
        imageUrl: "/images/Eldoria.webp",
        intro:
          "Ce projet a été créé dans le cadre de mes études à Ynov Campus lors de ma première année (B1). Il a été réalisé en une semaine en Golang.",
        contextTitle: "GitHub",
        context:
          "Pour ce projet, nous étions 3 et notre projet est entièrement disponible sur GitHub.",
        readme:
          "Eldoria est un jeu d'aventure textuel où vous incarnez un explorateur qui découvre le village d'Ynovia. Rencontrez Emeryn, le guide du village, et percez les mystères qui entourent ce lieu magique.",
        githubUrl: "https://github.com/StarWeizz/projet-red_Eldoria",
        linkLabel: "Voir le projet sur GitHub",
      },

      {
        slug: "face-recognition",
        title: "Face Recognition",
        year: "Bac Pro SN",
        visibility: "Public",
        order: 2,
        imageUrl: "/images/FaceRecognition.webp",
        intro:
          "J'ai eu 4 semaines pour coder un logiciel en Python pour la reconnaissance faciale sur photos, vidéos et webcam en direct.",
        contextTitle: "GitHub",
        context:
          "Ce projet personnel m'a permis de gagner des points bonus pour mon bac professionnel SN option RISC.",
        readme:
          "Logiciel de reconnaissance faciale en Python comparant les visages à une base de données. Utilisable comme système de sécurité ou portier automatique.",
        githubUrl: "https://github.com/Mayel-0/projet-chef-doeuvre-2024",
        linkLabel: "Voir le projet sur GitHub",
      },

      {
        slug: "ctf",
        title: "CTF",
        year: "2025",
        visibility: "Privé",
        order: 3,
        imageUrl: "/images/CTF.webp",
        intro:
          "J'ai participé au CTF 2025 sur le site Root Me, organisé par cette même plateforme.",
        contextTitle: "École SN",
        context:
          "Ce projet nous a été proposé par notre professeur de Sciences Numériques afin de nous entraîner à la sécurité informatique et au hacking éthique.",
        readme:
          "Compétition nationale de cybersécurité — résolution d'énigmes et problèmes de sécurité informatique dans un environnement sécurisé.",
        githubUrl: "https://github.com/Mayel-0/CTF-Entrainement-et-Realisation",
        linkLabel: "Voir le projet sur GitHub",
      },

      {
        slug: "one-piece-dle",
        title: "One Piece DLE",
        year: "Perso",
        visibility: "Public",
        order: 4,
        imageUrl: "/images/onepiecedle.png",
        intro:
          "Fan game basé sur l'univers de One Piece. Le but est de trouver un personnage précis parmi 250, comme un Geoguessr pour les personnages.",
        contextTitle: "GitHub",
        context:
          "Réalisé personnellement pour le plaisir, en Vue.js full front-end avec migration prévue vers React.",
        readme:
          "Jeu avec plusieurs modes : mode classique (deviner un personnage), mode fruits du démon, mode rires. Migration en cours vers React + Node.js + PostgreSQL.",
        liveUrl: "https://one-piece-dle-game.vercel.app/",
        linkLabel: "Voir le site",
      },

      {
        slug: "cloud-perso",
        title: "Cloud Perso",
        year: "Perso",
        visibility: "Public",
        order: 5,
        imageUrl: "/images/cloudperso.png",
        intro:
          "Projet personnel full Golang web avec communication base de données, hébergé sur NAS/Raspberry Pi.",
        contextTitle: "GitHub",
        context:
          "Réalisé personnellement, fonctionnel chez moi sur NAS/Raspberry Pi pour usage personnel et familial.",
        readme:
          "Cloud multi-utilisateurs avec gestion de fichiers, A2F email, backups, upload/download, corbeille, modification en ligne. Full Golang + MySQL.",
        githubUrl: "https://github.com/Mayel-0/Cloud_perso",
        linkLabel: "Voir le projet sur GitHub",
      },

      {
        slug: "tech-talk",
        title: "Tech Talk",
        year: "Ydays",
        visibility: "Privé",
        order: 6,
        imageUrl: "/images/tecktalk.png",
        intro:
          "Plateforme de podcasts créés par des étudiants pour des étudiants sur la tech et l'impact de l'IA sur nos métiers.",
        contextTitle: "GitHub",
        context: "Projet d'école dans le cadre des Ydays à Ynov Campus.",
        note: "En cours de développement et de finalisation.",
        githubUrl: "https://github.com/Mayel-0/Tech_Talk-Remaster-JS",
        linkLabel: "Voir le projet sur GitHub",
      },
    ])
    .returning();

  // ─── Project tags ──────────────────────────────────────────
  const tagMap = {
    eldoria: ["Golang", "CLI", "Jeu"],
    "face-recognition": ["Python", "Vision", "OpenCV"],
    ctf: ["Cybersécurité", "Root Me", "Web"],
    "one-piece-dle": ["Vue.js", "Jeu", "Front-end"],
    "cloud-perso": ["Golang", "MySQL", "Self-hosted"],
    "tech-talk": ["Web", "Podcast", "En cours"],
  };

  for (const p of projs) {
    const tags = tagMap[p.slug] ?? [];
    if (tags.length) {
      await db
        .insert(projectTags)
        .values(tags.map((tag) => ({ projectId: p.id, tag })));
    }
  }

  // ─── Project tech stack ────────────────────────────────────
  const techMap = {
    eldoria: {
      languages: ["Golang"],
      frameworks: ["fmt", "log", "os", "encoding/json", "math/rand", "time"],
    },
    "face-recognition": {
      languages: ["Python"],
      frameworks: [
        "face_recognition",
        "cv2",
        "numpy",
        "concurrent.futures",
        "tqdm",
      ],
    },
    ctf: { languages: [], frameworks: [] },
    "one-piece-dle": {
      languages: ["JavaScript"],
      frameworks: ["Vue.js", "Vite"],
    },
    "cloud-perso": {
      languages: ["Golang", "MySQL", "HTML", "CSS"],
      frameworks: [
        "net/http",
        "database/sql",
        "gomail",
        "crypto/bcrypt",
        "archive/zip",
      ],
    },
    "tech-talk": {
      languages: ["JavaScript"],
      frameworks: ["React", "Supabase"],
    },
  };

  for (const p of projs) {
    const tech = techMap[p.slug];
    if (!tech) continue;
    const entries = [
      ...tech.languages.map((label, i) => ({
        projectId: p.id,
        label,
        type: "language",
        order: i + 1,
      })),
      ...tech.frameworks.map((label, i) => ({
        projectId: p.id,
        label,
        type: "framework",
        order: i + 1,
      })),
    ];
    if (entries.length) await db.insert(projectTechStack).values(entries);
  }

  console.log("✓ Seed terminé");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erreur seed :", err);
  process.exit(1);
});
