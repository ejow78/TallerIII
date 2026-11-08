import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Users, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useSuperAdminDashboard } from "./superadmin/useSuperAdminDashboard";
import { SuperAdminDashboardSkeleton } from "./superadmin/SuperAdminDashboardSkeleton";
import { SuperAdminMetricsCards } from "./superadmin/SuperAdminMetricsCards";
import { SuperAdminOrgsFilterToolbar } from "./superadmin/SuperAdminOrgsFilterToolbar";
import { SuperAdminOrgsTable } from "./superadmin/SuperAdminOrgsTable";
import { SuperAdminViewOrgModal } from "./superadmin/SuperAdminViewOrgModal";
import { SuperAdminEditOrgModal } from "./superadmin/SuperAdminEditOrgModal";

export default function SuperAdminDashboard() {
  const {
    organizations,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    planFilter,
    setPlanFilter,
    viewingOrg,
    setViewingOrg,
    editingOrg,
    setEditingOrg,
    editOrgName,
    setEditOrgName,
    editOrgPlan,
    setEditOrgPlan,
    editOrgStatus,
    setEditOrgStatus,
    editingVenue,
    setEditingVenue,
    submittingSuper,
    loading,
    loadSuperData,
    handlePlanChange,
    handleStatusChange,
    handleOpenEditOrg,
    handleSaveEditOrg,
    handleDeleteOrg,
    handleSaveVenueAsSuper,
    filteredOrgs,
    totalOrgs,
    activeOrgs,
    suspendedOrgs,
    totalVenues,
  } = useSuperAdminDashboard();

  if (loading) {
    return <SuperAdminDashboardSkeleton />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Cabecera Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-outfit text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-primary shrink-0" />
            <span>Plataforma de Suscripciones</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-light">
            Administración centralizada de talleres, licencias operativas, sucursales y planes de suscripción.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={loadSuperData}
            className="h-9 border-border/80 text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Actualizar
          </Button>
          <Link to="/dashboard/usuarios">
            <Button className="h-9 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm">
              <Users className="w-3.5 h-3.5" />
              Gestionar Usuarios
            </Button>
          </Link>
        </div>
      </div>

      {/* Tarjetas de Métricas de Plataforma */}
      <SuperAdminMetricsCards
        totalOrgs={totalOrgs}
        activeOrgs={activeOrgs}
        suspendedOrgs={suspendedOrgs}
        totalVenues={totalVenues}
      />

      {/* Listado y Control de Talleres */}
      <Card className="bg-card/30 border-border/80 p-4 sm:p-6 shadow-sm space-y-5">
        <SuperAdminOrgsFilterToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          planFilter={planFilter}
          setPlanFilter={setPlanFilter}
          filteredCount={filteredOrgs.length}
          totalCount={organizations.length}
        />
        <SuperAdminOrgsTable
          filteredOrgs={filteredOrgs}
          onViewOrg={setViewingOrg}
          onOpenEditOrg={handleOpenEditOrg}
          onDeleteOrg={handleDeleteOrg}
          onPlanChange={handlePlanChange}
          onStatusChange={handleStatusChange}
        />
      </Card>

      {/* Modal: Ver Detalle de Taller (Sucursales y Cuentas) */}
      <SuperAdminViewOrgModal
        viewingOrg={viewingOrg}
        onClose={() => {
          setViewingOrg(null);
          setEditingVenue(null);
        }}
        editingVenue={editingVenue}
        setEditingVenue={setEditingVenue}
        handleSaveVenueAsSuper={handleSaveVenueAsSuper}
        submittingSuper={submittingSuper}
        onOpenEditOrg={handleOpenEditOrg}
      />

      {/* Modal: Editar Taller, Plan y Licencia */}
      <SuperAdminEditOrgModal
        editingOrg={editingOrg}
        onClose={() => setEditingOrg(null)}
        editOrgName={editOrgName}
        setEditOrgName={setEditOrgName}
        editOrgPlan={editOrgPlan}
        setEditOrgPlan={setEditOrgPlan}
        editOrgStatus={editOrgStatus}
        setEditOrgStatus={setEditOrgStatus}
        onSave={handleSaveEditOrg}
        onDelete={handleDeleteOrg}
        submittingSuper={submittingSuper}
      />
    </div>
  );
}
