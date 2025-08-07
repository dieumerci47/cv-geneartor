import React from "react";

const ICONS = {
  prenom: (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="8" stroke="#fff" strokeWidth="1.5" />
      <path
        d="M9 10.5c-2.5 0-4.5 1.5-4.5 3v.5h9v-.5c0-1.5-2-3-4.5-3Z"
        fill="#fff"
        fillOpacity=".2"
      />
    </svg>
  ),
  nom: (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="8" stroke="#fff" strokeWidth="1.5" />
      <path
        d="M9 10.5c-2.5 0-4.5 1.5-4.5 3v.5h9v-.5c0-1.5-2-3-4.5-3Z"
        fill="#fff"
        fillOpacity=".2"
      />
    </svg>
  ),
  email: (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <path d="M2.5 5l6.5 5 6.5-5" stroke="#2731F5" strokeWidth="1.5" />
      <rect
        x="2.5"
        y="5"
        width="13"
        height="8"
        rx="2"
        stroke="#2731F5"
        strokeWidth="1.5"
      />
    </svg>
  ),
  telephone: (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <path
        d="M4 3h2l2 5-1.5 1.5a10 10 0 005 5L13 13l5 2v2a1 1 0 01-1 1A13 13 0 014 4a1 1 0 011-1z"
        stroke="#fff"
        strokeWidth="1.5"
      />
    </svg>
  ),
  adresse: (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <path
        d="M9 16s7-6.65 7-10.5A7 7 0 002 5.5C2 9.35 9 16 9 16z"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="6" r="2.2" stroke="#fff" strokeWidth="1.5" />
    </svg>
  ),
  codePostal: (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <rect
        x="3"
        y="3"
        width="12"
        height="12"
        rx="2"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <text x="9" y="13" textAnchor="middle" fontSize="8" fill="#fff">
        CP
      </text>
    </svg>
  ),
  ville: (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <path
        d="M9 16s7-6.65 7-10.5A7 7 0 002 5.5C2 9.35 9 16 9 16z"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="6" r="2.2" stroke="#fff" strokeWidth="1.5" />
    </svg>
  ),
  lieu: (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <circle cx="9" cy="6" r="2.2" stroke="#fff" strokeWidth="1.5" />
      <path
        d="M9 16s7-6.65 7-10.5A7 7 0 002 5.5C2 9.35 9 16 9 16z"
        stroke="#fff"
        strokeWidth="1.5"
      />
    </svg>
  ),
  sexe: (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="8" stroke="#fff" strokeWidth="1.5" />
      <path d="M9 5v8M5 9h8" stroke="#fff" strokeWidth="1.5" />
    </svg>
  ),
  nationalites: (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <rect
        x="3"
        y="3"
        width="12"
        height="12"
        rx="2"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <path d="M3 9h12" stroke="#fff" strokeWidth="1.5" />
      <path d="M9 3v12" stroke="#fff" strokeWidth="1.5" />
    </svg>
  ),
  etatCivil: (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <rect
        x="3"
        y="3"
        width="12"
        height="12"
        rx="2"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="9" r="3" stroke="#fff" strokeWidth="1.5" />
    </svg>
  ),
  site: (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="8" stroke="#fff" strokeWidth="1.5" />
      <path d="M3 9h12" stroke="#fff" strokeWidth="1.5" />
      <path d="M9 3v12" stroke="#fff" strokeWidth="1.5" />
    </svg>
  ),
  linkedin: (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <rect
        x="2.5"
        y="2.5"
        width="13"
        height="13"
        rx="2"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <path d="M6 7v4M9 7v4M12 7v4" stroke="#fff" strokeWidth="1.5" />
    </svg>
  ),
  permis: (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <rect
        x="3"
        y="3"
        width="12"
        height="12"
        rx="2"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <path d="M6 12h6" stroke="#fff" strokeWidth="1.5" />
    </svg>
  ),
  emploi: (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <path
        d="M3 7V5a3 3 0 013-3h6a3 3 0 013 3v2"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <rect
        x="2.5"
        y="7.5"
        width="13"
        height="8"
        rx="2"
        stroke="#fff"
        strokeWidth="1.5"
      />
    </svg>
  ),
  custom: (
    <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
      <circle cx="9" cy="9" r="8" stroke="#fff" strokeWidth="1.5" />
      <path d="M6 9h6" stroke="#fff" strokeWidth="1.5" />
    </svg>
  ),
};

