import { Card } from "@/components/ui/card";
import { useInventoryData } from "@/components/inventory/useInventoryData";
import { InventoryHeader } from "@/components/inventory/InventoryHeader";
import { InventoryKpis } from "@/components/inventory/InventoryKpis";
import { InventoryFilterToolbar } from "@/components/inventory/InventoryFilterToolbar";
import { InventoryTable } from "@/components/inventory/InventoryTable";
import { InventoryItemModal } from "@/components/inventory/InventoryItemModal";

export default function InventoryPage() {
  const {
    isTechnician,
    items,
    loading,
    loadData,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    isModalOpen,
    editingItem,
    openCreateModal,
    openEditModal,
    closeModal,
    fileInputRef,
    availableCategories,
    adjustQuantity,
    handleDeleteItem,
    handleExportToExcel,
    handleImportCSV,
    filteredItems,
    totalValue,
    criticalItems,
  } = useInventoryData();

  return (
    <div className="space-y-5">
      {/* Cabecera Superior con Acciones */}
      <InventoryHeader
        fileInputRef={fileInputRef}
        onImportCSV={handleImportCSV}
        onExportExcel={handleExportToExcel}
        onOpenCreateModal={() => openCreateModal()}
      />

      {/* KPIs de Inventario */}
      <InventoryKpis
        itemsCount={items.length}
        totalValue={totalValue}
        criticalItems={criticalItems}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
      />

      {/* Contenedor Principal: Filtros + Tabla */}
      <Card className="bg-card/30 border-border/80 p-3.5 sm:p-5 shadow-sm space-y-4">
        <InventoryFilterToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          availableCategories={availableCategories}
        />

        <InventoryTable
          loading={loading}
          items={filteredItems}
          isTechnician={isTechnician}
          onAdjustQuantity={adjustQuantity}
          onEdit={openEditModal}
          onDelete={handleDeleteItem}
        />
      </Card>

      {/* Modal para Creación / Edición */}
      {isModalOpen && (
        <InventoryItemModal
          isOpen={isModalOpen}
          onClose={closeModal}
          item={editingItem}
          availableCategories={availableCategories}
          onSaved={loadData}
        />
      )}
    </div>
  );
}
