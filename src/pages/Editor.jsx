import React, { useState } from "react";
// import { useLocation } from "react-router-dom";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
// import { Textarea } from "../components/ui/textarea";
// import { Switch } from "../components/ui/switch";
// import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PersonalInfoSection from "../components/PersonalInfoSection";
import {
  defaultFields,
  optionalFields,
} from "../components/personalInfoFields";
import LivePreviewCV from "../components/LivePreviewCV";

const ALL_SECTIONS = [
  { key: "personal", label: "Informations personnelles" },
  { key: "profile", label: "Profil" },
  { key: "education", label: "Formation" },
  { key: "experience", label: "Expérience professionnelle" },
  { key: "skills", label: "Compétences" },
  { key: "languages", label: "Langues" },
  { key: "signature", label: "Signature" },
  { key: "internship", label: "Stage" },
  { key: "certificate", label: "Certificat" },
];

// Sortable Accordion Item
function SortableAccordionItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    background: isDragging ? "#f3f4f6" : undefined,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="mb-2 rounded-xl border border-blue-100 bg-white/90"
    >
      <div
        {...listeners}
        className="cursor-grab px-2 py-1 text-gray-400 inline-block align-middle select-none"
      >
        <span className="mr-2">⋮⋮</span>
      </div>
      {children}
    </div>
  );
}

const Editor = () => {
  // const location = useLocation();
  // const navigate = useNavigate();
  // const templateIdx = location.state?.templateIdx ?? 0;
  // const tpl = ... (tu peux réutiliser la preview à gauche si tu veux)

  // State des sections actives et disponibles
  const [sections, setSections] = useState([
    "personal",
    "profile",
    "education",
    "experience",
    "skills",
    "languages",
    "signature",
  ]);
  const [available, setAvailable] = useState(
    ALL_SECTIONS.filter((s) => !sections.includes(s.key))
  );
  const [open, setOpen] = useState("personal");

  // State pour Informations personnelles (contrôlé)
  const [personalFields, setPersonalFields] = useState(defaultFields);
  const [personalAvailable, setPersonalAvailable] = useState(optionalFields);
  const [personalValues, setPersonalValues] = useState({});
  const [personalPhoto, setPersonalPhoto] = useState(null);

  // State pour le profil
  const [profileValue, setProfileValue] = useState("");

  // Handlers pour PersonalInfoSection
  const handlePersonalChange = (key, value) => {
    setPersonalValues((v) => ({ ...v, [key]: value }));
  };
  const handlePersonalPhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPersonalPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };
  const handleAddPersonalField = (field) => {
    setPersonalFields([...personalFields, field]);
    setPersonalAvailable(personalAvailable.filter((f) => f.key !== field.key));
  };
  const handleRemovePersonalField = (key) => {
    if (defaultFields.find((f) => f.key === key)) return;
    const field = personalFields.find((f) => f.key === key);
    setPersonalFields(personalFields.filter((f) => f.key !== key));
    setPersonalAvailable([...personalAvailable, field]);
    setPersonalValues((v) => {
      const newV = { ...v };
      delete newV[key];
      return newV;
    });
  };

  // Drag & drop
  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  // Ajout/suppression de section
  function addSection(key) {
    setSections([...sections, key]);
    setAvailable(available.filter((s) => s.key !== key));
    setOpen(key);
  }
  function removeSection(key) {
    setSections(sections.filter((s) => s !== key));
    setAvailable([...available, ALL_SECTIONS.find((s) => s.key === key)]);
    setOpen(sections[0] || "");
  }

  // Form state pour Informations personnelles (exemple complet)
  /*   const [personal, setPersonal] = useState({
    photo: "",
    prenom: "",
    nom: "",
    emploi: "",
    titreCV: false,
    email: "",
    telephone: "",
    adresse: "",
    codePostal: "",
    ville: "",
    naissance: "",
    lieu: "",
    sexe: "",
    nationalites: "",
    linkedin: "",
  }); */

  // ... tu peux ajouter les states pour les autres sections ici ...

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e3e6f5] via-[#b3d0f7] to-[#eec6e6] px-2 py-8">
      <div className="w-full max-w-6xl bg-white/80 rounded-xl shadow-lg flex flex-row gap-8 p-4 md:p-8">
        {/* Preview à gauche */}
        <div className="w-1/2 flex items-start justify-center">
          <LivePreviewCV
            personal={{
              ...personalValues,
              photo: personalPhoto,
              profil: profileValue,
            }}
          />
        </div>
        {/* Formulaire à droite */}
        <div className="w-1/2 flex flex-col gap-6">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections}
              strategy={verticalListSortingStrategy}
            >
              <Accordion
                type="single"
                collapsible
                value={open}
                onValueChange={setOpen}
              >
                {sections.map((key) => {
                  const section = ALL_SECTIONS.find((s) => s.key === key);
                  return (
                    <SortableAccordionItem id={key} key={key}>
                      <AccordionItem value={key}>
                        <AccordionTrigger className="text-lg font-bold flex items-center justify-between">
                          {section.label}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSection(key);
                            }}
                          >
                            ×
                          </Button>
                        </AccordionTrigger>
                        <AccordionContent>
                          {key === "personal" && (
                            <PersonalInfoSection
                              fields={personalFields}
                              available={personalAvailable}
                              values={personalValues}
                              photo={personalPhoto}
                              onChange={handlePersonalChange}
                              onPhotoChange={handlePersonalPhotoChange}
                              onAddField={handleAddPersonalField}
                              onRemoveField={handleRemovePersonalField}
                            />
                          )}
                          {key === "profile" && (
                            <div className="space-y-4">
                              <label className="font-medium">Description</label>
                              <textarea
                                className="w-full min-h-[100px] rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-violet-50 text-gray-900"
                                placeholder="Commencez à rédiger ici..."
                                value={profileValue}
                                onChange={(e) =>
                                  setProfileValue(e.target.value)
                                }
                              />
                              <div className="flex justify-end">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="flex items-center gap-2"
                                >
                                  <span>✨</span> Suggestions de l'IA
                                </Button>
                              </div>
                            </div>
                          )}
                          {key !== "personal" && key !== "profile" && (
                            <div className="text-gray-400 italic">
                              Formulaire à venir pour cette section...
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </SortableAccordionItem>
                  );
                })}
              </Accordion>
            </SortableContext>
          </DndContext>
          {/* Liste des sections à ajouter */}
          <div className="flex flex-wrap gap-2 mt-4">
            {available.map((s) => (
              <Button
                key={s.key}
                variant="outline"
                size="sm"
                onClick={() => addSection(s.key)}
              >
                + {s.label}
              </Button>
            ))}
          </div>
          {/* Bouton de téléchargement (à brancher plus tard) */}
          <Button className="mt-6 w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold">
            Télécharger
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
