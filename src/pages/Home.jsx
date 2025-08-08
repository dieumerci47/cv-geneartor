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

const badgeColors = {
  "FORMAT EUROPÉEN": "bg-[#4B4EDB]",
  CLASSIQUE: "bg-blue-700",
  MODERNE: "bg-green-600",
  CRÉATIF: "bg-pink-600",
};

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-[#e3e6f5] via-[#b3d0f7] to-[#eec6e6]">
      {/* Section d'accroche façon CVDesignR */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-20 pt-6 pb-8 gap-8">
        <div className="flex-1 max-w-xl text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
            Créez votre CV professionnel
            <br />
            en ligne gratuitement avec{" "}
            <span className="text-blue-700">CV-Genarator</span>
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
      <section className="w-full max-w-6xl mx-auto mb-20">
        <h3 className="text-2xl font-bold text-blue-700 mb-8 text-center">
          Exemples de templates de CV
        </h3>
        <div className="relative flex flex-col items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full pt-3">
            {cvTemplates.map((tpl, idx) => (
              <div
                key={idx}
                className={`group transition-all duration-300 cursor-pointer rounded-2xl border-4 flex flex-col items-center p-0 aspect-[3/4] relative overflow-visible border-transparent shadow-md bg-white/80 hover:scale-105 hover:shadow-2xl hover:border-blue-500`}
                style={{ minHeight: 320, maxWidth: 340 }}
              >
                {/* Badge type du CV, bien AU-DESSUS de la carte */}
                <div
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
                </div>
                <img
                  src={tpl.image}
                  alt={tpl.name}
                  className="h-full w-full object-cover rounded-xl"
                  style={{ minHeight: 320, minWidth: 220 }}
                />
                {/* Bouton visible uniquement au hover */}
                <Button
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 px-8 py-3 text-base font-bold bg-pink-400 hover:bg-pink-500 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto"
                  onClick={() =>
                    navigate("/editor", { state: { templateIdx: idx } })
                  }
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
      <footer className="w-full bg-white/80 backdrop-blur border-t border-blue-100 py-6 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-2">
          <span className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CV Generator. Hackathon project.
          </span>
          <div className="flex gap-4 text-gray-400 text-xs">
            <a href="#" className="hover:text-blue-600 transition">
              À propos
            </a>
            <a href="#" className="hover:text-blue-600 transition">
              Contact
            </a>
            <a href="#" className="hover:text-blue-600 transition">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
