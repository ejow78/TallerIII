import { useState, useEffect, useMemo } from "react";
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
  Users,
  Search,
  ChevronDown,
  Shield,
  UserCheck,
  UserCog,
  Edit,
  Trash2,
  X,
  Save,
  Eye,
  EyeOff,
  Building2,
  Store,
  RefreshCw,
} from "lucide-react";
import { api, normalizePlan, getLocalUser } from "@/services/api";
import { toast } from "sonner";

export default function SuperAdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("todos");
  const [orgFilter, setOrgFilter] = useState("todas");

  // States for Manage User Modal
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalName, setModalName] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalRole, setModalRole] = useState("tecnico");
  const [modalVenueId, setModalVenueId] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, orgsData] = await Promise.all([
        api.super.getUsers(),
        api.super.getOrganizations().catch(() => []),
      ]);
      setUsers(usersData || []);
      setOrganizations(orgsData || []);
    } catch (err) {
      toast.error("Error al cargar usuarios de la plataforma", {
        description: err.message || "Por favor, intente de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.super.updateUserRole(userId, newRole);
      toast.success("Rol de usuario actualizado con éxito");
      loadData();
    } catch (err) {
      toast.error("Error al actualizar rol", {
        description: err.message || "No se pudo cambiar el rol.",
      });
    }
  };

  const handleOpenManageModal = (userItem) => {
    setSelectedUser(userItem);
    setModalName(userItem.name || "");
    setModalEmail(userItem.email || "");
    setModalRole(userItem.role || "tecnico");
    setModalVenueId(userItem.venueId?.id || userItem.venue_id || "");
    setModalPassword("");
    setShowPassword(false);
    setShowManageModal(true);
  };

  const selectedOrgVenues = useMemo(() => {
    if (!selectedUser) return [];
    const orgId =
      selectedUser.organizationId?.id || selectedUser.organization_id;
    const foundOrg = organizations.find((o) => o._id === orgId);
    return foundOrg?.venues || [];
  }, [selectedUser, organizations]);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!modalName || !modalEmail || !modalRole) {
      toast.error("Complete todos los campos requeridos.");
      return;
    }

    try {
      setSubmitting(true);
      await api.super.manageUser(
        selectedUser._id,
        modalName,
        modalEmail,
        modalRole,
        modalPassword || null
      );

      // Si cambió la sucursal asignada, actualizar también venue_id
      const currentVenueId =
        selectedUser.venueId?.id || selectedUser.venue_id || "";
      if (modalVenueId !== currentVenueId) {
        await api.super.updateUserAssignment(selectedUser._id, {
          venue_id: modalVenueId || null,
        });
      }

      toast.success("¡Usuario actualizado correctamente!");
      setShowManageModal(false);
      loadData();
    } catch (err) {
      toast.error("Error al actualizar usuario", {
        description: err.message || "No se pudo guardar los cambios.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    const currentUser = getLocalUser();
    if (userId === currentUser._id) {
      toast.error("No puede eliminar su propio usuario activo.");
      return;
    }

    if (
      !window.confirm(
        `¿Estás seguro de que deseás eliminar permanentemente al usuario "${userName}"? Esta acción no se puede deshacer.`
      )
    ) {
      return;
    }

    try {
      await api.super.deleteUser(userId);
      toast.success("Usuario eliminado", {
        description: `La cuenta de "${userName}" fue eliminada de la plataforma.`,
      });
      setShowManageModal(false);
      loadData();
    } catch (err) {
      toast.error("Error al eliminar usuario", {
        description: err.message || "No se pudo procesar la solicitud.",
      });
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.organizationId?.name &&
        u.organizationId.name.toLowerCase().includes(q)) ||
      (u.venueId?.name && u.venueId.name.toLowerCase().includes(q));
    const matchesRole = roleFilter === "todos" || u.role === roleFilter;
    const uOrgId = u.organizationId?.id || u.organization_id;
    const matchesOrg = orgFilter === "todas" || uOrgId === orgFilter;
    return matchesSearch && matchesRole && matchesOrg;
  });

  const totalCount = users.length;
  const adminsCount = users.filter((u) => u.role === "admin").length;
  const techsCount = users.filter((u) => u.role === "tecnico").length;
  const superCount = users.filter((u) => u.role === "superadmin").length;

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
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
            <Users className="w-7 h-7 text-primary shrink-0" />
            <span>Gestión de Usuarios</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-light">
            Administración centralizada de cuentas de administradores, técnicos de sucursal y credenciales de acceso.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          className="h-9 border-border/80 text-xs font-semibold rounded-xl flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Actualizar Listado
        </Button>
      </div>

      {/* 4 Tarjetas KPI de Usuarios */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        <Card className="bg-card/45 border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 sm:px-6 pt-4 sm:pt-5">
            <span className="text-[10px] sm:text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Total Cuentas
            </span>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
            <span className="text-2xl sm:text-3xl font-outfit font-black text-foreground block">
              {totalCount}
            </span>
            <span className="text-[10px] sm:text-[11px] text-muted-foreground block font-medium mt-1">
              Registradas en la plataforma
            </span>
          </CardContent>
        </Card>

        <Card className="bg-card/45 border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 sm:px-6 pt-4 sm:pt-5">
            <span className="text-[10px] sm:text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
              Administradores
            </span>
            <UserCog className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
            <span className="text-2xl sm:text-3xl font-outfit font-black text-foreground block">
              {adminsCount}
            </span>
            <span className="text-[10px] sm:text-[11px] text-amber-400/90 block font-medium mt-1">
              Dueños / encargados de taller
            </span>
          </CardContent>
        </Card>

        <Card className="bg-card/45 border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 sm:px-6 pt-4 sm:pt-5">
            <span className="text-[10px] sm:text-[11px] font-semibold text-sky-400 uppercase tracking-wider">
              Técnicos de Sede
            </span>
            <UserCheck className="h-4 w-4 text-sky-400" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
            <span className="text-2xl sm:text-3xl font-outfit font-black text-foreground block">
              {techsCount}
            </span>
            <span className="text-[10px] sm:text-[11px] text-sky-400/90 block font-medium mt-1">
              Cuentas operativas de sucursal
            </span>
          </CardContent>
        </Card>

        <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 px-4 sm:px-6 pt-4 sm:pt-5">
            <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              Super Admins
            </span>
            <Shield className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-4 sm:pb-5">
            <span className="text-2xl sm:text-3xl font-outfit font-black text-emerald-400 block">
              {superCount}
            </span>
            <span className="text-[10px] sm:text-[11px] text-emerald-400/90 block font-medium mt-1">
              Control global de plataforma
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Directorio General */}
      <Card className="bg-card/30 border-border/80 p-4 sm:p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border/50 pb-4 gap-3">
          <div>
            <CardTitle className="font-outfit text-base sm:text-lg font-bold text-foreground flex items-center gap-2 border-0 pb-0">
              <Users className="w-4.5 h-4.5 text-primary" />
              Directorio General de Personal y Accesos
            </CardTitle>
            <p className="text-xs text-muted-foreground font-light mt-0.5">
              Filtrá por rol o taller, cambiá permisos o restablecé contraseñas de cualquier cuenta.
            </p>
          </div>
          <Badge
            variant="secondary"
            className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 self-start sm:self-auto"
          >
            Mostrando {filteredUsers.length} de {users.length}
          </Badge>
        </div>

        {/* Barra de Búsqueda + Filtros */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="relative w-full lg:max-w-sm flex items-center">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar por nombre, email, taller o sucursal..."
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
            {/* Píldoras de Rol */}
            <div className="flex items-center gap-1 bg-background/60 p-1 rounded-xl border border-border/70">
              {[
                { id: "todos", label: "Todos" },
                { id: "admin", label: "Administradores" },
                { id: "tecnico", label: "Técnicos" },
                { id: "superadmin", label: "Super Admin" },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRoleFilter(r.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                    roleFilter === r.id
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Filtro por Organización / Taller */}
            <select
              value={orgFilter}
              onChange={(e) => setOrgFilter(e.target.value)}
              className="h-9 rounded-xl border border-border/70 bg-background/85 px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="todas">Todos los Talleres</option>
              {organizations.map((o) => (
                <option key={o._id} value={o._id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredUsers.length > 0 ? (
          <>
            {/* Vista Mobile (< md): Tarjetas de Usuario */}
            <div className="space-y-3 md:hidden">
              {filteredUsers.map((item) => {
                const isCurrentSuper = item.role === "superadmin";
                const orgPlan = item.organizationId?.subscription_plan
                  ? normalizePlan(item.organizationId.subscription_plan)
                  : null;

                return (
                  <div
                    key={item._id}
                    className="p-4 rounded-2xl border border-border/70 bg-background/50 space-y-3 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-bold text-sm text-foreground block truncate">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono block truncate">
                          {item.email}
                        </span>
                      </div>
                      <Badge
                        variant={
                          item.role === "superadmin"
                            ? "success"
                            : item.role === "admin"
                            ? "default"
                            : "secondary"
                        }
                        className="text-[9px] uppercase font-bold shrink-0"
                      >
                        {item.role === "superadmin"
                          ? "Super Admin"
                          : item.role === "admin"
                          ? "Admin"
                          : "Técnico"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap text-[11px] text-muted-foreground">
                      <span className="bg-muted/40 px-2 py-0.5 rounded-md border border-border/50">
                        {item.organizationId?.name || "Plataforma Central"}
                      </span>
                      <span className="bg-muted/40 px-2 py-0.5 rounded-md border border-border/50">
                        {item.venueId?.name || "Sin sede"}
                      </span>
                      {orgPlan && (
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-md border border-primary/25 font-bold">
                          {orgPlan}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/40">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenManageModal(item)}
                        className="h-8 text-xs font-semibold rounded-lg gap-1.5 cursor-pointer flex-1"
                      >
                        <Edit className="w-3.5 h-3.5 text-primary" />
                        Gestionar Cuenta
                      </Button>
                      {!isCurrentSuper && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(item._id, item.name)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
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
                    <th className="py-3.5 px-3">Usuario</th>
                    <th className="py-3.5 px-3">Taller / Organización</th>
                    <th className="py-3.5 px-3">Sucursal Asignada</th>
                    <th className="py-3.5 px-3">Rol del Sistema</th>
                    <th className="py-3.5 px-3">Fecha Alta</th>
                    <th className="py-3.5 px-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredUsers.map((item) => {
                    let roleBadge = "secondary";
                    let roleLabel = "Técnico";
                    if (item.role === "superadmin") {
                      roleBadge = "success";
                      roleLabel = "Super Admin";
                    } else if (item.role === "admin") {
                      roleBadge = "default";
                      roleLabel = "Administrador";
                    }

                    const isCurrentSuper = item.role === "superadmin";
                    const orgPlan = item.organizationId?.subscription_plan
                      ? normalizePlan(item.organizationId.subscription_plan)
                      : null;

                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-card/40 transition-colors"
                      >
                        <td className="py-3.5 px-3">
                          <span className="font-bold text-foreground text-sm block">
                            {item.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {item.email}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-foreground flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-primary/80 shrink-0" />
                              {item.organizationId?.name || "Plataforma Central"}
                            </span>
                            {orgPlan && (
                              <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/25 inline-block">
                                {orgPlan}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Store className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
                            {item.venueId?.name || "Taller Global"}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          {isCurrentSuper ? (
                            <Badge
                              variant={roleBadge}
                              className="text-[9px] uppercase font-bold px-2 py-0.5 border"
                            >
                              {roleLabel}
                            </Badge>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 border border-border/70 px-2.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Badge
                                    variant={roleBadge}
                                    className="text-[9px] uppercase font-bold px-1.5 py-0.5 border"
                                  >
                                    {roleLabel}
                                  </Badge>
                                  <ChevronDown className="w-3 h-3 opacity-60" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-card border-border text-foreground">
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRoleChange(item._id, "tecnico")
                                  }
                                  className="text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                                  Técnico de Sucursal
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRoleChange(item._id, "admin")
                                  }
                                  className="text-xs transition-colors cursor-pointer flex items-center gap-1.5"
                                >
                                  <UserCog className="w-3.5 h-3.5 text-amber-400" />
                                  Administrador de Taller
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-muted-foreground font-mono text-[11px]">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(
                                "es-AR"
                              )
                            : "N/A"}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <div className="flex justify-end items-center gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenManageModal(item)}
                              className="h-8 px-2.5 text-xs font-semibold border-border/70 hover:border-primary/40 hover:text-primary cursor-pointer rounded-lg gap-1.5"
                              title="Gestionar credenciales, rol y sucursal"
                            >
                              <Edit className="w-3.5 h-3.5" />
                              Gestionar
                            </Button>
                            {!isCurrentSuper && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleDeleteUser(item._id, item.name)
                                }
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-lg"
                                title="Eliminar usuario"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            )}
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
            No se encontraron usuarios que coincidan con la búsqueda.
          </div>
        )}
      </Card>

      {/* MODAL DE EDICIÓN Y GESTIÓN (Para SuperAdmin) */}
      {showManageModal && selectedUser && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in-50 zoom-in-95 duration-150 relative text-left">
            <Button
              onClick={() => setShowManageModal(false)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer rounded-full h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="space-y-1">
              <h3 className="font-outfit text-lg font-bold text-foreground">
                Gestionar Cuenta de Usuario
              </h3>
              <p className="text-xs text-muted-foreground font-light">
                Modificá el nombre, email, rol, sucursal asignada o contraseña de acceso.
              </p>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="manage-name"
                  className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Nombre Completo
                </Label>
                <Input
                  id="manage-name"
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="manage-email"
                  className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Email de Acceso
                </Label>
                <Input
                  id="manage-email"
                  type="email"
                  required
                  placeholder="Ej. juan@taller.com"
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-10 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="manage-role"
                    className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Rol del Sistema
                  </Label>
                  <select
                    id="manage-role"
                    value={modalRole}
                    onChange={(e) => setModalRole(e.target.value)}
                    disabled={selectedUser.role === "superadmin"}
                    className="w-full h-10 rounded-xl border border-border bg-background/85 text-xs px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
                  >
                    <option value="tecnico">Técnico (Sucursal)</option>
                    <option value="admin">Administrador (Taller)</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="manage-venue"
                    className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Sucursal Asignada
                  </Label>
                  <select
                    id="manage-venue"
                    value={modalVenueId}
                    onChange={(e) => setModalVenueId(e.target.value)}
                    disabled={selectedOrgVenues.length === 0}
                    className="w-full h-10 rounded-xl border border-border bg-background/85 text-xs px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
                  >
                    <option value="">Sin sede específica</option>
                    {selectedOrgVenues.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="manage-password"
                  className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex justify-between"
                >
                  <span>Nueva Contraseña</span>
                  <span className="text-[9px] text-muted-foreground font-light lowercase">
                    dejar vacío para no cambiar
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="manage-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña nueva (mín. 6 caracteres)"
                    value={modalPassword}
                    onChange={(e) => setModalPassword(e.target.value)}
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs pr-10 h-10 rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-border/40">
                {selectedUser.role !== "superadmin" ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      handleDeleteUser(selectedUser._id, selectedUser.name)
                    }
                    className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar
                  </Button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowManageModal(false)}
                    className="text-xs border-border/80 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 px-5 rounded-xl cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {submitting ? "Guardando..." : "Guardar Cambios"}
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
