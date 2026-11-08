import { Link, Outlet, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function PublicLayout() {
  const location = useLocation();
  const isAuthPage = [
    "/login", 
    "/register", 
    "/registro", 
    "/recuperar-password", 
    "/olvide-password", 
    "/reset-password"
  ].some((path) => location.pathname.startsWith(path));

  const handleNavClick = (targetUrl) => (e) => {
    e.preventDefault();
    if (window.location.hostname.includes("repairit.cloud")) {
      window.location.href = targetUrl;
    } else {
      const relativePath = targetUrl.replace("https://repairit.cloud", "");
      window.location.href = relativePath || "/";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 selection:text-primary relative">

      {/* Enlace accesible para saltar navegación repetida (WCAG 2.4.1) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:font-bold focus:outline-none"
      >
        Saltar al contenido principal
      </a>

      {/* Navbar con Efecto de Desenfoque y Vidrio (Glassmorphism) */}
      <header className="sticky top-0 z-50 bg-card/75 backdrop-blur-xl border-b border-border/70 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo del Proyecto (RepairIT) */}
          <a
            href={window.location.hostname.includes("repairit.cloud") ? "https://repairit.cloud" : "/"}
            onClick={handleNavClick("https://repairit.cloud")}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="font-outfit text-2xl font-black tracking-tight text-foreground">
              Repair<span className="text-primary">IT</span>
            </span>
          </a>

          {/* Menú de Navegación de la Landing */}
          {!isAuthPage ? (
            <nav className="flex items-center gap-3 sm:gap-6">
              <a
                href={window.location.hostname.includes("repairit.cloud") ? "https://repairit.cloud" : "/"}
                onClick={handleNavClick("https://repairit.cloud")}
                className="hidden lg:block text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                Inicio
              </a>
              <a
                href={window.location.hostname.includes("repairit.cloud") ? "https://repairit.cloud/#caracteristicas" : "/#caracteristicas"}
                onClick={handleNavClick("https://repairit.cloud/#caracteristicas")}
                className="hidden md:block text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                Funcionalidades
              </a>
              <a
                href={window.location.hostname.includes("repairit.cloud") ? "https://repairit.cloud/#precios" : "/#precios"}
                onClick={handleNavClick("https://repairit.cloud/#precios")}
                className="hidden md:block text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                Precios
              </a>
              <a
                href={window.location.hostname.includes("repairit.cloud") ? "https://repairit.cloud/#faq" : "/#faq"}
                onClick={handleNavClick("https://repairit.cloud/#faq")}
                className="hidden md:block text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                FAQ
              </a>
              <a
                href={window.location.hostname.includes("repairit.cloud") ? "https://repairit.cloud/#contacto" : "/#contacto"}
                onClick={handleNavClick("https://repairit.cloud/#contacto")}
                className="hidden lg:block text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                Contacto
              </a>

              {/* Botón rápido para que los clientes consulten el estado de su equipo */}
              <Button
                asChild
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium border-border/80 bg-background/60 hover:bg-background/90 text-foreground h-9 px-3 rounded-lg"
              >
                <a href={window.location.hostname.includes("repairit.cloud") ? "https://tracking.repairit.cloud/consulta" : "/consulta"}>
                  <Search className="w-3.5 h-3.5 text-primary" />
                  <span>Seguimiento</span>
                </a>
              </Button>

              {/* Botón de acceso para talleres */}
              <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 h-9 rounded-lg shadow-sm shadow-primary/20 text-xs sm:text-sm transition-all duration-200">
                <a href={window.location.hostname.includes("repairit.cloud") ? "https://app.repairit.cloud/login" : "/login"}>
                  Ingresar
                </a>
              </Button>
            </nav>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5 rounded-lg"
              >
                <a href={window.location.hostname.includes("repairit.cloud") ? "https://repairit.cloud" : "/"}>
                  Volver al inicio
                </a>
              </Button>
            </div>
          )}

        </div>
      </header>

      {/* Contenedor Principal (Hijo) con Efectos de Fondo Encapsulados */}
      <main id="main-content" tabIndex="-1" className="flex-1 flex flex-col relative z-10 overflow-hidden outline-none">
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
              <a
                href={window.location.hostname.includes("repairit.cloud") ? "https://repairit.cloud/privacidad" : "/privacidad"}
                onClick={handleNavClick("https://repairit.cloud/privacidad")}
                className="hover:text-foreground transition-colors"
              >
                Privacidad
              </a>
              <a
                href={window.location.hostname.includes("repairit.cloud") ? "https://repairit.cloud/terminos" : "/terminos"}
                onClick={handleNavClick("https://repairit.cloud/terminos")}
                className="hover:text-foreground transition-colors"
              >
                Términos
              </a>
            </div>
            <Separator orientation="vertical" className="hidden sm:block h-4" />
            <p className="text-muted-foreground/85 text-center sm:text-left">&copy; 2026 RepairIT. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
