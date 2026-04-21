import { useState } from "react";
import { CsvUploader } from "../components/CsvUploader";
import { TemplateSelector } from "../components/TemplateSelector";
import { CampaignSender } from "../components/CampaignSender";
import Navbar from "../components/navbar";

export function Home() {
  const [template, setTemplate] = useState("");

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
        <div className="mx-auto px-4 max-w-6xl">
          <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-slate-900">Gestor de Campañas</h1>
              <p className="mt-2 text-slate-600 max-w-2xl">Sube listas CSV, elige plantillas y lanza campañas con control y trazabilidad.</p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/admin/queues"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg shadow hover:bg-slate-800 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6M9 16h6M8 6h8M7 20h10a1 1 0 001-1V7a1 1 0 00-1-1h-2l-1-2H9L8 6H7a1 1 0 00-1 1v12a1 1 0 001 1z" />
                </svg>
                <span className="text-sm font-medium">Ver Colas</span>
              </a>
            </div>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white shadow-md rounded-lg p-6">
                <CsvUploader />
              </div>

              <div className="bg-white shadow-md rounded-lg p-6">
                <TemplateSelector selected={template} onChange={setTemplate} />
              </div>
            </div>

            <aside className="space-y-6">
              <div className="bg-white shadow-md rounded-lg p-6 flex flex-col">
                <CampaignSender templateName={template} />
                <p className="mt-4 text-sm text-slate-500">Selecciona una plantilla antes de enviar. Revisa las colas si surge algún error.</p>
              </div>

              <div className="bg-amber-50 border border-dashed border-amber-100 rounded-lg p-4 text-sm text-amber-700">
                <strong className="block text-amber-900">Consejo</strong>
                <span className="block mt-1">Usa previsualizaciones y pruebas con listas pequeñas antes de lanzar campañas masivas.</span>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </>
  );
}