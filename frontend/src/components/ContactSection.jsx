import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ContactForm from './ContactForm';

export function ContactSection() {
  return (
    <section id="contacto" className="bg-background min-h-[60vh] flex flex-col justify-center py-16 relative z-10 border-t border-border/40 w-full">
      <div className="w-full mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-bold tracking-tight lg:text-5xl text-foreground mb-6">
          Impulsá tu taller hoy
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
          Ponete en contacto con nosotros para conocer más sobre nuestros planes. Descubrí cómo RepairIT puede ayudarte a escalar tu taller.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="px-12 py-6 text-lg bg-brand hover:bg-brand-light text-white font-medium shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              Contactar a Ventas
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] sm:max-w-2xl bg-background border-border p-0 overflow-hidden rounded-xl">
            <ContactForm />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
