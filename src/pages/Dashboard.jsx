import React, { useEffect, useState } from "react";
import { listCvs } from "@/lib/cvRepository";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
  } catch {
    return "";
  }
}

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const rows = await listCvs();
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-800">
            Mes CV
          </h1>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-500 to-pink-500 text-white font-bold"
          >
            <a href="/editor">+ Nouveau CV</a>
          </Button>
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
          {items.map((cv) => (
            <Card
              key={cv.id}
              className="p-4 bg-white/95 border border-blue-100 rounded-xl shadow-md"
            >
              <div className="font-bold text-blue-900 text-lg mb-1">
                {cv.title || "Mon CV"}
              </div>
              <div className="text-sm text-gray-600">
                Dernière modif: {formatDate(cv.updated_at)}
              </div>
              <div className="text-xs text-gray-500">
                Template: {cv.template ?? "0"}
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                >
                  <a href={`/editor?template=${cv.template ?? 0}`}>Ouvrir</a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
