import { Store } from "lucide-react";
import { useProfileWorkshop } from "@/components/profile/useProfileWorkshop";
import { ActiveVenueFormCard } from "@/components/profile/ActiveVenueFormCard";
import { OrganizationVenuesCard } from "@/components/profile/OrganizationVenuesCard";
import { SubscriptionCard } from "@/components/profile/SubscriptionCard";
import { VenueModal } from "@/components/profile/VenueModal";
import { SubscriptionPlansModal } from "@/components/profile/SubscriptionPlansModal";

export default function ProfilePage() {
  const {
    venueName,
    setVenueName,
    address,
    setAddress,
    hours,
    setHours,
    phone,
    setPhone,
    email,
    setEmail,
    venues,
    subscriptionPlan,
    subscriptionStatus,
    showPlansModal,
    setShowPlansModal,
    showModal,
    setShowModal,
    modalMode,
    modalName,
    setModalName,
    modalEmail,
    setModalEmail,
    modalPhone,
    setModalPhone,
    modalAddress,
    setModalAddress,
    modalHours,
    setModalHours,
    handleSave,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleModalSubmit,
    handleSwitchActiveVenue,
  } = useProfileWorkshop();

  return (
    <div className="space-y-6">
      {/* Cabecera interna */}
      <div className="space-y-1">
        <h1 className="font-outfit text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
          <Store className="w-6 h-6 sm:w-7 sm:h-7 text-primary shrink-0" />
          <span>Configuración de Taller</span>
        </h1>
        <p className="text-xs text-muted-foreground font-light">
          Gestión de los datos comerciales de la sucursal activa y estado de tu suscripción.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda (2/3): Datos principales del taller */}
        <div className="lg:col-span-2 space-y-6">
          <ActiveVenueFormCard
            venueName={venueName}
            setVenueName={setVenueName}
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            address={address}
            setAddress={setAddress}
            hours={hours}
            setHours={setHours}
            onSubmit={handleSave}
          />
          <OrganizationVenuesCard
            venues={venues}
            activeVenueName={venueName}
            subscriptionPlan={subscriptionPlan}
            onOpenCreateModal={handleOpenCreateModal}
            onOpenEditModal={handleOpenEditModal}
            onSwitchActiveVenue={handleSwitchActiveVenue}
            onOpenPlansModal={() => setShowPlansModal(true)}
          />
        </div>

        {/* Columna Derecha (1/3): Suscripción */}
        <div className="space-y-6">
          <SubscriptionCard
            subscriptionPlan={subscriptionPlan}
            subscriptionStatus={subscriptionStatus}
            onOpenPlansModal={() => setShowPlansModal(true)}
          />
        </div>
      </div>

      <VenueModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        modalMode={modalMode}
        modalName={modalName}
        setModalName={setModalName}
        modalAddress={modalAddress}
        setModalAddress={setModalAddress}
        modalHours={modalHours}
        setModalHours={setModalHours}
        modalPhone={modalPhone}
        setModalPhone={setModalPhone}
        modalEmail={modalEmail}
        setModalEmail={setModalEmail}
        onSubmit={handleModalSubmit}
      />

      <SubscriptionPlansModal
        isOpen={showPlansModal}
        onClose={() => setShowPlansModal(false)}
        subscriptionPlan={subscriptionPlan}
      />
    </div>
  );
}
