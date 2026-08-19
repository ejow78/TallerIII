import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Users, Search, Trash2, Pencil, Eye, PlusCircle, ClipboardList } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { api } from "@/services/api";

export default function ClientsPage() {
  const [activeTab, setActiveTab] = useState("control");
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const clientsData = await api.clients.getAll();
      const ordersData = await api.orders.getAll();
      setClients(clientsData);
      setOrders(ordersData);
    } catch (error) {
      toast.error("Error al cargar datos", {
        description: error.message || "Por favor, intente nuevamente."
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Estados del formulario (Alta / Edición)
  const [editingId, setEditingId] = useState(null);
  const [clientName, setClientName] = useState("");
  const [clientDni, setClientDni] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  // Modal de visualización de órdenes
  const [selectedClientForOrders, setSelectedClientForOrders] = useState(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  // Modal de confirmación de borrado
  const [clientToDelete, setClientToDelete] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Registrar o editar cliente
  const handleRegisterClient = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Editar cliente
        await api.clients.update(editingId, {
          name: clientName,
          dni: clientDni,
          phone: clientPhone,
          email: clientEmail
        });
        toast.success("¡Ficha de Cliente Actualizada!", {
          description: `Los datos de ${clientName} fueron actualizados.`
        });
        setEditingId(null);
      } else {
        // Alta de cliente
        // Validar DNI único localmente antes de enviar (opcional, pero ayuda)
        const exists = clients.some(c => c.dni.replace(/\./g, "").trim() === clientDni.replace(/\./g, "").trim());
        if (exists) {
          toast.error("El DNI ingresado ya pertenece a un cliente registrado.");
          return;
        }

        const data = await api.clients.create({
          name: clientName,
          dni: clientDni,
          phone: clientPhone,
          email: clientEmail
        });
        toast.success("¡Cliente Registrado!", {
          description: `${clientName} fue dado de alta.`
        });
      }

      // Resetear formulario
      setClientName("");
      setClientDni("");
      setClientPhone("");
      setClientEmail("");
      setActiveTab("control");
      loadData();
    } catch (error) {
      toast.error("Error al registrar cliente", {
        description: error.message || "Por favor, intente nuevamente."
      });
    }
  };

  // Activar modo edición
  const handleEditClick = (client) => {
    setEditingId(client._id);
    setClientName(client.name);
    setClientDni(client.dni);
    setClientPhone(client.phone);
    setClientEmail(client.email);
    setActiveTab("registro");
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingId(null);
    setClientName("");
    setClientDni("");
    setClientPhone("");
    setClientEmail("");
    setActiveTab("control");
  };

  // Solicitar borrado de cliente
  const handleDeleteRequest = (client) => {
    setClientToDelete(client);
    setShowDeleteAlert(true);
  };

  // Confirmar borrado (borra cliente y todas sus órdenes asociadas)
  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;

    try {
      await api.clients.delete(clientToDelete._id);
      toast.error("Cliente eliminado", {
        description: `${clientToDelete.name} y su historial de órdenes asociadas fueron eliminados.`
      });
      setClientToDelete(null);
      setShowDeleteAlert(false);
      loadData();
    } catch (error) {
      toast.error("Error al eliminar cliente", {
        description: error.message || "Por favor, intente nuevamente."
      });
    }
  };

  // Abrir modal con las órdenes de un cliente
  const handleViewOrders = (client) => {
    setSelectedClientForOrders(client);
    setShowOrdersModal(true);
  };

  // Filtrado de clientes
  const filteredClients = clients.filter(c => {
    const term = searchQuery.toLowerCase().trim();
    const cId = c._id || "";
    return (
      cId.toLowerCase().includes(term) ||
      c.name.toLowerCase().includes(term) ||
      c.dni.replace(/\./g, "").includes(term.replace(/\./g, "")) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.phone && c.phone.includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Cabecera interna */}
      <div className="space-y-1">
        <h1 className="font-outfit text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
          <Users className="w-7 h-7 text-primary shrink-0" />
          <span>Directorio de Clientes</span>
        </h1>
        <p className="text-xs text-muted-foreground font-light">
          Gestión de fichas de clientes y acceso a su historial de reparaciones técnico.
        </p>
      </div>

      {/* Selector de Pestañas (Tabs) */}
      <div className="flex border-b border-border/60 gap-6">
        <button
          onClick={() => setActiveTab("control")}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer relative ${
            activeTab === "control"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Clientes Registrados
        </button>
        <button
          onClick={() => setActiveTab("registro")}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer relative ${
            activeTab === "registro"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          {editingId ? "Editar Cliente" : "Registrar Cliente"}
        </button>
      </div>

      <div className="animate-fade-in pt-2">
        {activeTab === "control" ? (
          <Card className="bg-card/20 border-border p-6 shadow-sm space-y-4">
            
            {/* Buscador */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-border/50 pb-4">
              <div className="relative w-full sm:max-w-xs flex items-center">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre, DNI, teléfono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background/80 border-border text-xs w-full pl-9"
                />
              </div>
              <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono font-bold">
                Total: {clients.length} Clientes
              </span>
            </div>

            {/* Listado de Clientes */}
            {filteredClients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold">
                      <th className="py-3 px-2">ID Cliente</th>
                      <th className="py-3 px-2">Nombre</th>
                      <th className="py-3 px-2">Identificación (DNI)</th>
                      <th className="py-3 px-2">Contacto</th>
                      <th className="py-3 px-2 text-center">Órdenes</th>
                      <th className="py-3 px-2 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => {
                      const clientOrders = orders.filter(o => {
                        const oClientId = typeof o.clientId === "object" ? o.clientId._id : o.clientId;
                        return oClientId === client._id;
                      });
                      return (
                        <tr key={client._id} className="border-b border-border/40 hover:bg-card/30 transition-colors">
                          <td className="py-3.5 px-2 font-mono font-bold text-primary">{client._id.substring(client._id.length - 6).toUpperCase()}</td>
                          <td className="py-3.5 px-2 font-medium">{client.name}</td>
                          <td className="py-3.5 px-2 font-mono">{client.dni}</td>
                          <td className="py-3.5 px-2">
                            <div className="flex flex-col">
                              <span>{client.phone}</span>
                              <span className="text-[10px] text-muted-foreground">{client.email}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-2 text-center">
                            <Badge variant={clientOrders.length > 0 ? "default" : "secondary"} className="text-[10px] font-bold">
                              {clientOrders.length}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="icon-sm"
                                onClick={() => handleViewOrders(client)}
                                className="text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-30"
                                title="Ver órdenes de reparación"
                                disabled={clientOrders.length === 0}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon-sm"
                                onClick={() => handleEditClick(client)}
                                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                                title="Editar ficha de cliente"
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon-sm"
                                onClick={() => handleDeleteRequest(client)}
                                className="text-muted-foreground hover:text-red-400 hover:bg-red-950/15"
                                title="Eliminar cliente"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
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
                No se encontraron clientes con los filtros actuales.
              </div>
            )}
          </Card>
        ) : (
          /* Formulario de Alta / Edición */
          <div className="max-w-2xl mx-auto w-full">
            <Card className="bg-card/40 border-border p-6 shadow-xl backdrop-blur-sm space-y-6">
              <div className="space-y-1">
                <CardTitle className="font-outfit text-lg font-bold text-foreground flex items-center gap-2 border-0 pb-0">
                  <PlusCircle className="w-5 h-5 text-primary" />
                  {editingId ? "Editar Ficha de Cliente" : "Alta de Ficha de Cliente"}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {editingId ? `Modificá los datos de contacto y facturación de ${clientName}.` : "Registrá un nuevo cliente en la base de datos."}
                </CardDescription>
              </div>

              <form onSubmit={handleRegisterClient} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="c-name" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Nombre Completo</Label>
                  <Input 
                    id="c-name"
                    type="text" 
                    required 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)} 
                    placeholder="Edgar Ortiz"
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="c-dni" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">DNI / Identificación</Label>
                    <Input 
                      id="c-dni"
                      type="text" 
                      required 
                      disabled={editingId !== null}
                      value={clientDni} 
                      onChange={(e) => setClientDni(e.target.value)} 
                      placeholder="44.375.912"
                      className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs font-mono disabled:opacity-60"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="c-phone" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Teléfono</Label>
                    <Input 
                      id="c-phone"
                      type="text" 
                      required 
                      value={clientPhone} 
                      onChange={(e) => setClientPhone(e.target.value)} 
                      placeholder="+54 381 1234567"
                      className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="c-email" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Email</Label>
                  <Input 
                    id="c-email"
                    type="email" 
                    required 
                    value={clientEmail} 
                    onChange={(e) => setClientEmail(e.target.value)} 
                    placeholder="edgar@repairit.cloud"
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  {editingId && (
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="w-full border-border text-xs py-2 rounded-md transition-all select-none cursor-pointer"
                    >
                      Cancelar
                    </Button>
                  )}
                  <Button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 rounded-md transition-all select-none cursor-pointer"
                  >
                    {editingId ? "Guardar Cambios" : "Registrar Cliente"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>

      {/* Modal / Diálogo para visualización de Órdenes del Cliente */}
      {showOrdersModal && selectedClientForOrders && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="bg-background border-border max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="space-y-1 text-left">
                <CardTitle className="font-outfit text-base font-bold text-foreground/90 flex items-center gap-2 border-0 pb-0">
                  <ClipboardList className="w-4.5 h-4.5 text-primary" />
                  Reparaciones de {selectedClientForOrders.name}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Ficha de cliente: {selectedClientForOrders._id.substring(selectedClientForOrders._id.length - 6).toUpperCase()} &bull; DNI: {selectedClientForOrders.dni}
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setShowOrdersModal(false);
                  setSelectedClientForOrders(null);
                }}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                Cerrar
              </Button>
            </div>

            <div className="space-y-3">
              {orders.filter(o => {
                const oClientId = typeof o.clientId === "object" ? o.clientId._id : o.clientId;
                return oClientId === selectedClientForOrders._id;
              }).map(o => {
                let badgeVariant = "secondary";
                if (o.status === "listo") badgeVariant = "success";
                if (o.status === "presupuestado") badgeVariant = "warning";
                return (
                  <div key={o._id} className="border border-border/55 bg-card/30 p-4 rounded-lg flex justify-between items-start gap-4">
                    <div className="text-left space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-primary text-xs">{o.trackingCode}</span>
                        <span className="text-[10px] text-muted-foreground">{o.date}</span>
                      </div>
                      <span className="font-medium text-xs text-foreground block">{o.deviceModel} ({o.deviceType})</span>
                      <p className="text-[10px] text-muted-foreground leading-normal mt-1">{o.issue}</p>
                    </div>
                    <Badge variant={o.status === "listo" ? "success" : o.status === "ingresado" ? "secondary" : "outline"} className="text-[9px] uppercase font-bold py-0.5 px-2 border">
                      {o.status.toUpperCase()}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Diálogo de alerta para confirmación de eliminación */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="bg-background border-border text-left">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-outfit text-lg font-bold text-foreground">
              ¿Confirmás la eliminación del cliente?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-normal">
              Al eliminar a {clientToDelete?.name}, también se eliminarán del historial de forma permanente todas las órdenes de servicio asociadas. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border text-xs">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteClient}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-bold"
            >
              Sí, Eliminar Todo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
