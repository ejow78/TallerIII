import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/grid-pattern";
import { User, Mail, MessageSquare, Send } from "lucide-react";
import { Link } from "react-router-dom";

export function LandingContactSection({
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
  onSubmit,
}) {
  return (
    <section id="contacto" className="py-24 px-6 bg-card/10 border-t border-border/50 relative overflow-hidden z-10 scroll-mt-16">
      {/* Fondo técnico GridPattern con desvanecimiento radial suave */}
      <GridPattern
        width={36}
        height={36}
        x={-1}
        y={-1}
        squares={[
          [2, 2],
          [5, 4],
          [9, 1],
          [12, 5],
          [16, 3],
          [20, 2],
        ]}
        className="stroke-white/[0.06] fill-white/[0.02] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,white,transparent_80%)] pointer-events-none"
      />

      <div className="max-w-2xl mx-auto space-y-10 relative z-10">
        <div className="text-center space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/75 block">
            Contacto Directo
          </span>
          <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
            ¿Tenés alguna consulta o necesitás un plan a medida?
          </h2>
          <p className="text-muted-foreground text-sm font-light leading-relaxed">
            Escribinos directamente y te responderemos a la brevedad para asesorarte.
          </p>
        </div>

        <Card className="bg-card/45 border-border/70 shadow-xl backdrop-blur-xs">
          <CardHeader className="space-y-1.5 pb-4">
            <CardTitle className="font-outfit text-xl font-bold text-foreground">
              Envianos tu mensaje
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground font-light">
              Completá tus datos y contanos sobre tu taller o la consulta que tengas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Campo Honeypot invisible para bots */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Nombre Completo */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-name"
                  className="text-xs font-semibold text-foreground/90 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-primary" />
                  Nombre Completo
                </label>
                <Input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="bg-background/85 border-border text-xs h-10 rounded-xl"
                />
              </div>

              {/* Correo Electrónico */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-email"
                  className="text-xs font-semibold text-foreground/90 flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  Correo Electrónico de Contacto
                </label>
                <Input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="Ej. juan@taller.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="bg-background/85 border-border text-xs h-10 rounded-xl"
                />
              </div>

              {/* Mensaje o Consulta */}
              <div className="space-y-2">
                <label
                  htmlFor="contact-message"
                  className="text-xs font-semibold text-foreground/90 flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                  Mensaje o Consulta
                </label>
                <Textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="Contanos qué tipo de taller tenés, cuántos técnicos son o qué duda te gustaría resolver..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="bg-background/85 border-border text-xs rounded-xl resize-none"
                />
              </div>

              {/* Aceptación de Términos y Privacidad */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="contact-terms"
                  required
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
                />
                <label
                  htmlFor="contact-terms"
                  className="text-xs text-muted-foreground font-light leading-snug cursor-pointer select-none"
                >
                  Acepto los{" "}
                  <Link
                    to="/terms"
                    className="text-primary hover:underline font-normal"
                    target="_blank"
                  >
                    Términos de Servicio
                  </Link>{" "}
                  y la{" "}
                  <Link
                    to="/privacy"
                    className="text-primary hover:underline font-normal"
                    target="_blank"
                  >
                    Política de Privacidad
                  </Link>{" "}
                  de RepairIT.
                </label>
              </div>

              {/* Botón de Envío */}
              <Button
                type="submit"
                disabled={isSendingContact}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 rounded-xl shadow-lg shadow-primary/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSendingContact ? (
                  <span>Enviando mensaje...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Enviar Consulta</span>
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