const PERSONAL_ORDER = [
  "prenom",
  "nom",
  "email",
  "telephone",
  "adresse",
  "codePostal",
  "ville",
  "lieu",
  "sexe",
  "nationalites",
  "etatCivil",
  "site",
  "linkedin",
  "permis",
  "emploi",
];

const PERSONAL_LABELS = {
  prenom: "Prénom",
  nom: "Nom",
  email: "E-mail",
  telephone: "Téléphone",
  adresse: "Adresse",
  codePostal: "Code postal",
  ville: "Ville",
  linkedin: "LinkedIn",
  emploi: "Emploi recherché",
  lieu: "Lieu de naissance",
  permis: "Permis",
  sexe: "Sexe",
  nationalites: "Nationalités",
  etatCivil: "État civil",
  site: "Site web",
  custom: "Autre",
};

const SECTION_TITLE_COLOR = "#4B6CB7";

const SECTION_KEY_MAP = {
  profile: "profile",
  education: "educations",
  experience: "experiences",
  certificate: "certificates",
  internship: "internships",
  signature: "signature",
};

const LEFT_SECTION_TITLE_COLOR = "#4B6CB7";
const LEFT_TEXT_COLOR = "#223A5E";

function isEmpty(cvData) {
  if (!cvData) return true;
  const {
    personal,
    profile,
    experiences,
    educations,
    languages,
    skills,
    interests,
    certificates,
    internships,
    signature,
  } = cvData;
  const hasPersonal = personal && Object.values(personal).some((v) => v);
  const hasProfile = profile && profile.trim() !== "";
  const hasExp =
    Array.isArray(experiences) &&
    experiences.some((e) => Object.values(e).some((v) => v));
  const hasEdu =
    Array.isArray(educations) &&
    educations.some((e) => Object.values(e).some((v) => v));
  const hasLang = Array.isArray(languages) && languages.some((l) => l.name);
  const hasSkills = Array.isArray(skills) && skills.some((s) => s.name);
  const hasInterests = Array.isArray(interests) && interests.length > 0;
  const hasCert =
    Array.isArray(certificates) && certificates.some((c) => c.name);
  const hasIntern =
    Array.isArray(internships) && internships.some((i) => i.job);
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
}

