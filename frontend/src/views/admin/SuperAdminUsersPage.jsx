import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, MessageSquare, RefreshCw } from "lucide-react";
import { useSuperAdminUsers } from "@/components/superadmin/useSuperAdminUsers";
import { SuperAdminUsersSkeleton } from "@/components/superadmin/SuperAdminUsersSkeleton";
import { SuperAdminKpis } from "@/components/superadmin/SuperAdminKpis";
import { SuperAdminUsersFilterToolbar } from "@/components/superadmin/SuperAdminUsersFilterToolbar";
import { SuperAdminUsersTable } from "@/components/superadmin/SuperAdminUsersTable";
import { SuperAdminManageUserModal } from "@/components/superadmin/SuperAdminManageUserModal";
import { SuperAdminContactMessagesTab } from "@/components/superadmin/SuperAdminContactMessagesTab";

export default function SuperAdminUsersPage() {
  const location = useLocation();
  const activeTab =
    location.pathname === "/dashboard/consultas" ? "consultas" : "usuarios";

  const {
    loading,
    organizations,
    searchQuery,
    setSearchQuery,
    messageSearchQuery,
    setMessageSearchQuery,
    roleFilter,
    setRoleFilter,
    orgFilter,
    setOrgFilter,
    filteredUsers,
    filteredContactMessages,
    totalCount,
    adminsCount,
    techsCount,
    superCount,
    loadData,
    handleRoleChange,
    handleDeleteUser,
    handleDeleteContactMessage,
    showManageModal,
    selectedUser,
    modalName,
    setModalName,
    modalEmail,
    setModalEmail,
    modalRole,
    setModalRole,
    modalVenueId,
    setModalVenueId,
    modalPassword,
    setModalPassword,
    showPassword,
    setShowPassword,
    submitting,
    selectedOrgVenues,
    handleOpenManageModal,
    handleCloseManageModal,
    handleUpdateUser,
  } = useSuperAdminUsers();

  if (loading) {
    return <SuperAdminUsersSkeleton />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Cabecera Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-outfit text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center gap-2.5">
            {activeTab === "consultas" ? (
              <>
                <MessageSquare className="w-7 h-7 text-primary shrink-0" />
                <span>Consultas Web</span>
              </>
            ) : (
              <>
                <Users className="w-7 h-7 text-primary shrink-0" />
                <span>Gestión de Usuarios</span>
              </>
            )}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-light">
            {activeTab === "consultas"
              ? "Bandeja de mensajes y consultas enviadas desde el formulario de contacto de la Landing Page."
              : "Administración centralizada de cuentas de administradores, técnicos de sucursal y credenciales de acceso."}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={loadData}
          className="h-9 border-border/80 text-xs font-semibold rounded-xl flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Actualizar Listado
        </Button>
      </div>

      {activeTab === "usuarios" && (
        <SuperAdminKpis
          totalCount={totalCount}
          adminsCount={adminsCount}
          techsCount={techsCount}
          superCount={superCount}
        />
      )}

      {activeTab === "usuarios" ? (
        <Card className="bg-card/30 border-border/80 p-4 sm:p-6 shadow-sm space-y-5">
          <SuperAdminUsersFilterToolbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            orgFilter={orgFilter}
            setOrgFilter={setOrgFilter}
            organizations={organizations}
            filteredCount={filteredUsers.length}
            totalCount={totalCount}
          />
          <SuperAdminUsersTable
            filteredUsers={filteredUsers}
            onOpenManageModal={handleOpenManageModal}
            onRoleChange={handleRoleChange}
            onDeleteUser={handleDeleteUser}
          />
        </Card>
      ) : (
        <SuperAdminContactMessagesTab
          filteredContactMessages={filteredContactMessages}
          messageSearchQuery={messageSearchQuery}
          setMessageSearchQuery={setMessageSearchQuery}
          onDeleteContactMessage={handleDeleteContactMessage}
        />
      )}

      <SuperAdminManageUserModal
        isOpen={showManageModal}
        onClose={handleCloseManageModal}
        selectedUser={selectedUser}
        modalName={modalName}
        setModalName={setModalName}
        modalEmail={modalEmail}
        setModalEmail={setModalEmail}
        modalRole={modalRole}
        setModalRole={setModalRole}
        modalVenueId={modalVenueId}
        setModalVenueId={setModalVenueId}
        modalPassword={modalPassword}
        setModalPassword={setModalPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        submitting={submitting}
        selectedOrgVenues={selectedOrgVenues}
        onSubmit={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
}
