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
  EyeOff
} from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

export default function SuperAdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // States for Manage User Modal
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalName, setModalName] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalRole, setModalRole] = useState("tecnico");
  const [modalPassword, setModalPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.super.getUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Error al cargar usuarios de la plataforma", {
        description: err.message || "Por favor, intente de nuevo."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.super.updateUserRole(userId, newRole);
      toast.success("Rol de usuario actualizado con éxito");
      loadUsers();
    } catch (err) {
      toast.error("Error al actualizar rol", {
        description: err.message || "No se pudo cambiar el rol."
      });
    }
  };

  const handleOpenManageModal = (user) => {
    setSelectedUser(user);
    setModalName(user.name || "");
    setModalEmail(user.email || "");
    setModalRole(user.role || "tecnico");
    setModalPassword("");
    setShowPassword(false);
    setShowManageModal(true);
  };

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
      toast.success("¡Usuario actualizado correctamente!");
      setShowManageModal(false);
      loadUsers();
    } catch (err) {
      toast.error("Error al actualizar usuario", {
        description: err.message || "No se pudo guardar los cambios."
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    const currentUser = JSON.parse(localStorage.getItem("repairit_user") || "{}");
    if (userId === currentUser._id) {
      toast.error("No puede eliminar su propio usuario activo.");
      return;
    }

    if (!window.confirm(`¿Está seguro de que desea eliminar permanentemente al usuario "${userName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await api.super.deleteUser(userId);
      toast.success("Usuario eliminado", {
        description: `La cuenta de "${userName}" fue eliminada de la plataforma.`
      });
      setShowManageModal(false);
      loadUsers();
    } catch (err) {
      toast.error("Error al eliminar usuario", {
        description: err.message || "No se pudo procesar la solicitud."
      });
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-1">
        <h1 className="font-outfit text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
          <Users className="w-7 h-7 text-primary shrink-0" />
          <span>Gestión de Usuarios</span>
        </h1>
        <p className="text-xs text-muted-foreground font-light">
          Administración centralizada de cuentas de técnicos y administradores de todos los talleres.
        </p>
      </div>

      <Card className="bg-card/20 border-border p-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-3">
            <CardTitle className="font-outfit text-base font-bold text-foreground/90 flex items-center gap-2 border-0 pb-0">
              <Users className="w-4.5 h-4.5 text-muted-foreground" />
              Directorio General de Personal
            </CardTitle>
            <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono font-bold">Total: {users.length}</span>
          </div>

          {/* Filtro rápido de búsqueda */}
          <div className="flex gap-3 py-2 border-b border-border/30">
            <div className="relative w-full sm:max-w-xs flex items-center">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
              <Input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background/80 border-border text-xs w-full pl-9"
              />
            </div>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold">
                    <th className="py-3 px-2">Usuario</th>
                    <th className="py-3 px-2">Organización / Taller</th>
                    <th className="py-3 px-2">Sucursal / Venue</th>
                    <th className="py-3 px-2">Rol del Sistema</th>
                    <th className="py-3 px-2">Fecha Alta</th>
                    <th className="py-3 px-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((item) => {
                    let roleBadge = "secondary";
                    let roleLabel = "Técnico";
                    if (item.role === "superadmin") {
                      roleBadge = "success";
                      roleLabel = "Super Admin";
                    } else if (item.role === "admin") {
                      roleBadge = "warning";
                      roleLabel = "Administrador";
                    }

                    const isCurrentSuper = item.role === "superadmin";

                    return (
                      <tr key={item._id} className="border-b border-border/40 hover:bg-card/30 transition-colors">
                        <td className="py-3.5 px-2">
                          <span className="font-medium text-foreground text-sm block">{item.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{item.email}</span>
                        </td>
                        <td className="py-3.5 px-2 font-medium text-foreground">{item.organizationId?.name || "Plataforma Central"}</td>
                        <td className="py-3.5 px-2 text-muted-foreground">{item.venueId?.name || "Taller Global"}</td>
                        <td className="py-3.5 px-2">
                          {isCurrentSuper ? (
                            <Badge variant={roleBadge} className="text-[9px] uppercase font-bold px-1.5 py-0.5 border">
                              {roleLabel}
                            </Badge>
                          ) : (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 border px-2 text-xs font-semibold rounded flex items-center gap-1">
                                  <Badge variant={roleBadge} className="text-[9px] uppercase font-bold px-1.5 py-0.5 border">
                                    {roleLabel}
                                  </Badge>
                                  <ChevronDown className="w-3 h-3 opacity-60" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-card border-border text-foreground">
                                <DropdownMenuItem onClick={() => handleRoleChange(item._id, "tecnico")} className="text-xs transition-colors cursor-pointer flex items-center gap-1.5">
                                  <UserCheck className="w-3.5 h-3.5 text-muted-foreground" />
                                  Técnico
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRoleChange(item._id, "admin")} className="text-xs transition-colors cursor-pointer flex items-center gap-1.5">
                                  <UserCog className="w-3.5 h-3.5 text-warning" />
                                  Administrador
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </td>
                        <td className="py-3.5 px-2 text-muted-foreground font-mono">{new Date(item.createdAt).toLocaleDateString("es-AR")}</td>
                        <td className="py-3.5 px-2 text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenManageModal(item)}
                              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/40 cursor-pointer rounded-full"
                              title="Editar / Configurar usuario"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            {!isCurrentSuper && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteUser(item._id, item.name)}
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-full"
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
          ) : (
            <div className="text-center py-12 text-muted-foreground text-xs font-light">
              No se encontraron usuarios que coincidan con la búsqueda.
            </div>
          )}
        </div>
      </Card>

      {/* MODAL DE EDICIÓN Y GESTIÓN (Para SuperAdmin) */}
      {showManageModal && selectedUser && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in-50 zoom-in-95 duration-150 relative">
            <Button
              onClick={() => setShowManageModal(false)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer rounded-full h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="space-y-1">
              <h3 className="font-outfit text-base font-bold text-foreground">
                Gestionar Cuenta de Usuario
              </h3>
              <p className="text-xs text-muted-foreground font-light">
                Modifique los accesos, rol y credenciales de la cuenta.
              </p>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              
              <div className="space-y-1.5">
                <Label htmlFor="manage-name" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Nombre Completo</Label>
                <Input
                  id="manage-name"
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez"
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="manage-email" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Email de Acceso</Label>
                <Input
                  id="manage-email"
                  type="email"
                  required
                  placeholder="Ej. juan@taller.com"
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="manage-role" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Rol del Sistema</Label>
                <select
                  id="manage-role"
                  value={modalRole}
                  onChange={(e) => setModalRole(e.target.value)}
                  disabled={selectedUser.role === "superadmin"}
                  className="w-full h-9 rounded-md border border-border bg-background/85 text-xs px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
                >
                  <option value="tecnico">Técnico (Inquilino)</option>
                  <option value="admin">Administrador (Taller)</option>
                  <option value="superadmin">Super Administrador (Plataforma)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="manage-password" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex justify-between">
                  <span>Nueva Contraseña</span>
                  <span className="text-[9px] text-muted-foreground font-light lowercase">dejar vacío para no cambiar</span>
                </Label>
                <div className="relative">
                  <Input
                    id="manage-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña nueva (mín. 6 caracteres)"
                    value={modalPassword}
                    onChange={(e) => setModalPassword(e.target.value)}
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-border/40">
                {selectedUser.role !== "superadmin" ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleDeleteUser(selectedUser._id, selectedUser.name)}
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
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 px-5 rounded-md cursor-pointer flex items-center gap-1.5"
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
