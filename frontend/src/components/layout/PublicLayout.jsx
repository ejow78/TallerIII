import { Link, Outlet } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 selection:text-primary relative">

      {/* Navbar con Efecto de Desenfoque y Vidrio (Glassmorphism) */}
      <header className="sticky top-0 z-50 bg-card/60 backdrop-blur-md border-b border-border/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo del Proyecto (RepairIT) */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-outfit text-2xl font-black tracking-tight text-foreground">
              Repair<span className="text-primary">IT</span>
            </span>
          </Link>

          {/* Menú de Navegación de la Landing - Optimizado para Móviles */}
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/"
              className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Inicio
            </Link>
            <a
              href="#caracteristicas"
              className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Servicios
            </a>
            <a
              href="#precios"
              className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Precios
            </a>
            <a
              href="#faq"
              className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Preguntas
            </a>
            <a
              href="#contacto"
              className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Contacto
            </a>
            <Separator orientation="vertical" className="hidden md:block h-4 !self-center" />
            <Button asChild variant="outline" size="sm" className="text-primary border-primary/20 hover:border-primary/40 bg-primary/10 hover:bg-primary/20 font-bold transition-all duration-200">
              <Link to="/login">Panel Técnico</Link>
            </Button>
          </nav>

        </div>
      </header>

      {/* Contenedor Principal (Hijo) con Efectos de Fondo Encapsulados */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Efectos de Fondo Decorativos */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <Outlet />
      </main>

      {/* Footer Tecnológico - Optimizado para Móviles */}
      <footer className="bg-card/40 border-t border-border py-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-outfit text-xl font-black tracking-tight text-foreground">
              Repair<span className="text-primary">IT</span>
            </span>
            <p className="text-xs text-muted-foreground mt-1">
              Sistema de Trazabilidad para Talleres de Servicio Técnico.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs text-muted-foreground font-medium w-full md:w-auto">
            <div className="flex items-center gap-6">
              <Link to="/privacidad" className="hover:text-foreground transition-colors">Privacidad</Link>
              <Link to="/terminos" className="hover:text-foreground transition-colors">Términos</Link>
            </div>
            <Separator orientation="vertical" className="hidden sm:block h-4" />
            <p className="text-muted-foreground/85 text-center sm:text-left">&copy; 2026 RepairIT. Edgar Javier Ortiz.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
