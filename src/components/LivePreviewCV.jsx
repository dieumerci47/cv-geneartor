import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { defaultFields, optionalFields } from "./personalInfoFields";

// Regroupement des champs personnels (hors photo, nom, prénom, emploi)
const getPersonalInfoFields = (personal) => {
  // On exclut les champs déjà affichés en haut
  const exclude = ["photo", "prenom", "nom", "emploi"];
  // On prend tous les champs connus (défaut + optionnels + custom)
  const allFields = [...defaultFields, ...optionalFields].filter(
    (f) => !exclude.includes(f.key)
  );
  // On ajoute les champs custom ajoutés dynamiquement
  const dynamicKeys = Object.keys(personal).filter(
    (k) => !allFields.find((f) => f.key === k) && !exclude.includes(k)
  );
  const dynamicFields = dynamicKeys.map((k) => ({
    key: k,
    label: k,
    type: "text",
  }));
  return [...allFields, ...dynamicFields];
};

export default function LivePreviewCV({ personal }) {
  const fullName = [personal.prenom, personal.nom].filter(Boolean).join(" ");
  const personalInfoFields = getPersonalInfoFields(personal);

  return (
    <div className="flex w-full max-w-3xl min-h-[600px] rounded-xl overflow-hidden shadow-lg bg-gray-100">
      {/* Colonne gauche (bleue) */}
      <div className="w-1/3 bg-[#395a86] text-white flex flex-col items-center py-8 px-4 gap-6">
        {/* Nom + photo + emploi */}
        <Avatar className="w-24 h-24 mb-2 border-4 border-white shadow-lg">
          {personal.photo ? (
            <AvatarImage src={personal.photo} alt={fullName || "Photo"} />
          ) : (
            <AvatarFallback>
              {personal.prenom?.[0] || ""}
              {personal.nom?.[0] || ""}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="text-xl font-bold text-center">
          {fullName || "Nom Prénom"}
        </div>
        {personal.emploi && (
          <div className="text-sm font-medium text-center mb-2">
            {personal.emploi}
          </div>
        )}
        {/* Bloc Informations personnelles */}
        <div className="w-full">
          <div className="font-semibold text-base mb-2 border-b border-white/30 pb-1">
            Informations personnelles
          </div>
          <div className="flex flex-col gap-2 text-sm">
            {personalInfoFields.map((field) =>
              personal[field.key] ? (
                <div key={field.key} className="flex items-center gap-2">
                  {/* Icônes selon le champ (optionnel) */}
                  <span className="font-bold min-w-[90px]">{field.label}:</span>
                  <span>{personal[field.key]}</span>
                </div>
              ) : null
            )}
          </div>
        </div>
        {/* Sections latérales à venir (Compétences, Langues, Centres d'intérêt) */}
      </div>
      {/* Colonne droite (contenu) */}
      <div className="flex-1 bg-white p-8 flex flex-col gap-6">
        {/* Profil */}
        <div>
          <div className="text-lg font-bold text-[#395a86] mb-1">Profil</div>
          <div className="text-gray-800 min-h-[32px]">
            {personal.profil || (
              <span className="text-gray-400 italic">Non renseigné</span>
            )}
          </div>
        </div>
        {/* Formation */}
        <div>
          <div className="text-lg font-bold text-[#395a86] mb-1">Formation</div>
          <div className="text-gray-800 min-h-[32px]">
            {/* À brancher sur l'état formation */}
            <span className="text-gray-400 italic">Non renseigné</span>
          </div>
        </div>
        {/* Expérience professionnelle */}
        <div>
          <div className="text-lg font-bold text-[#395a86] mb-1">
            Expérience professionnelle
          </div>
          <div className="text-gray-800 min-h-[32px]">
            {/* À brancher sur l'état expérience */}
            <span className="text-gray-400 italic">Non renseigné</span>
          </div>
        </div>
        {/* Stages */}
        <div>
          <div className="text-lg font-bold text-[#395a86] mb-1">Stages</div>
          <div className="text-gray-800 min-h-[32px]">
            {/* À brancher sur l'état stage */}
            <span className="text-gray-400 italic">Non renseigné</span>
          </div>
        </div>
        {/* Signature */}
        <div>
          <div className="text-lg font-bold text-[#395a86] mb-1">Signature</div>
          <div className="text-gray-800 min-h-[32px]">
            {/* À brancher sur l'état signature */}
            <span className="text-gray-400 italic">Non renseigné</span>
          </div>
        </div>
      </div>
    </div>
  );
}
