import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShieldCheck,
  Building2,
  CreditCard,
  ChevronDown,
  Search,
  Users,
  Store,
  Ban,
  RefreshCw,
  X,
  Save,
  MapPin,
  Phone,
  Mail,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { api, normalizePlan } from "@/services/api";
import { toast } from "sonner";

export default function SuperAdminDashboard() {
  const [organizations, setOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [planFilter, setPlanFilter] = useState("todos");
  const [viewingOrg, setViewingOrg] = useState(null);
  const [editingOrg, setEditingOrg] = useState(null);
  const [editOrgName, setEditOrgName] = useState("");
  const [editOrgPlan, setEditOrgPlan] = useState("Taller Básico");
  const [editOrgStatus, setEditOrgStatus] = useState("activo");
  const [editingVenue, setEditingVenue] = useState(null);
  const [submittingSuper, setSubmittingSuper] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSuperData = async () => {
    try {
      setLoading(true);
      const orgsData = await api.super.getOrganizations();
      setOrganizations(orgsData);
    } catch (err) {
      toast.error("Error al cargar organizaciones de la plataforma", {
        description: err.message || "Por favor, intente de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!isMounted) return;
      await loadSuperData();
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handlePlanChange = async (orgId, newPlan) => {
    try {
      await api.super.updateSubscription(orgId, newPlan, null);
      toast.success("Plan de suscripción actualizado", {
        description: `Se asignó el plan ${newPlan}.`,
      });
      loadSuperData();
    } catch (err) {
      toast.error("Error al cambiar plan", { description: err.message });
    }
  };

  const handleStatusChange = async (orgId, newStatus) => {
    try {
      await api.super.updateSubscription(orgId, null, newStatus);
      toast.success("Estado de suscripción actualizado", {
        description: `Nuevo estado: ${newStatus.toUpperCase()}.`,
      });
      loadSuperData();
    } catch (err) {
      toast.error("Error al cambiar estado", { description: err.message });
    }
  };

  const handleOpenEditOrg = (org) => {
    setEditingOrg(org);
    setEditOrgName(org.name || "");
    setEditOrgPlan(normalizePlan(org.subscriptionPlan));
    setEditOrgStatus(org.subscriptionStatus || "activo");
  };

  const handleSaveEditOrg = async (e) => {
    e.preventDefault();
    if (!editingOrg) return;
    try {
      setSubmittingSuper(true);
      await api.super.updateSubscription(
        editingOrg._id,
        editOrgPlan,
        editOrgStatus,
        editOrgName
      );
      toast.success("Taller actualizado con éxito");
      setEditingOrg(null);
      loadSuperData();
    } catch (err) {
      toast.error("Error al guardar taller", { description: err.message });
    } finally {
      setSubmittingSuper(false);
    }
  };

  const handleDeleteOrg = async (org) => {
    if (
      !window.confirm(
        `¿Estás seguro de eliminar el taller "${org.name}" y todos sus registros asociados? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }
    try {
      await api.super.deleteOrganization(org._id);
      toast.success("Taller eliminado", {
        description: `"${org.name}" fue eliminado de la plataforma.`,
      });
      if (viewingOrg?._id === org._id) setViewingOrg(null);
      if (editingOrg?._id === org._id) setEditingOrg(null);
      loadSuperData();
    } catch (err) {
      toast.error("Error al eliminar taller", { description: err.message });
    }
  };

  const handleSaveVenueAsSuper = async (e) => {
    e.preventDefault();
    if (!editingVenue) return;
    try {
      setSubmittingSuper(true);
      await api.super.updateVenueAsSuper(editingVenue.id, {
        name: editingVenue.name,
        address: editingVenue.address,
        phone: editingVenue.phone,
        email: editingVenue.email,
      });
      toast.success("Sucursal actualizada correctamente");
      setEditingVenue(null);
      const updatedOrgs = await api.super.getOrganizations();
      setOrganizations(updatedOrgs);
      if (viewingOrg) {
        const refreshed = updatedOrgs.find((o) => o._id === viewingOrg._id);
        if (refreshed) setViewingOrg(refreshed);
      }
    } catch (err) {
      toast.error("Error al actualizar sucursal", { description: err.message });
    } finally {
      setSubmittingSuper(false);
    }
  };

  const filteredOrgs = organizations.filter((o) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesName = o.name?.toLowerCase().includes(q);
    const matchesVenue = (o.venues || []).some(
      (v) =>
        v.name?.toLowerCase().includes(q) ||
        v.address?.toLowerCase().includes(q) ||
        v.email?.toLowerCase().includes(q)
    );
    const matchesSearch = !q || matchesName || matchesVenue;
    const matchesStatus =
      statusFilter === "todos" || o.subscriptionStatus === statusFilter;
    const matchesPlan =
      planFilter === "todos" ||
      normalizePlan(o.subscriptionPlan) === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const totalOrgs = organizations.length;
  const activeOrgs = organizations.filter(
    (o) => o.subscriptionStatus === "activo"
  ).length;
  const suspendedOrgs = organizations.filter(
    (o) => o.subscriptionStatus !== "activo"
  ).length;
  const totalVenues = organizations.reduce(
    (acc, o) => acc + (o.venuesCount || 0),
    0
  );

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Cabecera Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-outfit text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-primary shrink-0" />
            <span>Plataforma de Suscripciones</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-light">
            Administración centralizada de talleres, licencias operativas, sucursales y planes de suscripción.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={loadSuperData}
            className="h-9 border-border/80 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Actualizar
          </Button>
          <Link to="/dashboard/usuarios">
            <Button className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm">
              <Users className="w-3.5 h-3.5" />
              Gestionar Usuarios
            </Button>
          </Link>
        </div>
      </div>

      {/* Tarjetas de Métricas de Plataforma */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <Card className="bg-card/45 border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 sm:px-6 pt-4 sm:pt-5">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Talleres Registrados
            </span>
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Building2 className="h-3.5 w-3.5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
            <span className="text-2xl sm:text-3xl font-outfit font-black text-foreground block">
              {totalOrgs}
            </span>
            <span className="text-xs text-muted-foreground block font-medium mt-1">
              {activeOrgs} activos • {suspendedOrgs} suspendidos
            </span>
          </CardContent>
        </Card>

        <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 sm:px-6 pt-4 sm:pt-5">
            <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              Licencias Activas
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
            <span className="text-2xl sm:text-3xl font-outfit font-black text-emerald-400 block">
              {activeOrgs}
            </span>
            <span className="text-xs text-muted-foreground block font-medium mt-1">
              Operando en la nube
            </span>
          </CardContent>
        </Card>

        <Card className="bg-destructive/5 border-destructive/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 sm:px-6 pt-4 sm:pt-5">
            <span className="text-[10px] sm:text-[11px] font-semibold text-destructive/90 uppercase tracking-wider">
              Licencias Bloqueadas
            </span>
            <div className="w-7 h-7 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center justify-center shrink-0">
              <Ban className="h-3.5 w-3.5 text-destructive" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
            <span className="text-2xl sm:text-3xl font-outfit font-black text-destructive block">
              {suspendedOrgs}
            </span>
            <span className="text-xs text-muted-foreground block font-medium mt-1">
              Suspendidas o vencidas
            </span>
          </CardContent>
        </Card>

        <Card className="bg-card/45 border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 sm:px-6 pt-4 sm:pt-5">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Sucursales Totales
            </span>
            <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Store className="h-3.5 w-3.5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
            <span className="text-2xl sm:text-3xl font-outfit font-black text-foreground block">
              {totalVenues}
            </span>
            <span className="text-xs text-muted-foreground block font-medium mt-1">
              Puntos físicos conectados
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Listado y Control de Talleres */}
      <Card className="bg-card/30 border-border/80 p-4 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 pb-4 gap-3">
          <div>
            <CardTitle className="font-outfit text-base sm:text-lg font-bold text-foreground flex items-center gap-2 border-0 pb-0">
              <CreditCard className="w-4.5 h-4.5 text-primary" />
              Directorio de Talleres, Planes y Licencias
            </CardTitle>
            <p className="text-xs text-muted-foreground font-light mt-0.5">
              Cambiá el plan o estado de cada taller en un clic, o inspeccioná sus sucursales y cuentas de acceso.
            </p>
          </div>
          <Badge
            variant="secondary"
            className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 self-start sm:self-auto"
          >
            Mostrando {filteredOrgs.length} de {organizations.length}
          </Badge>
        </div>

        {/* Barra de Búsqueda + Píldoras de Filtro */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative w-full lg:max-w-sm flex items-center">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar por nombre de taller, sucursal o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background/85 border-border text-xs w-full pl-10 h-10 rounded-xl"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filtro por Estado */}
            <div className="flex items-center gap-1 bg-background/60 p-1 rounded-xl border border-border/70">
              {[
                { id: "todos", label: "Todos" },
                { id: "activo", label: "Activos" },
                { id: "suspendido", label: "Suspendidos" },
                { id: "vencido", label: "Vencidos" },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStatusFilter(st.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    statusFilter === st.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Filtro por Plan */}
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="h-9 rounded-xl border border-border/70 bg-background/85 px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="todos">Todos los Planes</option>
              <option value="Taller Básico">Taller Básico</option>
              <option value="Taller Pro">Taller Pro</option>
              <option value="Multi-Taller Pro">Multi-Taller Pro</option>
            </select>
          </div>
        </div>

        {filteredOrgs.length > 0 ? (
          <>
            {/* Vista Mobile (< md): Tarjetas de Talleres */}
            <div className="space-y-3 md:hidden">
              {filteredOrgs.map((org) => {
                const normPlan = normalizePlan(org.subscriptionPlan);
                const isActive = org.subscriptionStatus === "activo";
                const mainVenue = (org.venues || [])[0];

                return (
                  <div
                    key={org._id}
                    className="p-4 rounded-2xl border border-border/70 bg-background/50 space-y-3 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-bold text-sm text-foreground block truncate">
                          {org.name}
                        </span>
                        {mainVenue?.email && (
                          <span className="text-[11px] text-muted-foreground font-mono block truncate">
                            {mainVenue.email}
                          </span>
                        )}
                      </div>
                      <Badge
                        variant={
                          isActive
                            ? "success"
                            : org.subscriptionStatus === "suspendido"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-[9px] uppercase font-bold px-2 py-0.5 shrink-0"
                      >
                        {org.subscriptionStatus || "activo"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-[11px] text-muted-foreground">
                      <span className="bg-muted/40 px-2 py-0.5 rounded-md border border-border/50 font-mono">
                        {org.venuesCount || 0} sucursales
                      </span>
                      <span className="bg-muted/40 px-2 py-0.5 rounded-md border border-border/50 font-mono">
                        {org.usersCount || 0} cuentas
                      </span>
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/25 font-bold">
                        {normPlan}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/40 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingOrg(org)}
                        className="h-8 text-xs font-semibold rounded-lg gap-1.5 cursor-pointer flex-1"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" />
                        Sedes y Cuentas
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEditOrg(org)}
                        className="h-8 text-xs font-semibold rounded-lg gap-1.5 cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteOrg(org)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vista Escritorio (>= md): Tabla Completa */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/15 text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-3.5 px-3">Taller / Organización</th>
                    <th className="py-3.5 px-3">Sucursales</th>
                    <th className="py-3.5 px-3">Cuentas</th>
                    <th className="py-3.5 px-3">Plan Contratado</th>
                    <th className="py-3.5 px-3">Estado Licencia</th>
                    <th className="py-3.5 px-3">Alta</th>
                    <th className="py-3.5 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredOrgs.map((org) => {
                    const normPlan = normalizePlan(org.subscriptionPlan);
                    const mainVenue = (org.venues || [])[0];
                    let statusBadge = "secondary";
                    let statusLabel = "Inactivo";
                    if (org.subscriptionStatus === "activo") {
                      statusBadge = "success";
                      statusLabel = "Activo";
                    } else if (org.subscriptionStatus === "suspendido") {
                      statusBadge = "destructive";
                      statusLabel = "Suspendido";
                    } else if (org.subscriptionStatus === "vencido") {
                      statusBadge = "outline";
                      statusLabel = "Vencido";
                    }

                    return (
                      <tr
                        key={org._id}
                        className="hover:bg-card/40 transition-colors"
                      >
                        <td className="py-3.5 px-3">
                          <div className="space-y-0.5">
                            <span className="font-bold text-foreground text-sm block">
                              {org.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground font-mono block">
                              {mainVenue?.email || mainVenue?.address || `ID: ${org._id.substring(0, 8)}`}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-3">
                          <button
                            type="button"
                            onClick={() => setViewingOrg(org)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/40 hover:bg-primary/15 hover:text-primary border border-border/60 font-mono text-xs transition-colors cursor-pointer"
                            title="Ver sucursales del taller"
                          >
                            <Store className="w-3.5 h-3.5 text-primary" />
                            <span>{org.venuesCount || 0}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-3">
                          <button
                            type="button"
                            onClick={() => setViewingOrg(org)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/40 hover:bg-primary/15 hover:text-primary border border-border/60 font-mono text-xs transition-colors cursor-pointer"
                            title="Ver cuentas de usuario del taller"
                          >
                            <Users className="w-3.5 h-3.5 text-sky-400" />
                            <span>{org.usersCount || 0}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className={`h-8 border px-2.5 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer ${
                                  normPlan === "Multi-Taller Pro"
                                    ? "border-primary/40 bg-primary/10 text-primary"
                                    : normPlan === "Taller Pro"
                                    ? "border-sky-500/40 bg-sky-500/10 text-sky-400"
                                    : "border-border/80 bg-background/60 text-foreground"
                                }`}
                              >
                                {normPlan}
                                <ChevronDown className="w-3 h-3 opacity-70" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-card border-border text-foreground">
                              <DropdownMenuItem
                                onClick={() =>
                                  handlePlanChange(org._id, "Taller Básico")
                                }
                                className="text-xs transition-colors cursor-pointer font-medium"
                              >
                                Taller Básico
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handlePlanChange(org._id, "Taller Pro")
                                }
                                className="text-xs transition-colors cursor-pointer font-semibold text-sky-400"
                              >
                                Taller Pro
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handlePlanChange(org._id, "Multi-Taller Pro")
                                }
                                className="text-xs transition-colors cursor-pointer font-bold text-primary"
                              >
                                Multi-Taller Pro
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        <td className="py-3.5 px-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 border border-border/70 px-2.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                              >
                                <Badge
                                  variant={statusBadge}
                                  className="text-[9px] uppercase font-bold px-1.5 py-0.5 border"
                                >
                                  {statusLabel}
                                </Badge>
                                <ChevronDown className="w-3 h-3 opacity-60" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-card border-border text-foreground">
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(org._id, "activo")
                                }
                                className="text-xs transition-colors cursor-pointer"
                              >
                                Activo
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(org._id, "suspendido")
                                }
                                className="text-xs transition-colors cursor-pointer"
                              >
                                Suspendido
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleStatusChange(org._id, "vencido")
                                }
                                className="text-xs transition-colors cursor-pointer"
                              >
                                Vencido
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        <td className="py-3.5 px-3 text-muted-foreground font-mono text-[11px]">
                          {org.createdAt
                            ? new Date(org.createdAt).toLocaleDateString(
                                "es-AR",
                                {
                                  timeZone: "America/Argentina/Buenos_Aires",
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : "N/A"}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setViewingOrg(org)}
                              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
                              title="Ver detalle, sucursales y cuentas del taller"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenEditOrg(org)}
                              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 cursor-pointer"
                              title="Editar nombre, plan y licencia del taller"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleStatusChange(
                                  org._id,
                                  org.subscriptionStatus === "activo"
                                    ? "suspendido"
                                    : "activo"
                                )
                              }
                              className={`h-8 w-8 rounded-lg cursor-pointer ${
                                org.subscriptionStatus === "activo"
                                  ? "text-amber-400 hover:bg-amber-500/10"
                                  : "text-emerald-400 hover:bg-emerald-500/10"
                              }`}
                              title={
                                org.subscriptionStatus === "activo"
                                  ? "Suspender licencia rápidamente"
                                  : "Reactivar licencia rápidamente"
                              }
                            >
                              {org.subscriptionStatus === "activo" ? (
                                <Ban className="w-3.5 h-3.5" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteOrg(org)}
                              className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 cursor-pointer"
                              title="Eliminar taller"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground text-xs font-light">
            No se encontraron talleres registrados con ese criterio.
          </div>
        )}
      </Card>

      {/* MODAL 1: VER DETALLE DE TALLER (SUCURSALES Y CUENTAS) */}
      {viewingOrg && (
        <div
          onClick={() => setViewingOrg(null)}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl shadow-2xl max-w-3xl w-full max-h-[88vh] overflow-y-auto p-6 space-y-6 animate-in fade-in-50 zoom-in-95 duration-150 relative text-left cursor-default"
          >
            <div className="flex items-start justify-between border-b border-border/60 pb-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="font-outfit text-xl font-bold text-foreground">
                    {viewingOrg.name}
                  </h3>
                  <Badge className="bg-primary/15 text-primary border border-primary/30 text-[10px] font-bold uppercase">
                    {normalizePlan(viewingOrg.subscriptionPlan)}
                  </Badge>
                  <Badge
                    variant={
                      viewingOrg.subscriptionStatus === "activo"
                        ? "success"
                        : "destructive"
                    }
                    className="text-[10px] font-bold uppercase"
                  >
                    {viewingOrg.subscriptionStatus || "activo"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground font-light">
                  Inspección de sucursales operativas y cuentas de personal vinculadas a este taller.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setViewingOrg(null);
                  setEditingVenue(null);
                }}
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Sección Sucursales */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-outfit text-sm font-bold text-foreground flex items-center gap-2">
                  <Store className="w-4 h-4 text-primary" />
                  Sucursales del Taller ({(viewingOrg.venues || []).length})
                </h4>
              </div>

              {editingVenue && (
                <form
                  onSubmit={handleSaveVenueAsSuper}
                  className="p-4 rounded-xl border border-primary/40 bg-primary/5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      Editando Sucursal: {editingVenue.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingVenue(null)}
                      className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                        Nombre de Sucursal
                      </Label>
                      <Input
                        value={editingVenue.name || ""}
                        onChange={(e) =>
                          setEditingVenue({
                            ...editingVenue,
                            name: e.target.value,
                          })
                        }
                        required
                        className="h-8 text-xs bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                        Email Comercial
                      </Label>
                      <Input
                        value={editingVenue.email || ""}
                        onChange={(e) =>
                          setEditingVenue({
                            ...editingVenue,
                            email: e.target.value,
                          })
                        }
                        className="h-8 text-xs bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                        Teléfono
                      </Label>
                      <Input
                        value={editingVenue.phone || ""}
                        onChange={(e) =>
                          setEditingVenue({
                            ...editingVenue,
                            phone: e.target.value,
                          })
                        }
                        className="h-8 text-xs bg-background"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] uppercase text-muted-foreground font-bold">
                        Dirección Física
                      </Label>
                      <Input
                        value={editingVenue.address || ""}
                        onChange={(e) =>
                          setEditingVenue({
                            ...editingVenue,
                            address: e.target.value,
                          })
                        }
                        className="h-8 text-xs bg-background"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={submittingSuper}
                      size="sm"
                      className="h-8 bg-primary text-primary-foreground text-xs font-bold cursor-pointer gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Guardar Sucursal
                    </Button>
                  </div>
                </form>
              )}

              {(viewingOrg.venues || []).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(viewingOrg.venues || []).map((v) => (
                    <div
                      key={v.id}
                      className="p-3.5 rounded-xl border border-border/70 bg-background/50 space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-xs sm:text-sm text-foreground">
                            {v.name}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingVenue({ ...v })}
                            className="h-6 px-2 text-[10px] text-muted-foreground hover:text-primary cursor-pointer gap-1"
                          >
                            <Pencil className="w-3 h-3" />
                            Editar
                          </Button>
                        </div>
                        {v.address && (
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                            <MapPin className="w-3 h-3 shrink-0 text-primary/70" />
                            <span className="truncate">{v.address}</span>
                          </p>
                        )}
                        {v.phone && (
                          <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5">
                            <Phone className="w-3 h-3 shrink-0 text-primary/70" />
                            <span>{v.phone}</span>
                          </p>
                        )}
                        {v.email && (
                          <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1.5">
                            <Mail className="w-3 h-3 shrink-0 text-primary/70" />
                            <span className="truncate">{v.email}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground font-light italic">
                  Este taller no posee sucursales registradas.
                </p>
              )}
            </div>

            {/* Sección Cuentas de Usuario del Taller */}
            <div className="space-y-3 border-t border-border/50 pt-4">
              <div className="flex items-center justify-between">
                <h4 className="font-outfit text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-400" />
                  Cuentas de Acceso Vinculadas ({(viewingOrg.profiles || []).length})
                </h4>
                <Link to="/dashboard/usuarios">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] font-semibold rounded-lg gap-1 cursor-pointer"
                  >
                    Ir a Gestión de Usuarios
                    <ArrowUpRight className="w-3 h-3" />
                  </Button>
                </Link>
              </div>

              {(viewingOrg.profiles || []).length > 0 ? (
                <div className="divide-y divide-border/40 rounded-xl border border-border/60 bg-background/40 overflow-hidden">
                  {(viewingOrg.profiles || []).map((p) => {
                    const assignedVenue = (viewingOrg.venues || []).find(
                      (v) => v.id === p.venue_id
                    );
                    return (
                      <div
                        key={p.id}
                        className="p-3 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <span className="font-bold text-foreground block truncate">
                            {p.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono block truncate">
                            {p.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {assignedVenue && (
                            <span className="text-[10px] text-muted-foreground bg-muted/40 px-2 py-0.5 rounded border border-border/50">
                              {assignedVenue.name}
                            </span>
                          )}
                          <Badge
                            variant={
                              p.role === "admin" ? "default" : "secondary"
                            }
                            className="text-[9px] uppercase font-bold"
                          >
                            {p.role === "admin" ? "Admin" : "Técnico"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground font-light italic">
                  No hay cuentas de usuario asociadas a este taller.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-border/50 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  const org = viewingOrg;
                  setViewingOrg(null);
                  handleOpenEditOrg(org);
                }}
                className="text-xs font-semibold cursor-pointer gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                Editar Taller y Plan
              </Button>
              <Button
                onClick={() => {
                  setViewingOrg(null);
                  setEditingVenue(null);
                }}
                className="bg-primary text-primary-foreground text-xs font-bold cursor-pointer"
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDITAR TALLER, PLAN Y LICENCIA */}
      {editingOrg && (
        <div
          onClick={() => setEditingOrg(null)}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in-50 zoom-in-95 duration-150 relative text-left cursor-default"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingOrg(null)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="space-y-1">
              <h3 className="font-outfit text-lg font-bold text-foreground">
                Editar Taller y Suscripción
              </h3>
              <p className="text-xs text-muted-foreground font-light">
                Modificá el nombre comercial de la organización, su plan activo y el estado de su licencia.
              </p>
            </div>

            <form onSubmit={handleSaveEditOrg} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Nombre del Taller / Organización
                </Label>
                <Input
                  value={editOrgName}
                  onChange={(e) => setEditOrgName(e.target.value)}
                  required
                  className="bg-background/85 border-border text-xs h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Plan Contratado
                </Label>
                <select
                  value={editOrgPlan}
                  onChange={(e) => setEditOrgPlan(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-background/85 px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Taller Básico">Taller Básico</option>
                  <option value="Taller Pro">Taller Pro</option>
                  <option value="Multi-Taller Pro">Multi-Taller Pro</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Estado de Licencia
                </Label>
                <select
                  value={editOrgStatus}
                  onChange={(e) => setEditOrgStatus(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-background/85 px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="activo">Activo (Operación Habilitada)</option>
                  <option value="suspendido">Suspendido (Acceso Bloqueado)</option>
                  <option value="vencido">Vencido (Requiere Renovación)</option>
                </select>
              </div>

              <div className="flex flex-col-reverse sm:flex-row sm:justify-between items-stretch sm:items-center gap-2 pt-3 border-t border-border/50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDeleteOrg(editingOrg)}
                  className="text-xs text-destructive hover:bg-destructive/10 border-destructive/30 cursor-pointer flex items-center justify-center gap-1.5 order-last sm:order-first"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar Taller
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingOrg(null)}
                    className="text-xs flex-1 sm:flex-none cursor-pointer"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={submittingSuper}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex-1 sm:flex-none cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {submittingSuper ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
