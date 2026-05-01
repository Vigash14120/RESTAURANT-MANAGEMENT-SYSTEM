import { useEffect, useState } from "react";

import type { DashboardSummaryDto } from "@rms/shared-types";

import { fetchApi, isApiSuccess } from "../api/client";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummaryDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchApi<DashboardSummaryDto>("/dashboard/summary");
      if (!isApiSuccess(response)) {
        throw new Error(response.error.message);
      }
      setSummary(response.data);
    } catch (unknownError) {
      setError(errorMessage(unknownError, "Failed to load dashboard summary."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <div className="page-stack">
      <div className="page-card">
        <div className="action-row">
          <h2>Dashboard</h2>
          <button type="button" onClick={() => void refresh()} disabled={loading}>
            Refresh
          </button>
        </div>
        <p className="muted-text">Cross-module health view for reservations, orders, inventory, and staffing.</p>
        {error ? <p className="state-text error">{error}</p> : null}
        {loading ? <p className="state-text">Refreshing dashboard...</p> : null}
      </div>

      {summary ? (
        <>
          <div className="kpi-grid">
            <article className="kpi-card">
              <h3>Active Reservations</h3>
              <p>{summary.kpis.activeReservations}</p>
            </article>
            <article className="kpi-card">
              <h3>Total Reservations</h3>
              <p>{summary.kpis.totalReservations}</p>
            </article>
            <article className="kpi-card">
              <h3>Total Tickets</h3>
              <p>{summary.kpis.totalTickets}</p>
            </article>
            <article className="kpi-card">
              <h3>Kitchen Queue</h3>
              <p>{summary.kpis.kitchenQueue}</p>
            </article>
            <article className="kpi-card">
              <h3>Service Queue</h3>
              <p>{summary.kpis.serviceQueue}</p>
            </article>
            <article className="kpi-card">
              <h3>Emergency Requests</h3>
              <p>{summary.kpis.emergencyRequests}</p>
            </article>
            <article className="kpi-card">
              <h3>Low Stock Items</h3>
              <p>{summary.kpis.lowStockItems}</p>
            </article>
            <article className="kpi-card">
              <h3>Total Suppliers</h3>
              <p>{summary.kpis.totalSuppliers}</p>
            </article>
            <article className="kpi-card">
              <h3>Total Staff</h3>
              <p>{summary.kpis.totalStaff}</p>
            </article>
            <article className="kpi-card">
              <h3>Staff Members</h3>
              <p>{summary.kpis.totalStaffMembers}</p>
            </article>
            <article className="kpi-card">
              <h3>Job Assignments</h3>
              <p>{summary.kpis.totalJobAssignments}</p>
            </article>
          </div>

          <div className="dashboard-two-col">
            <div className="page-card">
              <h3>Low Stock Watch</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Ingredient</th>
                      <th>Stock Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.lowStockIngredients.length === 0 ? (
                      <tr>
                        <td colSpan={2}>No ingredients below threshold.</td>
                      </tr>
                    ) : (
                      summary.lowStockIngredients.map((item) => (
                        <tr key={item.ingredientId}>
                          <td>{item.ingredientId}</td>
                          <td>{item.stockLevel.toFixed(2)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="page-card">
              <h3>Upcoming Shifts</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Shift</th>
                      <th>Staff</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.upcomingShifts.length === 0 ? (
                      <tr>
                        <td colSpan={3}>No shift logs yet.</td>
                      </tr>
                    ) : (
                      summary.upcomingShifts.map((shift) => (
                        <tr key={shift.shiftLogId}>
                          <td>{shift.shiftLogId}</td>
                          <td>
                            {shift.staffFirstName} {shift.staffLastName}
                          </td>
                          <td>{new Date(shift.shiftTime).toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="dashboard-two-col">
            <div className="page-card">
              <h3>Latest Reservations</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Reservation</th>
                      <th>Table</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.latestReservations.length === 0 ? (
                      <tr>
                        <td colSpan={3}>No reservations found.</td>
                      </tr>
                    ) : (
                      summary.latestReservations.map((reservation) => (
                        <tr key={reservation.reservationId}>
                          <td>{reservation.reservationId}</td>
                          <td>{reservation.tableNumber}</td>
                          <td>{reservation.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="page-card">
              <h3>Latest Tickets</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Ticket</th>
                      <th>Order</th>
                      <th>Party Size</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.latestTickets.length === 0 ? (
                      <tr>
                        <td colSpan={3}>No tickets found.</td>
                      </tr>
                    ) : (
                      summary.latestTickets.map((ticket) => (
                        <tr key={ticket.ticketId}>
                          <td>{ticket.ticketId}</td>
                          <td>{ticket.customerOrderId}</td>
                          <td>{ticket.partySize}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="page-card">
            <h3>Maintenance Logs</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Log</th>
                    <th>Supplier</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.latestMaintenanceLogs.length === 0 ? (
                    <tr>
                      <td colSpan={3}>No maintenance logs found.</td>
                    </tr>
                  ) : (
                    summary.latestMaintenanceLogs.map((log) => (
                      <tr key={log.maintenanceLogId}>
                        <td>{log.maintenanceLogId}</td>
                        <td>{log.companyName}</td>
                        <td>{log.details ?? "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
