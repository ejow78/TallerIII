import React from 'react';
import { BGPattern } from './ui/bg-pattern';
import RepairForm from './form-layout';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="inicio" className="relative overflow-hidden min-h-screen flex flex-col justify-center pt-16">
      {/* Patron de fondo del hero */}
      <BGPattern variant="grid" mask="fade-edges" fill="rgba(255, 255, 255, 0.05)" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
          Gestiona tu taller con <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light via-brand to-brand-dark">
            precisión absoluta
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-muted mb-10">
          Trazabilidad completa de reparaciones, control de inventario y comunicación profesional con tus clientes, todo en una sola plataforma.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full sm:w-auto px-8 bg-brand hover:bg-brand-light text-white font-medium">
                Comenzar Ahora
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:max-w-4xl lg:max-w-6xl bg-background border-border p-0 overflow-hidden rounded-xl">
              <RepairForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default Hero;
