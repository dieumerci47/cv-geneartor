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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) =>
          field.type === "image" ? (
            <div
              key={field.key}
              className="flex flex-col items-start col-span-2"
            >
              <label className="mb-1 font-medium">{field.label}</label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={onPhotoChange}
                  className="block"
                />
                <Avatar className="w-20 h-20">
                  {photo ? (
                    <AvatarImage src={photo} alt="Photo" />
                  ) : (
                    <AvatarFallback>Photo</AvatarFallback>
                  )}
                </Avatar>
              </div>
            </div>
          ) : (
            <div key={field.key} className="flex flex-col">
              <label className="mb-1 font-medium">{field.label}</label>
              <Input
                type={field.type}
                value={values[field.key] || ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.label}
              />
              {optionalFields.find((f) => f.key === field.key) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveField(field.key)}
                  className="text-xs text-red-500 mt-1 self-end"
                >
                  Supprimer
                </Button>
              )}
            </div>
          )
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {available.map((field) => (
          <Button
            key={field.key}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAddField(field)}
            className="bg-white"
          >
            + {field.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
