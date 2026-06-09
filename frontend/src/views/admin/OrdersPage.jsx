import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { PlusCircle, ClipboardList, Trash2, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function OrdersPage() {
  // Estado para la tabla dinámica de órdenes de servicio
  const [orders, setOrders] = useState([
    {
      id: "RT-2026-ASUS",
      clientName: "Edgar Javier Ortiz",
      clientDni: "44.375.912",
      deviceType: "Notebook",
      deviceModel: "ASUS ROG Strix G15",
      serial: "SN-98218-ASUS",
      issue: "Calentamiento excesivo y reinicios aleatorios.",
      status: "presupuestado",
      date: "05/06/2026"
    },
    {
      id: "RT-2026-MOCK",
      clientName: "Cliente Registrado",
      clientDni: "29.987.654",
      deviceType: "Celular",
      deviceModel: "Samsung S23 Ultra",
      serial: "SN-PENDIENTE",
      issue: "Pantalla astillada tras caída física y puerto de carga flojo.",
      status: "diagnostico",
      date: "08/06/2026"
    }
  ]);

  // Pestaña activa
  const [activeTab, setActiveTab] = useState("registro");

  // Estados del formulario
  const [clientName, setClientName] = useState("");
  const [clientDni, setClientDni] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [deviceType, setDeviceType] = useState("Notebook");
  const [deviceModel, setDeviceModel] = useState("");
  const [serial, setSerial] = useState("");
  const [issue, setIssue] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Registrar orden
  const handleRegisterOrder = (e) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast.error("Debe aceptar los términos de recepción técnica.");
      return;
    }

    const trackingCode = `RT-2026-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const newOrder = {
      id: trackingCode,
      clientName,
      clientDni,
      deviceType,
      deviceModel,
      serial: serial || "SN-PENDIENTE",
      issue,
      status: "ingresado",
      date: new Date().toLocaleDateString("es-AR")
    };

    setOrders([newOrder, ...orders]);

    toast.success("¡Dispositivo Registrado!", {
      description: `Código de seguimiento: ${trackingCode}.`,
    });

    // Resetear formulario y mover a la pestaña de listado
    setClientName("");
    setClientDni("");
    setClientPhone("");
    setClientEmail("");
    setDeviceType("Notebook");
    setDeviceModel("");
    setSerial("");
    setIssue("");
    setAcceptTerms(false);
    setActiveTab("control");
  };

  // Eliminar orden localmente (simulado)
  const handleDeleteOrder = (id) => {
    setOrders(orders.filter(o => o.id !== id));
    toast.error(`Orden ${id} eliminada del listado.`);
  };

  // Manejar cambio de estado en la tabla
  const handleStatusChange = (id, newStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
    toast.success(`Estado de orden ${id} actualizado`, {
      description: `Nuevo estado: ${newStatus.toUpperCase()}`,
    });
  };

  // Selector interactivo de estado de tipo Dropdown Menu de shadcn
  const getStatusDropdown = (orderId, currentStatus) => {
    let colorClass = "";
    let statusLabel = "";
    switch (currentStatus) {
      case "ingresado":
        colorClass = "bg-sky-500/10 text-sky-400 border-sky-500/25 hover:bg-sky-500/20";
        statusLabel = "Ingresado";
        break;
      case "diagnostico":
        colorClass = "bg-amber-500/10 text-amber-400 border-amber-500/25 hover:bg-amber-500/20";
        statusLabel = "En Diagnóstico";
        break;
      case "presupuestado":
        colorClass = "bg-purple-500/10 text-purple-400 border-purple-500/25 hover:bg-purple-500/20";
        statusLabel = "Presupuestado";
        break;
      case "reparacion":
        colorClass = "bg-blue-500/10 text-blue-400 border-blue-500/25 hover:bg-blue-500/20";
        statusLabel = "En Reparación";
        break;
      case "listo":
        colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20";
        statusLabel = "Listo";
        break;
      default:
        colorClass = "bg-zinc-800 text-zinc-400 border-zinc-700/60 hover:bg-zinc-800/80";
        statusLabel = "Entregado";
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`h-8 border px-2.5 text-xs font-semibold rounded-md flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm select-none ${colorClass}`}
          >
            {statusLabel}
            <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="bg-card border-border/80 text-foreground w-44 shadow-xl p-1.5 space-y-1">
          <DropdownMenuItem
            onClick={() => handleStatusChange(orderId, "ingresado")}
            className="text-xs font-semibold rounded-md py-1.5 px-2.5 transition-colors cursor-pointer select-none border bg-sky-500/10 text-sky-400 border-sky-500/15 hover:bg-sky-500/20 hover:text-sky-350 focus:bg-sky-500/20 focus:text-sky-350"
          >
            Ingresado
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusChange(orderId, "diagnostico")}
            className="text-xs font-semibold rounded-md py-1.5 px-2.5 transition-colors cursor-pointer select-none border bg-amber-500/10 text-amber-400 border-amber-500/15 hover:bg-amber-500/20 hover:text-amber-350 focus:bg-amber-500/20 focus:text-amber-350"
          >
            En Diagnóstico
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusChange(orderId, "presupuestado")}
            className="text-xs font-semibold rounded-md py-1.5 px-2.5 transition-colors cursor-pointer select-none border bg-purple-500/10 text-purple-400 border-purple-500/15 hover:bg-purple-500/20 hover:text-purple-350 focus:bg-purple-500/20 focus:text-purple-350"
          >
            Presupuestado
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusChange(orderId, "reparacion")}
            className="text-xs font-semibold rounded-md py-1.5 px-2.5 transition-colors cursor-pointer select-none border bg-blue-500/10 text-blue-400 border-blue-500/15 hover:bg-blue-500/20 hover:text-blue-350 focus:bg-blue-500/20 focus:text-blue-350"
          >
            En Reparación
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusChange(orderId, "listo")}
            className="text-xs font-semibold rounded-md py-1.5 px-2.5 transition-colors cursor-pointer select-none border bg-emerald-500/10 text-emerald-400 border-emerald-500/15 hover:bg-emerald-500/20 hover:text-emerald-350 focus:bg-emerald-500/20 focus:text-emerald-350"
          >
            Listo
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusChange(orderId, "entregado")}
            className="text-xs font-semibold rounded-md py-1.5 px-2.5 transition-colors cursor-pointer select-none border bg-zinc-800 text-zinc-400 border-zinc-700/60 hover:bg-zinc-800/80 hover:text-zinc-350 focus:bg-zinc-800/80 focus:text-zinc-350"
          >
            Entregado
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-6">
      {/* Cabecera interna */}
      <div className="space-y-1">
        <h1 className="font-outfit text-3xl font-bold text-foreground tracking-tight">
          Órdenes de Servicio
        </h1>
        <p className="text-xs text-muted-foreground font-light">
          Alta de dispositivos ingresados y control de trazabilidad técnica del taller.
        </p>
      </div>

      {/* Selector de Pestañas (Tabs) estilo shadcn */}
      <div className="flex border-b border-border/60 gap-6">
        <button
          onClick={() => setActiveTab("registro")}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer relative ${
            activeTab === "registro"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Registrar Ingreso
        </button>
        <button
          onClick={() => setActiveTab("control")}
          className={`pb-3 text-sm font-semibold tracking-wide border-b-2 transition-all cursor-pointer relative ${
            activeTab === "control"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Control de Trazabilidad y Estados
        </button>
      </div>

      <div className="animate-fade-in pt-2">
        {activeTab === "registro" ? (
          <div className="max-w-2xl mx-auto w-full">
            {/* Formulario de Ingreso de Dispositivo (Card shadcn) */}
            <Card className="bg-card/40 border-border p-6 shadow-xl backdrop-blur-sm space-y-6">
              <div className="space-y-1">
                <CardTitle className="font-outfit text-lg font-bold text-foreground flex items-center gap-2 border-0 pb-0">
                  <PlusCircle className="w-5 h-5 text-primary" />
                  Ingreso de Equipo
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Registrá los datos del cliente y el dispositivo a reparar.
                </CardDescription>
              </div>

              <form onSubmit={handleRegisterOrder} className="space-y-4">
                
                {/* Sección: Datos del Cliente */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">1. Datos del Cliente</span>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="client-name" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Nombre Completo</Label>
                    <Input 
                      id="client-name"
                      type="text" 
                      required 
                      value={clientName} 
                      onChange={(e) => setClientName(e.target.value)} 
                      placeholder="Edgar Ortiz"
                      className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="client-dni" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">DNI / Identificación</Label>
                      <Input 
                        id="client-dni"
                        type="text" 
                        required 
                        value={clientDni} 
                        onChange={(e) => setClientDni(e.target.value)} 
                        placeholder="44.375.912"
                        className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs font-mono"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="client-phone" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Teléfono</Label>
                      <Input 
                        id="client-phone"
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
                    <Label htmlFor="client-email" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Email</Label>
                    <Input 
                      id="client-email"
                      type="email" 
                      required 
                      value={clientEmail} 
                      onChange={(e) => setClientEmail(e.target.value)} 
                      placeholder="edgar@repairit.cloud"
                      className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                    />
                  </div>
                </div>

                <Separator className="border-border/60" />

                {/* Sección: Datos del Equipo */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">2. Datos del Equipo</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="device-type" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Tipo</Label>
                      <select 
                        id="device-type"
                        value={deviceType}
                        onChange={(e) => setDeviceType(e.target.value)}
                        className="w-full h-9 bg-background/85 border border-border rounded-md px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="Notebook">Notebook</option>
                        <option value="PC Escritorio">PC Escritorio</option>
                        <option value="Consola">Consola</option>
                        <option value="Celular">Celular</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="device-serial" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Número de Serie</Label>
                      <Input 
                        id="device-serial"
                        type="text" 
                        value={serial} 
                        onChange={(e) => setSerial(e.target.value)} 
                        placeholder="SN-XXXXX"
                        className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="device-model" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Marca y Modelo</Label>
                    <Input 
                      id="device-model"
                      type="text" 
                      required 
                      value={deviceModel} 
                      onChange={(e) => setDeviceModel(e.target.value)} 
                      placeholder="ASUS ROG Strix G15"
                      className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="device-issue" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Falla Reportada</Label>
                    <Textarea 
                      id="device-issue"
                      required 
                      rows={3}
                      value={issue} 
                      onChange={(e) => setIssue(e.target.value)} 
                      placeholder="Describí los síntomas del dispositivo..."
                      className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs resize-none"
                    />
                  </div>
                </div>

                {/* Checkbox de Recepción */}
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox 
                    id="terms" 
                    checked={acceptTerms} 
                    onCheckedChange={(checked) => setAcceptTerms(checked)}
                    className="border-border focus-visible:ring-primary"
                  />
                  <div className="grid gap-1 leading-none">
                    <Label
                      htmlFor="terms"
                      className="text-[10px] text-muted-foreground font-light leading-tight select-none cursor-pointer"
                    >
                      Confirmo la recepción física del equipo y autorizo la apertura del dispositivo para su diagnóstico.
                    </Label>
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs py-2 rounded-md transition-all select-none cursor-pointer mt-2"
                >
                  Registrar Ingreso
                </Button>

              </form>
            </Card>
          </div>
        ) : (
          /* Listado y Control de Órdenes Registradas (Card shadcn) */
          <Card className="bg-card/20 border-border p-6 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <CardTitle className="font-outfit text-base font-bold text-foreground/90 flex items-center gap-2 border-0 pb-0">
                  <ClipboardList className="w-4.5 h-4.5 text-muted-foreground" />
                  Control de Trazabilidad
                </CardTitle>
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-mono font-bold">Total: {orders.length} Equipos</span>
              </div>

              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold">
                        <th className="py-3 px-2">Código</th>
                        <th className="py-3 px-2">Cliente</th>
                        <th className="py-3 px-2">Dispositivo</th>
                        <th className="py-3 px-2">Fecha</th>
                        <th className="py-3 px-2">Estado (Editar)</th>
                        <th className="py-3 px-2 text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id} className="border-b border-border/40 hover:bg-card/30 transition-colors">
                          <td className="py-3.5 px-2 font-mono font-bold text-primary">{o.id}</td>
                          <td className="py-3.5 px-2">
                            <span className="font-medium block">{o.clientName}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{o.clientDni}</span>
                          </td>
                          <td className="py-3.5 px-2">
                            <span className="font-medium block">{o.deviceModel}</span>
                            <span className="text-[10px] text-muted-foreground">{o.deviceType}</span>
                          </td>
                          <td className="py-3.5 px-2 text-muted-foreground">{o.date}</td>
                          <td className="py-3.5 px-2">{getStatusDropdown(o.id, o.status)}</td>
                          <td className="py-3.5 px-2 text-right">
                            <Button 
                              variant="ghost" 
                              size="icon-sm"
                              onClick={() => handleDeleteOrder(o.id)}
                              className="text-muted-foreground hover:text-red-400 hover:bg-red-950/15"
                              title="Eliminar de la lista de prueba"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-16 space-y-2">
                  <p className="text-xs text-muted-foreground leading-normal font-light">
                    No hay órdenes de servicio cargadas. Ve a la pestaña de "Registrar Ingreso" para añadir un ingreso técnico.
                  </p>
                </div>
              )}
            </div>

            <div className="text-[10px] text-muted-foreground/80 mt-6 border-t border-border/40 pt-3">
              * Nota: Los registros agregados persisten únicamente en el estado local de la sesión de prueba de React.
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
