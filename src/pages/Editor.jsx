import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const cvTemplates = [
  {
    name: "Template 1",
    type: "FORMAT EUROPÉEN",
    image:
      "https://cdn-blog.novoresume.com/articles/what-is-a-cv/what-is-a-cv.png",
  },
  {
    name: "Template 1",
    type: "FORMAT EUROPÉEN",
    image:
      "https://cdn-blog.novoresume.com/articles/what-is-a-cv/what-is-a-cv.png",
  },
  {
    name: "Template 1",
    type: "CLASSIQUE",
    image:
      "https://cdn-blog.novoresume.com/articles/what-is-a-cv/what-is-a-cv.png",
  },
  {
    name: "Template 1",
    type: "MODERNE",
    image:
      "https://cdn-blog.novoresume.com/articles/what-is-a-cv/what-is-a-cv.png",
  },
  {
    name: "Template 2",
    type: "MODERNE",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.WI2riEc8eubor1AQUiUAPgHaI5?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    name: "Template 3",
    type: "CRÉATIF",
    image:
      "https://cdn.cvdesignr.com/static/landing/uploads/63df8153-3985-43e0-a146-379c3c8b6d53-3.png",
  },
  {
    name: "Template 4",
    type: "CLASSIQUE",
    image:
      "https://cdn.cvdesignr.com/static/landing/uploads/63df8153-3985-43e0-a146-379c3c8b6d53-4.png",
  },
];

const Editor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const templateIdx = location.state?.templateIdx ?? 0;
  const tpl = cvTemplates[templateIdx];

  // Form state
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    titre: "",
    email: "",
    telephone: "",
    profil: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!tpl) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold mb-4">Aucun template sélectionné</h2>
        <button
          className="text-blue-600 underline"
          onClick={() => navigate("/")}
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e3e6f5] via-[#b3d0f7] to-[#eec6e6] px-2 py-8">
      <div className="w-full max-w-5xl bg-white/80 rounded-xl shadow-lg flex flex-col md:flex-row gap-8 p-6 md:p-10">
        {/* Preview du template à gauche */}
        <div className="flex-1 flex flex-col items-center justify-start">
          <h2 className="text-lg font-semibold mb-2 text-blue-700">
            Aperçu du template
          </h2>
          <img
            src={tpl.image}
            alt={tpl.name}
            className="rounded-xl shadow-md border border-blue-100 bg-white max-w-xs w-full mb-4"
            style={{ minHeight: 220, minWidth: 180 }}
          />
          <span className="text-sm font-bold text-gray-600">{tpl.type}</span>
        </div>
        {/* Formulaire d'édition à droite */}
        <form
          className="flex-1 flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <h2 className="text-xl font-bold mb-2 text-gray-800">
            Éditez votre CV
          </h2>
          <div className="flex gap-2">
            <Input
              name="prenom"
              placeholder="Prénom"
              value={form.prenom}
              onChange={handleChange}
              className="flex-1"
              required
            />
            <Input
              name="nom"
              placeholder="Nom"
              value={form.nom}
              onChange={handleChange}
              className="flex-1"
              required
            />
          </div>
          <Input
            name="titre"
            placeholder="Titre du poste (ex: Développeur Web)"
            value={form.titre}
            onChange={handleChange}
            required
          />
          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            type="email"
            required
          />
          <Input
            name="telephone"
            placeholder="Téléphone"
            value={form.telephone}
            onChange={handleChange}
            type="tel"
            required
          />
          <textarea
            name="profil"
            placeholder="Profil (présentez-vous en quelques lignes)"
            value={form.profil}
            onChange={handleChange}
            className="border border-blue-200 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[80px]"
          />
          <Button type="submit" className="mt-4 w-full">
            Sauvegarder (à venir)
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Editor;
