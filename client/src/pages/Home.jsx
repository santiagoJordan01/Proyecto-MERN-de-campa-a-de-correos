import { useState } from "react";
import { CsvUploader } from "../components/CsvUploader";
import { TemplateSelector } from "../components/TemplateSelector";
import { CampaignSender } from "../components/CampaignSender";

export function Home() {
  const [template, setTemplate] = useState("");

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl text-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Campañas</h1>

      <div className="mb-4">
        <CsvUploader />
      </div>

      <div className="mb-4">
        <TemplateSelector selected={template} onChange={setTemplate} />
      </div>

      <div>
        <CampaignSender templateName={template} />
      </div>
    </div>
  );
}
