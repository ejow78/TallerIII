"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DialogClose } from "@/components/ui/dialog";

export default function RepairForm() {
  const [deviceType, setDeviceType] = useState("laptop");

  return (
    <div className="w-full max-h-[90vh] overflow-y-auto px-6 py-8 sm:px-10">
      <form className="w-full text-left" onSubmit={(e) => e.preventDefault()}>

        <div className="mb-6">
          <h3 className="text-2xl font-bold text-foreground">
            Registrar Nueva Reparación
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Completa los datos del cliente y los detalles técnicos del equipo para generar la orden de servicio.
          </p>
        </div>

        <Separator className="bg-border/50 mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Columna Izquierda: Información Personal */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-foreground">Información Personal</h4>
              <p className="text-sm text-muted-foreground">Datos de contacto del cliente.</p>
            </div>

            <div className="space-y-4 bg-surface/30 p-5 rounded-lg border border-border/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input id="firstName" placeholder="Ej. Juan" className="bg-background" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input id="lastName" placeholder="Ej. Pérez" className="bg-background" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input id="email" type="email" placeholder="juan@ejemplo.com" className="bg-background" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono / WhatsApp</Label>
                <Input id="phone" type="tel" placeholder="+54 9 11 1234-5678" className="bg-background" required />
              </div>
            </div>
          </div>

          {/* Columna Derecha: Detalles del Equipo */}
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-foreground">Detalles del Equipo</h4>
              <p className="text-sm text-muted-foreground">Especificaciones y fallo reportado.</p>
            </div>

            <div className="space-y-4 bg-surface/30 p-5 rounded-lg border border-border/50">
              <div className="space-y-2">
                <Label htmlFor="deviceType">Tipo de Equipo</Label>
                <Select value={deviceType} onValueChange={setDeviceType}>
                  <SelectTrigger id="deviceType" className="w-full bg-background">
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="laptop">Notebook</SelectItem>
                    <SelectItem value="pc">PC de Escritorio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {deviceType === "laptop" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Input id="brand" placeholder="Ej. Lenovo, HP..." className="bg-background" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo</Label>
                    <Input id="model" placeholder="Ej. ThinkPad T490" className="bg-background" required />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="specs">Componentes Principales</Label>
                  <Textarea
                    id="specs"
                    placeholder="Ej. Mother ASUS B450, Ryzen 5, 16GB RAM..."
                    className="bg-background min-h-[60px] resize-y"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="issue">Descripción del Fallo</Label>
                <Textarea
                  id="issue"
                  placeholder="Describinos detalladamente el problema..."
                  className="bg-background min-h-[80px] resize-y"
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña del equipo</Label>
                  <span className="text-xs text-muted-foreground">Opcional</span>
                </div>
                <Input id="password" type="text" placeholder="Pin o contraseña" className="bg-background" />
              </div>
            </div>
          </div>

        </div>

        <Separator className="bg-border/50 my-6" />

        {/* Acciones */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pb-2">
          <DialogClose asChild>
            <Button type="button" variant="ghost" className="w-full sm:w-auto">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" className="w-full sm:w-auto bg-brand hover:bg-brand-light text-white font-medium px-8">
            Registrar Reparación
          </Button>
        </div>

      </form>
    </div>
  );
}
