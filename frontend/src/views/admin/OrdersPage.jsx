import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { useOrdersData } from "@/components/orders/useOrdersData";
import OrdersFilterToolbar from "@/components/orders/OrdersFilterToolbar";
import OrdersTable from "@/components/orders/OrdersTable";
import OrderDetailModal from "@/components/orders/OrderDetailModal";
import DiagnosisBudgetModal from "@/components/orders/DiagnosisBudgetModal";
import EditReceptionModal from "@/components/orders/EditReceptionModal";
import ChargePosModal from "@/components/orders/ChargePosModal";

export default function OrdersPage() {
  const [detailOrder, setDetailOrder] = useState(null);
  const [diagOrder, setDiagOrder] = useState(null);
  const [editReceptionOrder, setEditReceptionOrder] = useState(null);
  const [chargeOrder, setChargeOrder] = useState(null);

  const handleDetailOrderUpdate = useCallback((sortedOrders) => {
    setDetailOrder((prev) => {
      if (!prev) return null;
      return sortedOrders.find((o) => o._id === prev._id) || prev;
    });
  }, []);

  const {
    inventoryItems,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    profile,
    canUsePOS,
    isTechnician,
    loadData,
    handleStatusChange,
    handleDeleteOrder,
    handlePrintOrder,
    handleSendWhatsApp,
    handleExportToExcel,
    filteredOrders,
    getPublicTrackingUrl,
  } = useOrdersData(handleDetailOrderUpdate);

  const onStatusChangeWithDetail = async (id, newStatus) => {
    setDetailOrder((prev) => {
      if (!prev || prev._id !== id) return prev;
      return { ...prev, status: newStatus };
    });
    await handleStatusChange(id, newStatus);
  };

  const onDeleteOrderWithDetail = async (order) => {
    if (detailOrder?._id === order._id) {
      setDetailOrder(null);
    }
    await handleDeleteOrder(order);
  };

  return (
    <div className="space-y-5">
      <OrdersFilterToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onExportToExcel={handleExportToExcel}
      />

      <Card className="bg-card/30 border-border/80 p-2.5 sm:p-5 shadow-sm space-y-4 overflow-hidden">
        <OrdersTable
          orders={filteredOrders}
          loading={loading}
          canUsePOS={canUsePOS}
          isTechnician={isTechnician}
          onStatusChange={onStatusChangeWithDetail}
          onOpenDetailModal={setDetailOrder}
          onOpenDiagModal={setDiagOrder}
          onOpenEditReceptionModal={setEditReceptionOrder}
          onOpenChargePosModal={setChargeOrder}
          onDeleteOrder={onDeleteOrderWithDetail}
          onPrintOrder={handlePrintOrder}
          onSendWhatsApp={handleSendWhatsApp}
          getPublicTrackingUrl={getPublicTrackingUrl}
        />
      </Card>

      {/* Modales */}
      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          canUsePOS={canUsePOS}
          isTechnician={isTechnician}
          onClose={() => setDetailOrder(null)}
          onStatusChange={onStatusChangeWithDetail}
          onOpenEditReceptionModal={setEditReceptionOrder}
          onOpenDiagModal={setDiagOrder}
          onOpenChargePosModal={setChargeOrder}
          onSendWhatsApp={handleSendWhatsApp}
          onPrintOrder={handlePrintOrder}
          onDeleteOrder={onDeleteOrderWithDetail}
          getPublicTrackingUrl={getPublicTrackingUrl}
        />
      )}

      {diagOrder && (
        <DiagnosisBudgetModal
          order={diagOrder}
          inventoryItems={inventoryItems}
          profile={profile}
          onClose={() => setDiagOrder(null)}
          onSuccess={loadData}
        />
      )}

      {editReceptionOrder && (
        <EditReceptionModal
          order={editReceptionOrder}
          onClose={() => setEditReceptionOrder(null)}
          onSuccess={loadData}
        />
      )}

      {chargeOrder && (
        <ChargePosModal
          order={chargeOrder}
          profile={profile}
          onClose={() => setChargeOrder(null)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}
