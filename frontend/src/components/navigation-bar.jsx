"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

export function NavigationBar({ isSimple = false }) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className={`container mx-auto h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8 ${isSimple ? 'flex justify-center' : 'grid grid-cols-3'}`}>

        {/* Logo */}
        <div className={`flex items-center ${isSimple ? '' : 'justify-self-start'}`}>
          <Link to="/" className="text-xl font-bold tracking-tight text-foreground">
            Repair<span className="text-brand">IT</span>
          </Link>
        </div>

        {!isSimple && (
          <>
            {/* Enlaces centrales (Escritorio únicamente) */}
            <div className="hidden md:flex justify-self-center">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <a href="/#inicio" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-muted-foreground hover:text-foreground")}>
                        Inicio
                      </a>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <a href="/#caracteristicas" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-muted-foreground hover:text-foreground")}>
                        Características
                      </a>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <a href="/#contacto" className={cn(navigationMenuTriggerStyle(), "bg-transparent text-muted-foreground hover:text-foreground")}>
                        Contacto
                      </a>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-4 justify-self-end">
              <Button variant="ghost" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
                Iniciar Sesión
              </Button>
            </div>
          </>
        )}

      </div>
    </header>
  );
}
