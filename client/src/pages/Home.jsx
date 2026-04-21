import { useState } from "react";
import { CsvUploader } from "../components/CsvUploader";
import { TemplateSelector } from "../components/TemplateSelector";
import { CampaignSender } from "../components/CampaignSender";

export function Home() {
  const [template, setTemplate] = useState("");

  const testApi = async (endpoint) => {
    try {
      const res = await fetch(endpoint);
      const data = await res.json();
      alert(JSON.stringify(data, null, 2));
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl text-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Campañas</h1>

      {/* Botones para probar las rutas de API */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => testApi('/api/emails/test')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
        >
          Test API
        </button>
        <button
          onClick={() => window.open('/admin/queues', '_blank')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
        >
          Ver Colas (Bull Board)
        </button>
      </div>

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