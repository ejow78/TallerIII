import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SuperAdminDashboard = lazy(() =>
  import("@/components/dashboard/SuperAdminDashboard")
);
const WorkshopDashboard = lazy(() =>
  import("@/components/dashboard/WorkshopDashboard")
);

const DashboardSkeleton = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="space-y-2">
      <Skeleton className="h-9 w-48" />
      <Skeleton className="h-4 w-72" />
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-28 w-full rounded-2xl" />
      <Skeleton className="h-28 w-full rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Skeleton className="h-[320px] w-full rounded-2xl" />
      </div>
      <div>
        <Skeleton className="h-[320px] w-full rounded-2xl" />
      </div>
    </div>
  </div>
);

export default function DashboardPage() {
  const user = JSON.parse(
    sessionStorage.getItem("repairit_user") ||
      localStorage.getItem("repairit_user") ||
      "{}"
  );

  return (
    <Suspense fallback={<DashboardSkeleton />}>
      {user.role === "superadmin" ? (
        <SuperAdminDashboard />
      ) : (
        <WorkshopDashboard user={user} />
      )}
    </Suspense>
  );
}
