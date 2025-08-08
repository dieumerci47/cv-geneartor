import React, { useState, useRef } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
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
import Template4CV from "../components/templates/Template4CV";
import SignatureModal from "@/components/SignatureModal";
import { upsertCv } from "@/lib/cvRepository";

const TEMPLATES = [
  { label: "Template 1", component: Template1CV },
  { label: "Template 2", component: Template2CV },
  { label: "Template 3", component: Template3CV },
  { label: "Template 4", component: Template4CV },
];

const ALL_SECTIONS = [
  { key: "personal", label: "Informations personnelles" },
  { key: "profile", label: "Profil" },
  { key: "education", label: "Formation" },
  { key: "experience", label: "Expérience professionnelle" },
  { key: "skills", label: "Compétences" },
  { key: "languages", label: "Langues" },
  { key: "interests", label: "Centres d'intérêt" },
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
  const [saving, setSaving] = useState(false);
  const [cvId, setCvId] = useState(null);
  const [cvTitle, setCvTitle] = useState("");
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
  // const emptyLanguage = { name: "", level: "" };
  // Ajout de l'état local pour afficher/masquer le formulaire d'ajout de langue
  const [showLanguageForm, setShowLanguageForm] = useState(false);
  const [languageInput, setLanguageInput] = useState({ name: "", level: "" });

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
    if (!languageInput.name || !languageInput.level) return;
    setLanguages([...languages, { ...languageInput }]);
    setLanguageInput({ name: "", level: "" });
    setShowLanguageForm(false);
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

  // State pour centres d'intérêt
  const [interests, setInterests] = useState([]);
  const [interestInput, setInterestInput] = useState("");
  function handleAddInterest(e) {
    e.preventDefault();
    if (interestInput.trim()) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput("");
    }
  }
  function handleDeleteInterest(idx) {
    setInterests(interests.filter((_, i) => i !== idx));
  }

  // Construction de l'objet cvData unique
  const cvData = {
    personal: {
      ...personalValues,
      photo: personalPhoto,
    },
    profile: profileValue,
    educations,
    experiences,
    skills,
    languages,
    internships,
    certificates,
    interests,
    signature: {
      image: signature.image,
      city: signature.city,
      date: signature.date,
    },
  };

  const PreviewComponent =
    TEMPLATES[selectedTemplate]?.component || LivePreviewCV;

  const cvRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: cvRef,
    documentTitle: "MonCV",
  });
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  // Mobile: bouton de téléchargement intégré côté formulaire

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e3e6f5] via-[#b3d0f7] to-[#eec6e6] px-2 py-8">
      {/* Hidden print container (kept in DOM but not visible) */}
      <div
        id="print-root"
        style={{ position: "absolute", left: "-10000px", top: 0 }}
      >
        <div ref={cvRef}>
          <PreviewComponent
            cvData={cvData}
            leftSections={leftSections}
            rightSections={rightSections}
          />
        </div>
      </div>
      <div className="w-full max-w-6xl bg-white/80 rounded-xl shadow-lg flex flex-row gap-8 p-4 md:p-8">
        {/* Preview à gauche : sticky sur desktop, même hauteur que le scroll */}
        <div className="w-1/2 hidden md:flex items-start justify-center">
          <div className="sticky top-8 h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] flex items-start justify-center overflow-y-auto">
            {/* Bouton PDF au-dessus de la preview */}
            {/*  <div className="w-full flex justify-center md:justify-start mb-4">
              <Button
                onClick={handlePrint}
                className="bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold px-6 py-3 rounded-full shadow-md hover:scale-105 transition-transform flex items-center gap-2"
              >
                <span>⬇️</span> Télécharger en PDF
              </Button>
            </div> */}
            {/* Preview du CV (visuel seulement) */}
            <PreviewComponent
              cvData={cvData}
              leftSections={leftSections}
              rightSections={rightSections}
            />
          </div>
        </div>
        {/* Sur mobile, on n'affiche que le formulaire. La prévisualisation s'ouvre via un bouton flottant. */}
        {/* Formulaire à droite : scrollable sur desktop, style hackathon */}
        <div className="w-full md:w-1/2 flex flex-col gap-8 max-h-[calc(100vh-64px)] overflow-y-auto pr-1 bg-gradient-to-br from-white/80 via-blue-50 to-pink-50 rounded-2xl shadow-xl p-4 md:p-8 border border-blue-100">
          {/* En-tête: titre, template, sauvegarde */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
            <input
              className="flex-1 border rounded px-3 py-2 bg-white shadow focus:ring-2 focus:ring-blue-400 text-base"
              placeholder="Titre du CV (ex: Développeur Frontend)"
              value={cvTitle}
              onChange={(e) => setCvTitle(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <select
                className="border rounded px-3 py-2 bg-white shadow focus:ring-2 focus:ring-blue-400 text-base font-semibold"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(Number(e.target.value))}
              >
                {TEMPLATES.map((tpl, idx) => (
                  <option key={idx} value={idx}>
                    {tpl.label}
                  </option>
                ))}
              </select>
              <Button
                disabled={saving}
                onClick={async () => {
                  try {
                    setSaving(true);
                    const row = await upsertCv({
                      id: cvId || undefined,
                      title: cvTitle || "Mon CV",
                      template: String(selectedTemplate),
                      data: cvData,
                    });
                    setCvId(row.id);
                  } catch (e) {
                    console.error(e);
                    alert("Erreur lors de la sauvegarde");
                  } finally {
                    setSaving(false);
                  }
                }}
                className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-bold px-4 py-2 rounded shadow"
              >
                {saving ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </div>
          </div>
          {/* Accordéon infos personnelles (jamais déplaçable, mais même style visuel) */}
          <div className="mb-4">
            <SortableAccordionItem id="personal">
              <Accordion
                type="single"
                collapsible
                value={open}
                onValueChange={setOpen}
              >
                <AccordionItem value="personal">
                  <AccordionTrigger className="text-xl font-extrabold flex items-center gap-2 text-blue-700">
                    <span className="text-2xl">👤</span> Informations
                    personnelles
                  </AccordionTrigger>
                  <AccordionContent className="bg-white/95 rounded-xl shadow-md border border-blue-100 p-6 animate-fade-in">
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
            </SortableAccordionItem>
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
                      <AccordionTrigger className="text-xl font-extrabold flex items-center gap-2 text-violet-700">
                        {key === "skills" && (
                          <span className="text-2xl">🛠️</span>
                        )}
                        {key === "languages" && (
                          <span className="text-2xl">🌍</span>
                        )}
                        {key === "interests" && (
                          <span className="text-2xl">🎯</span>
                        )}
                        {ALL_SECTIONS.find((s) => s.key === key)?.label}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeLeftSection(key);
                          }}
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          ×
                        </Button>
                      </AccordionTrigger>
                      <AccordionContent className="bg-white/95 rounded-xl shadow-md border border-violet-100 p-6 animate-fade-in">
                        {key === "skills" && (
                          <div className="space-y-6">
                            {skills.map((sk, idx) => (
                              <div
                                key={idx}
                                className="border rounded-lg p-4 mb-4 bg-blue-50/60 hover:shadow-lg transition-all"
                              >
                                {editingSkill === idx ? (
                                  <>
                                    <label className="block font-semibold text-violet-700 mb-1 text-base">
                                      Compétence
                                    </label>
                                    <input
                                      className="w-full mb-2 rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base"
                                      placeholder="Nom de la compétence"
                                      value={sk.name}
                                      onChange={(e) =>
                                        handleChangeSkill(
                                          "name",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <label className="block font-semibold text-violet-700 mb-1 text-base">
                                      Niveau
                                    </label>
                                    <select
                                      className="w-full rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base mb-2"
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
                                        className="rounded-full px-4 py-2"
                                      >
                                        🗑️
                                      </Button>
                                      <Button
                                        type="button"
                                        onClick={handleFinishSkill}
                                        className="rounded-full bg-gradient-to-r from-violet-500 to-blue-400 text-white font-bold shadow-md hover:scale-105 transition-transform px-6"
                                      >
                                        ✓ Terminé
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div className="font-bold text-violet-900 text-lg">
                                      {sk.name}
                                    </div>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditSkill(idx)}
                                      className="rounded-full border-violet-300 text-violet-700 font-semibold px-4 py-2 hover:bg-violet-100"
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
                              className="rounded-full bg-gradient-to-r from-violet-400 to-blue-400 text-white font-bold shadow-md hover:scale-105 transition-transform px-4 py-2"
                              onClick={handleAddSkill}
                            >
                              + Ajouter une compétence
                            </Button>
                          </div>
                        )}
                        {key === "languages" && (
                          <div className="space-y-6">
                            {/* Affiche le bouton ou le formulaire selon l'état */}
                            {!showLanguageForm ? (
                              <div className="flex justify-center">
                                <Button
                                  type="button"
                                  onClick={() => setShowLanguageForm(true)}
                                  className="rounded-full px-8 py-3 bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold shadow-md hover:scale-105 transition-transform flex items-center gap-2 text-base"
                                >
                                  <span>🌍</span> + Ajouter une langue
                                </Button>
                              </div>
                            ) : (
                              <div className="border border-blue-100 rounded-2xl p-6 bg-white/95 shadow-lg">
                                <label className="font-bold text-blue-700 text-lg mb-2 flex items-center gap-2">
                                  <span className="text-2xl">🌍</span> Langue
                                </label>
                                <input
                                  className="w-full mb-3 rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-blue-400 text-base"
                                  placeholder="Nom de la langue"
                                  value={languageInput.name}
                                  onChange={(e) =>
                                    setLanguageInput({
                                      ...languageInput,
                                      name: e.target.value,
                                    })
                                  }
                                />
                                <label className="font-medium mb-1">
                                  Niveau
                                </label>
                                <select
                                  className="w-full rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-blue-400 text-base mb-3"
                                  value={languageInput.level}
                                  onChange={(e) =>
                                    setLanguageInput({
                                      ...languageInput,
                                      level: e.target.value,
                                    })
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
                                <div className="flex justify-between mt-4">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="rounded-full px-6 py-2 font-bold"
                                    onClick={() => setShowLanguageForm(false)}
                                  >
                                    Annuler
                                  </Button>
                                  <Button
                                    type="button"
                                    onClick={handleAddLanguage}
                                    className="rounded-full px-8 py-3 bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold shadow-md hover:scale-105 transition-transform flex items-center gap-2 text-base"
                                  >
                                    <span>🌍</span> Ajouter la langue
                                  </Button>
                                </div>
                              </div>
                            )}
                            {/* Liste des langues ajoutées */}
                            {languages.map((l, idx) => (
                              <div
                                key={idx}
                                className="border border-blue-100 rounded-2xl p-6 mb-6 bg-white/95 shadow-lg"
                              >
                                {editingLanguage === idx ? (
                                  <>
                                    <label className="font-bold text-blue-700 text-lg mb-2 flex items-center gap-2">
                                      <span className="text-2xl">🌍</span>{" "}
                                      Langue
                                    </label>
                                    <input
                                      className="w-full mb-3 rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-blue-400 text-base"
                                      placeholder="Nom de la langue"
                                      value={l.name}
                                      onChange={(e) =>
                                        handleChangeLanguage(
                                          "name",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <label className="font-medium mb-1">
                                      Niveau
                                    </label>
                                    <select
                                      className="w-full rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-blue-400 text-base mb-3"
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
                                    <div className="flex justify-between mt-4">
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        className="rounded-full px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 font-bold flex items-center gap-2"
                                        onClick={() =>
                                          handleDeleteLanguage(idx)
                                        }
                                      >
                                        <span>🗑️</span> Supprimer
                                      </Button>
                                      <Button
                                        type="button"
                                        onClick={handleFinishLanguage}
                                        className="rounded-full px-6 py-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                                      >
                                        <span>✓</span> Terminé
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <div>
                                      <div className="font-bold text-blue-900 text-lg flex items-center gap-2">
                                        <span>🌍</span>
                                        {l.name}
                                      </div>
                                      <div className="mt-1 flex items-center gap-2">
                                        {l.level && (
                                          <span className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map(
                                              (_, i) => (
                                                <span
                                                  key={i}
                                                  className={
                                                    i < Number(l.level)
                                                      ? "inline-block w-3 h-3 rounded-full bg-blue-500"
                                                      : "inline-block w-3 h-3 rounded-full bg-gray-300"
                                                  }
                                                />
                                              )
                                            )}
                                          </span>
                                        )}
                                        <span className="text-xs text-gray-500 ml-2">
                                          {LEVELS.find(
                                            (lv) =>
                                              String(lv.value) ===
                                              String(l.level)
                                          )?.label || ""}
                                        </span>
                                      </div>
                                    </div>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="rounded-full border-blue-300 text-blue-700 font-bold hover:bg-blue-50"
                                      onClick={() => handleEditLanguage(idx)}
                                    >
                                      Modifier
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        {key === "interests" && (
                          <div className="space-y-6">
                            {interests &&
                              interests.length > 0 &&
                              interests.map((interest, idx) => (
                                <div
                                  key={idx}
                                  className="border rounded-lg p-4 mb-4 bg-blue-50/60 hover:shadow-lg transition-all flex items-center justify-between"
                                >
                                  <div className="font-bold text-blue-900">
                                    {interest}
                                  </div>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => handleDeleteInterest(idx)}
                                    className="ml-2"
                                  >
                                    🗑️
                                  </Button>
                                </div>
                              ))}
                            <form
                              className="flex gap-2 items-end"
                              onSubmit={handleAddInterest}
                            >
                              <div className="flex-1">
                                <label className="block font-medium mb-1">
                                  Centre d'intérêt
                                </label>
                                <input
                                  className="w-full rounded border px-3 py-2 bg-violet-50 focus:ring-2 focus:ring-blue-400"
                                  placeholder="Ex: Football, Lecture, Musique..."
                                  value={interestInput}
                                  onChange={(e) =>
                                    setInterestInput(e.target.value)
                                  }
                                />
                              </div>
                              <Button
                                type="submit"
                                className="rounded-full bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold shadow-md hover:scale-105 transition-transform px-4 py-2"
                              >
                                + Ajouter
                              </Button>
                            </form>
                          </div>
                        )}
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
                      <AccordionTrigger className="text-xl font-extrabold flex items-center gap-2 text-pink-700">
                        {key === "profile" && (
                          <span className="text-2xl">📝</span>
                        )}
                        {key === "education" && (
                          <span className="text-2xl">🎓</span>
                        )}
                        {key === "experience" && (
                          <span className="text-2xl">💼</span>
                        )}
                        {key === "internship" && (
                          <span className="text-2xl">🏢</span>
                        )}
                        {key === "certificate" && (
                          <span className="text-2xl">📜</span>
                        )}
                        {key === "signature" && (
                          <span className="text-2xl">✍️</span>
                        )}
                        {ALL_SECTIONS.find((s) => s.key === key)?.label}
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRightSection(key);
                          }}
                          className="hover:bg-red-100 hover:text-red-600"
                        >
                          ×
                        </Button>
                      </AccordionTrigger>
                      <AccordionContent className="bg-white/95 rounded-xl shadow-md border border-pink-100 p-6 animate-fade-in">
                        {key === "profile" && (
                          <div className="space-y-4">
                            <label className="font-bold text-blue-700 text-lg mb-2 flex items-center gap-2">
                              <span className="text-2xl">📝</span> Profil
                            </label>
                            <textarea
                              className="w-full min-h-[100px] rounded-xl border border-blue-200 p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 text-gray-900 shadow-md"
                              placeholder="Commencez à rédiger ici..."
                              value={profileValue}
                              onChange={(e) => setProfileValue(e.target.value)}
                            />
                            <div className="flex justify-end">
                              <Button
                                type="button"
                                variant="outline"
                                className="flex items-center gap-2 bg-gradient-to-r from-violet-400 to-blue-400 text-white font-bold shadow-md hover:scale-105 transition-transform px-6 py-2 rounded-full"
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
                                className="border rounded-lg p-4 mb-4 bg-blue-50/60 hover:shadow-lg transition-all"
                              >
                                {editingEducation === idx ? (
                                  <>
                                    <label className="block font-semibold text-blue-700 mb-1 text-base">
                                      Formation
                                    </label>
                                    <input
                                      className="w-full rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-blue-400 text-base"
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
                                        <label className="block font-semibold text-blue-700 mb-1 text-base">
                                          Établissement
                                        </label>
                                        <input
                                          className="w-full rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-blue-400 text-base"
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
                                        <label className="block font-semibold text-blue-700 mb-1 text-base">
                                          Ville
                                        </label>
                                        <input
                                          className="w-full rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-blue-400 text-base"
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
                                        <label className="block font-semibold text-blue-700 mb-1 text-base">
                                          Date de début
                                        </label>
                                        <div className="flex gap-1">
                                          <select
                                            className="rounded-lg border border-blue-200 px-2 py-1 bg-blue-50 focus:ring-2 focus:ring-blue-400 text-base"
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
                                            className="rounded-lg border border-blue-200 px-2 py-1 bg-blue-50 focus:ring-2 focus:ring-blue-400 text-base"
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
                                        <label className="block font-semibold text-blue-700 mb-1 text-base">
                                          Date de fin
                                        </label>
                                        <div className="flex gap-1 items-center">
                                          <select
                                            className="rounded-lg border border-blue-200 px-2 py-1 bg-blue-50 focus:ring-2 focus:ring-blue-400 text-base"
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
                                            className="rounded-lg border border-blue-200 px-2 py-1 bg-blue-50 focus:ring-2 focus:ring-blue-400 text-base"
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
                                    <label className="block font-semibold text-blue-700 mb-1 text-base mt-2">
                                      Description
                                    </label>
                                    <textarea
                                      className="w-full min-h-[80px] rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-blue-400 text-base"
                                      placeholder="Description de la formation, matières principales, etc."
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
                                        className="bg-blue-700 text-white font-bold rounded-lg px-6"
                                      >
                                        ✓ Terminé
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-bold text-blue-900 text-lg">
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
                                className="border rounded-lg p-4 mb-4 bg-blue-50/60 hover:shadow-lg transition-all"
                              >
                                {editingExperience === idx ? (
                                  <>
                                    <label className="block font-semibold text-violet-700 mb-1 text-base">
                                      Poste
                                    </label>
                                    <input
                                      className="w-full mb-2 rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base"
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
                                        <label className="block font-semibold text-violet-700 mb-1 text-base">
                                          Employeur
                                        </label>
                                        <input
                                          className="w-full rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base"
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
                                        <label className="block font-semibold text-violet-700 mb-1 text-base">
                                          Ville
                                        </label>
                                        <input
                                          className="w-full rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base"
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
                                        <label className="block font-semibold text-violet-700 mb-1 text-base">
                                          Date de début
                                        </label>
                                        <div className="flex gap-1">
                                          <select
                                            className="rounded-lg border border-blue-200 px-2 py-1 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base"
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
                                            className="rounded-lg border border-blue-200 px-2 py-1 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base"
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
                                        <label className="block font-semibold text-violet-700 mb-1 text-base">
                                          Date de fin
                                        </label>
                                        <div className="flex gap-1 items-center">
                                          <select
                                            className="rounded-lg border border-blue-200 px-2 py-1 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base"
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
                                            className="rounded-lg border border-blue-200 px-2 py-1 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base"
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
                                    <label className="block font-semibold text-violet-700 mb-1 text-base mt-2">
                                      Description
                                    </label>
                                    <textarea
                                      className="w-full min-h-[80px] rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base"
                                      placeholder="Description du poste, missions principales, etc."
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
                                        className="rounded-full px-4 py-2"
                                      >
                                        🗑️
                                      </Button>
                                      <Button
                                        type="button"
                                        onClick={handleFinishExperience}
                                        className="rounded-full bg-gradient-to-r from-violet-500 to-blue-400 text-white font-bold shadow-md hover:scale-105 transition-transform px-6"
                                      >
                                        ✓ Terminé
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div className="font-bold text-violet-900 text-lg">
                                      {ex.job}
                                    </div>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditExperience(idx)}
                                      className="rounded-full border-violet-300 text-violet-700 font-semibold px-4 py-2 hover:bg-violet-100"
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
                              className="rounded-full bg-gradient-to-r from-violet-400 to-blue-400 text-white font-bold shadow-md hover:scale-105 transition-transform px-4 py-2"
                              onClick={handleAddExperience}
                            >
                              + Ajouter une expérience
                            </Button>
                          </div>
                        )}
                        {key === "certificate" && (
                          <div className="space-y-6">
                            {certificates.length === 0 && (
                              <div className="flex items-center justify-center py-8">
                                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold shadow animate-fade-in">
                                  Section à venir...
                                </span>
                              </div>
                            )}
                            {certificates.map((c, idx) => (
                              <div
                                key={idx}
                                className="border border-blue-100 rounded-2xl p-6 mb-6 bg-white/95 shadow-lg animate-fade-in"
                              >
                                {editingCertificate === idx ? (
                                  <>
                                    <label className="block font-bold text-blue-700 text-lg mb-2 flex items-center gap-2">
                                      <span className="text-2xl">📜</span>{" "}
                                      Certificat
                                    </label>
                                    <input
                                      className="w-full mb-3 rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-blue-400 text-base"
                                      placeholder="Nom du certificat"
                                      value={c.name}
                                      onChange={(e) =>
                                        handleChangeCertificate(
                                          "name",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <div className="flex flex-col md:flex-row gap-3 mb-3 items-end">
                                      <div className="flex-1">
                                        <label className="block font-medium mb-1">
                                          Période
                                        </label>
                                        <div className="flex gap-2 flex-wrap md:flex-nowrap">
                                          <select
                                            className="rounded-lg border border-blue-200 px-2 py-1 bg-blue-50 focus:ring-2 focus:ring-blue-400 text-base"
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
                                            className="rounded-lg border border-blue-200 px-2 py-1 bg-blue-50 focus:ring-2 focus:ring-blue-400 text-base"
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
                                          <label className="ml-2 flex items-center gap-1 text-xs font-medium">
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
                                    <label className="font-medium mb-1 mt-2 flex items-center gap-2">
                                      <span className="text-lg">📝</span>{" "}
                                      Description
                                    </label>
                                    <textarea
                                      className="w-full min-h-[80px] rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-blue-400 text-base"
                                      placeholder="Commencez à rédiger ici..."
                                      value={c.description}
                                      onChange={(e) =>
                                        handleChangeCertificate(
                                          "description",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <div className="flex justify-between mt-4">
                                      <Button
                                        type="button"
                                        variant="destructive"
                                        className="rounded-full px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 font-bold flex items-center gap-2"
                                        onClick={() =>
                                          handleDeleteCertificate(idx)
                                        }
                                      >
                                        <span>🗑️</span> Supprimer
                                      </Button>
                                      <Button
                                        type="button"
                                        onClick={handleFinishCertificate}
                                        className="rounded-full px-6 py-2 bg-gradient-to-r from-violet-500 to-blue-500 text-white font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                                      >
                                        <span>✓</span> Terminé
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                                    <div>
                                      <div className="font-bold text-blue-900 text-lg flex items-center gap-2">
                                        <span>📜</span>
                                        {c.name}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        {c.month && c.year
                                          ? `${c.month} ${c.year}`
                                          : ""}
                                        {c.current && " - ce jour"}
                                      </div>
                                      {c.description && (
                                        <div className="mt-2 text-gray-700 text-sm whitespace-pre-line">
                                          {c.description}
                                        </div>
                                      )}
                                    </div>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="rounded-full border-blue-300 text-blue-700 font-bold hover:bg-blue-50"
                                      onClick={() => handleEditCertificate(idx)}
                                    >
                                      Modifier
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                            <div className="flex justify-center">
                              <Button
                                type="button"
                                onClick={handleAddCertificate}
                                className="rounded-full px-8 py-3 bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold shadow-md hover:scale-105 transition-transform flex items-center gap-2 text-base"
                              >
                                <span>📜</span> + Ajouter un certificat
                              </Button>
                            </div>
                          </div>
                        )}
                        {key === "internship" && (
                          <div className="space-y-6">
                            {internships.map((int, idx) => (
                              <div
                                key={idx}
                                className="border rounded-lg p-4 mb-4 bg-blue-50/60 hover:shadow-lg transition-all"
                              >
                                {editingInternship === idx ? (
                                  <>
                                    <label className="block font-semibold text-violet-700 mb-1 text-base">
                                      Poste
                                    </label>
                                    <input
                                      className="w-full mb-2 rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base"
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
                                        <label className="block font-semibold text-violet-700 mb-1 text-base">
                                          Employeur
                                        </label>
                                        <input
                                          className="w-full rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base"
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
                                        <label className="block font-semibold text-violet-700 mb-1 text-base">
                                          Ville
                                        </label>
                                        <input
                                          className="w-full rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base"
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
                                    {/* Bloc dates stage corrigé */}
                                    <div className="flex flex-col md:flex-row gap-6 mb-2 items-end">
                                      <div className="flex flex-col gap-1 flex-1">
                                        <label className="block font-semibold text-violet-700 mb-1 text-base">
                                          Date de début
                                        </label>
                                        <select
                                          className="rounded-lg border border-blue-200 px-2 py-1 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base mb-1"
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
                                          className="rounded-lg border border-blue-200 px-2 py-1 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base"
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
                                      <div className="flex flex-col gap-1 flex-1">
                                        <label className="block font-semibold text-violet-700 mb-1 text-base">
                                          Date de fin
                                        </label>
                                        <select
                                          className="rounded-lg border border-blue-200 px-2 py-1 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base mb-1"
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
                                          className="rounded-lg border border-blue-200 px-2 py-1 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base"
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
                                        <label className="ml-2 flex items-center gap-1 text-xs mt-1">
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
                                    <label className="block font-semibold text-violet-700 mb-1 text-base mt-2">
                                      Description
                                    </label>
                                    <textarea
                                      className="w-full min-h-[80px] rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base"
                                      placeholder="Description du stage, missions principales, etc."
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
                                        className="rounded-full px-4 py-2"
                                      >
                                        🗑️
                                      </Button>
                                      <Button
                                        type="button"
                                        onClick={handleFinishInternship}
                                        className="rounded-full bg-gradient-to-r from-violet-500 to-blue-400 text-white font-bold shadow-md hover:scale-105 transition-transform px-6"
                                      >
                                        ✓ Terminé
                                      </Button>
                                    </div>
                                  </>
                                ) : (
                                  <div className="flex items-center justify-between">
                                    <div className="font-bold text-violet-900 text-lg">
                                      {int.job}
                                    </div>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEditInternship(idx)}
                                      className="rounded-full border-violet-300 text-violet-700 font-semibold px-4 py-2 hover:bg-violet-100"
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
                              className="rounded-full bg-gradient-to-r from-violet-400 to-blue-400 text-white font-bold shadow-md hover:scale-105 transition-transform px-4 py-2"
                              onClick={handleAddInternship}
                            >
                              + Ajouter un stage
                            </Button>
                          </div>
                        )}
                        {key === "signature" && (
                          <div className="space-y-6">
                            <div className="text-xl font-bold text-violet-700 mb-2">
                              Signature
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="flex-1">
                                <label className="block font-semibold text-violet-700 mb-1 text-base">
                                  Ville
                                </label>
                                <input
                                  className="w-full rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base"
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
                                <label className="block font-semibold text-violet-700 mb-1 text-base">
                                  Date
                                </label>
                                <input
                                  type="date"
                                  className="w-full rounded-lg border border-blue-200 px-4 py-2 bg-blue-50 focus:ring-2 focus:ring-violet-400 text-base"
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
                            <div className="flex flex-col items-center justify-center">
                              <div className="w-full flex items-center justify-center">
                                <div className="w-full max-w-xs min-h-[120px] bg-blue-50 border-2 border-dashed border-violet-300 rounded-xl shadow-md flex flex-col items-center justify-center p-4">
                                  {signature.image ? (
                                    <>
                                      <img
                                        src={signature.image}
                                        alt="Signature"
                                        className="max-h-20 object-contain mx-auto mb-2"
                                      />
                                      <Button
                                        type="button"
                                        onClick={() =>
                                          setSignatureModalOpen(true)
                                        }
                                        className="rounded-full bg-gradient-to-r from-violet-500 to-blue-400 text-white font-bold shadow-md hover:scale-105 transition-transform px-6 py-2"
                                      >
                                        ✍️ Modifier
                                      </Button>
                                    </>
                                  ) : (
                                    <Button
                                      type="button"
                                      onClick={() =>
                                        setSignatureModalOpen(true)
                                      }
                                      className="rounded-full bg-gradient-to-r from-violet-500 to-blue-400 text-white font-bold shadow-md hover:scale-105 transition-transform px-6 py-2"
                                    >
                                      ✍️ Signer
                                    </Button>
                                  )}
                                </div>
                              </div>
                              <SignatureModal
                                open={signatureModalOpen}
                                onClose={() => setSignatureModalOpen(false)}
                                onSave={handleSignatureModalSave}
                              />
                            </div>
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
                className="bg-gradient-to-r from-blue-100 to-pink-100 text-blue-700 font-semibold border-blue-200 hover:scale-105 transition-transform"
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
                className="bg-gradient-to-r from-pink-100 to-blue-100 text-pink-700 font-semibold border-pink-200 hover:scale-105 transition-transform"
              >
                + {ALL_SECTIONS.find((sec) => sec.key === s)?.label}
              </Button>
            ))}
          </div>
          {/* Espace bas mobile pour éviter que la barre d'actions fixe ne recouvre les champs */}
          <div className="md:hidden h-28" />

          {/* Bouton de téléchargement (desktop uniquement) */}
          <Button
            onClick={handlePrint}
            className="hidden md:block mt-6 w-full bg-gradient-to-r from-blue-500 to-pink-400 hover:from-blue-600 hover:to-pink-500 text-white font-bold text-lg py-4 rounded-xl shadow-xl transition-all"
          >
            <span>⬇️</span> Télécharger en PDF
          </Button>
        </div>
      </div>

      {/* Barre d'actions mobile: prévisualiser et télécharger */}
      <div className="md:hidden fixed bottom-4 left-0 right-0 px-4 z-[70]">
        <div className="flex gap-3">
          <Button
            onClick={() => setMobilePreviewOpen(true)}
            className="flex-1 bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold py-4 rounded-full shadow-xl"
          >
            👀 Prévisualiser
          </Button>
          <Button
            onClick={handlePrint}
            className="flex-1 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold py-4 rounded-full shadow-xl"
          >
            ⬇️ Télécharger
          </Button>
        </div>
      </div>

      {/* Overlay de prévisualisation plein écran (mobile) */}
      {mobilePreviewOpen && (
        <div className="md:hidden fixed inset-0 z-[80] bg-black/60">
          <div className="absolute inset-0 flex flex-col bg-white">
            <div className="p-3 flex items-center justify-between border-b">
              <Button
                variant="outline"
                onClick={() => setMobilePreviewOpen(false)}
                className="rounded-full"
              >
                ✖ Fermer
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-3">
              <PreviewComponent
                cvData={cvData}
                leftSections={leftSections}
                rightSections={rightSections}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
