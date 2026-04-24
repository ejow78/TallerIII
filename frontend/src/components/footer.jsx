import React from 'react';
import { Link } from 'react-router-dom';

const links = [
    { title: 'Inicio', href: '#inicio' },
    { title: 'Características', href: '#caracteristicas' },
    { title: 'Contacto', href: '#contacto' },
];

export function FooterSection() {
    return (
        <footer className="py-12 border-t border-border/40 bg-background z-10 relative">
            <div className="mx-auto max-w-5xl px-6">
                <div className="flex items-center justify-center mb-8">
                    <span className="text-2xl font-bold tracking-tight text-foreground">
                        Repair<span className="text-brand">IT</span>
                    </span>
                </div>

                <div className="mt-8 mb-4 flex flex-wrap justify-center gap-6 text-sm">
                    {links.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            className="text-muted-foreground hover:text-foreground transition-colors duration-150">
                            {link.title}
                        </a>
                    ))}
                </div>

                <div className="mt-4 flex flex-col items-center gap-4">
                    <span className="text-muted-foreground block text-center text-sm">
                        © {new Date().getFullYear()} RepairIT. Todos los derechos reservados.
                    </span>
                    <div className="flex flex-wrap justify-center gap-6 text-xs text-text-muted/60">
                        <Link to="/terms" className="hover:text-foreground transition-colors">
                            Términos y Condiciones
                        </Link>
                        <Link to="/privacy" className="hover:text-foreground transition-colors">
                            Privacidad
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}