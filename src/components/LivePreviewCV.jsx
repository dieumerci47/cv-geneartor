import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

const SECTION_LABELS = {
  personal: "Informations personnelles",
  skills: "Compétences",
  languages: "Langues",
  interests: "Centres d'intérêt",
  profile: "Profil",
  education: "Formation",
  experience: "Expérience professionnelle",
  internship: "Stages",
  signature: "Signature",
  certificate: "Certificat",
};

function LevelDots({ level }) {
  if (!level || isNaN(Number(level))) return null;
  const lvl = Number(level);
  return (
    <span className="inline-flex gap-1 ml-2 align-middle">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={
            "inline-block w-3 h-3 rounded-full " +
            (i <= lvl ? "bg-[#076ff8]" : "bg-gray-300")
          }
        />
      ))}
    </span>
  );
}

export default function LivePreviewCV({
  personal,
  leftSections = [],
  rightSections = [],
  educations = [],
  experiences = [],
  skills = [],
  languages = [],
  certificates = [],
  internships = [],
  signature = {},
}) {
  const fullName = [personal.prenom, personal.nom].filter(Boolean).join(" ");
  const hasProfile = personal.profil && personal.profil.trim() !== "";
  return (
    <div className="flex w-full max-w-3xl min-h-[600px] rounded-xl overflow-hidden shadow-lg bg-gray-100">
      {/* Colonne gauche (bleue) */}
      <div className="w-1/3 bg-[#395a86] text-white flex flex-col items-center py-8 px-4 gap-6">
        {/* Infos personnelles toujours en haut */}
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
        <div className="text-xl font-bold text-center">{fullName}</div>
        {personal.emploi && (
          <div className="text-sm font-medium text-center mb-2">
            {personal.emploi}
          </div>
        )}
        {/* Bloc infos personnelles dynamiques */}
        {Object.keys(personal).some(
          (k) =>
            !["photo", "prenom", "nom", "emploi", "profil"].includes(k) &&
            personal[k]
        ) && (
          <div className="w-full">
            <div className="font-semibold text-base mb-2 border-b border-white/30 pb-1">
              {SECTION_LABELS.personal}
            </div>
            <div className="flex flex-col gap-2 text-sm">
              {Object.entries(personal)
                .filter(
                  ([k, v]) =>
                    !["photo", "prenom", "nom", "emploi", "profil"].includes(
                      k
                    ) && v
                )
                .map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2">
                    <span className="font-bold min-w-[90px]">{k}:</span>
                    <span>{v}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
        {/* Sections latérales dynamiques */}
        {leftSections.map((key) => {
          if (key === "skills" && Array.isArray(skills) && skills.length > 0) {
            return (
              <div key={key} className="w-full">
                <div className="font-semibold text-base mb-2 border-b border-white/30 pb-1">
                  {SECTION_LABELS[key]}
                </div>
                <div className="flex flex-col gap-2">
                  {skills
                    .filter((sk) => sk.name)
                    .map((sk, idx) => (
                      <div key={idx} className="flex items-center">
                        <span>{sk.name}</span>
                        <LevelDots level={Number(sk.level)} />
                      </div>
                    ))}
                </div>
              </div>
            );
          }
          if (
            key === "languages" &&
            Array.isArray(languages) &&
            languages.length > 0
          ) {
            return (
              <div key={key} className="w-full">
                <div className="font-semibold text-base mb-2 border-b border-white/30 pb-1">
                  {SECTION_LABELS[key]}
                </div>
                <div className="flex flex-col gap-2">
                  {languages
                    .filter((l) => l.name)
                    .map((l, idx) => (
                      <div key={idx} className="flex items-center">
                        <span>{l.name}</span>
                        <LevelDots level={Number(l.level)} />
                      </div>
                    ))}
                </div>
              </div>
            );
          }
          if (key === "interests") {
            return null; // à compléter plus tard
          }
          return null;
        })}
      </div>
      {/* Colonne droite (contenu) */}
      <div className="flex-1 bg-white p-8 flex flex-col gap-6">
        {rightSections.map((key) => {
          if (key === "profile" && hasProfile) {
            return (
              <div key={key}>
                <div className="text-lg font-bold text-[#395a86] mb-1">
                  {SECTION_LABELS[key]}
                </div>
                <div className="text-gray-800 min-h-[32px]">
                  {personal.profil}
                </div>
              </div>
            );
          }
          if (
            key === "education" &&
            Array.isArray(educations) &&
            educations.length > 0
          ) {
            return (
              <div key={key}>
                <div className="text-lg font-bold text-[#395a86] mb-1">
                  {SECTION_LABELS[key]}
                </div>
                <div className="flex flex-col gap-3">
                  {educations
                    .filter(
                      (ed) => ed.title || ed.school || ed.city || ed.description
                    )
                    .map((ed, idx) => (
                      <div
                        key={idx}
                        className="border-b pb-2 last:border-b-0 last:pb-0"
                      >
                        <div className="font-bold text-base">{ed.title}</div>
                        <div className="text-xs text-gray-500 mb-1">
                          {ed.school}
                          {ed.city && ` - ${ed.city}`}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          {ed.startMonth && ed.startYear
                            ? `${ed.startMonth}/${ed.startYear}`
                            : ""}
                          {((ed.endMonth && ed.endYear) || ed.current) &&
                            ` - ${
                              ed.current
                                ? "ce jour"
                                : `${ed.endMonth}/${ed.endYear}`
                            }`}
                        </div>
                        {ed.description && (
                          <div className="text-sm text-gray-800 mt-1">
                            {ed.description}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            );
          }
          if (
            key === "experience" &&
            Array.isArray(experiences) &&
            experiences.length > 0
          ) {
            return (
              <div key={key}>
                <div className="text-lg font-bold text-[#395a86] mb-1">
                  {SECTION_LABELS[key]}
                </div>
                <div className="flex flex-col gap-3">
                  {experiences
                    .filter(
                      (ex) => ex.job || ex.employer || ex.city || ex.description
                    )
                    .map((ex, idx) => (
                      <div
                        key={idx}
                        className="border-b pb-2 last:border-b-0 last:pb-0"
                      >
                        <div className="font-bold text-base">{ex.job}</div>
                        <div className="text-xs text-gray-500 mb-1">
                          {ex.employer}
                          {ex.city && ` - ${ex.city}`}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          {ex.startMonth && ex.startYear
                            ? `${ex.startMonth}/${ex.startYear}`
                            : ""}
                          {((ex.endMonth && ex.endYear) || ex.current) &&
                            ` - ${
                              ex.current
                                ? "ce jour"
                                : `${ex.endMonth}/${ex.endYear}`
                            }`}
                        </div>
                        {ex.description && (
                          <div className="text-sm text-gray-800 mt-1">
                            {ex.description}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            );
          }
          if (
            key === "certificate" &&
            Array.isArray(certificates) &&
            certificates.length > 0
          ) {
            return (
              <div key={key}>
                <div className="text-lg font-bold text-[#395a86] mb-1">
                  {SECTION_LABELS[key]}
                </div>
                <div className="flex flex-col gap-3">
                  {certificates
                    .filter((c) => c.name || c.month || c.year || c.description)
                    .map((c, idx) => (
                      <div
                        key={idx}
                        className="border-b pb-2 last:border-b-0 last:pb-0"
                      >
                        <div className="font-bold text-base">{c.name}</div>
                        <div className="text-xs text-gray-500 mb-1">
                          {c.month && c.year ? `${c.month} ${c.year}` : ""}
                          {c.current && " - ce jour"}
                        </div>
                        {c.description && (
                          <div className="text-sm text-gray-800 mt-1">
                            {c.description}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            );
          }
          if (
            key === "internship" &&
            Array.isArray(internships) &&
            internships.length > 0
          ) {
            return (
              <div key={key}>
                <div className="text-lg font-bold text-[#395a86] mb-1">
                  {SECTION_LABELS[key]}
                </div>
                <div className="flex flex-col gap-3">
                  {internships
                    .filter(
                      (int) =>
                        int.job || int.employer || int.city || int.description
                    )
                    .map((int, idx) => (
                      <div
                        key={idx}
                        className="border-b pb-2 last:border-b-0 last:pb-0"
                      >
                        <div className="font-bold text-base">{int.job}</div>
                        <div className="text-xs text-gray-500 mb-1">
                          {int.employer}
                          {int.city && ` - ${int.city}`}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          {int.startMonth && int.startYear
                            ? `${int.startMonth}/${int.startYear}`
                            : ""}
                          {((int.endMonth && int.endYear) || int.current) &&
                            ` - ${
                              int.current
                                ? "ce jour"
                                : `${int.endMonth}/${int.endYear}`
                            }`}
                        </div>
                        {int.description && (
                          <div className="text-sm text-gray-800 mt-1">
                            {int.description}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            );
          }
          if (key === "signature" && signature.image) {
            return (
              <div key={key}>
                <div className="text-lg font-bold text-[#395a86] mb-1">
                  {SECTION_LABELS[key]}
                </div>
                <div className="flex items-center min-h-[60px]">
                  <img
                    src={signature.image}
                    alt="Signature"
                    className="max-h-[60px] object-contain inline-block align-middle"
                    style={{
                      background: "none",
                      border: "none",
                      boxShadow: "none",
                      padding: 0,
                      margin: 0,
                    }}
                  />
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
