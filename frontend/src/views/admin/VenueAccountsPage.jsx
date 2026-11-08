import { Button } from "@/components/ui/button";
import { KeyRound, Plus, Info } from "lucide-react";
import { useVenueAccounts } from "@/components/accounts/useVenueAccounts";
import { VenueAccountsRestrictedView } from "@/components/accounts/VenueAccountsRestrictedView";
import { VenueAccountsTable } from "@/components/accounts/VenueAccountsTable";
import { CreateVenueAccountModal } from "@/components/accounts/CreateVenueAccountModal";

export default function VenueAccountsPage() {
  const {
    accounts,
    venues,
    loading,
    showModal,
    setShowModal,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    venueId,
    setVenueId,
    showPassword,
    setShowPassword,
    submitting,
    isMultiTaller,
    handleCreate,
    handleDelete,
  } = useVenueAccounts();

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-light">
            Cargando cuentas de acceso...
          </p>
        </div>
      </div>
    );
  }

  // Vista cuando no tienen el plan correcto
  if (!isMultiTaller) {
    return <VenueAccountsRestrictedView />;
  }

  return (
    <div className="space-y-6 max-w-6xl">
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
        <div className="space-y-1 text-left">
          <p className="text-foreground font-medium">¿Cómo funcionan estas cuentas?</p>
          <p>
            Estas credenciales están diseñadas para ser ingresadas en las computadoras fijas del taller de cada sucursal.{" "}
            El personal técnico que inicie sesión con estas cuentas{" "}
            <strong className="font-semibold text-foreground">
              solo podrá ver, editar y registrar información correspondiente a su sucursal asociada
            </strong>
            . No tendrán acceso a la facturación, configuración global ni a otras sucursales.
          </p>
        </div>
      </div>

      {/* Table Card */}
      <VenueAccountsTable accounts={accounts} onDelete={handleDelete} />

      {/* Modal Creación */}
      <CreateVenueAccountModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        venueId={venueId}
        setVenueId={setVenueId}
        venues={venues}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        submitting={submitting}
        onSubmit={handleCreate}
      />
    </div>
  );
}
