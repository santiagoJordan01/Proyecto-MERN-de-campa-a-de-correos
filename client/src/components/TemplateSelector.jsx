import { useState } from "react";

export function TemplateSelector({ selected, onChange }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Seleccionar Plantilla</h2>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 p-2 border"
      >
        <option value="">-- Selecciona una --</option>
        <option value="template1">Plantilla Oferta 1</option>
        <option value="template2">Plantilla Oferta 2</option>
      </select>
    </div>
  );
}
// Este componente permite al usuario seleccionar una plantilla de correo electrónico.
// Recibe el nombre de la plantilla seleccionada y una función para manejar el cambio.



