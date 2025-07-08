
// Este componente permite al usuario subir un archivo CSV con correos electrónicos.
// Utiliza el hook useState para manejar el estado del archivo y los mensajes.
import { useState } from "react";
import { api } from "../api";

export function CampaignSender({ templateName }) {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!templateName) return alert("Debes seleccionar una plantilla primero");

    try {
      const res = await api.post("/emails/send-campaign", { templateName });
      setMessage(res.data.message);
      alert(res.data.message || "Campaña procesada");
    } catch (err) {
      console.error(err);
      setMessage("Error al enviar campaña");
    }
  };

  return (
    <div className="p-4 ">
      <button
        onClick={handleSend}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Enviar campaña
      </button>
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
}

// Este componente permite al usuario enviar una campaña de correo electrónico utilizando una plantilla seleccionada.
// Utiliza el hook useState para manejar el estado del mensaje de respuesta del servidor.