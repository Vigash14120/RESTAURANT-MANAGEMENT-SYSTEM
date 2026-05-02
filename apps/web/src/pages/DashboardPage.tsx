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
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const refresh = async (isAuto = false) => {
    if (!isAuto) setLoading(true);
    setError(null);
    try {
      const response = await fetchApi<DashboardSummaryDto>("/dashboard/summary");
      if (!isApiSuccess(response)) {
        throw new Error(response.error.message);
      }
      setSummary(response.data);
      setLastUpdated(new Date());
    } catch (unknownError) {
      setError(errorMessage(unknownError, "Failed to load dashboard summary."));
    } finally {
      if (!isAuto) setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      void refresh(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-stack fade-in">
      <div className="page-card">
        <div className="action-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h2 style={{ margin: 0 }}>Dashboard</h2>
            <div className="live-indicator">
              <span className="pulse-dot"></span>
              LIVE
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="muted-text">Updated: {lastUpdated.toLocaleTimeString()}</span>
            <button type="button" onClick={() => void refresh()} disabled={loading}>
              {loading ? "Refreshed" : "Refresh Now"}
            </button>
          </div>
        </div>
        <p className="muted-text">Cross-module health view for reservations, orders, inventory, and staffing.</p>
        {error ? <p className="state-text error">{error}</p> : null}
      </div>

      {summary ? (
        <>
          <div className="kpi-grid">
            <article className="kpi-card success">
              <h3>📅 Active Reservations</h3>
              <p>{summary.kpis.activeReservations}</p>
              <div className="capacity-bar-bg">
                <div 
                  className={`capacity-bar-fill ${summary.kpis.activeReservations > 10 ? 'warning' : ''}`} 
                  style={{ width: `${Math.min((summary.kpis.activeReservations / 20) * 100, 100)}%` }}
                ></div>
              </div>
            </article>
            <article className="kpi-card primary">
              <h3>🎟️ Total Tickets</h3>
              <p>{summary.kpis.totalTickets}</p>
            </article>
            <article className="kpi-card warning">
              <h3>🍳 Kitchen Queue</h3>
              <p>{summary.kpis.kitchenQueue}</p>
            </article>
            <article className="kpi-card info">
              <h3>🍽️ Service Queue</h3>
              <p>{summary.kpis.serviceQueue}</p>
            </article>
            <article className="kpi-card danger">
              <h3>🚨 Emergency</h3>
              <p>{summary.kpis.emergencyRequests}</p>
            </article>
            <article className="kpi-card danger">
              <h3>📦 Low Stock</h3>
              <p>{summary.kpis.lowStockItems}</p>
            </article>
            <article className="kpi-card staff">
              <h3>👥 Total Staff</h3>
              <p>{summary.kpis.totalStaff}</p>
            </article>
            <article className="kpi-card staff">
              <h3>📋 Assignments</h3>
              <p>{summary.kpis.totalJobAssignments}</p>
            </article>
          </div>

          <div className="dashboard-two-col">
            <div className="page-card">
              <div className="dashboard-section-title">
                <h3>📦 Low Stock Watch</h3>
                <span className="status-chip danger">{summary.lowStockIngredients.length} Items</span>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Ingredient ID</th>
                      <th>Level</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.lowStockIngredients.length === 0 ? (
                      <tr>
                        <td colSpan={3}>No ingredients below threshold.</td>
                      </tr>
                    ) : (
                      summary.lowStockIngredients.map((item) => (
                        <tr key={item.ingredientId}>
                          <td><strong>#{item.ingredientId}</strong></td>
                          <td>{item.stockLevel.toFixed(2)}</td>
                          <td><span className="status-chip danger">Critical</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="page-card">
              <div className="dashboard-section-title">
                <h3>🗓️ Upcoming Shifts</h3>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Staff</th>
                      <th>Shift Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.upcomingShifts.length === 0 ? (
                      <tr>
                        <td colSpan={2}>No shift logs yet.</td>
                      </tr>
                    ) : (
                      summary.upcomingShifts.map((shift) => (
                        <tr key={shift.shiftLogId}>
                          <td>
                            <strong>{shift.staffFirstName} {shift.staffLastName}</strong>
                          </td>
                          <td>{new Date(shift.shiftTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
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
              <div className="dashboard-section-title">
                <h3>✅ Latest Reservations</h3>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
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
                      summary.latestReservations.map((res) => (
                        <tr key={res.reservationId}>
                          <td>#{res.reservationId}</td>
                          <td>Table {res.tableNumber}</td>
                          <td>
                            <span className={`status-chip ${res.status}`}>
                              {res.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="page-card">
              <div className="dashboard-section-title">
                <h3>🎫 Recent Tickets</h3>
              </div>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Ticket ID</th>
                      <th>Party</th>
                      <th>Time</th>
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
                          <td><strong>#{ticket.ticketId}</strong></td>
                          <td>{ticket.partySize} People</td>
                          <td>{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="page-card">
            <div className="dashboard-section-title">
              <h3>🔧 System Maintenance Logs</h3>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Supplier</th>
                    <th>Date</th>
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
                        <td><strong>{log.companyName}</strong></td>
                        <td>{new Date(log.loggedAt).toLocaleDateString()}</td>
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

