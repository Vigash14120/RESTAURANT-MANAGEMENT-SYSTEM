import type {
  CreateReservationRequest,
  ReservationDetailsDto,
  ReservationStatusName
} from "@rms/shared-types";
import { useCallback, useEffect, useMemo, useState } from "react";

import { fetchApi, isApiSuccess } from "../api/client";

type ReservationFilterStatus = "all" | ReservationStatusName;

const reservationStatusOptions: ReservationStatusName[] = [
  "pending",
  "confirmed",
  "cancelled",
  "completed"
];

function formatDateTime(value: string): string {
  const dateValue = new Date(value);
  return Number.isNaN(dateValue.getTime()) ? value : dateValue.toLocaleString();
}

function toDatetimeLocalValue(value: Date): string {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  const hours = String(value.getHours()).padStart(2, "0");
  const minutes = String(value.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getTransitionActions(status: ReservationStatusName): ReservationStatusName[] {
  if (status === "pending") {
    return ["confirmed", "cancelled"];
  }
  if (status === "confirmed") {
    return ["completed", "cancelled"];
  }
  return [];
}

export function ReservationsPage() {
  const [reservations, setReservations] = useState<ReservationDetailsDto[]>([]);
  const [statusFilter, setStatusFilter] = useState<ReservationFilterStatus>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [tableNumberInput, setTableNumberInput] = useState("1");
  const [partySizeInput, setPartySizeInput] = useState("2");
  const [reservationTimeInput, setReservationTimeInput] = useState(
    toDatetimeLocalValue(new Date(Date.now() + 60 * 60 * 1000))
  );
  const [initialStatusInput, setInitialStatusInput] = useState<ReservationStatusName>("pending");
  const [isCreatingReservation, setIsCreatingReservation] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const reservationsPath = useMemo(() => {
    if (statusFilter === "all") {
      return "/reservations";
    }
    return `/reservations?status=${statusFilter}`;
  }, [statusFilter]);

  const loadReservations = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    const response = await fetchApi<ReservationDetailsDto[]>(reservationsPath);
    if (!isApiSuccess(response)) {
      setReservations([]);
      setErrorMessage(response.error.message);
      setIsLoading(false);
      return;
    }
    setReservations(response.data);
    setIsLoading(false);
  }, [reservationsPath]);

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  async function handleCreateReservation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCreatingReservation(true);
    setFormMessage(null);

    const payload: CreateReservationRequest = {
      tableNumber: Number(tableNumberInput),
      partySize: Number(partySizeInput),
      reservationTime: new Date(reservationTimeInput).toISOString(),
      status: initialStatusInput
    };

    const response = await fetchApi<ReservationDetailsDto>("/reservations", {
      method: "POST",
      body: JSON.stringify(payload)
    });

    if (!isApiSuccess(response)) {
      setFormMessage(response.error.message);
      setIsCreatingReservation(false);
      return;
    }

    setFormMessage(`Reservation #${response.data.reservationId} created successfully.`);
    setIsCreatingReservation(false);
    await loadReservations();
  }

  async function handleStatusUpdate(reservationId: number, status: ReservationStatusName) {
    const response = await fetchApi<ReservationDetailsDto>(`/reservations/${reservationId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    if (!isApiSuccess(response)) {
      setErrorMessage(response.error.message);
      return;
    }
    await loadReservations();
  }

  return (
    <div className="page-stack">
      <div className="page-card">
        <h2>Reservations</h2>
        <p>Create reservations and manage reservation lifecycle transitions.</p>

        <form className="form-grid" onSubmit={handleCreateReservation}>
          <label className="field">
            <span>Table Number</span>
            <input
              value={tableNumberInput}
              onChange={(event) => setTableNumberInput(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Party Size</span>
            <input
              value={partySizeInput}
              onChange={(event) => setPartySizeInput(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Reservation Time</span>
            <input
              type="datetime-local"
              value={reservationTimeInput}
              onChange={(event) => setReservationTimeInput(event.target.value)}
              required
            />
          </label>

          <label className="field">
            <span>Initial Status</span>
            <select
              value={initialStatusInput}
              onChange={(event) => setInitialStatusInput(event.target.value as ReservationStatusName)}
            >
              {reservationStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" disabled={isCreatingReservation}>
            {isCreatingReservation ? "Creating..." : "Create Reservation"}
          </button>
        </form>

        {formMessage && <p className="state-text">{formMessage}</p>}
      </div>

      <div className="page-card">
        <div className="filters-row">
          <label className="field">
            <span>Filter by status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as ReservationFilterStatus)}
            >
              <option value="all">All</option>
              {reservationStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>

        {isLoading && <p className="state-text">Loading reservations...</p>}
        {!isLoading && errorMessage && <p className="state-text error">{errorMessage}</p>}
        {!isLoading && !errorMessage && reservations.length === 0 && (
          <p className="state-text">No reservations available.</p>
        )}

        {!isLoading && !errorMessage && reservations.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Table</th>
                  <th>Party</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => {
                  const actions = getTransitionActions(reservation.status);
                  return (
                    <tr key={reservation.reservationId}>
                      <td>#{reservation.reservationId}</td>
                      <td>{reservation.tableNumber}</td>
                      <td>
                        {reservation.partySize} / {reservation.capacity}
                      </td>
                      <td>{formatDateTime(reservation.reservationTime)}</td>
                      <td>
                        <span className={`status-chip ${reservation.status}`}>{reservation.status}</span>
                      </td>
                      <td>{reservation.location}</td>
                      <td>
                        <div className="action-row">
                          {actions.length === 0 && <span className="muted-text">No actions</span>}
                          {actions.map((actionStatus) => (
                            <button
                              key={actionStatus}
                              type="button"
                              onClick={() =>
                                void handleStatusUpdate(reservation.reservationId, actionStatus)
                              }
                            >
                              Mark {actionStatus}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
