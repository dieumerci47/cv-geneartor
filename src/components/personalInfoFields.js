// Champs affichés par défaut
export const defaultFields = [
  { key: "photo", label: "Photo", type: "image" },
  { key: "prenom", label: "Prénom", type: "text" },
  { key: "nom", label: "Nom", type: "text" },
  { key: "emploi", label: "Emploi recherché", type: "text" },
  { key: "email", label: "Email", type: "email" },
  { key: "telephone", label: "Téléphone", type: "tel" },
  { key: "adresse", label: "Adresse", type: "text" },
  { key: "codePostal", label: "Code postal", type: "text" },
  { key: "ville", label: "Ville", type: "text" },
];

// Champs optionnels
export const optionalFields = [
  // { key: "lieu", label: "Lieu de naissance", type: "text" },
  // { key: "permis", label: "Permis de conduire", type: "text" },
  { key: "sexe", label: "Sexe", type: "text" },
  { key: "nationalites", label: "Nationalité", type: "text" },
  // { key: "etatCivil", label: "État civil", type: "text" },
  // { key: "site", label: "Site internet", type: "url" },
  { key: "linkedin", label: "LinkedIn", type: "url" },
  { key: "custom", label: "Champ personnalisé", type: "text" },
];
