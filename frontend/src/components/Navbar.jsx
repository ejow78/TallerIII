import React from 'react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-surface-hover">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <span className="text-white font-bold text-xl leading-none">H</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-text-main">
              HardFix
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-text-main font-medium hover:text-accent transition-colors">Inicio</a>
              <a href="#" className="text-text-muted hover:text-text-main transition-colors">Características</a>
              <a href="#" className="text-text-muted hover:text-text-main transition-colors">Precios</a>
              <a href="#" className="text-text-muted hover:text-text-main transition-colors">Testimonios</a>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-text-muted hover:text-text-main font-medium transition-colors">
              Iniciar Sesión
            </button>
            <button className="px-4 py-2 bg-accent hover:bg-accent-light text-white rounded-md font-medium transition-all shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(96,165,250,0.5)]">
              Probar Gratis
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="text-text-muted hover:text-text-main focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
