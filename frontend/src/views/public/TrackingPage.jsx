import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { usePublicTracking } from "@/components/tracking/usePublicTracking";
import { TrackingHeroCard } from "@/components/tracking/TrackingHeroCard";
import { TrackingDiagnosisSection } from "@/components/tracking/TrackingDiagnosisSection";
import { TrackingBudgetSection } from "@/components/tracking/TrackingBudgetSection";
import { TrackingVenueCard } from "@/components/tracking/TrackingVenueCard";
import { TrackingHistoryCard } from "@/components/tracking/TrackingHistoryCard";

export default function TrackingPage() {
  const {
    id,
    order,
    loading,
    dniInput,
    setDniInput,
    isDialogOpen,
    setIsDialogOpen,
    approving,
    handleDownloadPdf,
    handleApproveBudget,
    handleResetDemo,
    isDemo,
    currentStepIndex,
    clientName,
    parsedVenue,
    venueName,
    venuePhone,
  } = usePublicTracking();

  if (loading) {
    return (
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 space-y-6 animate-fade-in">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-36 w-full rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="order-1 md:order-1 md:col-span-2 h-56 w-full rounded-2xl" />
          <Skeleton className="order-2 md:order-2 md:col-span-1 h-56 w-full rounded-2xl" />
          <Skeleton className="order-4 md:order-3 md:col-span-2 h-48 w-full rounded-2xl" />
          <Skeleton className="order-3 md:order-4 md:col-span-1 h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex-1 max-w-md w-full mx-auto px-6 py-20 text-center space-y-5 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto text-destructive shadow-sm">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="font-outfit text-xl font-bold text-foreground">
            Orden no encontrada
          </h2>
          <p className="text-xs text-muted-foreground font-light leading-relaxed">
            No se encontró información para el código{" "}
            <span className="font-mono font-bold text-foreground">"{id}"</span>
            . Comprobá el código o consultá a tu taller.
          </p>
        </div>
        <Button
          asChild
          variant="outline"
          className="text-xs font-bold rounded-xl px-5 h-9"
        >
          <Link to="/consulta">Ver otro seguimiento</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fade-in">
      {/* Botón superior de retorno */}
      <div className="flex items-center justify-between">
        <Link
          to="/consulta"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al portal de consulta
        </Link>
      </div>

      {/* Hero del Dispositivo y Stepper */}
      <TrackingHeroCard
        order={order}
        clientName={clientName}
        currentStepIndex={currentStepIndex}
        onDownloadPdf={handleDownloadPdf}
      />

      {/* Grid Bento: Informe + Cotización + Taller + Historial */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TrackingDiagnosisSection order={order} />

        <TrackingBudgetSection
          budget={order.budget}
          isDemo={isDemo}
          onResetDemo={handleResetDemo}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          dniInput={dniInput}
          setDniInput={setDniInput}
          approving={approving}
          onApproveBudget={handleApproveBudget}
        />

        <TrackingVenueCard
          venueName={venueName}
          parsedVenue={parsedVenue}
          venuePhone={venuePhone}
        />

        <TrackingHistoryCard history={order.history} />
      </div>
    </div>
  );
}