export default function Template1CV({ cvData, leftSections, rightSections }) {
  if (isEmpty(cvData)) {
    return (
      <div className="bg-gradient-to-br from-[#e3e6f5] via-[#b3d0f7] to-[#eec6e6] w-full h-[700px] rounded-xl shadow-lg flex items-center justify-center"></div>
    );
  }
  const {
    personal = {},
    profile,
    educations = [],
    experiences = [],
    skills = [],
    languages = [],
    interests = [],
    certificates = [],
    internships = [],
    signature = {},
  } = cvData;

  const fullName = [personal.prenom, personal.nom].filter(Boolean).join(" ");
  // Section infos perso : ordre précis, icônes, nom/prénom inclus
  const orderedPersonal = PERSONAL_ORDER.filter((key) => personal[key]).map(
    (key) => [key, personal[key]]
  );
  const customPersonal = Object.entries(personal).filter(
    ([key, value]) => value && !PERSONAL_ORDER.includes(key) && key !== "photo"
  );
  const allPersonal = [...orderedPersonal, ...customPersonal];

  const leftOrder = leftSections || ["languages", "skills", "interests"];
  const rightOrder = rightSections || [
    "profile",
    "experiences",
    "educations",
    "certificates",
    "internships",
    "signature",
  ];

  // Helpers pour affichage des sections à GAUCHE (style type exemple fourni)
  const renderLeftSection = (key) => {
    if (
      key === "languages" &&
      languages.length > 0 &&
      languages.some((l) => l.name)
    ) {
      return (
        <div className="w-full mb-8">
          <div className="text-xl font-bold mb-2 pb-1 text-[#4B6CB7] border-b border-gray-300">
            Langues
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {languages
              .filter((l) => l.name)
              .map((lang, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-base text-[#223A5E]"
                >
                  <span className="w-20" data-marker={`lang-name-${i}`}>
                    {lang.name}
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <span
                        key={j}
                        className={`w-3 h-3 rounded-full ${
                          j <= lang.level ? "bg-[#4B6CB7]" : "bg-gray-300"
                        } inline-block`}
                        data-marker={`lang-level-${i}-${j}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      );
    }
    if (key === "skills" && skills.length > 0 && skills.some((s) => s.name)) {
      return (
        <div className="w-full mb-8">
          <div className="text-xl font-bold mb-2 pb-1 text-[#4B6CB7] border-b border-gray-300">
            Compétences
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {skills
              .filter((s) => s.name)
              .map((sk, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-base text-[#223A5E]"
                  data-marker={`skill-name-${i}`}
                >
                  <span>{sk.name}</span>
                  {sk.level && (
                    <span className="ml-2 flex gap-1">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <span
                          key={j}
                          className={`w-3 h-3 rounded-full ${
                            j <= sk.level ? "bg-[#4B6CB7]" : "bg-gray-300"
                          } inline-block`}
                          data-marker={`skill-level-${i}-${j}`}
                        />
                      ))}
                    </span>
                  )}
                </div>
              ))}
          </div>
        </div>
      );
    }
    if (key === "interests" && interests.length > 0) {
      return (
        <div className="w-full mb-8">
          <div className="text-xl font-bold mb-2 pb-1 text-[#4B6CB7] border-b border-gray-300">
            Centres d'intérêt
          </div>
          <ul className="flex flex-col gap-2 mt-2">
            {interests.map((int, i) => (
              <li
                key={i}
                className="text-base text-[#223A5E] flex items-center gap-2"
                data-marker={`interest-${i}`}
              >
                <span className="w-3 h-3 rounded bg-[#4B6CB7] inline-block"></span>
                {int}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  // Helpers pour affichage des sections à DROITE (style type exemple fourni)
  const renderRightSection = (key) => {
    const mappedKey = SECTION_KEY_MAP[key] || key;
    if (mappedKey === "profile" && profile && profile.trim() !== "") {
      return (
        <div className="mb-8">
          <div className="text-2xl font-bold text-[#4B6CB7] mb-2 border-b border-gray-300 pb-1">
            Profil
          </div>
          <div
            className="text-gray-800 text-base leading-relaxed"
            data-marker="profil"
          >
            {profile}
          </div>
        </div>
      );
    }
    if (
      mappedKey === "educations" &&
      educations.length > 0 &&
      educations.some((e) => Object.values(e).some((v) => v))
    ) {
      return (
        <div className="mb-8">
          <div className="text-2xl font-bold text-[#4B6CB7] mb-2 border-b border-gray-300 pb-1">
            Formation
          </div>
          <div className="flex flex-col gap-4 mt-2">
            {educations.map((ed, idx) => (
              <div key={idx} className="">
                <div className="flex justify-between items-center">
                  <div
                    className="font-semibold text-base"
                    data-marker={`education-title-${idx}`}
                  >
                    {ed.title}
                  </div>
                  <div
                    className="text-sm text-[#4B6CB7] font-semibold"
                    data-marker={`education-period-${idx}`}
                  >
                    {formatDate(ed.startMonth, ed.startYear)}
                    {((ed.endMonth && ed.endYear) || ed.current) &&
                      ` à ${formatDate(ed.endMonth, ed.endYear, ed.current)}`}
                  </div>
                </div>
                {ed.school && (
                  <div
                    className="text-sm text-[#4B6CB7]"
                    data-marker={`education-school-city-${idx}`}
                  >
                    {ed.school}
                    {ed.city && `, ${ed.city}`}
                  </div>
                )}
                {ed.description && (
                  <div
                    className="text-gray-800 text-sm mt-1"
                    data-marker={`education-description-${idx}`}
                  >
                    {renderDescription(ed.description)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (
      mappedKey === "experiences" &&
      experiences.length > 0 &&
      experiences.some((e) => Object.values(e).some((v) => v))
    ) {
      return (
        <div className="mb-8">
          <div className="text-2xl font-bold text-[#4B6CB7] mb-2 border-b border-gray-300 pb-1">
            Expérience professionnelle
          </div>
          <div className="flex flex-col gap-4 mt-2">
            {experiences.map((exp, idx) => (
              <div key={idx} className="">
                <div className="flex justify-between items-center">
                  <div
                    className="font-semibold text-base"
                    data-marker={`experience-job-${idx}`}
                  >
                    {exp.job}
                  </div>
                  <div
                    className="text-sm text-[#4B6CB7] font-semibold"
                    data-marker={`experience-period-${idx}`}
                  >
                    {formatDate(exp.startMonth, exp.startYear)}
                    {((exp.endMonth && exp.endYear) || exp.current) &&
                      ` à ${formatDate(
                        exp.endMonth,
                        exp.endYear,
                        exp.current
                      )}`}
                  </div>
                </div>
                {exp.employer && (
                  <div
                    className="text-sm text-[#4B6CB7]"
                    data-marker={`experience-employer-city-${idx}`}
                  >
                    {exp.employer}
                    {exp.city && `, ${exp.city}`}
                  </div>
                )}
                {exp.description && (
                  <div
                    className="text-gray-800 text-sm mt-1"
                    data-marker={`experience-description-${idx}`}
                  >
                    {renderDescription(exp.description)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (
      mappedKey === "internships" &&
      internships.length > 0 &&
      internships.some((i) => Object.values(i).some((v) => v))
    ) {
      return (
        <div className="mb-8">
          <div className="text-2xl font-bold text-[#4B6CB7] mb-2 border-b border-gray-300 pb-1">
            Stages
          </div>
          <div className="flex flex-col gap-4 mt-2">
            {internships.map((int, idx) => (
              <div key={idx} className="">
                <div className="flex justify-between items-center">
                  <div
                    className="font-semibold text-base"
                    data-marker={`internship-job-${idx}`}
                  >
                    {int.job}
                  </div>
                  <div
                    className="text-sm text-[#4B6CB7] font-semibold"
                    data-marker={`internship-period-${idx}`}
                  >
                    {formatDate(int.startMonth, int.startYear)}
                    {((int.endMonth && int.endYear) || int.current) &&
                      ` à ${formatDate(
                        int.endMonth,
                        int.endYear,
                        int.current
                      )}`}
                  </div>
                </div>
                {int.employer && (
                  <div
                    className="text-sm text-[#4B6CB7]"
                    data-marker={`internship-employer-city-${idx}`}
                  >
                    {int.employer}
                    {int.city && `, ${int.city}`}
                  </div>
                )}
                {int.description && (
                  <div
                    className="text-gray-800 text-sm mt-1"
                    data-marker={`internship-description-${idx}`}
                  >
                    {renderDescription(int.description)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (
      mappedKey === "certificates" &&
      certificates.length > 0 &&
      certificates.some((c) => c.name)
    ) {
      return (
        <div className="mb-8">
          <div className="text-2xl font-bold text-[#4B6CB7] mb-2 border-b border-gray-300 pb-1">
            Certificats
          </div>
          <div className="flex flex-col gap-4 mt-2">
            {certificates.map((c, idx) => (
              <div key={idx} className="">
                <div className="flex justify-between items-center">
                  <div
                    className="font-semibold text-base"
                    data-marker={`certificate-name-${idx}`}
                  >
                    {c.name}
                  </div>
                  <div
                    className="text-sm text-[#4B6CB7] font-semibold"
                    data-marker={`certificate-period-${idx}`}
                  >
                    {c.month && c.year ? `${c.month} ${c.year}` : ""}
                    {c.current && " - ce jour"}
                  </div>
                </div>
                {c.description && (
                  <div
                    className="text-gray-800 text-sm mt-1"
                    data-marker={`certificate-description-${idx}`}
                  >
                    {renderDescription(c.description)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    if (mappedKey === "signature" && signature && signature.image) {
      return (
        <div className="mt-8 flex flex-col items-start">
          <img
            src={signature.image}
            alt="Signature"
            className="max-h-[60px] object-contain inline-block align-middle bg-none border-none shadow-none p-0 m-0"
            data-marker="signature-image"
          />
        </div>
      );
    }
    return null;
  };

  // Helper pour rendre les descriptions avec liens cliquables
  function renderDescription(desc) {
    // Remplace les liens par des <a> cliquables
    const parts = desc.split(/(https?:\/\/\S+)/g);
    return parts.map((part, i) =>
      part.match(/^https?:\/\//) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#4B6CB7] underline break-all"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  }

  return (
    <div className="bg-white w-full max-w-3xl mx-auto rounded-2xl shadow-2xl overflow-hidden text-[#222] font-sans flex flex-col md:flex-row min-h-[700px]">
      {/* Colonne gauche élargie */}
      <div className="w-full md:w-[45%] lg:w-[42%] bg-[#f5f8fc] text-[#223A5E] flex flex-col items-stretch py-0 px-0 gap-0 relative border-r border-gray-200">
        {/* Nom/prénom en haut, plus petit, sur une ligne */}
        {fullName && (
          <div className="w-full pt-8 pb-2 px-0 flex flex-col items-center justify-center bg-[#4B6CB7]">
            <div
              className="text-xl font-bold text-white text-center mb-1 whitespace-nowrap overflow-hidden text-ellipsis"
              style={{ letterSpacing: 0.5 }}
              data-marker="nom-header"
            >
              {fullName}
            </div>
          </div>
        )}
        {/* Photo centrée sous le nom */}
        {personal.photo && (
          <div className="flex justify-center mb-4 bg-[#f5f8fc]">
            <img
              src={personal.photo}
              alt="photo"
              className="w-28 h-28 object-cover rounded-full border-4 border-white shadow-lg"
              data-marker="photo"
            />
          </div>
        )}
        {/* Infos personnelles dynamiques avec icônes et ordre précis (inclut à nouveau nom/prénom) */}
        {allPersonal.length > 0 && (
          <div className="w-full mb-8">
            <div className="text-xl font-bold mb-2 pb-1 text-[#4B6CB7] border-b border-gray-300">
              Informations personnelles
            </div>
            <div className="flex flex-col gap-3 text-base mt-2">
              {allPersonal.map(([key, value]) =>
                key === "prenom" || key === "nom" ? null : (
                  <div
                    key={key}
                    className="flex items-center gap-3 pl-0 ml-0 text-[#223A5E]"
                    data-marker={`personal-field-${key}`}
                  >
                    <span className="w-7 flex-shrink-0 flex items-center justify-center ml-0 pl-0">
                      {ICONS[key] || ICONS.custom}
                    </span>
                    <span className="font-semibold text-left break-words w-full overflow-wrap break-all">
                      {value}
                    </span>
                  </div>
                )
              )}
              {/* Affiche nom/prénom sur une seule ligne en haut de la section infos perso */}
              {personal.prenom || personal.nom ? (
                <div
                  className="flex items-center gap-3 pl-0 ml-0 text-[#223A5E]"
                  data-marker="personal-field-fullname"
                >
                  <span className="w-7 flex-shrink-0 flex items-center justify-center ml-0 pl-0">
                    {ICONS.prenom}
                  </span>
                  <span className="font-semibold text-left break-words w-full overflow-wrap break-all">
                    {fullName}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
        )}
        {/* Sections dynamiques gauche (ordre drag & drop) */}
        <div className="px-6">
          {leftOrder.map((key) => renderLeftSection(key))}
        </div>
      </div>
      {/* Colonne droite réduite */}
      <div className="flex-1 bg-white p-10 flex flex-col gap-6">
        {rightOrder.map((key) => renderRightSection(key))}
      </div>
    </div>
  );
}

function formatDate(month, year, current) {
  if (current) return "ce jour";
  if (month && year) return `${month}/${year}`;
  if (year) return year;
  return "";
}
