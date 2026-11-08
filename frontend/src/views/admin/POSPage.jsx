import { usePosTerminal } from "@/components/pos/usePosTerminal";
import { PosUpgradePrompt } from "@/components/pos/PosUpgradePrompt";
import { PosHeader } from "@/components/pos/PosHeader";
import { PosProductCatalog } from "@/components/pos/PosProductCatalog";
import { PosCartCheckout } from "@/components/pos/PosCartCheckout";
import { PosSalesHistory } from "@/components/pos/PosSalesHistory";

export default function POSPage() {
  const {
    hasAccess,
    activeTab,
    setActiveTab,
    items,
    loading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    cart,
    setCart,
    paymentMethod,
    setPaymentMethod,
    submitting,
    cashReceived,
    setCashReceived,
    venues,
    selectedVenueFilter,
    setSelectedVenueFilter,
    dateRangeFilter,
    setDateRangeFilter,
    salesLoading,
    searchInputRef,
    categories,
    filteredItems,
    addToCart,
    updateCartQty,
    removeFromCart,
    total,
    handleCheckout,
    handleCashKeyDown,
    filteredSales,
    salesBreakdown,
    handlePrintReceipt,
    handleExportSalesToExcel,
    isMultiTaller,
    isAdmin,
  } = usePosTerminal();

  if (loading) {
    return (
      <div className="flex h-[65vh] items-center justify-center text-foreground">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-muted-foreground font-light">
            Cargando punto de venta...
          </p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return <PosUpgradePrompt />;
  }

  return (
    <div className="space-y-6">
      {/* Cabecera Superior con selector de pestaña */}
      <PosHeader activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "venta" ? (
        /* VISTA DE TERMINAL POS (Catálogo + Ticket) */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <PosProductCatalog
            searchInputRef={searchInputRef}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            categories={categories}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            totalItemsCount={items.length}
            filteredItems={filteredItems}
            cart={cart}
            onAddToCart={addToCart}
          />

          <PosCartCheckout
            cart={cart}
            setCart={setCart}
            onUpdateCartQty={updateCartQty}
            onRemoveFromCart={removeFromCart}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            cashReceived={cashReceived}
            setCashReceived={setCashReceived}
            onCashKeyDown={handleCashKeyDown}
            total={total}
            submitting={submitting}
            onCheckout={handleCheckout}
          />
        </div>
      ) : (
        /* VISTA DE HISTORIAL DE VENTAS Y ARQUEO */
        <PosSalesHistory
          salesLoading={salesLoading}
          filteredSales={filteredSales}
          salesBreakdown={salesBreakdown}
          dateRangeFilter={dateRangeFilter}
          setDateRangeFilter={setDateRangeFilter}
          isMultiTaller={isMultiTaller}
          isAdmin={isAdmin}
          venues={venues}
          selectedVenueFilter={selectedVenueFilter}
          setSelectedVenueFilter={setSelectedVenueFilter}
          onExportExcel={handleExportSalesToExcel}
          onPrintReceipt={handlePrintReceipt}
        />
      )}
    </div>
  );
}
