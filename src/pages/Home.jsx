import React from "react";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import CV from "../assets/templates/cv1.svg";
import CV2 from "../assets/templates/cv2.svg";
import CV3 from "../assets/templates/cv3.svg";
// import CV from "../assets/templates/cv1.svg";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
// Ajoute une image de CVs dans public/cvs-preview.png ou adapte le chemin
// import { ReactComponent as Cv1 } from "../assets/cv1.svg";
const cvTemplates = [
  {
    name: "Template 1",
    type: "FORMAT EUROPÉEN",
    // image: "./../assets/templates/cv1.svg",
    image: CV,
  },
  {
    name: "Template 1",
    type: "FORMAT EUROPÉEN",
    image: CV2,
  },
  {
    name: "Template 1",
    type: "FORMAT EUROPÉEN",
    image: CV3,
  } /* 
  {
    name: "Template 2",
    type: "CLASSIQUE",
    image:
      "https://cdn-blog.novoresume.com/articles/what-is-a-cv/what-is-a-cv.png",
  },
  {
    name: "Template 3",
    type: "MODERNE",
    image:
      "https://cdn-blog.novoresume.com/articles/what-is-a-cv/what-is-a-cv.png",
  },
  {
    name: "Template 4",
    type: "CRÉATIF",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.WI2riEc8eubor1AQUiUAPgHaI5?rs=1&pid=ImgDetMain&o=7&rm=3",
  }, */,
];

