import { Button } from "@/components/ui/button";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { normalizePlan } from "@/services/api";
import { useNewOrder } from "@/components/orders/new-order/useNewOrder";
import { NewOrderClientSection } from "@/components/orders/new-order/NewOrderClientSection";
import { NewOrderDeviceSection } from "@/components/orders/new-order/NewOrderDeviceSection";

export default function NewOrderPage() {
  const {
    clientSearch,
    setClientSearch,
    selectedExistingClient,
    clientName,
    setClientName,
    clientDni,
    setClientDni,
    clientPhone,
    setClientPhone,
    clientEmail,
    setClientEmail,
    deviceType,
    setDeviceType,
    deviceModel,
    setDeviceModel,
    accessories,
    setAccessories,
    cosmeticCondition,
    setCosmeticCondition,
    issue,
    setIssue,
    acceptTerms,
    setAcceptTerms,
    autoPrint,
    setAutoPrint,
    submitting,
    profile,
    monthlyOrdersCount,
    matchingClients,
    dniMatchClient,
    handleSelectClient,
    handleClearSelectedClient,
    handleRegisterOrder,
    isBasicCupoExceeded,
    navigate,
  } = useNewOrder();

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

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {normalizePlan(profile?.subscriptionPlan) === "Taller Básico" && (
            <span
              className={`text-[11px] font-mono font-bold px-2.5 py-1.5 rounded-lg border ${
                monthlyOrdersCount >= 100
                  ? "bg-destructive/15 text-destructive border-destructive/30"
                  : "bg-primary/10 text-primary border-primary/25"
              }`}
            >
              Cupo Plan Básico: {monthlyOrdersCount} / 100 órdenes este mes
            </span>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/ordenes")}
            className="h-9 text-xs font-semibold border-border/80 rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Ver Órdenes
          </Button>
        </div>
      </div>

      <form onSubmit={handleRegisterOrder} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <NewOrderClientSection
            clientSearch={clientSearch}
            setClientSearch={setClientSearch}
            matchingClients={matchingClients}
            selectedExistingClient={selectedExistingClient}
            clientName={clientName}
            setClientName={setClientName}
            clientDni={clientDni}
            setClientDni={setClientDni}
            clientPhone={clientPhone}
            setClientPhone={setClientPhone}
            clientEmail={clientEmail}
            setClientEmail={setClientEmail}
            dniMatchClient={dniMatchClient}
            onSelectClient={handleSelectClient}
            onClearClient={handleClearSelectedClient}
          />
          <NewOrderDeviceSection
            deviceType={deviceType}
            setDeviceType={setDeviceType}
            deviceModel={deviceModel}
            setDeviceModel={setDeviceModel}
            accessories={accessories}
            setAccessories={setAccessories}
            cosmeticCondition={cosmeticCondition}
            setCosmeticCondition={setCosmeticCondition}
            issue={issue}
            setIssue={setIssue}
            acceptTerms={acceptTerms}
            setAcceptTerms={setAcceptTerms}
            autoPrint={autoPrint}
            setAutoPrint={setAutoPrint}
            submitting={submitting}
            isBasicCupoExceeded={isBasicCupoExceeded}
          />
        </div>
      </form>
    </div>
  );
}
