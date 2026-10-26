import { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/services/api";
import { toast } from "sonner";
import {
  PlusCircle,
  Search,
  UserCheck,
  Smartphone,
  User,
  Printer,
  X,
  ArrowLeft,
} from "lucide-react";
import { sendOrderCreatedEmail } from "@/services/emailService";
import { printOrderReceipt, getOrderWhatsAppUrl } from "@/utils/printHelper";

export default function NewOrderPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Clientes existentes para autocompletado rápido
  const [existingClients, setExistingClients] = useState([]);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedExistingClient, setSelectedExistingClient] = useState(null);

  // Estados del formulario
  const [clientName, setClientName] = useState("");
  const [clientDni, setClientDni] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [deviceType, setDeviceType] = useState("Smartphone");
  const [deviceModel, setDeviceModel] = useState("");
  const [accessories, setAccessories] = useState("");
  const [cosmeticCondition, setCosmeticCondition] = useState("");
  const [issue, setIssue] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [autoPrint, setAutoPrint] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [p, cList] = await Promise.all([
          api.auth.getProfile().catch(() => null),
          api.clients.getAll().catch(() => []),
        ]);
        if (p) setProfile(p);
        if (Array.isArray(cList)) setExistingClients(cList);
      } catch (err) {
        console.error("Error al cargar datos en NewOrderPage:", err);
      }
    };
    loadInitial();
  }, []);

  useEffect(() => {
    if (location.state?.client) {
      const c = location.state.client;
      if (c.name) setClientName(c.name);
      if (c.dni) setClientDni(c.dni);
      if (c.phone) setClientPhone(c.phone);
      if (c.email) setClientEmail(c.email);
      setSelectedExistingClient(c);
      toast.info(`Datos precargados para cliente: ${c.name}`);
    }
  }, [location.state]);

  // Coincidencias del buscador rápido de clientes
  const matchingClients = useMemo(() => {
    const q = clientSearch.trim().toLowerCase();
    if (!q) return [];
    return existingClients
      .filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.dni && c.dni.replace(/\./g, "").includes(q.replace(/\./g, ""))) ||
          (c.phone && c.phone.includes(q))
      )
      .slice(0, 5);
  }, [clientSearch, existingClients]);

  // Coincidencia automática por DNI mientras tipea
  const dniMatchClient = useMemo(() => {
    const cleanDni = clientDni.replace(/\./g, "").trim();
    if (cleanDni.length < 6 || selectedExistingClient) return null;
    return existingClients.find(
      (c) => c.dni && c.dni.replace(/\./g, "").trim() === cleanDni
    );
  }, [clientDni, existingClients, selectedExistingClient]);

  const handleSelectClient = (c) => {
    setClientName(c.name || "");
    setClientDni(c.dni || "");
    setClientPhone(c.phone || "");
    setClientEmail(c.email || "");
    setSelectedExistingClient(c);
    setClientSearch("");
    toast.success(`Cliente seleccionado: ${c.name}`);
  };

  const handleClearSelectedClient = () => {
    setSelectedExistingClient(null);
    setClientName("");
    setClientDni("");
    setClientPhone("");
    setClientEmail("");
  };

  // Registrar orden
  const handleRegisterOrder = async (e) => {
    e.preventDefault();

    if (!acceptTerms) {
      toast.error("Debe confirmar las condiciones de recepción técnica.");
      return;
    }

    try {
      setSubmitting(true);

      // 1. Registrar o actualizar cliente mediante la API
      const client = await api.clients.create({
        name: clientName,
        dni: clientDni,
        phone: clientPhone,
        email: clientEmail,
      });

      const dateStr = new Date().toLocaleDateString("es-AR");
      const timeStr = new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // 2. Crear la orden de servicio vinculada
      const order = await api.orders.create({
        clientId: client._id,
        deviceType,
        deviceModel,
        accessories: accessories || "Ninguno",
        cosmetic: cosmeticCondition || "Sin detalles",
        issue,
        date: dateStr,
        time: timeStr,
        status: "ingresado",
      });

      const hydratedOrder = {
        ...order,
        clientId: {
          _id: client._id,
          name: clientName,
          dni: clientDni,
          phone: clientPhone,
          email: clientEmail,
        },
      };

      const waUrl = getOrderWhatsAppUrl(hydratedOrder, profile);

      toast.success(`¡Orden #${order.trackingCode} registrada!`, {
        description: `${deviceType} ${deviceModel} a nombre de ${clientName}.`,
        action: waUrl
          ? {
              label: "Enviar WhatsApp",
              onClick: () => window.open(waUrl, "_blank", "noopener,noreferrer"),
            }
          : undefined,
      });

      // 3. Imprimir comprobante si está activado
      if (autoPrint) {
        printOrderReceipt(hydratedOrder, profile, hydratedOrder.clientId);
      }

      // 4. Enviar confirmación por correo electrónico automáticamente
      if (clientEmail && clientEmail.includes("@")) {
        try {
          await sendOrderCreatedEmail({
            to: clientEmail.trim(),
            clientName: clientName.trim(),
            orderCode: order.trackingCode,
            deviceType,
            deviceModel,
            issue,
            workshopName: profile?.name || "RepairIT",
            workshopPhone: profile?.phone || "",
            workshopAddress: profile?.address || "",
          });
        } catch (err) {
          console.warn("No se pudo enviar email de recepción:", err);
        }
      }

      navigate("/dashboard/ordenes");
    } catch (error) {
      toast.error("Error al registrar ingreso técnico", {
        description: error.message || "Por favor, intente nuevamente.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Cabecera Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-outfit text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <PlusCircle className="w-6 h-6 sm:w-7 sm:h-7 text-primary shrink-0" />
            <span>Nuevo Ingreso de Equipo</span>
          </h1>
          <p className="text-xs text-muted-foreground font-light">
            Recepción técnica rápida con autocompletado de clientes y emisión de comprobante QR.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => navigate("/dashboard/ordenes")}
          className="h-9 text-xs font-semibold border-border/80 rounded-lg flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Ver Órdenes
        </Button>
      </div>

      <form onSubmit={handleRegisterOrder} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* COLUMNA IZQUIERDA (5 cols): 1. Datos del Cliente */}
          <Card className="lg:col-span-5 bg-card/40 border-border/80 p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div>
                <CardTitle className="font-outfit text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  1. Datos del Cliente
                </CardTitle>
                <CardDescription className="text-[11px] text-muted-foreground">
                  Buscá un cliente habitual o completá los datos de uno nuevo.
                </CardDescription>
              </div>
              {selectedExistingClient && (
                <button
                  type="button"
                  onClick={handleClearSelectedClient}
                  className="text-[10px] font-bold text-muted-foreground hover:text-foreground inline-flex items-center gap-1 bg-muted/40 px-2 py-1 rounded-md cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  Limpiar
                </button>
              )}
            </div>

            {/* Buscador rápido de cliente registrado */}
            <div className="relative space-y-1.5">
              <Label className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                Autocompletar Cliente Registrado (Opcional)
              </Label>
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 pointer-events-none" />
                <Input
                  type="text"
                  value={clientSearch}
                  onChange={(e) => setClientSearch(e.target.value)}
                  placeholder="Buscar por nombre, DNI o teléfono..."
                  className="bg-background/90 border-primary/25 focus-visible:ring-1 focus-visible:ring-primary text-xs pl-8 h-9 rounded-lg"
                />
                {clientSearch && (
                  <button
                    type="button"
                    onClick={() => setClientSearch("")}
                    className="absolute right-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {matchingClients.length > 0 && (
                <div className="rounded-xl border border-border bg-card shadow-xl divide-y divide-border/50 overflow-hidden z-20">
                  {matchingClients.map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => handleSelectClient(c)}
                      className="w-full px-3 py-2 text-left hover:bg-primary/10 transition-colors flex items-center justify-between gap-2 cursor-pointer"
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-foreground block truncate">
                          {c.name}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">
                          DNI: {c.dni} • Tel: {c.phone}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-primary shrink-0 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5" />
                        Elegir
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <Label
                  htmlFor="client-name"
                  className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
                >
                  Nombre y Apellido
                </Label>
                <Input
                  id="client-name"
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
                    htmlFor="client-dni"
                    className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
                  >
                    DNI / CUIT
                  </Label>
                  <Input
                    id="client-dni"
                    type="text"
                    required
                    value={clientDni}
                    onChange={(e) => setClientDni(e.target.value)}
                    placeholder="Ej. 38.450.123"
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs font-mono h-9 rounded-lg"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label
                    htmlFor="client-phone"
                    className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
                  >
                    Teléfono (WhatsApp)
                  </Label>
                  <Input
                    id="client-phone"
                    type="text"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+54 381 5551234"
                    className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
                  />
                </div>
              </div>

              {/* Sugerencia automática si escribe un DNI existente */}
              {dniMatchClient && (
                <button
                  type="button"
                  onClick={() => handleSelectClient(dniMatchClient)}
                  className="w-full p-2 rounded-lg bg-primary/10 border border-primary/25 text-left flex items-center justify-between text-xs text-primary hover:bg-primary/15 transition-colors cursor-pointer"
                >
                  <span className="truncate">
                    DNI registrado: <strong>{dniMatchClient.name}</strong>
                  </span>
                  <span className="text-[10px] font-bold underline shrink-0 ml-2">
                    Autocompletar
                  </span>
                </button>
              )}

              <div className="space-y-1.5">
                <Label
                  htmlFor="client-email"
                  className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
                >
                  Correo Electrónico
                </Label>
                <Input
                  id="client-email"
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="cliente@ejemplo.com"
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
                />
              </div>
            </div>
          </Card>

          {/* COLUMNA DERECHA (7 cols): 2. Datos del Equipo y Recepción */}
          <Card className="lg:col-span-7 bg-card/40 border-border/80 p-4 sm:p-5 shadow-sm space-y-4">
            <div className="border-b border-border/50 pb-3">
              <CardTitle className="font-outfit text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" />
                2. Especificaciones del Equipo y Falla
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground">
                Detallá el modelo recibido, estado estético, accesorios y motivo de ingreso.
              </CardDescription>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="device-type"
                  className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
                >
                  Tipo de Dispositivo
                </Label>
                <select
                  id="device-type"
                  value={deviceType}
                  onChange={(e) => setDeviceType(e.target.value)}
                  className="w-full h-9 bg-background/85 border border-border rounded-lg px-3 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Smartphone">Smartphone / Celular</option>
                  <option value="Notebook">Notebook / Laptop</option>
                  <option value="Tablet">Tablet / iPad</option>
                  <option value="PC Escritorio">PC Escritorio / Gamer</option>
                  <option value="Consola">Consola de Videojuegos</option>
                  <option value="Monitor / Periférico">Monitor / Impresora</option>
                  <option value="Otro">Otro Dispositivo</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="device-model"
                  className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
                >
                  Marca y Modelo Exacto
                </Label>
                <Input
                  id="device-model"
                  type="text"
                  required
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                  placeholder="Ej. iPhone 14 Pro / Lenovo Legion 5"
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label
                  htmlFor="accessories"
                  className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
                >
                  Accesorios Entregados
                </Label>
                <Input
                  id="accessories"
                  type="text"
                  value={accessories}
                  onChange={(e) => setAccessories(e.target.value)}
                  placeholder="Ej. Cargador original, funda (o vacío si ninguno)"
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="cosmetic"
                  className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
                >
                  Estado Cosmético de Recepción
                </Label>
                <Input
                  id="cosmetic"
                  type="text"
                  value={cosmeticCondition}
                  onChange={(e) => setCosmeticCondition(e.target.value)}
                  placeholder="Ej. Rayón en tapa trasera, vidrio templado sano"
                  className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs h-9 rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="device-issue"
                className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block"
              >
                Falla Reportada / Trabajo Solicitado
              </Label>
              <Textarea
                id="device-issue"
                rows={3}
                required
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="Describí con precisión la falla informada por el cliente al dejar el equipo..."
                className="bg-background/85 border-border focus-visible:ring-1 focus-visible:ring-primary text-xs resize-none rounded-lg"
              />
            </div>

            {/* Opciones de confirmación e impresión */}
            <div className="space-y-2.5 pt-2 border-t border-border/50">
              <div className="flex items-start space-x-2.5 bg-background/50 p-3 rounded-lg border border-border/60">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                  className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor="terms"
                  className="text-xs font-normal text-muted-foreground leading-snug cursor-pointer select-none"
                >
                  El cliente acepta las condiciones de revisión técnica y deja constancia del estado
                  cosmético declarado.
                </Label>
              </div>

              <div className="flex items-center space-x-2.5 bg-primary/5 p-3 rounded-lg border border-primary/20">
                <Checkbox
                  id="auto-print"
                  checked={autoPrint}
                  onCheckedChange={(checked) => setAutoPrint(checked === true)}
                  className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor="auto-print"
                  className="text-xs font-semibold text-foreground leading-snug cursor-pointer select-none flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-primary" />
                  Abrir ventana para imprimir comprobante A4 con QR automáticamente al registrar
                </Label>
              </div>
            </div>

            <div className="pt-1 flex flex-col sm:flex-row justify-end gap-2.5">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs py-2.5 px-6 rounded-lg transition-all cursor-pointer shadow-lg shadow-primary/15 flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                {submitting ? "Registrando Ingreso..." : "Registrar Orden de Servicio"}
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
