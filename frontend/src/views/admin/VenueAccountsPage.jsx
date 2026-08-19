import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  KeyRound, 
  Plus, 
  Trash2, 
  Shield, 
  Store, 
  X, 
  Save, 
  Eye, 
  EyeOff, 
  Info
} from "lucide-react";
import { api } from "@/services/api";
import { supabase } from "@/services/supabaseClient";

export default function VenueAccountsPage() {
  const user = JSON.parse(localStorage.getItem("repairit_user") || "{}");
  const isMultiTaller = user.subscriptionPlan === "Multi-Taller Pro";

  const [accounts, setAccounts] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [venueId, setVenueId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    if (!isMultiTaller) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const accountsData = await api.venueAccounts.getAll();
      setAccounts(accountsData);
      
      const venuesData = await api.auth.getVenues();
      setVenues(venuesData);
      if (venuesData.length > 0) {
        setVenueId(venuesData[0]._id);
      }
    } catch (error) {
      toast.error("Error al cargar datos", {
        description: error.message || "Por favor, intente nuevamente."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !venueId) {
      toast.error("Complete todos los campos requeridos.");
      return;
    }

    try {
      setSubmitting(true);
      await api.venueAccounts.create({
        name,
        email,
        password,
        venueId
      });
      toast.success("¡Cuenta de Acceso Creada!", {
        description: `Se registró la cuenta "${name}" correctamente.`
      });
      setShowModal(false);
      setName("");
      setEmail("");
      setPassword("");
      fetchData();
    } catch (error) {
      toast.error("Error al crear cuenta", {
        description: error.message || "No se pudo registrar la cuenta en Supabase."
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (accountId, accountName) => {
    if (!window.confirm(`¿Está seguro de que desea eliminar la cuenta "${accountName}"? El dispositivo perderá acceso inmediato al sistema.`)) {
      return;
    }

    try {
      await api.venueAccounts.delete(accountId);
      toast.success("Cuenta eliminada", {
        description: `La cuenta de acceso "${accountName}" fue removida correctamente.`
      });
      fetchData();
    } catch (error) {
      toast.error("Error al eliminar cuenta", {
        description: error.message || "No se pudo procesar la solicitud."
      });
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-light">Cargando cuentas de acceso...</p>
        </div>
      </div>
    );
  }

  // Vista cuando no tienen el plan correcto
  if (!isMultiTaller) {
    return (
      <div className="p-6 space-y-6 max-w-4xl">
        <div className="space-y-1">
          <h2 className="font-outfit text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <KeyRound className="w-6 h-6 text-primary shrink-0" />
            <span>Cuentas de Acceso de Sucursal</span>
          </h2>
          <p className="text-xs text-muted-foreground font-light">
            Administración de cuentas para las PCs de cada una de sus sedes.
          </p>
        </div>

        <Card className="bg-card/25 border-border border-dashed p-10 text-center flex flex-col items-center justify-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Shield className="w-7 h-7" />
          </div>
          <div className="space-y-2 max-w-md">
            <h3 className="font-outfit text-lg font-bold text-foreground">Función Exclusiva de Multi-Taller Pro</h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              La creación de usuarios de acceso independientes para las computadoras de cada sucursal requiere una licencia activa del plan <span className="text-primary font-bold">Multi-Taller Pro</span>.
            </p>
            <p className="text-xs text-muted-foreground font-light">
              Mejore su plan en la pestaña de perfil para habilitar esta funcionalidad.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-outfit text-2xl font-black tracking-tight text-foreground flex items-center gap-2.5">
            <KeyRound className="w-6 h-6 text-primary shrink-0" />
            <span>Cuentas de Acceso de Sucursal</span>
          </h2>
          <p className="text-xs text-muted-foreground font-light">
            Configure credenciales de PC independientes para limitar el acceso del personal de cada sede.
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs py-2.5 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-lg shadow-primary/15 transition-all select-none self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Crear Cuenta de Acceso
        </Button>
      </div>

      {/* Info Warning */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3 text-xs text-muted-foreground font-light leading-relaxed">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-foreground font-medium">¿Cómo funcionan estas cuentas?</p>
          <p>
            Estas credenciales están diseñadas para ser ingresadas en las computadoras fijas del taller de cada sede. 
            El personal técnico que inicie sesión con estas cuentas **solo podrá ver, editar y registrar información correspondiente a su sucursal asociada**. No tendrán acceso a la facturación, configuración global ni a otras sedes.
          </p>
        </div>
      </div>

      {/* Table Card */}
      <Card className="bg-card/30 border-border shadow-xl backdrop-blur-sm">
        <CardContent className="p-0">
          {accounts.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mx-auto text-muted-foreground">
                <Store className="w-6 h-6" />
              </div>
              <p className="text-xs font-light text-muted-foreground">No hay cuentas de acceso adicionales registradas.</p>
              <p className="text-[10px] text-muted-foreground/60">Presione el botón superior para crear la primera cuenta.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/15 text-muted-foreground font-medium uppercase text-[10px] tracking-wider">
                    <th className="py-4 px-5">Nombre Identificador</th>
                    <th className="py-4 px-5">Email de Acceso</th>
                    <th className="py-4 px-5">Sucursal Asociada</th>
                    <th className="py-4 px-5">Rol Asignado</th>
                    <th className="py-4 px-5">Fecha Alta</th>
                    <th className="py-4 px-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {accounts.map((acc) => (
                    <tr key={acc._id} className="hover:bg-muted/10 transition-colors">
                      <td className="py-4 px-5 font-bold text-foreground">{acc.name}</td>
                      <td className="py-4 px-5 font-mono text-muted-foreground">{acc.email}</td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5">
                          <Store className="w-3.5 h-3.5 text-primary/70" />
                          <span className="text-foreground">{acc.venueId?.name || "Desconocida"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <Badge variant="secondary" className="text-[9px] uppercase font-bold px-1.5 py-0.5">Técnico</Badge>
                      </td>
                      <td className="py-4 px-5 text-muted-foreground font-mono text-[10px]">
                        {new Date(acc.created_at).toLocaleDateString("es-AR")}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(acc._id, acc.name)}
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer rounded-full"
                          title="Eliminar cuenta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Creación */}
      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in-50 zoom-in-95 duration-150 relative">
            <Button
              onClick={() => setShowModal(false)}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer rounded-full h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="space-y-1">
              <h3 className="font-outfit text-base font-bold text-foreground">
                Registrar Cuenta de Acceso
              </h3>
              <p className="text-xs text-muted-foreground font-light">
                Crea credenciales específicas para una de las sucursales de tu organización.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Nombre Identificador</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  placeholder="Ej. Técnico Yerba Buena"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Email de Acceso</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="Ej. yerbabuena@repairit.cloud"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Contraseña del equipo"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="space-y-1.5">
                <Label htmlFor="venue" className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Sucursal Asociada</Label>
                <select
                  id="venue"
                  value={venueId}
                  onChange={(e) => setVenueId(e.target.value)}
                  className="w-full h-9 rounded-md border border-border bg-background/85 text-xs px-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground"
                >
                  {venues.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name}
                    </option>
                  ))}
                </select>
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
                  disabled={submitting}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 px-5 rounded-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  {submitting ? "Creando..." : "Crear Acceso"}
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
