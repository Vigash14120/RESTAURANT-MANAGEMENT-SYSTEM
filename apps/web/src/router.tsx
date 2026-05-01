import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "./layout/AppShell";
import { DashboardPage } from "./pages/DashboardPage";
import { FloorTablesPage } from "./pages/FloorTablesPage";
import { InventorySuppliersPage } from "./pages/InventorySuppliersPage";
import { OrdersKitchenPage } from "./pages/OrdersKitchenPage";
import { ReservationsPage } from "./pages/ReservationsPage";
import { StaffingAssignmentsPage } from "./pages/StaffingAssignmentsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <DashboardPage />
      },
      {
        path: "floor-tables",
        element: <FloorTablesPage />
      },
      {
        path: "reservations",
        element: <ReservationsPage />
      },
      {
        path: "orders-kitchen",
        element: <OrdersKitchenPage />
      },
      {
        path: "inventory-suppliers",
        element: <InventorySuppliersPage />
      },
      {
        path: "staffing-assignments",
        element: <StaffingAssignmentsPage />
      }
    ]
  }
]);
