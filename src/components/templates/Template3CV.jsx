import React from "react";

const Template3CV = React.forwardRef(function Template3CV({ cvData }, ref) {
  const { personal, profile, experiences, educations } = cvData;
  return (
    <div
      ref={ref}
      className="bg-white w-[900px] mx-auto rounded-xl shadow-lg overflow-hidden text-[#222] font-sans p-8"
    >
      {/* Titre */}
      <h1 className="text-4xl font-bold text-center mb-8">Curriculum vitae</h1>
      {/* Informations personnelles */}
      <div className="bg-gray-400/90 rounded mb-6 flex items-center p-6">
        <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2">
          <LabelValue
            label="Nom"
            value={`${personal?.prenom || ""} ${personal?.nom || ""}`}
            marker="nom"
          />
          <LabelValue
            label="Adresse e-mail"
            value={personal?.email}
            marker="email"
          />
          <LabelValue
            label="Numéro de téléphone"
            value={personal?.telephone}
            marker="telephone"
          />
          <LabelValue
            label="Adresse"
            value={personal?.adresse}
            marker="adresse"
          />
          <LabelValue
            label="LinkedIn"
            value={personal?.linkedin}
            marker="linkedin"
          />
        </div>
        {personal?.photo && (
          <img
            src={personal.photo}
            alt="photo"
            className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md ml-8"
            data-marker="photo"
          />
        )}
      </div>
      {/* Profil */}
      {profile && (
        <div className="bg-gray-200 rounded mb-6 p-6">
          <h2 className="text-xl font-bold mb-2">Profil</h2>
          <div className="text-base" data-marker="profil">
            {profile}
          </div>
        </div>
      )}
      {/* Expérience professionnelle */}
      <div className="bg-gray-200 rounded mb-6 p-6">
        <h2 className="text-xl font-bold mb-2">Expérience professionnelle</h2>
        {experiences?.map((exp, i) => (
          <div key={i} className="mb-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
              <div className="font-bold text-base" data-marker={`exp-job-${i}`}>
                {exp.job}
              </div>
              <div
                className="text-sm text-gray-700 font-semibold"
                data-marker={`exp-date-${i}`}
              >
                {formatDateRange(exp)}
              </div>
            </div>
            <div
              className="font-semibold text-gray-700 text-sm mb-1"
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
      <div className="bg-gray-200 rounded mb-6 p-6">
        <h2 className="text-xl font-bold mb-2">Formation</h2>
        {educations?.map((ed, i) => (
          <div key={i} className="mb-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
              <div
                className="font-bold text-base"
                data-marker={`edu-title-${i}`}
              >
                {ed.title}
              </div>
              <div
                className="text-sm text-gray-700 font-semibold"
                data-marker={`edu-date-${i}`}
              >
                {formatDateRange(ed)}
              </div>
            </div>
            <div
              className="font-semibold text-gray-700 text-sm mb-1"
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
  );
});

export default Template3CV;

function LabelValue({ label, value, marker }) {
  return (
    <div className="flex">
      <span className="font-bold min-w-[120px]">{label}</span>
      <span className="ml-2" data-marker={marker}>
        {value}
      </span>
    </div>
  );
}

function formatDateRange(obj) {
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
