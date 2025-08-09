import React from "react";
// Template4CV

//import React from "react";

// Template 4 — Mise en page inspirée du PDF fourni
// En-tête: grand nom, coordonnées avec icônes, photo ronde à droite, paragraphe de profil.
// Corps: grille à 2 colonnes. Colonne gauche avec les intitulés de sections.
// Chaque section (expérience, formation) s'affiche en grille 2 colonnes: période à gauche, contenu à droite.

const HEADER_COLOR = "#2f6cc6"; // bleu vif proche du rendu PDF
const HEADER_BG = "#eaf3ff"; // fond bleuté clair pour l'en-tête
const SECTION_TITLE_COLOR = "#3a7bd5";
const EMPLOYER_COLOR = "#3a7bd5";

const Template4CV = React.forwardRef(function Template4CV(
  { cvData, leftSections, rightSections },
  ref
) {
  const {
    personal = {},
    profile = "",
    experiences = [],
    educations = [],
    languages = [],
    skills = [],
    interests = [],
    internships = [],
    certificates = [],
    signature = {},
  } = cvData || {};

  const fullName = [personal.prenom, personal.nom].filter(Boolean).join(" ");

  const isEmpty = (() => {
    const hasPersonal = personal && Object.values(personal).some((v) => v);
    const hasProfile = typeof profile === "string" && profile.trim() !== "";
    const hasExp =
      Array.isArray(experiences) &&
      experiences.some((e) => e && Object.values(e).some((v) => v));
    const hasEdu =
      Array.isArray(educations) &&
      educations.some((e) => e && Object.values(e).some((v) => v));
    const hasLang =
      Array.isArray(languages) && languages.some((l) => l && l.name);
    const hasSkills = Array.isArray(skills) && skills.some((s) => s && s.name);
    const hasInterests = Array.isArray(interests) && interests.length > 0;
    const hasCert =
      Array.isArray(certificates) && certificates.some((c) => c && c.name);
    const hasIntern =
      Array.isArray(internships) &&
      internships.some((i) => i && Object.values(i).some((v) => v));
    const hasSign = signature && signature.image;
    return !(
      hasPersonal ||
      hasProfile ||
      hasExp ||
      hasEdu ||
      hasLang ||
      hasSkills ||
      hasInterests ||
      hasCert ||
      hasIntern ||
      hasSign
    );
  })();

  if (isEmpty) {
    return (
      <div
        ref={ref}
        className="bg-gradient-to-br from-[#e3e6f5] via-[#b3d0f7] to-[#eec6e6] w-[900px] h-[700px] mx-auto rounded-xl shadow-lg overflow-hidden flex items-center justify-center"
      >
        <div className="text-center px-6">
          <div className="text-xl font-bold text-[#1f2937]/80">
            Aperçu du CV
          </div>
          <div className="mt-2 text-sm text-[#1f2937]/70">
            Commencez à remplir le formulaire à droite pour voir l’aperçu ici.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="bg-white w-[900px] mx-auto rounded-xl shadow-xl overflow-hidden text-[#1f2937] font-sans"
    >
      {/* En-tête */}
      <div
        className="px-8 pt-8 pb-4 border-b border-gray-200 relative"
        style={{ backgroundColor: HEADER_BG }}
      >
        {/* Photo */}
        {personal.photo && (
          <img
            src={personal.photo}
            alt="photo"
            className="w-20 h-20 object-cover rounded-full absolute right-8 top-8 border-4 border-white shadow-md"
            data-marker="photo"
          />
        )}
        <h1
          className="text-4xl font-extrabold tracking-tight"
          style={{ color: HEADER_COLOR }}
          data-marker="nom"
        >
          {fullName || "Votre Nom"}
        </h1>

        {/* Coordonnées */}
        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-[15px] text-gray-700">
          {personal.email && (
            <InfoItem icon={MailIcon} label={personal.email} marker="email" />
          )}
          {personal.telephone && (
            <InfoItem
              icon={PhoneIcon}
              label={personal.telephone}
              marker="telephone"
            />
          )}
          {(personal.adresse || personal.ville || personal.codePostal) && (
            <InfoItem
              icon={PinIcon}
              label={[personal.adresse, personal.codePostal, personal.ville]
                .filter(Boolean)
                .join(", ")}
              marker="adresse"
            />
          )}
          {personal.linkedin && (
            <InfoItem
              icon={LinkedinIcon}
              label={personal.linkedin}
              marker="linkedin"
            />
          )}
          {personal.site && (
            <InfoItem icon={GlobeIcon} label={personal.site} marker="site" />
          )}
          {personal.sexe && (
            <div className="flex items-center gap-2" data-marker="sexe">
              <span className="inline-block w-[10px] h-[10px] rounded-sm bg-[#2f6cc6]" />
              <span>Sexe: {personal.sexe}</span>
            </div>
          )}
          {personal.emploi && (
            <div className="flex items-center gap-2" data-marker="emploi">
              <span className="inline-block w-[10px] h-[10px] rounded-sm bg-[#2f6cc6]" />
              <span>Emploi recherché: {personal.emploi}</span>
            </div>
          )}
        </div>

        {/* Profil */}
        {profile && (
          <div
            className="mt-5 text-[15px] leading-relaxed text-gray-800"
            data-marker="profil"
          >
            {profile}
          </div>
        )}
      </div>

      {/* Corps — rendu dynamique par rang selon drag & drop */}
      <div className="px-8 py-8 space-y-10">
        {(() => {
          const combined = (rightSections || DEFAULT_RIGHT).concat(
            leftSections || DEFAULT_LEFT
          );
          const sanitized = combined.filter(
            (key) => key !== "personal" && key !== "profile"
          );
          const priority = ["languages", "skills", "interests"]; // en premier
          const ordered = [
            ...priority.filter((k) => sanitized.includes(k)),
            ...sanitized.filter((k) => !priority.includes(k)),
          ];
          return ordered.map((key, idx) => {
            const content = renderSectionContent({
              key,
              profile,
              experiences,
              educations,
              languages,
              skills,
              interests,
              internships,
              certificates,
              signature,
            });
            if (!content) return null;
            return (
              <div
                key={`${key}-${idx}`}
                className="grid grid-cols-[220px,1fr] gap-4 items-start"
              >
                <div className="text-sm font-semibold text-gray-600 pt-1 pr-3 border-r border-blue-100">
                  <SectionTitle>{getSectionLabel(key)}</SectionTitle>
                </div>
                <div className="pl-4">{content}</div>
              </div>
            );
          });
        })()}
      </div>
    </div>
  );
});

export default Template4CV;

function SectionTitle({ children }) {
  return (
    <div
      className="uppercase tracking-wide"
      style={{ color: SECTION_TITLE_COLOR }}
    >
      {children}
    </div>
  );
}

const DEFAULT_LEFT = ["skills", "languages", "interests"];
const DEFAULT_RIGHT = [
  "profile",
  "experience",
  "education",
  "internship",
  "signature",
  "certificate",
];

function getSectionLabel(key) {
  switch (key) {
    case "profile":
      return "Profil";
    case "education":
      return "Formation";
    case "experience":
      return "Expérience professionnelle";
    case "languages":
      return "Langues";
    case "skills":
      return "Compétences";
    case "interests":
      return "Centres d'intérêt";
    case "internship":
      return "Stages";
    case "certificate":
      return "Certificats";
    case "signature":
      return "Signature";
    default:
      return "Section";
  }
}

function renderSectionContent({
  key,
  profile,
  experiences,
  educations,
  languages,
  skills,
  interests,
  internships,
  certificates,
  signature,
}) {
  if (key === "profile" && profile) {
    return (
      <div
        className="text-[15px] leading-relaxed text-gray-800"
        data-marker="profil"
      >
        {profile}
      </div>
    );
  }
  if (key === "education") {
    const items = (educations || []).filter((e) =>
      Object.values(e || {}).some((v) => v)
    );
    if (items.length === 0) return null;
    return (
      <div className="space-y-6">
        {items.map((ed, i) => (
          <div key={i} className="grid grid-cols-[240px,1fr] gap-4">
            <div className="flex items-start gap-3 text-[13px] text-gray-600">
              <span className="mt-1 inline-block w-[10px] h-[10px] rounded-sm bg-[#2f6cc6]" />
              <span data-marker={`education-period-${i}`} className="leading-6">
                {formatDateRange(ed)}
              </span>
            </div>
            <div>
              {ed.title && (
                <div
                  className="text-[16px] font-semibold text-gray-900"
                  data-marker={`education-title-${i}`}
                >
                  {ed.title}
                </div>
              )}
              {(ed.school || ed.city) && (
                <div
                  className="text-[13px] font-semibold"
                  style={{ color: EMPLOYER_COLOR }}
                  data-marker={`education-school-city-${i}`}
                >
                  {ed.school}
                  {ed.city ? `, ${ed.city}` : ""}
                </div>
              )}
              {ed.description && (
                <div
                  className="mt-1 text-[13.5px] text-gray-800"
                  data-marker={`education-description-${i}`}
                >
                  {renderDescription(ed.description)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (key === "experience") {
    const items = (experiences || []).filter((e) =>
      Object.values(e || {}).some((v) => v)
    );
    if (items.length === 0) return null;
    return (
      <div className="space-y-6">
        {items.map((exp, i) => (
          <div key={i} className="grid grid-cols-[240px,1fr] gap-4">
            <div className="flex items-start gap-3 text-[13px] text-gray-600">
              <span className="mt-1 inline-block w-[10px] h-[10px] rounded-sm bg-[#2f6cc6]" />
              <span
                data-marker={`experience-period-${i}`}
                className="leading-6"
              >
                {formatDateRange(exp)}
              </span>
            </div>
            <div>
              {exp.job && (
                <div
                  className="text-[16px] font-semibold text-gray-900"
                  data-marker={`experience-job-${i}`}
                >
                  {exp.job}
                </div>
              )}
              {(exp.employer || exp.city) && (
                <div
                  className="text-[13px] font-semibold"
                  style={{ color: EMPLOYER_COLOR }}
                  data-marker={`experience-employer-city-${i}`}
                >
                  {exp.employer}
                  {exp.city ? `, ${exp.city}` : ""}
                </div>
              )}
              {exp.description && (
                <ul className="mt-1 ml-5 list-disc text-[13.5px] text-gray-800 space-y-1">
                  {splitDescription(exp.description).map((line, j) => (
                    <li
                      key={j}
                      data-marker={`experience-description-${i}-${j}`}
                    >
                      {renderDescription(line)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (key === "languages") {
    const items = (languages || []).filter((l) => l && l.name);
    if (items.length === 0) return null;
    return (
      <div className="space-y-3">
        {items.map((lang, i) => (
          <div
            key={i}
            className="grid grid-cols-[240px,1fr] gap-4 items-center"
          >
            <div className="flex items-center gap-3 text-[13px] text-gray-700">
              <span className="inline-block w-[10px] h-[10px] rounded-sm bg-[#2f6cc6]" />
              <span data-marker={`lang-name-${i}`}>{lang.name}</span>
            </div>
            <div className="h-[8px] bg-gray-200 rounded">
              <div
                className="h-full rounded bg-[#2f6cc6]"
                style={{ width: `${languagePercent(lang.level)}%` }}
                data-marker={`lang-level-${i}`}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (key === "skills") {
    const items = (skills || []).filter((s) => s && s.name);
    if (items.length === 0) return null;
    return (
      <div className="space-y-3">
        {items.map((s, i) => (
          <div
            key={i}
            className="grid grid-cols-[240px,1fr] gap-4 items-center"
          >
            <div className="flex items-center gap-3 text-[13px] text-gray-700">
              <span className="inline-block w-[10px] h-[10px] rounded-sm bg-[#2f6cc6]" />
              <span data-marker={`skill-name-${i}`}>{s.name}</span>
            </div>
            {s.level ? (
              <div className="h-[8px] bg-gray-200 rounded">
                <div
                  className="h-full rounded bg-[#2f6cc6]"
                  style={{ width: `${languagePercent(s.level)}%` }}
                  data-marker={`skill-level-${i}`}
                />
              </div>
            ) : (
              <div className="h-[8px] bg-gray-100 rounded" />
            )}
          </div>
        ))}
      </div>
    );
  }
  if (key === "interests") {
    const items = interests || [];
    if (items.length === 0) return null;
    return (
      <ul className="ml-5 list-disc text-[13.5px] text-gray-800 space-y-1">
        {items.map((it, i) => (
          <li key={i} data-marker={`interest-${i}`}>
            {it}
          </li>
        ))}
      </ul>
    );
  }
  if (key === "internship") {
    const items = (internships || []).filter((i) =>
      Object.values(i || {}).some((v) => v)
    );
    if (items.length === 0) return null;
    return (
      <div className="space-y-6">
        {items.map((int, i) => (
          <div key={i} className="grid grid-cols-[240px,1fr] gap-4">
            <div className="flex items-start gap-3 text-[13px] text-gray-600">
              <span className="mt-1 inline-block w-[10px] h-[10px] rounded-sm bg-[#2f6cc6]" />
              <span
                data-marker={`internship-period-${i}`}
                className="leading-6"
              >
                {formatDateRange(int)}
              </span>
            </div>
            <div>
              {int.job && (
                <div
                  className="text-[16px] font-semibold text-gray-900"
                  data-marker={`internship-job-${i}`}
                >
                  {int.job}
                </div>
              )}
              {(int.employer || int.city) && (
                <div
                  className="text-[13px] font-semibold"
                  style={{ color: EMPLOYER_COLOR }}
                  data-marker={`internship-employer-city-${i}`}
                >
                  {int.employer}
                  {int.city ? `, ${int.city}` : ""}
                </div>
              )}
              {int.description && (
                <div
                  className="mt-1 text-[13.5px] text-gray-800"
                  data-marker={`internship-description-${i}`}
                >
                  {renderDescription(int.description)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (key === "certificate") {
    const items = (certificates || []).filter((c) => c && c.name);
    if (items.length === 0) return null;
    return (
      <div className="space-y-4">
        {items.map((c, i) => (
          <div key={i} className="grid grid-cols-[240px,1fr] gap-4">
            <div className="flex items-start gap-3 text-[13px] text-gray-600">
              <span className="mt-1 inline-block w-[10px] h-[10px] rounded-sm bg-[#2f6cc6]" />
              <span
                data-marker={`certificate-period-${i}`}
                className="leading-6"
              >
                {c.month && c.year ? `${c.month} ${c.year}` : ""}
                {c.current && " - ce jour"}
              </span>
            </div>
            <div>
              <div
                className="text-[16px] font-semibold text-gray-900"
                data-marker={`certificate-name-${i}`}
              >
                {c.name}
              </div>
              {c.description && (
                <div
                  className="mt-1 text-[13.5px] text-gray-800"
                  data-marker={`certificate-description-${i}`}
                >
                  {renderDescription(c.description)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (key === "signature" && signature && signature.image) {
    return (
      <div className="mt-2 flex flex-col items-start">
        <img
          src={signature.image}
          alt="Signature"
          className="max-h-[60px] object-contain inline-block align-middle bg-none border-none shadow-none p-0 m-0"
          data-marker="signature-image"
        />
        {(signature.city || signature.date) && (
          <div className="text-sm text-gray-500 italic mt-2 w-full text-left pl-1">
            {signature.city && <span>{signature.city}</span>}
            {signature.city && signature.date && ". "}
            {signature.date && <span>{signature.date}</span>}
          </div>
        )}
      </div>
    );
  }
  return null;
}

function InfoItem({ icon: Icon, label, marker }) {
  return (
    <div className="flex items-center gap-2" data-marker={marker}>
      <Icon />
      <span className="break-all">{label}</span>
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path d="M2.5 5l6.5 5 6.5-5" stroke="#2f6cc6" strokeWidth="1.5" />
      <rect
        x="2.5"
        y="5"
        width="13"
        height="8"
        rx="2"
        stroke="#2f6cc6"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path
        d="M4 3h2l2 5-1.5 1.5a10 10 0 005 5L13 13l5 2v2a1 1 0 01-1 1A13 13 0 014 4a1 1 0 011-1z"
        stroke="#2f6cc6"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <path
        d="M9 16s7-6.65 7-10.5A7 7 0 002 5.5C2 9.35 9 16 9 16z"
        stroke="#2f6cc6"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="6" r="2.2" stroke="#2f6cc6" strokeWidth="1.5" />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <rect
        x="2.5"
        y="2.5"
        width="13"
        height="13"
        rx="2"
        stroke="#2f6cc6"
        strokeWidth="1.5"
      />
      <path d="M6 7v4M9 7v4M12 7v4" stroke="#2f6cc6" strokeWidth="1.5" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="8" stroke="#2f6cc6" strokeWidth="1.5" />
      <path d="M3 9h12" stroke="#2f6cc6" strokeWidth="1.5" />
      <path d="M9 3v12" stroke="#2f6cc6" strokeWidth="1.5" />
    </svg>
  );
}

function splitDescription(desc) {
  if (!desc) return [];
  return desc
    .split(/\n|•/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function renderDescription(text) {
  const parts = String(text).split(/(https?:\/\/\S+)/g);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#2f6cc6] underline break-all"
      >
        {part}
      </a>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function languagePercent(level) {
  const n = Number(level);
  if (!n || isNaN(n)) return 0;
  return Math.max(0, Math.min(100, (n / 5) * 100));
}

function formatDateRange(obj) {
  if (!obj) return "";
  const months = [
    "janv.",
    "févr.",
    "mars",
    "avr.",
    "mai",
    "juin",
    "juil.",
    "août",
    "sept.",
    "oct.",
    "nov.",
    "déc.",
  ];
  const start =
    obj.startMonth && obj.startYear
      ? `de ${months[Number(obj.startMonth) - 1 || 0] || obj.startMonth} ${
          obj.startYear
        }`
      : "";
  const end = obj.current
    ? "à ce jour"
    : obj.endMonth && obj.endYear
    ? `à ${months[Number(obj.endMonth) - 1 || 0] || obj.endMonth} ${
        obj.endYear
      }`
    : "";
  return [start, end].filter(Boolean).join(" ");
}
