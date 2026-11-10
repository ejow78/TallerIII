import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Card } from "@/components/ui/card";
import { DashboardSidebar } from "@/components/layout/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/layout/dashboard/DashboardHeader";
import OrdersFilterToolbar from "@/components/orders/OrdersFilterToolbar";
import OrdersTable from "@/components/orders/OrdersTable";

const NOOP = () => {};

const MOCK_USER = {
  name: "Javier Ortiz",
  role: "admin",
};

const MOCK_VENUE = {
  _id: "venue-1",
  name: "FixTech San Miguel",
};

const MOCK_VENUES = [
  MOCK_VENUE,
  { _id: "venue-2", name: "FixTech Centro" },
];

const MOCK_SIDEBAR_STATS = {
  activeOrders: 8,
  lowStock: 1,
  outOfStock: 0,
  contactMessagesCount: 0,
};

const MOCK_ORDERS = [
  {
    _id: "ord-1",
    trackingCode: "RT-RAPKTXBH",
    date: "10/11/2026",
    time: "09:05",
    clientId: {
      name: "Javier Ortiz",
      dni: "3812992200",
      phone: "3812992200",
    },
    deviceModel: "Lenovo ThinkPad T14",
    deviceType: "Notebook",
    diagnosis: "",
    budget: { items: [], approved: false },
    status: "ingresado",
  },
  {
    _id: "ord-2",
    trackingCode: "RT-YB77218M",
    date: "09/11/2026",
    time: "15:00",
    clientId: {
      name: "Mariana Terán",
      dni: "41254789",
      phone: "+54 9 381 555-6622",
    },
    deviceModel: "Lenovo Tab M10 HD",
    deviceType: "Tablet",
    diagnosis: "",
    budget: { items: [], approved: false },
    status: "ingresado",
  },
  {
    _id: "ord-3",
    trackingCode: "RT-YB11009X",
    date: "07/11/2026",
    time: "11:30",
    clientId: {
      name: "Camila Costas",
      dni: "43222111",
      phone: "+54 9 381 483-5922",
    },
    deviceModel: "Xiaomi Redmi Note 12S",
    deviceType: "Smartphone",
    diagnosis: "",
    budget: { items: [], approved: false },
    status: "ingresado",
  },
  {
    _id: "ord-4",
    trackingCode: "RT-YB55214Z",
    date: "04/11/2026",
    time: "17:00",
    clientId: {
      name: "Nicolás Aráoz",
      dni: "37888999",
      phone: "+54 9 381 577-8990",
    },
    deviceModel: "Motorola Moto G54 5G",
    deviceType: "Smartphone",
    diagnosis: "Display IPS destruido. Placa base intacta.",
    budget: { items: [{ price: 75000 }], approved: true },
    status: "en_reparacion",
  },
  {
    _id: "ord-5",
    trackingCode: "RT-YB44321P",
    date: "26/10/2026",
    time: "10:15",
    clientId: {
      name: "Mariana Terán",
      dni: "41254789",
      phone: "+54 9 381 555-6622",
    },
    deviceModel: "Dell Inspiron 3515 Ryzen 5",
    deviceType: "Notebook",
    diagnosis: "Teclado con pistas cortadas por derrame.",
    budget: { items: [{ price: 53000 }], approved: false },
    status: "presupuestado",
  },
  {
    _id: "ord-6",
    trackingCode: "RT-YB66321Q",
    date: "18/10/2026",
    time: "16:30",
    clientId: {
      name: "Esteban Ramos",
      dni: "33554987",
      phone: "+54 9 381 632-5577",
    },
    deviceModel: "Asus VivoBook 15",
    deviceType: "Notebook",
    diagnosis: "Celdas de ion de litio agotadas (11% salud).",
    budget: { items: [{ price: 57000 }], approved: false },
    status: "entregado",
  },
  {
    _id: "ord-7",
    trackingCode: "RT-YB99124K",
    date: "16/10/2026",
    time: "14:00",
    clientId: {
      name: "Gonzalo Herrera",
      dni: "35789123",
      phone: "+54 9 381 422-7700",
    },
    deviceModel: "Custom Gamer Core i7 RTX 3060",
    deviceType: "PC Escritorio",
    diagnosis: "Pasta térmica de microprocesador seca.",
    budget: { items: [{ price: 34000 }], approved: true },
    status: "listo",
  },
  {
    _id: "ord-8",
    trackingCode: "RT-YB81249A",
    date: "10/09/2026",
    time: "12:00",
    clientId: {
      name: "Sofía Albarracín",
      dni: "39115244",
      phone: "+54 9 381 555-8811",
    },
    deviceModel: "Motorola Edge 40 Neo",
    deviceType: "Smartphone",
    diagnosis: "Reemplazo de cristal protector de cámara.",
    budget: { items: [{ price: 19000 }], approved: false },
    status: "entregado",
  },
];

export function OrdersMockView() {
  return (
    <SidebarProvider className="h-full max-h-full min-h-0 overflow-hidden">
      <div className="flex h-full max-h-full w-full overflow-hidden bg-background text-foreground font-sans select-none">
        <DashboardSidebar
          collapsible="none"
          isSuperAdmin={false}
          user={MOCK_USER}
          activeVenue={MOCK_VENUE}
          effectivePlan="Multi-Taller Pro"
          sidebarStats={MOCK_SIDEBAR_STATS}
          currentPath="/dashboard/ordenes"
          onLogout={NOOP}
        />

        <SidebarInset className="flex-1 flex flex-col min-w-0 h-full max-h-full overflow-hidden bg-background">
          <DashboardHeader
            isSuperAdmin={false}
            user={MOCK_USER}
            activeVenue={MOCK_VENUE}
            venues={MOCK_VENUES}
            effectivePlan="Multi-Taller Pro"
            currentPath="/dashboard/ordenes"
            onSwitchVenue={NOOP}
          />

          <main className="flex-1 min-h-0 p-5 overflow-hidden w-full">
            <div className="space-y-5">
              <OrdersFilterToolbar
                searchQuery=""
                setSearchQuery={NOOP}
                statusFilter="todos"
                setStatusFilter={NOOP}
                onExportToExcel={NOOP}
              />

              <Card className="bg-card/30 border-border/80 p-5 shadow-sm space-y-4 overflow-hidden">
                <OrdersTable
                  orders={MOCK_ORDERS}
                  loading={false}
                  canUsePOS={true}
                  isTechnician={false}
                  onStatusChange={NOOP}
                  onOpenDetailModal={NOOP}
                  onOpenDiagModal={NOOP}
                  onOpenEditReceptionModal={NOOP}
                  onOpenChargePosModal={NOOP}
                  onDeleteOrder={NOOP}
                  onPrintOrder={NOOP}
                  onSendWhatsApp={NOOP}
                  getPublicTrackingUrl={() => "#"}
                />
              </Card>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
