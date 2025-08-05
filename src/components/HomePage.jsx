import { Button } from "../components/ui/button";
import logo from "../assets/react.svg";

const HomePage = ({ onLoginClick }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-gray-50 to-blue-100">
      {/* Navbar moderne */}
      <nav className="w-full bg-white/80 backdrop-blur shadow-sm py-3 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-9 w-9" />
          <span className="text-2xl font-bold text-blue-700 tracking-tight">
            CV Generator
          </span>
        </div>
        <div>
          <Button
            className="px-6 py-2 text-base font-semibold shadow"
            variant="outline"
            onClick={onLoginClick}
          >
            Se connecter
          </Button>
        </div>
      </nav>
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800">
          Créez, personnalisez et téléchargez votre CV
        </h2>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          En quelques clics, choisissez un template, éditez vos informations et
          exportez votre CV en PDF avec markers intelligents.
        </p>
        <Button className="px-8 py-4 text-lg" onClick={onLoginClick}>
          Commencer
        </Button>
        <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
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
      </main>
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

export default HomePage;
