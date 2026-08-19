import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Store,
  Save,
  CheckCircle,
  Plus,
  Edit,
  X,
  RefreshCw,
} from "lucide-react";
import { api } from "@/services/api";

export default function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("repairit_user") || "{}");
  const [venueName, setVenueName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [venues, setVenues] = useState([]);

  const [showPlansModal, setShowPlansModal] = useState(false);

  // Estados de Modal de Sucursal
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" o "edit"
  const [editingVenueId, setEditingVenueId] = useState(null);
  const [modalName, setModalName] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalPhone, setModalPhone] = useState("");
  const [modalAddress, setModalAddress] = useState("");

  const fetchProfile = async () => {
    try {
      const data = await api.auth.getProfile();
      setVenueName(data.name || "");
      setAddress(data.address || "");
      setPhone(data.phone || "");
      setEmail(data.email || "");

      // Cargar todas las sucursales de la organización
      const venuesData = await api.auth.getVenues();
      setVenues(venuesData);
    } catch (error) {
      toast.error("Error al cargar perfil del taller", {
        description: error.message || "Por favor, intente nuevamente."
      });
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.auth.updateProfile({ name: venueName, address, phone, email });
      toast.success("¡Configuración del Taller Guardada!", {
        description: `Los datos de la sucursal "${venueName}" han sido actualizados con éxito.`,
      });
      fetchProfile();
    } catch (error) {
      toast.error("Error al guardar configuración", {
        description: error.message || "No se pudieron guardar los cambios."
      });
    }
  };

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setEditingVenueId(null);
    setModalName("");
    setModalEmail("");
    setModalPhone("");
    setModalAddress("");
    setShowModal(true);
  };

  const handleOpenEditModal = (venue) => {
    setModalMode("edit");
    setEditingVenueId(venue._id);
    setModalName(venue.name || "");
    setModalEmail(venue.email || "");
    setModalPhone(venue.phone || "");
    setModalAddress(venue.address || "");
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        await api.auth.createVenue({
          name: modalName,
          email: modalEmail,
          phone: modalPhone,
          address: modalAddress,
        });
        toast.success("Nueva sucursal creada con éxito");
      } else {
        await api.auth.updateVenue(editingVenueId, {
          name: modalName,
          email: modalEmail,
          phone: modalPhone,
          address: modalAddress,
        });
        toast.success("Datos de sucursal actualizados con éxito");
      }
      setShowModal(false);
      fetchProfile();
    } catch (err) {
      toast.error("Error al procesar la sucursal", { description: err.message });
    }
  };

  const handleSwitchActiveVenue = async (venueId) => {
    try {
      const updatedUser = await api.auth.switchVenue(venueId);
      
      // Actualizar sesión guardada
      const localUser = JSON.parse(localStorage.getItem("repairit_user") || "{}");
      localStorage.setItem("repairit_user", JSON.stringify({ ...localUser, venueId: updatedUser.venueId }));
      
      toast.success("Sucursal activa cambiada", {
        description: "El panel de control se actualizará con el contexto de la nueva sucursal."
      });

      // Forzar reload suave para recargar sidebar, órdenes e inventario
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (err) {
      toast.error("Error al cambiar de sucursal", { description: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera interna */}
      <div className="space-y-1">
        <h1 className="font-outfit text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
          <Store className="w-7 h-7 text-primary shrink-0" />
          <span>Perfil de Taller</span>
        </h1>
        <p className="text-xs text-muted-foreground font-light">
          Gestión del perfil del local y estado de la suscripción de la sucursal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Columna Izquierda (2/3): Datos principales del taller */}
        <div className="lg:col-span-2 space-y-6">

          {/* Card 1: Datos de la Sucursal Activa */}
          <Card className="bg-card/40 border-border p-6 shadow-xl backdrop-blur-sm">
            <CardHeader className="p-0 pb-5 border-b border-border/50">
              <CardTitle className="font-outfit text-base font-bold text-foreground flex items-center gap-2 border-0 pb-0">
                Datos del Establecimiento Activo
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Información de contacto que se mostrará en los recibos y el seguimiento del cliente.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 pt-6">
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="venue-name" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Nombre del Taller</Label>
                    <Input
                      id="venue-name"
                      type="text"
                      required
                      value={venueName}
                      onChange={(e) => setVenueName(e.target.value)}
                      placeholder="RepairIT Tucumán Centro"
                      className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="venue-email" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Email de Contacto</Label>
                    <Input
                      id="venue-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tucuman@repairit.cloud"
                      className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="venue-phone" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Teléfono Comercial</Label>
                    <Input
                      id="venue-phone"
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+54 381 4223344"
                      className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="venue-address" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Dirección Física</Label>
                    <Input
                      id="venue-address"
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="San Martín 650, San Miguel de Tucumán"
                      className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 px-6 rounded-md transition-all cursor-pointer flex items-center gap-2 select-none"
                  >
                    <Save className="w-4 h-4" />
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Card de Sucursales de la Organización */}
          <Card className="bg-card/30 border-border p-6 shadow-xl backdrop-blur-sm space-y-4">
            <div className="border-b border-border/50 pb-3 flex items-center justify-between">
              <div>
                <CardTitle className="font-outfit text-base font-bold text-foreground">
                  Sucursales de la Organización
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground mt-1">
                  Gestioná o alterná las sedes de servicio de tu negocio.
                </CardDescription>
              </div>
              {user.subscriptionPlan === "Multi-Taller Pro" && (
                <Button
                  onClick={handleOpenCreateModal}
                  className="bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary text-[10px] font-extrabold uppercase py-1.5 px-3 rounded flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Agregar Sucursal
                </Button>
              )}
            </div>
            <CardContent className="p-0">
              {user.subscriptionPlan !== "Multi-Taller Pro" ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center space-y-3 bg-muted/5 rounded-lg border border-dashed border-border/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Store className="w-5 h-5" />
                  </div>
                  <div className="space-y-2 flex flex-col items-center">
                    <h4 className="font-outfit text-sm font-bold text-foreground">Gestión de Sucursales Limitada</h4>
                    <p className="text-xs text-muted-foreground max-w-sm font-light leading-relaxed mb-1">
                      Mejore su plan al nivel <span className="text-primary font-semibold">Multi-Taller Pro</span> para poder gestionar y cambiar entre múltiples sedes de su negocio.
                    </p>
                    <Button
                      onClick={() => setShowPlansModal(true)}
                      size="sm"
                      className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/25 font-bold text-[10px] uppercase py-1.5 px-4 rounded-md cursor-pointer transition-all shrink-0 mt-1"
                    >
                      Ver Planes Disponibles
                    </Button>
                  </div>
                </div>
              ) : venues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {venues.map((v) => {
                    const isActive = v.name === venueName;
                    return (
                      <div
                        key={v._id}
                        className={`p-4 rounded-lg border text-xs space-y-2 flex flex-col justify-between ${
                          isActive
                            ? "bg-primary/5 border-primary/45 shadow-sm"
                            : "bg-card/20 border-border/50"
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-foreground truncate text-sm">{v.name}</span>
                            {isActive && (
                              <Badge className="bg-primary/15 text-primary border border-primary/30 text-[8px] font-bold uppercase py-0.5 px-1 shrink-0">
                                Activa
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground font-light leading-tight">{v.address}</p>
                          <p className="text-muted-foreground font-mono text-[10px]">Tel: {v.phone}</p>
                          <p className="text-muted-foreground font-mono text-[10px] truncate">{v.email}</p>
                        </div>

                        <div className="flex items-center justify-between border-t border-border/25 pt-2.5 mt-1 gap-2">
                          <Button
                            onClick={() => handleOpenEditModal(v)}
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs font-medium text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-2 hover:bg-muted/50 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Editar
                          </Button>

                          {!isActive && (
                            <Button
                              onClick={() => handleSwitchActiveVenue(v._id)}
                              variant="outline"
                              size="sm"
                              className="h-7 text-[10px] font-bold uppercase border-border/60 hover:bg-primary hover:text-primary-foreground hover:border-primary flex items-center gap-1 px-2.5 cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Activar
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-muted-foreground font-light">
                  No hay sucursales adicionales registradas.
                </div>
              )}
            </CardContent>
          </Card>

        </div>

        {/* Columna Derecha (1/3): Suscripción */}
        <div className="space-y-6">

          {/* Card 2: Suscripción */}
          <Card className="bg-card/25 border-border p-6 shadow-sm space-y-4">
            <h3 className="font-outfit text-base font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
              Suscripción
            </h3>

            <div className="space-y-3.5 text-xs font-light">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Plan Licenciado</span>
                <Badge className="bg-primary hover:bg-primary text-primary-foreground text-[10px] font-extrabold uppercase">
                  {user.subscriptionPlan || "Sin Plan"}
                </Badge>
              </div>
              <div className="flex items-center justify-between border-t border-border/30 pt-2.5">
                <span className="text-muted-foreground">Vencimiento</span>
                <span className="text-foreground font-mono font-medium">31/12/2026</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/30 pt-2.5">
                <span className="text-muted-foreground">Estado del Pago</span>
                <span className={user.subscriptionStatus === "activo" ? "text-emerald-400 font-bold flex items-center gap-1.5" : "text-destructive font-bold flex items-center gap-1.5"}>
                  <CheckCircle className={user.subscriptionStatus === "activo" ? "w-3.5 h-3.5 fill-emerald-400/10" : "w-3.5 h-3.5 fill-destructive/10"} />
                  {user.subscriptionStatus === "activo" ? "Al Día" : "Inactivo"}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/30">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPlansModal(true)}
                className="w-full text-[10px] font-bold uppercase border-border/80 hover:bg-card/50 transition-all cursor-pointer"
              >
                Ver / Cambiar Plan
              </Button>
            </div>
          </Card>

        </div>

      </div>

      {/* MODAL DE SUCURSAL (Creación / Edición) */}
      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h3 className="font-outfit text-base font-bold text-foreground">
                {modalMode === "create" ? "Registrar Nueva Sucursal" : "Editar Detalles de Sucursal"}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowModal(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="modal-name" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Nombre del Taller / Sucursal</Label>
                <Input
                  id="modal-name"
                  type="text"
                  required
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  placeholder="Ej. RepairIT - Yerba Buena"
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="modal-address" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Dirección Física</Label>
                <Input
                  id="modal-address"
                  type="text"
                  required
                  value={modalAddress}
                  onChange={(e) => setModalAddress(e.target.value)}
                  placeholder="Ej. Av. Aconquija 1300, Yerba Buena"
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="modal-phone" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Teléfono de Contacto</Label>
                  <Input
                    id="modal-phone"
                    type="text"
                    required
                    value={modalPhone}
                    onChange={(e) => setModalPhone(e.target.value)}
                    placeholder="Ej. +54 381 4889900"
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="modal-email" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Email Comercial</Label>
                  <Input
                    id="modal-email"
                    type="email"
                    required
                    value={modalEmail}
                    onChange={(e) => setModalEmail(e.target.value)}
                    placeholder="Ej. yerbabuena@repairit.cloud"
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-border/40">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="text-xs border-border/80 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 px-5 rounded-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {modalMode === "create" ? "Crear Sucursal" : "Guardar Cambios"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE PLANES (Comparador de Precios) */}
      {showPlansModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-4xl w-full p-6 space-y-6 animate-in fade-in-50 zoom-in-95 duration-150 relative">
            <Button
              onClick={() => setShowPlansModal(false)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer rounded-full h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="text-center space-y-1.5">
              <h3 className="font-outfit text-xl font-bold text-foreground">
                Planes de Suscripción RepairIT
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto font-light">
                Elija el plan que mejor se adapte al tamaño y necesidades de su taller de reparación técnica.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              
              {/* Plan Básico */}
              <div className={`border rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all ${
                user.subscriptionPlan === "Sin Plan" || user.subscriptionPlan === "Taller Básico"
                  ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                  : "border-border/60 bg-card/25"
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Taller Básico</span>
                    {(user.subscriptionPlan === "Sin Plan" || user.subscriptionPlan === "Taller Básico") && (
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/20 text-[8px] font-bold uppercase border border-primary/30">Activo</Badge>
                    )}
                  </div>
                  <div>
                    <span className="font-outfit text-2xl font-black text-foreground">Gratis</span>
                    <span className="text-[10px] text-muted-foreground font-light"> / para siempre</span>
                  </div>
                  <ul className="text-[11px] text-muted-foreground font-light space-y-2 border-t border-border/40 pt-3">
                    <li className="flex items-center gap-2">✓ 1 Sucursal física</li>
                    <li className="flex items-center gap-2">✓ Hasta 100 órdenes / mes</li>
                    <li className="flex items-center gap-2">✓ Inventario y stock básico</li>
                    <li className="flex items-center gap-2">✓ Consulta de tracking pública</li>
                  </ul>
                </div>
              </div>

              {/* Plan Premium */}
              <div className={`border rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all relative overflow-hidden ${
                user.subscriptionPlan === "Taller Premium"
                  ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                  : "border-border/60 bg-card/25"
              }`}>
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[8px] font-black uppercase py-0.5 px-3 rounded-bl-lg tracking-wider">Popular</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Taller Premium</span>
                    {user.subscriptionPlan === "Taller Premium" && (
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/20 text-[8px] font-bold uppercase border border-primary/30">Activo</Badge>
                    )}
                  </div>
                  <div>
                    <span className="font-outfit text-2xl font-black text-foreground">$19</span>
                    <span className="text-[10px] text-muted-foreground font-light"> / mes</span>
                  </div>
                  <ul className="text-[11px] text-muted-foreground font-light space-y-2 border-t border-border/40 pt-3">
                    <li className="flex items-center gap-2 text-foreground font-medium">✓ 1 Sucursal física</li>
                    <li className="flex items-center gap-2">✓ Órdenes y equipos ilimitados</li>
                    <li className="flex items-center gap-2">✓ Inventario con alertas críticas</li>
                    <li className="flex items-center gap-2">✓ Dashboard métricas avanzado</li>
                    <li className="flex items-center gap-2">✓ Soporte prioritario 24/7</li>
                  </ul>
                </div>
              </div>

              {/* Plan Multi-Taller Pro */}
              <div className={`border rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all ${
                user.subscriptionPlan === "Multi-Taller Pro"
                  ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                  : "border-border/60 bg-card/25"
              }`}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Multi-Taller Pro</span>
                    {user.subscriptionPlan === "Multi-Taller Pro" && (
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/20 text-[8px] font-bold uppercase border border-primary/30">Activo</Badge>
                    )}
                  </div>
                  <div>
                    <span className="font-outfit text-2xl font-black text-foreground">$39</span>
                    <span className="text-[10px] text-muted-foreground font-light"> / mes</span>
                  </div>
                  <ul className="text-[11px] text-muted-foreground font-light space-y-2 border-t border-border/40 pt-3">
                    <li className="flex items-center gap-2 text-primary font-bold">✓ Hasta 5 Sucursales</li>
                    <li className="flex items-center gap-2">✓ Selector rápido en barra superior</li>
                    <li className="flex items-center gap-2">✓ 4 cuentas Técnicos + 1 Admin</li>
                    <li className="flex items-center gap-2">✓ Órdenes e Inventario ilimitados</li>
                    <li className="flex items-center gap-2">✓ Reportes centralizados multisede</li>
                  </ul>
                </div>
              </div>

            </div>

            <div className="text-center pt-2 border-t border-border/40">
              <Button
                onClick={() => {
                  setShowPlansModal(false);
                  toast.info("Contacto con Soporte", {
                    description: "Para cambiar su suscripción de taller, por favor comuníquese a soporte@repairit.cloud o con su asesor comercial."
                  });
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 px-6 rounded-lg cursor-pointer transition-all shadow-md shadow-primary/15"
              >
                Solicitar Cambio de Plan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