/* const badgeColors = {
  "FORMAT EUROPÉEN": "bg-[#4B4EDB]",
  CLASSIQUE: "bg-blue-700",
  MODERNE: "bg-green-600",
  CRÉATIF: "bg-pink-600",
};
 */
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#e3e6f5] via-[#b3d0f7] to-[#eec6e6]">
      {/* Section d'accroche façon CVDesignR */}
      <section
        id="home"
        className="w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-20 pt-6 pb-8 gap-8"
      >
        <div className="flex-1 max-w-xl text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
            Créez votre CV professionnel
            <br />
            en ligne gratuitement avec{" "}
            <span className="text-blue-700">CVMarket</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            En quelques minutes, créez <b>votre CV gratuitement</b>, choisissez
            un modèle, personnalisez son design puis optimisez-le avec{" "}
            <b>l'intelligence artificielle</b>.<br />
            Votre CV pdf <b>100% compatible ATS</b> est prêt.
          </p>
          <Button className="px-8 py-4 text-lg mb-8">Commencer</Button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img
            src="https://cdn.cvdesignr.com/static/landing/uploads/63df8153-3985-43e0-a146-379c3c8b6d53.png"
            alt="Aperçu de CVs"
            className="w-full max-w-md rounded-xl shadow-lg border border-blue-100 bg-white"
            style={{ minWidth: 260 }}
          />
        </div>
      </section>

      {/* Section Exemples de CV - Hover only */}
      <section className="w-full max-w-6xl mx-auto mb-20 px-4" id="modeles">
        <h3 className="text-2xl font-bold text-blue-700 mb-8 text-center">
          Exemples de templates de CV
        </h3>
        <div className="relative flex flex-col items-center">
          <div className="w-full pt-3 flex flex-col md:flex-row md:items-stretch md:justify-between gap-6">
            {cvTemplates.map((tpl, idx) => (
              <div
                key={idx}
                className={`group transition-all duration-300 cursor-pointer rounded-2xl border-4 flex flex-col items-center p-0 aspect-[3/4] relative overflow-visible border-transparent shadow-md bg-white/80 hover:scale-105 hover:shadow-2xl hover:border-blue-500 flex-1`}
                style={{ minHeight: 320, minWidth: 260, maxWidth: 420 }}
              >
                {/* Badge type du CV, bien AU-DESSUS de la carte */}
                {/*    <div
                  className={`absolute -top-8 left-1/2 -translate-x-1/2 px-7 py-2 rounded-2xl text-white font-extrabold text-lg shadow-lg select-none text-center whitespace-pre-line ${
                    tpl.type === "FORMAT EUROPÉEN"
                      ? "bg-[#4B4EDB]"
                      : badgeColors[tpl.type] || "bg-[#4B4EDB]"
                  }`}
                  style={{
                    zIndex: 10,
                    minWidth: 170,
                    boxShadow: "0 4px 16px 0 rgba(75,78,219,0.10)",
                    fontSize: 15,
                    lineHeight: 1.1,
                  }}
                >
                  {tpl.type}
                </div> */}
                <img
                  src={tpl.image}
                  alt={tpl.name}
                  className="h-full w-full object-cover rounded-xl"
                  style={{ minHeight: 320, minWidth: 220 }}
                />
                {/* Bouton visible uniquement au hover */}
                <Button
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 text-base font-bold bg-pink-400 hover:bg-pink-500 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto"
                  onClick={() => {
                    const targetIdx = idx === 1 ? 2 : idx === 2 ? 3 : idx; // image 2 -> Template4 (idx 2), image 3 -> Template3 (idx 3)
                    navigate("/editor", { state: { templateIdx: targetIdx } });
                  }}
                >
                  CRÉER MON CV
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section fonctionnalités */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-blue-600 mb-2">
            Templates modernes
          </h3>
          <p>Choisissez parmi plusieurs styles de CV professionnels.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-blue-600 mb-2">Édition facile</h3>
          <p>
            Modifiez vos informations en temps réel avec un aperçu instantané.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-blue-600 mb-2">
            Export PDF avec markers
          </h3>
          <p>
            Téléchargez un PDF prêt à l’emploi, optimisé pour l’analyse
            automatique.
          </p>
        </div>
      </section>
      {/* Footer moderne */}
      <footer className="w-full bg-gradient-to-b from-blue-50 to-white backdrop-blur-lg border-t border-blue-100/50 py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Logo et description */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-600 w-3 h-7 rounded-full"></div>
                <span className="font-bold text-xl text-blue-800 tracking-tight">
                  CVMarker
                </span>
              </div>
              <p className="text-sm text-gray-500 max-w-xs">
                Créateur de CV intelligents - Transformez votre parcours
                professionnel en opportunités
              </p>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-blue-800 font-semibold mb-3 text-sm uppercase tracking-wider">
                  Navigation
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#home"
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      Accueil
                    </a>
                  </li>
                  <li>
                    <a
                      href="#modeles"
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      Modèles
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      Exemples
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-blue-800 font-semibold mb-3 text-sm uppercase tracking-wider">
                  Légal
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      Confidentialité
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      Conditions
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                    >
                      Cookies
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact et social */}
            <div className="space-y-4">
              <div>
                <h3 className="text-blue-800 font-semibold mb-3 text-sm uppercase tracking-wider">
                  Contact
                </h3>
                <p className="text-gray-600 text-sm">support@cvgenerator.fr</p>
              </div>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/dieumerci47/cv-geneartor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 p-2 rounded-lg hover:bg-blue-200 transition-colors group"
                >
                  <svg
                    className="w-5 h-5 text-blue-600 group-hover:text-blue-800 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-blue-100 p-2 rounded-lg hover:bg-blue-200 transition-colors group"
                >
                  <svg
                    className="w-5 h-5 text-blue-600 group-hover:text-blue-800 transition-colors"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright et mentions */}
          <div className="border-t border-blue-100/50 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <span className="text-gray-500 text-sm">
              © {new Date().getFullYear()} CV Generator - Projet Hackathon
            </span>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <a
                href="#"
                className="text-gray-500 hover:text-blue-600 transition-colors text-xs"
              >
                Mentions légales
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-600 transition-colors text-xs"
              >
                Accessibilité
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-600 transition-colors text-xs"
              >
                Gestion des cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
