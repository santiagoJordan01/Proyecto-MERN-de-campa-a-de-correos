import { useState } from "react";
import { CsvUploader } from "../components/CsvUploader";
import { TemplateSelector } from "../components/TemplateSelector";
import { CampaignSender } from "../components/CampaignSender";

export function Home() {
  const [template, setTemplate] = useState("");

  return (
    <div className="max-w-2xl mx-auto p-6 py-4 px-20 bg-white-500 align">
      <h1 className="text-3xl font-bold mb-4">Gestión de Campañas</h1>
      <div><CsvUploader /></div>
      <div className="flex"><TemplateSelector selected={template} onChange={setTemplate} /></div>
      <CampaignSender templateName={template} />
    </div>
  );
}
// Este componente principal de la página de inicio combina los componentes de carga de CSV, selección de plantilla y envío de campaña.
// Utiliza el hook useState para manejar el estado de la plantilla seleccionada.import { useState } from "react";