import React from 'react';
import { BGPattern } from './ui/bg-pattern';

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      {/* Background Pattern */}
      <BGPattern variant="grid" mask="fade-edges" fill="rgba(255, 255, 255, 0.05)" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
          Gestiona tu taller con <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light via-accent to-accent-dark">
            precisión absoluta
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-muted mb-10">
          Trazabilidad completa de reparaciones, control de inventario y comunicación profesional con tus clientes, todo en una sola plataforma.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-4 bg-accent hover:bg-accent-light text-white rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(96,165,250,0.5)]">
            Comenzar Ahora
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-surface hover:bg-surface-hover text-text-main rounded-lg font-medium transition-colors border border-surface-hover">
            Ver Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
