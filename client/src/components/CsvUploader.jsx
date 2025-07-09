import { api } from "../api";
import axios from "axios";
import { useState } from "react";

export function CsvUploader() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("csv", file);

    try {
      const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/emails/upload-csv`, formData);
      alert("Correos cargados correctamente");
    } catch (error) {
      alert("Error al cargar el archivo CSV");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Subir CSV</h2>
      <input
        type="file"
        accept=".csv"
        // onChange={(e) => setFile(e.target.files[0])}
        onChange={handleUpload}
        className="my-2"
      />

      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
}
