import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
// Ajoute une image de CVs dans public/cvs-preview.png ou adapte le chemin

const cvTemplates = [
  {
    name: "Moderne Minimaliste",
    description:
      "Un template épuré et professionnel, idéal pour tous secteurs.",
    image: "/cv-template-1.png",
  },
  {
    name: "Créatif",
    description: "Un design coloré pour les métiers créatifs et artistiques.",
    image: "/cv-template-2.png",
  },
  {
    name: "Classique",
    description: "Un format traditionnel, sobre et efficace.",
    image: "/cv-template-3.png",
  },
];

const stats = [
  { value: "5 000 000+", label: "cv créés" },
  { value: "140 000", label: "nouveaux CV chaque mois" },
  { value: "99%", label: "de satisfaction utilisateur" },
];

const Home = () => {
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
            <br />
            {/* Parcourez ensuite des offres d’emploi ciblées, postulez et organisez
            vos candidatures. */}
          </p>
          <Button className="px-8 py-4 text-lg mb-8">Commencer</Button>
          <div className="flex gap-8 mt-8 flex-wrap">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-2xl md:text-3xl font-extrabold text-pink-500">
                  {stat.value}
                </span>
                <span className="text-base font-semibold text-gray-800 text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
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

      {/* Section Exemples de CV */}
      <section className="w-full max-w-6xl mx-auto mb-20">
        <h3 className="text-2xl font-bold text-blue-700 mb-8 text-left">
          Exemples de templates de CV
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cvTemplates.map((tpl, idx) => (
            <Card
              key={idx}
              className="flex flex-col h-full shadow-lg hover:scale-[1.025] transition-transform"
            >
              <CardHeader>
                <CardTitle>{tpl.name}</CardTitle>
                <CardDescription>{tpl.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center">
                <img
                  src={tpl.image}
                  alt={tpl.name}
                  className="rounded-md object-cover w-full h-40 border border-blue-100 bg-white"
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button variant="outline">Voir le template</Button>
              </CardFooter>
            </Card>
          ))}
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
