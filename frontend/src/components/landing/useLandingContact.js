import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useLandingContact() {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const handleContactSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (honeypot.trim()) {
        toast.success("¡Mensaje enviado con éxito!", {
          description: "Gracias por contactarte.",
        });
        setContactName("");
        setContactEmail("");
        setContactMessage("");
        return;
      }

      if (!acceptTerms) {
        toast.error("Debe aceptar los términos de privacidad.");
        return;
      }
      if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
        toast.error("Por favor complete todos los campos.");
        return;
      }

      setIsSendingContact(true);
      try {
        const { sendContactEmail } = await import("@/services/emailService");
        const res = await sendContactEmail({
          name: contactName.trim(),
          email: contactEmail.trim(),
          message: contactMessage.trim(),
        });

        if (res?.ok) {
          toast.success("¡Mensaje enviado con éxito!", {
            description: `Gracias por contactarte, ${contactName}. Te responderemos a la brevedad.`,
          });
          setContactName("");
          setContactEmail("");
          setContactMessage("");
          setAcceptTerms(false);
        } else {
          toast.error(
            res?.error ||
              "No se pudo enviar el mensaje. Podés escribirnos directo a contacto@repairit.cloud"
          );
        }
      } catch (err) {
        console.error("[useLandingContact] Error:", err);
        toast.error("Error al enviar el mensaje.");
      } finally {
        setIsSendingContact(false);
      }
    },
    [contactName, contactEmail, contactMessage, acceptTerms, honeypot]
  );

  return {
    contactName,
    setContactName,
    contactEmail,
    setContactEmail,
    contactMessage,
    setContactMessage,
    acceptTerms,
    setAcceptTerms,
    isSendingContact,
    honeypot,
    setHoneypot,
    handleContactSubmit,
  };
}
