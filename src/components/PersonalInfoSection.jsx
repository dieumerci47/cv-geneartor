import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { optionalFields } from "./personalInfoFields";

export default function PersonalInfoSection({
  fields,
  available,
  values,
  photo,
  onChange,
  onPhotoChange,
  onAddField,
  onRemoveField,
}) {
  return (
    <div className="bg-blue-50/60 border border-blue-100 rounded-xl shadow-md p-6 mb-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) =>
          field.type === "image" ? (
            <div
              key={field.key}
              className="flex flex-col items-start col-span-2"
            >
              <label className="mb-1 font-semibold text-blue-700 text-base">
                {field.label}
              </label>
              <div className="flex items-center gap-6 w-full">
                <div className="flex items-center gap-2 flex-1">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onPhotoChange}
                      className="absolute opacity-0 w-0 h-0 pointer-events-none"
                    />
                    <span className="rounded-full bg-gradient-to-r from-blue-400 to-pink-400 text-white font-bold shadow-md px-4 py-2 flex items-center gap-2 hover:scale-105 transition-transform">
                      <span className="text-lg">📷</span> Choisir une photo
                    </span>
                  </label>
                  <span className="text-sm text-gray-600 ml-2">
                    {photo ? "Photo sélectionnée" : "Aucun fichier choisi"}
                  </span>
                </div>
                <Avatar className="w-20 h-20 shadow-lg border-2 border-blue-200">
                  {photo ? (
                    <AvatarImage src={photo} alt="Photo" />
                  ) : (
                    <AvatarFallback>Photo</AvatarFallback>
                  )}
                </Avatar>
              </div>
            </div>
          ) : (
            <div key={field.key} className="flex flex-col gap-1">
              <label className="mb-1 font-semibold text-blue-700 text-base">
                {field.label}
              </label>
              <Input
                type={field.type}
                value={values[field.key] || ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.label}
                className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-base focus:ring-2 focus:ring-blue-400"
              />
              {optionalFields.find((f) => f.key === field.key) && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onRemoveField(field.key)}
                  className="rounded-full text-xs mt-1 self-end px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 transition-all"
                >
                  Supprimer
                </Button>
              )}
            </div>
          )
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-6">
        {available.map((field) => (
          <Button
            key={field.key}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAddField(field)}
            className="rounded-full bg-gradient-to-r from-blue-100 to-pink-100 text-blue-700 font-semibold border-blue-200 shadow hover:scale-105 transition-transform px-4 py-2"
          >
            + {field.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
