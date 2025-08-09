import React, { useEffect, useState } from "react";
import { listCvs, deleteCv } from "@/lib/cvRepository";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/supabase/supabase";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutList,
  FilePlus2,
  Trash2,
  Pencil,
  Download,
  Home,
} from "lucide-react";
import { getCv } from "@/lib/cvRepository";
import Template1CV from "@/components/templates/Template1CV";
import Template2CV from "@/components/templates/Template2CV";
import Template3CV from "@/components/templates/Template3CV";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

// formatDate removed (no longer shown in card header)

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data: auth } = await supabase.auth.getUser();
        const meta = auth?.user?.user_metadata || {};
        const display =
          [meta.prenom, meta.nom].filter(Boolean).join(" ") ||
          auth?.user?.email ||
          "Utilisateur";
        if (mounted) setUserName(display);
        let rows = await listCvs();
        // Enrichit si certaines lignes n'ont pas de données utiles (sécurité)
        rows = await Promise.all(
          rows.map(async (r) => {
            const d = r?.data || {};
            const hasSome = !!(
              (d.personal && Object.values(d.personal).some(Boolean)) ||
              (typeof d.profile === "string" && d.profile.trim()) ||
              (Array.isArray(d.educations) &&
                d.educations.some(
                  (e) => e && Object.values(e).some(Boolean)
                )) ||
              (Array.isArray(d.experiences) &&
                d.experiences.some(
                  (e) => e && Object.values(e).some(Boolean)
                )) ||
              (Array.isArray(d.languages) &&
                d.languages.some((l) => l?.name)) ||
              (Array.isArray(d.skills) && d.skills.some((s) => s?.name)) ||
              (Array.isArray(d.interests) && d.interests.length > 0) ||
              (Array.isArray(d.certificates) &&
                d.certificates.some((c) => c?.name)) ||
              (Array.isArray(d.internships) &&
                d.internships.some((i) => i?.job)) ||
              (d.signature && d.signature.image)
            );
            if (!hasSome) {
              try {
                const full = await getCv(r.id);
                return { ...r, data: full?.data || r.data };
              } catch {
                return r;
              }
            }
            return r;
          })
        );
        if (!mounted) return;
        setItems(rows);
      } catch (e) {
        if (!mounted) return;
        setError("Impossible de charger vos CV.");
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen w-full px-4 md:px-8 py-8 bg-gradient-to-br from-[#e3e6f5] via-[#b3d0f7] to-[#eec6e6]">
      <div className="max-w-6xl mx-auto">
        {/* Header de bienvenue */}
        <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-white/90 shadow-lg p-4 md:p-6 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/60 via-pink-50/60 to-blue-50/60 pointer-events-none" />
          <div className="relative flex items-center gap-4">
            <Avatar className="size-12 bg-blue-100 text-blue-800">
              <AvatarFallback>
                {userName
                  .split(" ")
                  .map((p) => p.charAt(0).toUpperCase())
                  .slice(0, 2)
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm text-gray-600">Bienvenue</div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-blue-800">
                {userName}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                className="rounded-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <a href="/" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Accueil
                </a>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold rounded-full shadow transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
              >
                <a href="/editor" className="flex items-center gap-2">
                  <FilePlus2 className="w-4 h-4" />
                  Nouveau CV
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Titre liste */}
        <div className="flex items-center gap-2 mb-3 text-blue-900">
          <LayoutList className="w-5 h-5" />
          <h2 className="text-lg md:text-xl font-bold">Mes CV</h2>
        </div>

        {loading && (
          <div className="text-center text-blue-700">Chargement…</div>
        )}
        {error && (
          <div className="text-center text-red-600 font-medium">{error}</div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="text-center text-gray-700">
            Aucun CV pour l’instant. Créez-en un !
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {items.map((cv) => {
            // Child component to encapsulate hooks per card
            function CvCard() {
              const printRef = useRef();
              const handlePrint = useReactToPrint({
                contentRef: printRef,
                documentTitle: cv.title || "MonCV",
              });
              const containerRef = useRef(null);
              const [scale, setScale] = useState(0.4);
              const BASE_WIDTH = 768; // Tailwind max-w-3xl ~ 768px
              const BASE_HEIGHT = 700; // Template min height

              useEffect(() => {
                const el = containerRef.current;
                if (!el) return;
                const ro = new ResizeObserver((entries) => {
                  for (const entry of entries) {
                    const w = entry.contentRect.width;
                    if (w > 0) setScale(Math.min(1, w / BASE_WIDTH));
                  }
                });
                ro.observe(el);
                return () => ro.disconnect();
              }, []);

              const PrintPreview = () => {
                const tpl = String(cv.template ?? 0);
                const data = cv.data || {};
                const left = ["languages", "skills", "interests"];
                const right = [
                  "profile",
                  "experiences",
                  "educations",
                  "internships",
                  "signature",
                  "certificates",
                ];
                if (tpl === "0" || tpl === "1")
                  return (
                    <Template1CV
                      cvData={data}
                      leftSections={left}
                      rightSections={right}
                    />
                  );
                if (tpl === "2")
                  return (
                    <Template2CV
                      cvData={data}
                      leftSections={left}
                      rightSections={right}
                    />
                  );
                return (
                  <Template3CV
                    cvData={data}
                    leftSections={left}
                    rightSections={right}
                  />
                );
              };

              return (
                <Card
                  key={cv.id}
                  className="p-4 bg-gradient-to-br from-white to-blue-50/60 border border-blue-100 rounded-2xl shadow-lg transition-colors"
                >
                  {/* Hidden print root for this card */}
                  <div
                    style={{ position: "absolute", left: "-10000px", top: 0 }}
                  >
                    <div ref={printRef}>
                      <PrintPreview />
                    </div>
                  </div>

                  {/* Mini aperçu auto-fit */}
                  <div
                    ref={containerRef}
                    className="mt-3 rounded-2xl border border-blue-100 bg-white shadow-lg ring-1 ring-blue-50 overflow-hidden relative"
                  >
                    <div
                      className="relative"
                      style={{ height: `${BASE_HEIGHT * scale}px` }}
                    >
                      <div
                        className="absolute left-0 top-0 pointer-events-none select-none"
                        style={{
                          transform: `scale(${scale})`,
                          transformOrigin: "top left",
                        }}
                      >
                        <div style={{ width: `${BASE_WIDTH}px` }}>
                          <PrintPreview />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="rounded-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                    >
                      <a
                        href={`/editor?template=${cv.template ?? 0}&cv=${
                          cv.id
                        }`}
                      >
                        <Pencil className="w-4 h-4 mr-1" /> Modifier
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                      onClick={handlePrint}
                    >
                      <Download className="w-4 h-4 mr-1" /> Télécharger PDF
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
                      onClick={async () => {
                        if (!confirm("Supprimer ce CV ?")) return;
                        try {
                          await deleteCv(cv.id);
                          setItems((prev) =>
                            prev.filter((x) => x.id !== cv.id)
                          );
                        } catch (e) {
                          alert("Suppression impossible");
                          console.error(e);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Supprimer
                    </Button>
                  </div>
                </Card>
              );
            }

            return <CvCard key={cv.id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
