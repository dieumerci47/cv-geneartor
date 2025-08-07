import React from "react";

export default function Template2CV({ cvData }) {
  const {
    personal,
    profile,
    experiences,
    educations,
    languages,
    skills,
    interests,
  } = cvData;
  return (
    <div className="bg-white w-[900px] mx-auto rounded-xl shadow-lg overflow-hidden text-[#222] font-sans flex">
      {/* Colonne gauche (bleue) */}
      <div className="w-[270px] bg-[#3a7ec1] text-white flex flex-col min-h-full">
        <div className="flex flex-col items-center px-6 pt-8 pb-4">
          {personal?.photo && (
            <img
              src={personal.photo}
              alt="photo"
              className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md mb-4"
              data-marker="photo"
            />
          )}
          <h1 className="text-2xl font-bold mb-1 text-center">
            <span data-marker="nom">
              {personal?.prenom} {personal?.nom}
            </span>
          </h1>
        </div>
        <div className="px-6">
          <h2 className="text-lg font-semibold mb-2 border-b border-white/30 pb-1">
            Informations personnelles
          </h2>
          <div className="flex flex-col gap-2 text-sm mb-4">
            {personal?.email && (
              <div className="flex items-center gap-2" data-marker="email">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path d="M2 4l6 5 6-5" stroke="#fff" strokeWidth="1.5" />
                  <rect
                    x="2"
                    y="4"
                    width="12"
                    height="8"
                    rx="2"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                </svg>
                {personal.email}
              </div>
            )}
            {personal?.telephone && (
              <div className="flex items-center gap-2" data-marker="telephone">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path
                    d="M3 2h2l2 5-1.5 1.5a10 10 0 005 5L11 11l5 2v2a1 1 0 01-1 1A13 13 0 013 3a1 1 0 011-1z"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                </svg>
                {personal.telephone}
              </div>
            )}
            {personal?.adresse && (
              <div className="flex items-center gap-2" data-marker="adresse">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <path
                    d="M8 14s6-5.686 6-9A6 6 0 002 5c0 3.314 6 9 6 9z"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                  <circle cx="8" cy="5" r="2" stroke="#fff" strokeWidth="1.5" />
                </svg>
                {personal.adresse}
              </div>
            )}
            {personal?.linkedin && (
              <div className="flex items-center gap-2" data-marker="linkedin">
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                  <rect
                    x="2"
                    y="2"
                    width="12"
                    height="12"
                    rx="2"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M5 6v4M8 6v4M11 6v4"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                </svg>
                {personal.linkedin}
              </div>
            )}
          </div>
          {/* Langues */}
          <h2 className="text-lg font-semibold mb-2 border-b border-white/30 pb-1">
            Langues
          </h2>
          <div className="flex flex-col gap-2 mb-4">
            {languages?.map((lang, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-20" data-marker={`lang-name-${i}`}>
                  {lang.name}
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <span
                      key={j}
                      className={`w-3 h-3 rounded-full ${
                        j <= lang.level ? "bg-white" : "bg-white/40"
                      } inline-block`}
                      data-marker={`lang-level-${i}-${j}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Qualités */}
          {skills?.length > 0 && (
            <>
              <h2 className="text-lg font-semibold mb-2 border-b border-white/30 pb-1">
                Qualités
              </h2>
              <ul className="mb-4 list-disc ml-5">
                {skills.map((sk, i) => (
                  <li
                    key={i}
                    className="text-white"
                    data-marker={`skill-name-${i}`}
                  >
                    {sk.name}
                  </li>
                ))}
              </ul>
            </>
          )}
          {/* Centres d'intérêt */}
          {interests?.length > 0 && (
            <>
              <h2 className="text-lg font-semibold mb-2 border-b border-white/30 pb-1">
                Centres d'intérêt
              </h2>
              <ul className="mb-4 list-disc ml-5">
                {interests.map((int, i) => (
                  <li
                    key={i}
                    className="text-white"
                    data-marker={`interest-${i}`}
                  >
                    {int}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
      {/* Colonne droite (contenu) */}
      <div className="flex-1 px-10 py-8">
        {/* Profil */}
        {profile && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#3a7ec1] mb-2">
              Profil
            </h2>
            <div className="text-base text-[#222]" data-marker="profil">
              {profile}
            </div>
          </div>
        )}
        {/* Expérience */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#3a7ec1] mb-2">
            Expérience professionnelle
          </h2>
          {experiences?.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <div
                  className="font-bold text-base"
                  data-marker={`exp-job-${i}`}
                >
                  {exp.job}
                </div>
                <div
                  className="text-sm text-[#3a7ec1] font-semibold"
                  data-marker={`exp-date-${i}`}
                >
                  {formatDateRange(exp)}
                </div>
              </div>
              <div
                className="font-semibold text-[#3a7ec1] text-sm mb-1"
                data-marker={`exp-employer-${i}`}
              >
                {exp.employer}
                {exp.city ? ", " + exp.city : ""}
              </div>
              <ul className="list-disc ml-5 text-sm">
                {exp.description
                  ?.split(/\n|•/)
                  .filter(Boolean)
                  .map((line, j) => (
                    <li key={j} data-marker={`exp-desc-${i}-${j}`}>
                      {line.trim()}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Formation */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#3a7ec1] mb-2">
            Formation
          </h2>
          {educations?.map((ed, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <div
                  className="font-bold text-base"
                  data-marker={`edu-title-${i}`}
                >
                  {ed.title}
                </div>
                <div
                  className="text-sm text-[#3a7ec1] font-semibold"
                  data-marker={`edu-date-${i}`}
                >
                  {formatDateRange(ed)}
                </div>
              </div>
              <div
                className="font-semibold text-[#3a7ec1] text-sm mb-1"
                data-marker={`edu-school-${i}`}
              >
                {ed.school}
                {ed.city ? ", " + ed.city : ""}
              </div>
              <div className="text-sm" data-marker={`edu-desc-${i}`}>
                {ed.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatDateRange(obj) {
  // Ex: de févr. 2013 à mai 2020
  if (!obj) return "";
  const mois = [
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
  let start =
    obj.startMonth && obj.startYear
      ? `de ${mois[obj.startMonth - 1] || obj.startMonth} ${obj.startYear}`
      : "";
  let end = obj.current
    ? "à ce jour"
    : obj.endMonth && obj.endYear
    ? `à ${mois[obj.endMonth - 1] || obj.endMonth} ${obj.endYear}`
    : "";
  return [start, end].filter(Boolean).join(" ");
}
