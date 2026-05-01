import type { FloorTableDto, FloorTableStatusFilter, TableAssignmentDto } from "@rms/shared-types";
import { useEffect, useMemo, useState } from "react";

import { fetchApi, isApiSuccess } from "../api/client";

type FloorTableFilterStatus = "all" | FloorTableStatusFilter;

function formatDateTime(value: string | null): string {
  if (!value) {
    return "-";
  }
  const dateValue = new Date(value);
  return Number.isNaN(dateValue.getTime()) ? value : dateValue.toLocaleString();
}

const statusFilterOptions: Array<{ value: FloorTableFilterStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "reserved", label: "Reserved" },
  { value: "pending", label: "Pending Reservation" },
  { value: "confirmed", label: "Confirmed Reservation" }
];

export function FloorTablesPage() {
  const [floorTables, setFloorTables] = useState<FloorTableDto[]>([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<FloorTableFilterStatus>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedTableNumber, setSelectedTableNumber] = useState<number | null>(null);
  const [assignmentReservationId, setAssignmentReservationId] = useState("");
  const [assignmentMenuPrice, setAssignmentMenuPrice] = useState("");
  const [assignmentMessage, setAssignmentMessage] = useState<string | null>(null);
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);

  const floorTablePath = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (locationFilter.trim().length > 0) {
      searchParams.set("location", locationFilter.trim());
    }
    if (statusFilter !== "all") {
      searchParams.set("status", statusFilter);
    }
    const query = searchParams.toString();
    return query.length > 0 ? `/floor-tables?${query}` : "/floor-tables";
  }, [locationFilter, statusFilter]);

  useEffect(() => {
    async function loadFloorTables() {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await fetchApi<FloorTableDto[]>(floorTablePath);
      if (!isApiSuccess(response)) {
        setErrorMessage(response.error.message);
        setFloorTables([]);
        setIsLoading(false);
        return;
      }
      setFloorTables(response.data);
      setIsLoading(false);
    }

    void loadFloorTables();
  }, [floorTablePath]);

  async function handleCreateAssignment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTableNumber) {
      setAssignmentMessage("Select a table to create assignment.");
      return;
    }

    const reservationIdValue = assignmentReservationId.trim();
    const menuPriceValue = assignmentMenuPrice.trim();
    const reservationId = reservationIdValue.length > 0 ? Number(reservationIdValue) : undefined;
    const menuPrice = menuPriceValue.length > 0 ? Number(menuPriceValue) : undefined;

    setIsSubmittingAssignment(true);
    setAssignmentMessage(null);

    const response = await fetchApi<TableAssignmentDto>("/table-assignments", {
      method: "POST",
      body: JSON.stringify({
        tableNumber: selectedTableNumber,
        reservationId,
        menuPrice
      })
    });

    if (!isApiSuccess(response)) {
      setAssignmentMessage(response.error.message);
      setIsSubmittingAssignment(false);
      return;
    }

    setAssignmentMessage(`Assignment #${response.data.assignmentId} created for table ${response.data.tableNumber}.`);
    setAssignmentReservationId("");
    setAssignmentMenuPrice("");
    setIsSubmittingAssignment(false);
  }

  return (
    <div className="page-stack">
      <div className="page-card">
        <h2>Floor & Tables</h2>
        <p>View table availability and create table assignments for reservation flow.</p>

        <div className="filters-row">
          <label className="field">
            <span>Location</span>
            <input
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
              placeholder="e.g. Main Hall"
            />
          </label>

          <label className="field">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as FloorTableFilterStatus)}
            >
              {statusFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {isLoading && <p className="state-text">Loading floor tables...</p>}
        {!isLoading && errorMessage && <p className="state-text error">{errorMessage}</p>}
        {!isLoading && !errorMessage && floorTables.length === 0 && (
          <p className="state-text">No floor tables match the selected filters.</p>
        )}

        {!isLoading && !errorMessage && floorTables.length > 0 && (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Table</th>
                  <th>Capacity</th>
                  <th>Location</th>
                  <th>Availability</th>
                  <th>Active Reservation</th>
                </tr>
              </thead>
              <tbody>
                {floorTables.map((floorTable) => (
                  <tr
                    key={floorTable.tableNumber}
                    className={selectedTableNumber === floorTable.tableNumber ? "selected-row" : ""}
                    onClick={() => setSelectedTableNumber(floorTable.tableNumber)}
                  >
                    <td>{floorTable.tableNumber}</td>
                    <td>{floorTable.capacity}</td>
                    <td>{floorTable.location}</td>
                    <td>
                      <span className={`status-chip ${floorTable.availability}`}>
                        {floorTable.availability}
                      </span>
                    </td>
                    <td>
                      {floorTable.activeReservationId
                        ? `#${floorTable.activeReservationId} (${floorTable.activeReservationStatus ?? "-"}) at ${formatDateTime(floorTable.activeReservationTime)}`
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="page-card">
        <h3>Create Table Assignment</h3>
        <p>
          Selected table:{" "}
          <strong>{selectedTableNumber ?? "Select a row from the floor table list first"}</strong>
        </p>

        <form className="form-grid" onSubmit={handleCreateAssignment}>
          <label className="field">
            <span>Reservation ID (optional)</span>
            <input
              value={assignmentReservationId}
              onChange={(event) => setAssignmentReservationId(event.target.value)}
              placeholder="e.g. 12"
            />
          </label>

          <label className="field">
            <span>Menu Price (optional)</span>
            <input
              value={assignmentMenuPrice}
              onChange={(event) => setAssignmentMenuPrice(event.target.value)}
              placeholder="e.g. 120.00"
            />
          </label>

          <button type="submit" disabled={isSubmittingAssignment || selectedTableNumber === null}>
            {isSubmittingAssignment ? "Creating..." : "Create Assignment"}
          </button>
        </form>

        {assignmentMessage && <p className="state-text">{assignmentMessage}</p>}
      </div>
    </div>
  );
}
