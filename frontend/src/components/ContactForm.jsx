"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { DialogClose } from "@/components/ui/dialog";

export default function ContactForm() {
  return (
    <div className="w-full px-6 py-8 sm:px-10">
      <form className="w-full text-left" onSubmit={(e) => e.preventDefault()}>
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground">
            Contactar a Ventas
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Dejanos tus datos y nos pondremos en contacto para ofrecerte el plan ideal para tu taller de reparación.
          </p>
        </div>

        <Separator className="bg-border/50 mb-6" />

        <div className="space-y-4 bg-surface/30 p-5 rounded-lg border border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Nombre Completo</Label>
              <Input id="contactName" placeholder="Ej. Juan Pérez" className="bg-background" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workshopName">Nombre del Taller</Label>
              <Input id="workshopName" placeholder="Ej. PC Fixers" className="bg-background" required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Correo Electrónico</Label>
              <Input id="contactEmail" type="email" placeholder="taller@ejemplo.com" className="bg-background" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Teléfono / WhatsApp</Label>
              <Input id="contactPhone" type="tel" placeholder="+54 9 11 1234-5678" className="bg-background" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactMessage">¿En qué podemos ayudarte?</Label>
            <Textarea 
              id="contactMessage" 
              placeholder="Contanos sobre tu taller, volumen de reparaciones o consultas sobre nuestros planes..." 
              className="bg-background min-h-[100px] resize-y" 
              required
            />
          </div>
        </div>

        <Separator className="bg-border/50 my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pb-2">
          <DialogClose asChild>
            <Button type="button" variant="ghost" className="w-full sm:w-auto">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" className="w-full sm:w-auto bg-brand hover:bg-brand-light text-white font-medium px-8">
            Enviar Mensaje
          </Button>
        </div>
      </form>
    </div>
  );
}
