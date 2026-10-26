import React, { useState, useEffect } from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Users,
  Search,
  Trash2,
  Pencil,
  Eye,
  PlusCircle,
  ClipboardList,
  Download,
  MessageCircle,
  X,
  UserPlus,
  Printer,
} from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import {
  getClientWhatsAppUrl,
  getOrderWhatsAppUrl,
  printOrderReceipt,
} from "@/utils/printHelper";

export default function ClientsPage() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal de Alta / Edición de Cliente
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [clientName, setClientName] = useState("");
  const [clientDni, setClientDni] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  // Modal de visualización de órdenes del cliente
  const [selectedClientForOrders, setSelectedClientForOrders] = useState(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  // Modal de confirmación de borrado
  const [clientToDelete, setClientToDelete] = useState(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [clientsData, ordersData, profileData] = await Promise.all([
        api.clients.getAll(),
        api.orders.getAll(),
        api.auth.getProfile().catch(() => null),
      ]);
      setClients(clientsData || []);
      setOrders(ordersData || []);
      if (profileData) setProfile(profileData);
    } catch (error) {
      toast.error("Error al cargar datos", {
        description: error.message || "Por favor, intente nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNewClientModal = () => {
    setEditingId(null);
    setClientName("");
    setClientDni("");
    setClientPhone("");
    setClientEmail("");
    setShowClientModal(true);
  };

  const handleEditClick = (client) => {
    setEditingId(client._id);
    setClientName(client.name || "");
    setClientDni(client.dni || "");
    setClientPhone(client.phone || "");
    setClientEmail(client.email || "");
    setShowClientModal(true);
  };

  const handleCloseClientModal = () => {
    setShowClientModal(false);
    setEditingId(null);
    setClientName("");
    setClientDni("");
    setClientPhone("");
    setClientEmail("");
  };

  const handleRegisterClient = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.clients.update(editingId, {
          name: clientName,
          dni: clientDni,
          phone: clientPhone,
          email: clientEmail,
        });
        toast.success("¡Ficha de Cliente Actualizada!", {
          description: `Los datos de ${clientName} fueron actualizados.`,
        });
      } else {
        const exists = clients.some(
          (c) =>
            c.dni.replace(/\./g, "").trim() === clientDni.replace(/\./g, "").trim()
        );
        if (exists) {
          toast.error("El DNI ingresado ya pertenece a un cliente registrado.");
          return;
        }

        await api.clients.create({
          name: clientName,
          dni: clientDni,
          phone: clientPhone,
          email: clientEmail,
        });
        toast.success("¡Cliente Registrado!", {
          description: `${clientName} fue dado de alta.`,
        });
      }

      handleCloseClientModal();
      loadData();
    } catch (error) {
      toast.error("Error al guardar cliente", {
        description: error.message || "Por favor, intente nuevamente.",
      });
    }
  };

  const handleDeleteRequest = (client) => {
    setClientToDelete(client);
    setShowDeleteAlert(true);
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;

    try {
      await api.clients.delete(clientToDelete._id);
      toast.error("Cliente eliminado", {
        description: `${clientToDelete.name} y su historial de órdenes asociadas fueron eliminados.`,
      });
      setClientToDelete(null);
      setShowDeleteAlert(false);
      loadData();
    } catch (error) {
      toast.error("Error al eliminar cliente", {
        description: error.message || "Por favor, intente nuevamente.",
      });
    }
  };

  const handleViewOrders = (client) => {
    setSelectedClientForOrders(client);
    setShowOrdersModal(true);
  };

  const handleOpenWhatsAppClient = (client) => {
    const url = getClientWhatsAppUrl(client, profile);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleExportToExcel = async () => {
    if (clients.length === 0) {
      toast.error("No hay clientes registrados para exportar.");
      return;
    }

    try {
      toast.info("Generando archivo Excel de clientes...");
      const { default: writeXlsxFile } = await import("write-excel-file/browser");

      const columns = [
        {
          header: {
            value: "ID Cliente",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (c) => ({ type: String, value: String(c._id || "N/A"), align: "center" }),
          width: 16,
        },
        {
          header: {
            value: "Nombre y Apellido",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
          },
          cell: (c) => ({
            type: String,
            value: c.name || "Sin nombre",
            fontWeight: "bold",
          }),
          width: 28,
        },
        {
          header: {
            value: "DNI / CUIT",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (c) => ({ type: String, value: String(c.dni || "N/A"), align: "center" }),
          width: 16,
        },
        {
          header: {
            value: "Teléfono",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
          },
          cell: (c) => ({ type: String, value: c.phone || "N/A" }),
          width: 20,
        },
        {
          header: {
            value: "Correo Electrónico",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
          },
          cell: (c) => ({ type: String, value: c.email || "N/A" }),
          width: 28,
        },
        {
          header: {
            value: "Órdenes Registradas",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (c) => {
            const count = orders.filter((o) => {
              const oClientId = typeof o.clientId === "object" ? o.clientId?._id : o.clientId;
              return oClientId === c._id;
            }).length;
            return { type: Number, value: count, align: "center" };
          },
          width: 20,
        },
        {
          header: {
            value: "Fecha Alta",
            fontWeight: "bold",
            backgroundColor: "#0284c7",
            color: "#ffffff",
            align: "center",
          },
          cell: (c) => {
            let formattedDate = "-";
            if (c.created_at) {
              formattedDate = new Date(c.created_at).toLocaleDateString("es-AR");
            }
            return { type: String, value: formattedDate, align: "center" };
          },
          width: 16,
        },
      ];

      await writeXlsxFile(filteredClients, { columns }).toFile(
        `Clientes_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      toast.success("Listado de clientes exportado a Excel (.xlsx).");
    } catch (err) {
      console.error("Error al generar Excel de clientes:", err);
      toast.error("Error al exportar clientes a Excel.");
    }
  };

  const filteredClients = clients.filter((c) => {
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
    <div className="space-y-5">
      {/* Cabecera Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-outfit text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 sm:w-7 sm:h-7 text-primary shrink-0" />
            <span>Directorio de Clientes</span>
          </h1>
          <p className="text-xs text-muted-foreground font-light">
            Gestión de fichas de clientes, contacto directo por WhatsApp e historial de reparaciones.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Button
            variant="outline"
            onClick={handleExportToExcel}
            className="h-9 border-border/80 text-xs font-semibold flex items-center gap-1.5 cursor-pointer rounded-lg"
            title="Exportar listado de clientes a Excel (.xlsx)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Exportar Excel
          </Button>
          <Button
            onClick={handleOpenNewClientModal}
            className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold flex items-center gap-1.5 cursor-pointer rounded-lg shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Contenedor Principal */}
      <Card className="bg-card/30 border-border/80 p-3.5 sm:p-5 shadow-sm space-y-4">
        {/* Buscador y Contador */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-b border-border/50 pb-3.5">
          <div className="relative w-full sm:max-w-sm flex items-center">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 pointer-events-none" />
            <Input
              type="text"
              placeholder="Buscar por nombre, DNI, teléfono o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background/85 border-border text-xs w-full pl-9 h-9 rounded-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-mono font-bold">
            Total: {filteredClients.length} Clientes
          </span>
        </div>

        {/* Listado de Clientes */}
        {loading ? (
          <div className="text-center py-14 text-xs text-muted-foreground font-light">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Cargando directorio de clientes...
          </div>
        ) : filteredClients.length > 0 ? (
          <>
            {/* Vista Móvil (< md): Tarjetas de Clientes */}
            <div className="space-y-3 md:hidden">
              {filteredClients.map((client) => {
                const clientOrders = orders.filter((o) => {
                  const oClientId = typeof o.clientId === "object" ? o.clientId._id : o.clientId;
                  return oClientId === client._id;
                });
                return (
                  <div
                    key={client._id}
                    className="rounded-xl border border-border/70 bg-background/50 p-3.5 space-y-2.5 text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-bold text-foreground text-sm block leading-snug">
                          {client.name}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground block mt-0.5">
                          DNI: {client.dni} • ID:{" "}
                          {client._id.substring(client._id.length - 6).toUpperCase()}
                        </span>
                      </div>
                      <Badge
                        variant={clientOrders.length > 0 ? "default" : "secondary"}
                        className="text-[10px] font-bold shrink-0"
                      >
                        {clientOrders.length} {clientOrders.length === 1 ? "orden" : "órdenes"}
                      </Badge>
                    </div>

                    <div className="text-xs text-muted-foreground space-y-0.5 pt-2 border-t border-border/40">
                      {client.phone && (
                        <div className="text-foreground/90 font-medium">Tel: {client.phone}</div>
                      )}
                      {client.email && <div className="text-[11px] truncate">{client.email}</div>}
                    </div>

                    <div className="flex items-center justify-between gap-1.5 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/dashboard/nuevo-ingreso", { state: { client } })}
                        className="h-8 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 rounded-lg flex-1 gap-1.5 cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        Nueva Orden
                      </Button>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => handleOpenWhatsAppClient(client)}
                          className="h-8 w-8 text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30 rounded-lg cursor-pointer"
                          title="Escribir por WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => handleViewOrders(client)}
                          disabled={clientOrders.length === 0}
                          className="h-8 w-8 text-muted-foreground hover:text-primary border-border/80 disabled:opacity-30 rounded-lg cursor-pointer"
                          title="Ver órdenes"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => handleEditClick(client)}
                          className="h-8 w-8 text-muted-foreground hover:text-primary border-border/80 rounded-lg cursor-pointer"
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => handleDeleteRequest(client)}
                          className="h-8 w-8 text-muted-foreground hover:text-red-400 border-border/80 rounded-lg cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vista Escritorio (>= md): Tabla completa */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-3 px-2.5">ID</th>
                    <th className="py-3 px-2.5">Nombre y Apellido</th>
                    <th className="py-3 px-2.5">DNI / CUIT</th>
                    <th className="py-3 px-2.5">Contacto</th>
                    <th className="py-3 px-2.5 text-center">Órdenes</th>
                    <th className="py-3 px-2.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => {
                    const clientOrders = orders.filter((o) => {
                      const oClientId =
                        typeof o.clientId === "object" ? o.clientId._id : o.clientId;
                      return oClientId === client._id;
                    });
                    return (
                      <tr
                        key={client._id}
                        className="border-b border-border/40 hover:bg-card/40 transition-colors"
                      >
                        <td className="py-3.5 px-2.5 font-mono font-bold text-primary">
                          {client._id.substring(client._id.length - 6).toUpperCase()}
                        </td>
                        <td className="py-3.5 px-2.5 font-semibold text-foreground">
                          {client.name}
                        </td>
                        <td className="py-3.5 px-2.5 font-mono text-muted-foreground">
                          {client.dni}
                        </td>
                        <td className="py-3.5 px-2.5">
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{client.phone}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {client.email}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-2.5 text-center">
                          <Badge
                            variant={clientOrders.length > 0 ? "default" : "secondary"}
                            className="text-[10px] font-bold"
                          >
                            {clientOrders.length}
                          </Badge>
                        </td>
                        <td className="py-3.5 px-2.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate("/dashboard/nuevo-ingreso", { state: { client } })
                              }
                              className="h-8 px-2.5 text-xs font-bold border-primary/30 text-primary hover:bg-primary/10 rounded-lg flex items-center gap-1 cursor-pointer"
                              title="Registrar nuevo equipo para este cliente"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              Orden
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleOpenWhatsAppClient(client)}
                              className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/15 rounded-lg cursor-pointer"
                              title="Escribir por WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleViewOrders(client)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 disabled:opacity-30 rounded-lg cursor-pointer"
                              title="Ver historial de órdenes del cliente"
                              disabled={clientOrders.length === 0}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleEditClick(client)}
                              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
                              title="Editar ficha de cliente"
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDeleteRequest(client)}
                              className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-950/15 rounded-lg cursor-pointer"
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
          </>
        ) : (
          <div className="text-center py-12 text-muted-foreground text-xs font-light">
            No se encontraron clientes con los filtros actuales.
          </div>
        )}
      </Card>

      {/* MODAL CREAR / EDITAR CLIENTE */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <Card className="bg-card border-border/80 shadow-2xl max-w-md w-full p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150 relative">
            <div className="flex items-start justify-between border-b border-border/60 pb-3">
              <div className="space-y-0.5 text-left">
                <CardTitle className="font-outfit text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-primary" />
                  {editingId ? "Editar Ficha de Cliente" : "Nuevo Cliente"}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {editingId
                    ? `Modificá los datos de contacto de ${clientName}.`
                    : "Registrá un nuevo cliente en el directorio del taller."}
                </CardDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleCloseClientModal}
                className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleRegisterClient} className="space-y-3.5 text-left">
              <div className="space-y-1.5">
                <Label
                  htmlFor="c-name"
                  className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
                >
                  Nombre Completo
                </Label>
                <Input
                  id="c-name"
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="c-dni"
                    className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
                  >
                    DNI / Identificación
                  </Label>
                  <Input
                    id="c-dni"
                    type="text"
                    required
                    disabled={editingId !== null}
                    value={clientDni}
                    onChange={(e) => setClientDni(e.target.value)}
                    placeholder="Ej. 38.450.123"
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs font-mono h-9 rounded-lg disabled:opacity-60"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="c-phone"
                    className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
                  >
                    Teléfono (WhatsApp)
                  </Label>
                  <Input
                    id="c-phone"
                    type="text"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+54 381 1234567"
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="c-email"
                  className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
                >
                  Email
                </Label>
                <Input
                  id="c-email"
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="cliente@ejemplo.com"
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseClientModal}
                  className="h-9 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs px-5 rounded-lg cursor-pointer"
                >
                  {editingId ? "Guardar Cambios" : "Registrar Cliente"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Modal / Diálogo para visualización de Órdenes del Cliente */}
      {showOrdersModal && selectedClientForOrders && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <Card className="bg-card border-border/80 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl p-4 sm:p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="space-y-1 text-left">
                <CardTitle className="font-outfit text-base font-bold text-foreground flex items-center gap-2 border-0 pb-0">
                  <ClipboardList className="w-4 h-4 text-primary" />
                  Reparaciones de {selectedClientForOrders.name}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  DNI: {selectedClientForOrders.dni} &bull; Tel: {selectedClientForOrders.phone}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowOrdersModal(false);
                  setSelectedClientForOrders(null);
                }}
                className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {orders
                .filter((o) => {
                  const oClientId =
                    typeof o.clientId === "object" ? o.clientId._id : o.clientId;
                  return oClientId === selectedClientForOrders._id;
                })
                .map((o) => {
                  const waUrl = getOrderWhatsAppUrl(o, profile, selectedClientForOrders);
                  return (
                    <div
                      key={o._id}
                      className="border border-border/60 bg-background/50 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-primary text-xs">
                            #{o.trackingCode}
                          </span>
                          <Badge
                            variant="outline"
                            className="text-[9px] uppercase font-bold py-0 px-1.5 border-border"
                          >
                            {o.status.toUpperCase()}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {o.date}
                          </span>
                        </div>
                        <span className="font-semibold text-xs text-foreground block">
                          {o.deviceModel} ({o.deviceType})
                        </span>
                        <p className="text-[11px] text-muted-foreground leading-snug">
                          {o.issue}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        {waUrl && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(waUrl, "_blank", "noopener,noreferrer")}
                            className="h-8 text-xs font-bold border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 rounded-lg flex items-center gap-1 cursor-pointer"
                            title="Enviar seguimiento por WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            WhatsApp
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          onClick={() =>
                            printOrderReceipt(o, profile, selectedClientForOrders)
                          }
                          className="h-8 w-8 text-muted-foreground hover:text-primary border-border/80 rounded-lg cursor-pointer"
                          title="Imprimir comprobante"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </Button>
                      </div>
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
              Al eliminar a {clientToDelete?.name}, también se eliminarán del historial de forma
              permanente todas las órdenes de servicio asociadas. Esta acción no se puede deshacer.
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
