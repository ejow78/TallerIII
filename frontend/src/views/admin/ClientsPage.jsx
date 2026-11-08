import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useClientsData } from "@/components/clients/useClientsData";
import { ClientsHeader } from "@/components/clients/ClientsHeader";
import { ClientsFilterToolbar } from "@/components/clients/ClientsFilterToolbar";
import { ClientsTable } from "@/components/clients/ClientsTable";
import { ClientModal } from "@/components/clients/ClientModal";
import { ClientOrdersModal } from "@/components/clients/ClientOrdersModal";
import { ClientsDeleteDialog } from "@/components/clients/ClientsDeleteDialog";

export default function ClientsPage() {
  const navigate = useNavigate();
  const {
    isTechnician,
    clients,
    orders,
    profile,
    loading,
    searchQuery,
    setSearchQuery,
    filteredClients,
    loadData,
    showClientModal,
    editingClient,
    openCreateModal,
    openEditModal,
    closeClientModal,
    showOrdersModal,
    selectedClientForOrders,
    openOrdersModal,
    closeOrdersModal,
    clientToDelete,
    showDeleteAlert,
    requestDeleteClient,
    confirmDeleteClient,
    cancelDelete,
    handleExportToExcel,
  } = useClientsData();

  return (
    <div className="space-y-5">
      {/* Cabecera Superior */}
      <ClientsHeader
        onExportExcel={handleExportToExcel}
        onNewClient={openCreateModal}
      />

      {/* Contenedor Principal: Filtros + Tabla */}
      <Card className="bg-card/30 border-border/80 p-3.5 sm:p-5 shadow-sm space-y-4">
        <ClientsFilterToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          totalCount={filteredClients.length}
        />

        <ClientsTable
          loading={loading}
          clients={filteredClients}
          orders={orders}
          isTechnician={isTechnician}
          onNewOrder={(client) =>
            navigate("/dashboard/nuevo-ingreso", { state: { client } })
          }
          onViewOrders={openOrdersModal}
          onEdit={openEditModal}
          onDelete={requestDeleteClient}
        />
      </Card>

      {/* Modal Crear / Editar Cliente */}
      {showClientModal && (
        <ClientModal
          isOpen={showClientModal}
          onClose={closeClientModal}
          client={editingClient}
          clientsList={clients}
          onSaved={loadData}
        />
      )}

      {/* Modal de Órdenes del Cliente */}
      {showOrdersModal && selectedClientForOrders && (
        <ClientOrdersModal
          isOpen={showOrdersModal}
          onClose={closeOrdersModal}
          client={selectedClientForOrders}
          orders={orders}
          profile={profile}
        />
      )}

      {/* Alerta de confirmación de eliminación */}
      <ClientsDeleteDialog
        isOpen={showDeleteAlert}
        onOpenChange={(open) => !open && cancelDelete()}
        client={clientToDelete}
        onConfirm={confirmDeleteClient}
      />
    </div>
  );
}
