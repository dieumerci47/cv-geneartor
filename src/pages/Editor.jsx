import React, { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
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
import Template1CV from "../components/templates/Template1CV";
import Template2CV from "../components/templates/Template2CV";
import Template3CV from "../components/templates/Template3CV";
import SignatureModal from "@/components/SignatureModal";

const TEMPLATES = [
  { label: "Template 1", component: Template1CV },
  { label: "Template 2", component: Template2CV },
  { label: "Template 3", component: Template3CV },
];

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

const LEFT_SECTIONS = ["skills", "languages", "interests"];
const RIGHT_SECTIONS = [
  "profile",
  "education",
  "experience",
  "internship",
  "signature",
  "certificate",
];

const LEVELS = [
  { label: "Débutant", value: 1 },
  { label: "Intermédiaire", value: 2 },
  { label: "Bien", value: 3 },
  { label: "Très bien", value: 4 },
  { label: "Expert", value: 5 },
];

const MONTHS = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
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
  const location = useLocation();
  const [searchParams] = useSearchParams();
  // Priorité : query param > state > 0
  let initialTemplate = 0;
  const queryTpl = searchParams.get("template");
  if (queryTpl && !isNaN(Number(queryTpl))) initialTemplate = Number(queryTpl);
  else if (location.state && typeof location.state.templateIdx === "number")
    initialTemplate = location.state.templateIdx;

  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplate);

  // State des sections actives et disponibles
  const [leftSections, setLeftSections] = useState([
    "skills",
    "languages",
    "interests",
  ]);
  const [rightSections, setRightSections] = useState([
    "profile",
    "education",
    "experience",
    "internship",
    "signature",
    // "certificate",
  ]);
  const [availableLeft, setAvailableLeft] = useState(
    LEFT_SECTIONS.filter((s) => !leftSections.includes(s))
  );
  const [availableRight, setAvailableRight] = useState(
    RIGHT_SECTIONS.filter((s) => !rightSections.includes(s))
  );
  const [open, setOpen] = useState("personal");
  // const [selectedTemplate, setSelectedTemplate] = useState(0);

  // State pour Informations personnelles (contrôlé)
  const [personalFields, setPersonalFields] = useState(defaultFields);
  const [personalAvailable, setPersonalAvailable] = useState(optionalFields);
  const [personalValues, setPersonalValues] = useState({});
  const [personalPhoto, setPersonalPhoto] = useState(null);

  // State pour le profil
  const [profileValue, setProfileValue] = useState("");
  // TODO: ajouter les autres states (education, experience, etc.)

  // State pour la liste des formations
  const [educations, setEducations] = useState([]);
  const [editingEducation, setEditingEducation] = useState(null); // index de l'item en édition ou null
  const emptyEducation = {
    title: "",
    school: "",
    city: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    current: false,
    description: "",
  };

  // State pour la liste des expériences
  const [experiences, setExperiences] = useState([]);
  const [editingExperience, setEditingExperience] = useState(null); // index de l'item en édition ou null
  const emptyExperience = {
    job: "",
    employer: "",
    city: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    current: false,
    description: "",
  };

  // State pour compétences
  const [skills, setSkills] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const emptySkill = { name: "", level: "" };

  function handleEditSkill(idx) {
    setEditingSkill(idx);
  }
  function handleDeleteSkill(idx) {
    setSkills((skills) => skills.filter((_, i) => i !== idx));
    setEditingSkill(null);
  }
  function handleChangeSkill(field, value) {
    setSkills((skills) =>
      skills.map((sk, i) =>
        i === editingSkill ? { ...sk, [field]: value } : sk
      )
    );
  }
  function handleAddSkill() {
    setSkills([...skills, { ...emptySkill }]);
    setEditingSkill(skills.length);
  }
  function handleFinishSkill() {
    setEditingSkill(null);
  }

  // State pour langues
  const [languages, setLanguages] = useState([]);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const emptyLanguage = { name: "", level: "" };

  function handleEditLanguage(idx) {
    setEditingLanguage(idx);
  }
  function handleDeleteLanguage(idx) {
    setLanguages((langs) => langs.filter((_, i) => i !== idx));
    setEditingLanguage(null);
  }
  function handleChangeLanguage(field, value) {
    setLanguages((langs) =>
      langs.map((l, i) =>
        i === editingLanguage ? { ...l, [field]: value } : l
      )
    );
  }
  function handleAddLanguage() {
    setLanguages([...languages, { ...emptyLanguage }]);
    setEditingLanguage(languages.length);
  }
  function handleFinishLanguage() {
    setEditingLanguage(null);
  }

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

  // Handlers pour le formulaire formation
  function handleEditEducation(idx) {
    setEditingEducation(idx);
  }
  function handleDeleteEducation(idx) {
    setEducations((eds) => eds.filter((_, i) => i !== idx));
    setEditingEducation(null);
  }
  function handleChangeEducation(field, value) {
    setEducations((eds) =>
      eds.map((ed, i) =>
        i === editingEducation ? { ...ed, [field]: value } : ed
      )
    );
  }
  function handleAddEducation() {
    setEducations([...educations, { ...emptyEducation }]);
    setEditingEducation(educations.length);
  }
  function handleFinishEducation() {
    setEditingEducation(null);
  }

  // Handlers pour le formulaire expérience
  function handleEditExperience(idx) {
    setEditingExperience(idx);
  }
  function handleDeleteExperience(idx) {
    setExperiences((exps) => exps.filter((_, i) => i !== idx));
    setEditingExperience(null);
  }
  function handleChangeExperience(field, value) {
    setExperiences((exps) =>
      exps.map((ex, i) =>
        i === editingExperience ? { ...ex, [field]: value } : ex
      )
    );
  }
  function handleAddExperience() {
    setExperiences([...experiences, { ...emptyExperience }]);
    setEditingExperience(experiences.length);
  }
  function handleFinishExperience() {
    setEditingExperience(null);
  }

  // State pour la liste des certificats
  const [certificates, setCertificates] = useState([]);
  const [editingCertificate, setEditingCertificate] = useState(null); // index de l'item en édition ou null
  const emptyCertificate = {
    name: "",
    month: "",
    year: "",
    current: false,
    description: "",
  };

  // Handlers pour le formulaire certificat
  function handleEditCertificate(idx) {
    setEditingCertificate(idx);
  }
  function handleDeleteCertificate(idx) {
    setCertificates((certs) => certs.filter((_, i) => i !== idx));
    setEditingCertificate(null);
  }
  function handleChangeCertificate(field, value) {
    setCertificates((certs) =>
      certs.map((c, i) =>
        i === editingCertificate ? { ...c, [field]: value } : c
      )
    );
  }
  function handleAddCertificate() {
    setCertificates([...certificates, { ...emptyCertificate }]);
    setEditingCertificate(certificates.length);
  }
  function handleFinishCertificate() {
    setEditingCertificate(null);
  }

  // State pour la liste des stages
  const [internships, setInternships] = useState([]);
  const [editingInternship, setEditingInternship] = useState(null); // index de l'item en édition ou null
  const emptyInternship = {
    job: "",
    employer: "",
    city: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    current: false,
    description: "",
  };

  // Handlers pour le formulaire stage
  function handleEditInternship(idx) {
    setEditingInternship(idx);
  }
  function handleDeleteInternship(idx) {
    setInternships((ints) => ints.filter((_, i) => i !== idx));
    setEditingInternship(null);
  }
  function handleChangeInternship(field, value) {
    setInternships((ints) =>
      ints.map((int, i) =>
        i === editingInternship ? { ...int, [field]: value } : int
      )
    );
  }
  function handleAddInternship() {
    setInternships([...internships, { ...emptyInternship }]);
    setEditingInternship(internships.length);
  }
  function handleFinishInternship() {
    setEditingInternship(null);
  }

  // State pour la signature
  const [signature, setSignature] = useState({
    city: "",
    date: "",
    image: null, // url de l'image ou base64
  });

  function handleChangeSignature(field, value) {
    setSignature((sig) => ({ ...sig, [field]: value }));
  }

  const [signatureModalOpen, setSignatureModalOpen] = useState(false);

  function handleSignatureModalSave(img) {
    setSignature((sig) => ({ ...sig, image: img }));
  }

  // Drag & drop handlers pour chaque colonne
  function handleLeftDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setLeftSections((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
  function handleRightDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setRightSections((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  // Ajout/suppression de section pour chaque colonne
  function addLeftSection(key) {
    setLeftSections([...leftSections, key]);
    setAvailableLeft(availableLeft.filter((s) => s !== key));
    setOpen(key);
  }
  function removeLeftSection(key) {
    setLeftSections(leftSections.filter((s) => s !== key));
    setAvailableLeft([...availableLeft, key]);
    setOpen(leftSections[0] || "personal");
  }
  function addRightSection(key) {
    setRightSections([...rightSections, key]);
    setAvailableRight(availableRight.filter((s) => s !== key));
    setOpen(key);
  }
  function removeRightSection(key) {
    setRightSections(rightSections.filter((s) => s !== key));
    setAvailableRight([...availableRight, key]);
    setOpen(rightSections[0] || "personal");
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

  // Construction de l'objet cvData unique
  const cvData = {
    personal: {
      ...personalValues,
      photo: personalPhoto,
    },
    profile: profileValue,
    educations,
    experiences,
    internships,
    certificates,
    skills,
    languages,
    interests: [], // à brancher si tu ajoutes la section
    signature: { image: signature.image },
  };

  const PreviewComponent =
    TEMPLATES[selectedTemplate]?.component || LivePreviewCV;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e3e6f5] via-[#b3d0f7] to-[#eec6e6] px-2 py-8">
      <div className="w-full max-w-6xl bg-white/80 rounded-xl shadow-lg flex flex-row gap-8 p-4 md:p-8">
        {/* Preview à gauche : sticky sur desktop, même hauteur que le scroll */}
        <div className="w-1/2 hidden md:flex items-start justify-center">
          <div className="sticky top-8 h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] flex items-start justify-center overflow-y-auto">
            <PreviewComponent
              cvData={cvData}
              leftSections={leftSections}
              rightSections={rightSections}
            />
          </div>
        </div>
        {/* Preview mobile (en haut, non sticky) */}
        <div className="w-full md:hidden mb-6">
          <PreviewComponent
            cvData={cvData}
            leftSections={leftSections}
            rightSections={rightSections}
          />
        </div>
        {/* Formulaire à droite : scrollable sur desktop */}
        <div className="w-full md:w-1/2 flex flex-col gap-6 max-h-[calc(100vh-64px)] overflow-y-auto pr-1">
          {/* Sélecteur de template */}
          <div className="flex justify-end mb-2">
            <select
              className="border rounded px-3 py-2 bg-white shadow"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(Number(e.target.value))}
            >
              {TEMPLATES.map((tpl, idx) => (
                <option key={idx} value={idx}>
                  {tpl.label}
                </option>
              ))}
            </select>
          </div>
          {/* Accordéon infos personnelles (jamais déplaçable) */}
          <div className="mb-4">
            <Accordion
              type="single"
              collapsible
              value={open}
              onValueChange={setOpen}
            >
              <AccordionItem value="personal">
                <AccordionTrigger className="text-lg font-bold flex items-center justify-between">
                  Informations personnelles
                </AccordionTrigger>
                <AccordionContent>
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          {/* Accordéon sections de gauche (DnD) */}
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleLeftDragEnd}
          >
            <SortableContext
              items={leftSections}
              strategy={verticalListSortingStrategy}
            >
              <Accordion
                type="single"
                collapsible
                value={open}
                onValueChange={setOpen}
              >
                {leftSections.map((key) => (
                  <SortableAccordionItem id={key} key={key}>
                    <AccordionItem value={key}>
                      <AccordionTrigger className="text-lg font-bold flex items-center justify-between">
                        {ALL_SECTIONS.find((s) => s.key === key)?.label}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLeftSection(key);
                          }}
                        >
                          ×
                        </Button>
                      </AccordionTrigger>
                      <AccordionContent>
                        {key === "skills" && (
                          <div className="space-y-6">
                            {skills.map((sk, idx) => (
                              <div
                                key={idx}
                                className="border rounded-lg p-4 mb-4 bg-white/90"
                              >
                                {editingSkill === idx ? (
                                  <>
                                    <label className="block font-medium mb-1">
                                      Compétence
                                    </label>
                                    <input
                                      className="w-full mb-2 rounded border px-3 py-2 bg-violet-50"
                                      placeholder="Nom de la compétence"
                                      value={sk.name}
                                      onChange={(e) =>
                                        handleChangeSkill(
                                          "name",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <label className="block font-medium mb-1">
                                      Niveau
                                    </label>
                                    <select
                                      className="w-full rounded border px-3 py-2 bg-violet-50 mb-2"
                                      value={sk.level}
                                      onChange={(e) =>
                                        handleChangeSkill(
                                          "level",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">
                                        Sélectionner le niveau...
                                      </option>
                                      {LEVELS.map((l) => (
                                        <option key={l.value} value={l.value}>
                                          {l.label}
                                        </option>
                                      ))}
                                    </select>
                                    <div className="flex justify-between mt-3">
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => handleDeleteSkill(idx)}
                                      >
                                        🗑️
                                      </Button>
                                      <Button
                                        type="button"
                                        onClick={handleFinishSkill}
                                        className="bg-violet-700 text-white font-bold"
                                      >
                                        ✓ Terminé
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div className="font-bold">{sk.name}</div>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditSkill(idx)}
                                    >
                                      Modifier
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleAddSkill}
                            >
                              + Ajouter une compétence
                            </Button>
                          </div>
                        )}
                        {key === "languages" && (
                          <div className="space-y-6">
                            {languages.map((l, idx) => (
                              <div
                                key={idx}
                                className="border rounded-lg p-4 mb-4 bg-white/90"
                              >
                                {editingLanguage === idx ? (
                                  <>
                                    <label className="block font-medium mb-1">
                                      Langue
                                    </label>
                                    <input
                                      className="w-full mb-2 rounded border px-3 py-2 bg-violet-50"
                                      placeholder="Nom de la langue"
                                      value={l.name}
                                      onChange={(e) =>
                                        handleChangeLanguage(
                                          "name",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <label className="block font-medium mb-1">
                                      Niveau
                                    </label>
                                    <select
                                      className="w-full rounded border px-3 py-2 bg-violet-50 mb-2"
                                      value={l.level}
                                      onChange={(e) =>
                                        handleChangeLanguage(
                                          "level",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">
                                        Sélectionner le niveau...
                                      </option>
                                      {LEVELS.map((lv) => (
                                        <option key={lv.value} value={lv.value}>
                                          {lv.label}
                                        </option>
                                      ))}
                                    </select>
                                    <div className="flex justify-between mt-3">
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() =>
                                          handleDeleteLanguage(idx)
                                        }
                                      >
                                        🗑️
                                      </Button>
                                      <Button
                                        type="button"
                                        onClick={handleFinishLanguage}
                                        className="bg-violet-700 text-white font-bold"
                                      >
                                        ✓ Terminé
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div className="font-bold">{l.name}</div>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditLanguage(idx)}
                                    >
                                      Modifier
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleAddLanguage}
                            >
                              + Ajouter une langue
                            </Button>
                          </div>
                        )}
                        {/* TODO: brancher les formulaires pour chaque section */}
                        <div className="text-gray-400 italic">
                          Formulaire à venir pour cette section...
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </SortableAccordionItem>
                ))}
              </Accordion>
            </SortableContext>
          </DndContext>
          {/* Accordéon sections de droite (DnD) */}
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleRightDragEnd}
          >
            <SortableContext
              items={rightSections}
              strategy={verticalListSortingStrategy}
            >
              <Accordion
                type="single"
                collapsible
                value={open}
                onValueChange={setOpen}
              >
                {rightSections.map((key) => (
                  <SortableAccordionItem id={key} key={key}>
                    <AccordionItem value={key}>
                      <AccordionTrigger className="text-lg font-bold flex items-center justify-between">
                        {ALL_SECTIONS.find((s) => s.key === key)?.label}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRightSection(key);
                          }}
                        >
                          ×
                        </Button>
                      </AccordionTrigger>
                      <AccordionContent>
                        {key === "profile" && (
                          <div className="space-y-4">
                            <label className="font-medium">Description</label>
                            <textarea
                              className="w-full min-h-[100px] rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-violet-50 text-gray-900"
                              placeholder="Commencez à rédiger ici..."
                              value={profileValue}
                              onChange={(e) => setProfileValue(e.target.value)}
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
                        {key === "education" && (
                          <div className="space-y-6">
                            {educations.map((ed, idx) => (
                              <div
                                key={idx}
                                className="border rounded-lg p-4 mb-4 bg-white/90"
                              >
                                {editingEducation === idx ? (
                                  <>
                                    <label className="block font-medium mb-1">
                                      Formation
                                    </label>
                                    <input
                                      className="w-full mb-2 rounded border px-3 py-2 bg-violet-50"
                                      placeholder="Intitulé du diplôme ou formation"
                                      value={ed.title}
                                      onChange={(e) =>
                                        handleChangeEducation(
                                          "title",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <div className="flex gap-2 mb-2">
                                      <div className="flex-1">
                                        <label className="block font-medium mb-1">
                                          Établissement
                                        </label>
                                        <input
                                          className="w-full rounded border px-3 py-2 bg-violet-50"
                                          placeholder="Établissement"
                                          value={ed.school}
                                          onChange={(e) =>
                                            handleChangeEducation(
                                              "school",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <label className="block font-medium mb-1">
                                          Ville
                                        </label>
                                        <input
                                          className="w-full rounded border px-3 py-2 bg-violet-50"
                                          placeholder="Ville"
                                          value={ed.city}
                                          onChange={(e) =>
                                            handleChangeEducation(
                                              "city",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="flex gap-2 mb-2 items-end">
                                      <div>
                                        <label className="block font-medium mb-1">
                                          Date de début
                                        </label>
                                        <div className="flex gap-1">
                                          <select
                                            className="rounded border px-2 py-1 bg-violet-50"
                                            value={ed.startMonth}
                                            onChange={(e) =>
                                              handleChangeEducation(
                                                "startMonth",
                                                e.target.value
                                              )
                                            }
                                          >
                                            <option value="">Mois</option>
                                            {Array.from(
                                              { length: 12 },
                                              (_, i) => i + 1
                                            ).map((m) => (
                                              <option key={m} value={m}>
                                                {m}
                                              </option>
                                            ))}
                                          </select>
                                          <select
                                            className="rounded border px-2 py-1 bg-violet-50"
                                            value={ed.startYear}
                                            onChange={(e) =>
                                              handleChangeEducation(
                                                "startYear",
                                                e.target.value
                                              )
                                            }
                                          >
                                            <option value="">Année</option>
                                            {Array.from(
                                              { length: 50 },
                                              (_, i) => 2024 - i
                                            ).map((y) => (
                                              <option key={y} value={y}>
                                                {y}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block font-medium mb-1">
                                          Date de fin
                                        </label>
                                        <div className="flex gap-1 items-center">
                                          <select
                                            className="rounded border px-2 py-1 bg-violet-50"
                                            value={ed.endMonth}
                                            onChange={(e) =>
                                              handleChangeEducation(
                                                "endMonth",
                                                e.target.value
                                              )
                                            }
                                            disabled={ed.current}
                                          >
                                            <option value="">Mois</option>
                                            {Array.from(
                                              { length: 12 },
                                              (_, i) => i + 1
                                            ).map((m) => (
                                              <option key={m} value={m}>
                                                {m}
                                              </option>
                                            ))}
                                          </select>
                                          <select
                                            className="rounded border px-2 py-1 bg-violet-50"
                                            value={ed.endYear}
                                            onChange={(e) =>
                                              handleChangeEducation(
                                                "endYear",
                                                e.target.value
                                              )
                                            }
                                            disabled={ed.current}
                                          >
                                            <option value="">Année</option>
                                            {Array.from(
                                              { length: 50 },
                                              (_, i) => 2024 - i
                                            ).map((y) => (
                                              <option key={y} value={y}>
                                                {y}
                                              </option>
                                            ))}
                                          </select>
                                          <label className="ml-2 flex items-center gap-1 text-xs">
                                            <input
                                              type="checkbox"
                                              checked={ed.current}
                                              onChange={(e) =>
                                                handleChangeEducation(
                                                  "current",
                                                  e.target.checked
                                                )
                                              }
                                            />{" "}
                                            ce jour
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <label className="block font-medium mb-1 mt-2">
                                      Description
                                    </label>
                                    <div className="flex items-center gap-2 mb-2">
                                      {/* Boutons de mise en forme (non fonctionnels ici) */}
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <b>B</b>
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <i>I</i>
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <u>U</u>
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        •
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        1.
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        ≡
                                      </Button>
                                      <div className="flex-1" />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        className="flex items-center gap-2"
                                      >
                                        <span>✨</span> Suggestions de l'IA
                                      </Button>
                                    </div>
                                    <textarea
                                      className="w-full min-h-[80px] rounded border px-3 py-2 bg-violet-50"
                                      placeholder="Commencez à rédiger ici..."
                                      value={ed.description}
                                      onChange={(e) =>
                                        handleChangeEducation(
                                          "description",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <div className="flex justify-between mt-3">
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() =>
                                          handleDeleteEducation(idx)
                                        }
                                      >
                                        🗑️
                                      </Button>
                                      <Button
                                        type="button"
                                        onClick={handleFinishEducation}
                                        className="bg-violet-700 text-white font-bold"
                                      >
                                        ✓ Terminé
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-bold">
                                        {ed.title}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {ed.school} {ed.city && `- ${ed.city}`}
                                      </div>
                                    </div>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditEducation(idx)}
                                    >
                                      Modifier
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleAddEducation}
                            >
                              + Ajouter une formation
                            </Button>
                          </div>
                        )}
                        {key === "experience" && (
                          <div className="space-y-6">
                            {experiences.map((ex, idx) => (
                              <div
                                key={idx}
                                className="border rounded-lg p-4 mb-4 bg-white/90"
                              >
                                {editingExperience === idx ? (
                                  <>
                                    <label className="block font-medium mb-1">
                                      Poste
                                    </label>
                                    <input
                                      className="w-full mb-2 rounded border px-3 py-2 bg-violet-50"
                                      placeholder="Intitulé du poste"
                                      value={ex.job}
                                      onChange={(e) =>
                                        handleChangeExperience(
                                          "job",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <div className="flex gap-2 mb-2">
                                      <div className="flex-1">
                                        <label className="block font-medium mb-1">
                                          Employeur
                                        </label>
                                        <input
                                          className="w-full rounded border px-3 py-2 bg-violet-50"
                                          placeholder="Employeur"
                                          value={ex.employer}
                                          onChange={(e) =>
                                            handleChangeExperience(
                                              "employer",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <label className="block font-medium mb-1">
                                          Ville
                                        </label>
                                        <input
                                          className="w-full rounded border px-3 py-2 bg-violet-50"
                                          placeholder="Ville"
                                          value={ex.city}
                                          onChange={(e) =>
                                            handleChangeExperience(
                                              "city",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="flex gap-2 mb-2 items-end">
                                      <div>
                                        <label className="block font-medium mb-1">
                                          Date de début
                                        </label>
                                        <div className="flex gap-1">
                                          <select
                                            className="rounded border px-2 py-1 bg-violet-50"
                                            value={ex.startMonth}
                                            onChange={(e) =>
                                              handleChangeExperience(
                                                "startMonth",
                                                e.target.value
                                              )
                                            }
                                          >
                                            <option value="">Mois</option>
                                            {Array.from(
                                              { length: 12 },
                                              (_, i) => i + 1
                                            ).map((m) => (
                                              <option key={m} value={m}>
                                                {m}
                                              </option>
                                            ))}
                                          </select>
                                          <select
                                            className="rounded border px-2 py-1 bg-violet-50"
                                            value={ex.startYear}
                                            onChange={(e) =>
                                              handleChangeExperience(
                                                "startYear",
                                                e.target.value
                                              )
                                            }
                                          >
                                            <option value="">Année</option>
                                            {Array.from(
                                              { length: 50 },
                                              (_, i) => 2024 - i
                                            ).map((y) => (
                                              <option key={y} value={y}>
                                                {y}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block font-medium mb-1">
                                          Date de fin
                                        </label>
                                        <div className="flex gap-1 items-center">
                                          <select
                                            className="rounded border px-2 py-1 bg-violet-50"
                                            value={ex.endMonth}
                                            onChange={(e) =>
                                              handleChangeExperience(
                                                "endMonth",
                                                e.target.value
                                              )
                                            }
                                            disabled={ex.current}
                                          >
                                            <option value="">Mois</option>
                                            {Array.from(
                                              { length: 12 },
                                              (_, i) => i + 1
                                            ).map((m) => (
                                              <option key={m} value={m}>
                                                {m}
                                              </option>
                                            ))}
                                          </select>
                                          <select
                                            className="rounded border px-2 py-1 bg-violet-50"
                                            value={ex.endYear}
                                            onChange={(e) =>
                                              handleChangeExperience(
                                                "endYear",
                                                e.target.value
                                              )
                                            }
                                            disabled={ex.current}
                                          >
                                            <option value="">Année</option>
                                            {Array.from(
                                              { length: 50 },
                                              (_, i) => 2024 - i
                                            ).map((y) => (
                                              <option key={y} value={y}>
                                                {y}
                                              </option>
                                            ))}
                                          </select>
                                          <label className="ml-2 flex items-center gap-1 text-xs">
                                            <input
                                              type="checkbox"
                                              checked={ex.current}
                                              onChange={(e) =>
                                                handleChangeExperience(
                                                  "current",
                                                  e.target.checked
                                                )
                                              }
                                            />{" "}
                                            ce jour
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <label className="block font-medium mb-1 mt-2">
                                      Description
                                    </label>
                                    <div className="flex items-center gap-2 mb-2">
                                      {/* Boutons de mise en forme (non fonctionnels ici) */}
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <b>B</b>
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <i>I</i>
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <u>U</u>
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        •
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        1.
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        ≡
                                      </Button>
                                      <div className="flex-1" />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        className="flex items-center gap-2"
                                      >
                                        <span>✨</span> Suggestions de l'IA
                                      </Button>
                                    </div>
                                    <textarea
                                      className="w-full min-h-[80px] rounded border px-3 py-2 bg-violet-50"
                                      placeholder="Commencez à rédiger ici..."
                                      value={ex.description}
                                      onChange={(e) =>
                                        handleChangeExperience(
                                          "description",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <div className="flex justify-between mt-3">
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() =>
                                          handleDeleteExperience(idx)
                                        }
                                      >
                                        🗑️
                                      </Button>
                                      <Button
                                        type="button"
                                        onClick={handleFinishExperience}
                                        className="bg-violet-700 text-white font-bold"
                                      >
                                        ✓ Terminé
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-bold">{ex.job}</div>
                                      <div className="text-xs text-gray-500">
                                        {ex.employer}{" "}
                                        {ex.city && `- ${ex.city}`}
                                      </div>
                                    </div>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditExperience(idx)}
                                    >
                                      Modifier
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleAddExperience}
                            >
                              + Ajouter une expérience
                            </Button>
                          </div>
                        )}
                        {key === "certificate" && (
                          <div className="space-y-6">
                            {certificates.map((c, idx) => (
                              <div
                                key={idx}
                                className="border rounded-lg p-4 mb-4 bg-white/90"
                              >
                                {editingCertificate === idx ? (
                                  <>
                                    <label className="block font-medium mb-1">
                                      Certificat
                                    </label>
                                    <input
                                      className="w-full mb-2 rounded border px-3 py-2 bg-violet-50"
                                      placeholder="Nom du certificat"
                                      value={c.name}
                                      onChange={(e) =>
                                        handleChangeCertificate(
                                          "name",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <div className="flex gap-2 mb-2 items-end">
                                      <div>
                                        <label className="block font-medium mb-1">
                                          Période
                                        </label>
                                        <div className="flex gap-1">
                                          <select
                                            className="rounded border px-2 py-1 bg-violet-50"
                                            value={c.month}
                                            onChange={(e) =>
                                              handleChangeCertificate(
                                                "month",
                                                e.target.value
                                              )
                                            }
                                            disabled={c.current}
                                          >
                                            <option value="">Mois</option>
                                            {MONTHS.map((m) => (
                                              <option key={m} value={m}>
                                                {m}
                                              </option>
                                            ))}
                                          </select>
                                          <select
                                            className="rounded border px-2 py-1 bg-violet-50"
                                            value={c.year}
                                            onChange={(e) =>
                                              handleChangeCertificate(
                                                "year",
                                                e.target.value
                                              )
                                            }
                                            disabled={c.current}
                                          >
                                            <option value="">Année</option>
                                            {Array.from(
                                              { length: 50 },
                                              (_, i) => 2024 - i
                                            ).map((y) => (
                                              <option key={y} value={y}>
                                                {y}
                                              </option>
                                            ))}
                                          </select>
                                          <label className="ml-2 flex items-center gap-1 text-xs">
                                            <input
                                              type="checkbox"
                                              checked={c.current}
                                              onChange={(e) =>
                                                handleChangeCertificate(
                                                  "current",
                                                  e.target.checked
                                                )
                                              }
                                            />{" "}
                                            ce jour
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <label className="block font-medium mb-1 mt-2">
                                      Description
                                    </label>
                                    <div className="flex items-center gap-2 mb-2">
                                      {/* Boutons de mise en forme (non fonctionnels ici) */}
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <b>B</b>
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <i>I</i>
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <u>U</u>
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        •
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        1.
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        ≡
                                      </Button>
                                      <div className="flex-1" />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        className="flex items-center gap-2"
                                      >
                                        <span>✨</span> Suggestions de l'IA
                                      </Button>
                                    </div>
                                    <textarea
                                      className="w-full min-h-[80px] rounded border px-3 py-2 bg-violet-50"
                                      placeholder="Commencez à rédiger ici..."
                                      value={c.description}
                                      onChange={(e) =>
                                        handleChangeCertificate(
                                          "description",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <div className="flex justify-between mt-3">
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() =>
                                          handleDeleteCertificate(idx)
                                        }
                                      >
                                        🗑️
                                      </Button>
                                      <Button
                                        type="button"
                                        onClick={handleFinishCertificate}
                                        className="bg-violet-700 text-white font-bold"
                                      >
                                        ✓ Terminé
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-bold">{c.name}</div>
                                      <div className="text-xs text-gray-500">
                                        {c.month && c.year
                                          ? `${c.month} ${c.year}`
                                          : ""}
                                        {c.current && " - ce jour"}
                                      </div>
                                    </div>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditCertificate(idx)}
                                    >
                                      Modifier
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleAddCertificate}
                            >
                              + Ajouter un certificat
                            </Button>
                          </div>
                        )}
                        {key === "internship" && (
                          <div className="space-y-6">
                            {internships.map((int, idx) => (
                              <div
                                key={idx}
                                className="border rounded-lg p-4 mb-4 bg-white/90"
                              >
                                {editingInternship === idx ? (
                                  <>
                                    <label className="block font-medium mb-1">
                                      Poste
                                    </label>
                                    <input
                                      className="w-full mb-2 rounded border px-3 py-2 bg-violet-50"
                                      placeholder="Intitulé du poste"
                                      value={int.job}
                                      onChange={(e) =>
                                        handleChangeInternship(
                                          "job",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <div className="flex gap-2 mb-2">
                                      <div className="flex-1">
                                        <label className="block font-medium mb-1">
                                          Employeur
                                        </label>
                                        <input
                                          className="w-full rounded border px-3 py-2 bg-violet-50"
                                          placeholder="Employeur"
                                          value={int.employer}
                                          onChange={(e) =>
                                            handleChangeInternship(
                                              "employer",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <label className="block font-medium mb-1">
                                          Ville
                                        </label>
                                        <input
                                          className="w-full rounded border px-3 py-2 bg-violet-50"
                                          placeholder="Ville"
                                          value={int.city}
                                          onChange={(e) =>
                                            handleChangeInternship(
                                              "city",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="flex gap-2 mb-2 items-end">
                                      <div>
                                        <label className="block font-medium mb-1">
                                          Date de début
                                        </label>
                                        <div className="flex gap-1">
                                          <select
                                            className="rounded border px-2 py-1 bg-violet-50"
                                            value={int.startMonth}
                                            onChange={(e) =>
                                              handleChangeInternship(
                                                "startMonth",
                                                e.target.value
                                              )
                                            }
                                          >
                                            <option value="">Mois</option>
                                            {MONTHS.map((m) => (
                                              <option key={m} value={m}>
                                                {m}
                                              </option>
                                            ))}
                                          </select>
                                          <select
                                            className="rounded border px-2 py-1 bg-violet-50"
                                            value={int.startYear}
                                            onChange={(e) =>
                                              handleChangeInternship(
                                                "startYear",
                                                e.target.value
                                              )
                                            }
                                          >
                                            <option value="">Année</option>
                                            {Array.from(
                                              { length: 50 },
                                              (_, i) => 2024 - i
                                            ).map((y) => (
                                              <option key={y} value={y}>
                                                {y}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block font-medium mb-1">
                                          Date de fin
                                        </label>
                                        <div className="flex gap-1 items-center">
                                          <select
                                            className="rounded border px-2 py-1 bg-violet-50"
                                            value={int.endMonth}
                                            onChange={(e) =>
                                              handleChangeInternship(
                                                "endMonth",
                                                e.target.value
                                              )
                                            }
                                            disabled={int.current}
                                          >
                                            <option value="">Mois</option>
                                            {MONTHS.map((m) => (
                                              <option key={m} value={m}>
                                                {m}
                                              </option>
                                            ))}
                                          </select>
                                          <select
                                            className="rounded border px-2 py-1 bg-violet-50"
                                            value={int.endYear}
                                            onChange={(e) =>
                                              handleChangeInternship(
                                                "endYear",
                                                e.target.value
                                              )
                                            }
                                            disabled={int.current}
                                          >
                                            <option value="">Année</option>
                                            {Array.from(
                                              { length: 50 },
                                              (_, i) => 2024 - i
                                            ).map((y) => (
                                              <option key={y} value={y}>
                                                {y}
                                              </option>
                                            ))}
                                          </select>
                                          <label className="ml-2 flex items-center gap-1 text-xs">
                                            <input
                                              type="checkbox"
                                              checked={int.current}
                                              onChange={(e) =>
                                                handleChangeInternship(
                                                  "current",
                                                  e.target.checked
                                                )
                                              }
                                            />{" "}
                                            ce jour
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                    <label className="block font-medium mb-1 mt-2">
                                      Description
                                    </label>
                                    <div className="flex items-center gap-2 mb-2">
                                      {/* Boutons de mise en forme (non fonctionnels ici) */}
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <b>B</b>
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <i>I</i>
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        <u>U</u>
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        •
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        1.
                                      </Button>
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="ghost"
                                      >
                                        ≡
                                      </Button>
                                      <div className="flex-1" />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        className="flex items-center gap-2"
                                      >
                                        <span>✨</span> Suggestions de l'IA
                                      </Button>
                                    </div>
                                    <textarea
                                      className="w-full min-h-[80px] rounded border px-3 py-2 bg-violet-50"
                                      placeholder="Commencez à rédiger ici..."
                                      value={int.description}
                                      onChange={(e) =>
                                        handleChangeInternship(
                                          "description",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <div className="flex justify-between mt-3">
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() =>
                                          handleDeleteInternship(idx)
                                        }
                                      >
                                        🗑️
                                      </Button>
                                      <Button
                                        type="button"
                                        onClick={handleFinishInternship}
                                        className="bg-violet-700 text-white font-bold"
                                      >
                                        ✓ Terminé
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-bold">{int.job}</div>
                                      <div className="text-xs text-gray-500">
                                        {int.employer}{" "}
                                        {int.city && `- ${int.city}`}
                                      </div>
                                    </div>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditInternship(idx)}
                                    >
                                      Modifier
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleAddInternship}
                            >
                              + Ajouter un stage
                            </Button>
                          </div>
                        )}
                        {key === "signature" && (
                          <div className="space-y-6">
                            <div className="flex gap-4">
                              <div className="flex-1">
                                <label className="block font-medium mb-1">
                                  Ville
                                </label>
                                <input
                                  className="w-full rounded border px-3 py-2 bg-violet-50"
                                  placeholder="Ville"
                                  value={signature.city}
                                  onChange={(e) =>
                                    handleChangeSignature(
                                      "city",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="flex-1">
                                <label className="block font-medium mb-1">
                                  Date
                                </label>
                                <input
                                  type="date"
                                  className="w-full rounded border px-3 py-2 bg-violet-50"
                                  value={signature.date}
                                  onChange={(e) =>
                                    handleChangeSignature(
                                      "date",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block font-medium mb-1">
                                Signature
                              </label>
                              <div
                                className="mt-2 border rounded bg-gray-100 p-2 flex items-center justify-center min-h-[180px] cursor-pointer hover:bg-gray-200 transition"
                                onClick={() => setSignatureModalOpen(true)}
                                style={{ height: 180 }}
                              >
                                {signature.image ? (
                                  <img
                                    src={signature.image}
                                    alt="Signature"
                                    className="max-h-32 max-w-full object-contain"
                                  />
                                ) : (
                                  <svg
                                    width="48"
                                    height="48"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    stroke="currentColor"
                                    className="text-gray-400"
                                  >
                                    <path
                                      d="M16 32l16-16M20 36h8M12 44h24a4 4 0 004-4V12a4 4 0 00-4-4H12a4 4 0 00-4 4v28a4 4 0 004 4z"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                    <path
                                      d="M16 32l-2 6 6-2"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                )}
                              </div>
                              <SignatureModal
                                open={signatureModalOpen}
                                onClose={() => setSignatureModalOpen(false)}
                                onSave={handleSignatureModalSave}
                              />
                            </div>
                          </div>
                        )}
                        {key !== "profile" && (
                          <div className="text-gray-400 italic">
                            Formulaire à venir pour cette section...
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </SortableAccordionItem>
                ))}
              </Accordion>
            </SortableContext>
          </DndContext>
          {/* Liste des sections à ajouter */}
          <div className="flex flex-wrap gap-2 mt-4">
            {availableLeft.map((s) => (
              <Button
                key={s}
                variant="outline"
                size="sm"
                onClick={() => addLeftSection(s)}
              >
                + {ALL_SECTIONS.find((sec) => sec.key === s)?.label}
              </Button>
            ))}
            {availableRight.map((s) => (
              <Button
                key={s}
                variant="outline"
                size="sm"
                onClick={() => addRightSection(s)}
              >
                + {ALL_SECTIONS.find((sec) => sec.key === s)?.label}
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
