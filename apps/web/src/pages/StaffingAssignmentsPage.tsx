import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

import type {
  CreateEquipmentRequest,
  CreateJobAssignmentRequest,
  CreateStaffMemberRequest,
  CreateStaffRequest,
  CreateStaffShiftLogRequest,
  EquipmentDto,
  JobAssignmentDto,
  RestaurantSummaryDto,
  StaffDto,
  StaffMemberDto,
  StaffShiftLogDto
} from "@rms/shared-types";

import { fetchApi, isApiSuccess } from "../api/client";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function toIsoFromLocalInput(value: string): string {
  return new Date(value).toISOString();
}

export function StaffingAssignmentsPage() {
  const [restaurants, setRestaurants] = useState<RestaurantSummaryDto[]>([]);
  const [staff, setStaff] = useState<StaffDto[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMemberDto[]>([]);
  const [shiftLogs, setShiftLogs] = useState<StaffShiftLogDto[]>([]);
  const [assignments, setAssignments] = useState<JobAssignmentDto[]>([]);
  const [equipment, setEquipment] = useState<EquipmentDto[]>([]);

  const [staffFirstName, setStaffFirstName] = useState("");
  const [staffLastName, setStaffLastName] = useState("");

  const [staffMemberFirstName, setStaffMemberFirstName] = useState("");
  const [staffMemberSalary, setStaffMemberSalary] = useState("0");
  const [staffMemberEmployerId, setStaffMemberEmployerId] = useState("");
  const [staffMemberRestaurantId, setStaffMemberRestaurantId] = useState("");

  const [shiftStaffId, setShiftStaffId] = useState("");
  const [shiftTime, setShiftTime] = useState("");

  const [assignmentStaffId, setAssignmentStaffId] = useState("");
  const [assignmentRestaurantId, setAssignmentRestaurantId] = useState("");
  const [assignmentShiftTime, setAssignmentShiftTime] = useState("");

  const [equipmentAssignmentId, setEquipmentAssignmentId] = useState("");
  const [equipmentName, setEquipmentName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hydrateDefaults = useCallback(
    (
      loadedRestaurants: RestaurantSummaryDto[],
      loadedStaff: StaffDto[],
      loadedAssignments: JobAssignmentDto[]
    ) => {
      const firstRestaurant = loadedRestaurants[0];
      const firstStaff = loadedStaff[0];
      const firstAssignment = loadedAssignments[0];

      if (!staffMemberRestaurantId && firstRestaurant) {
        setStaffMemberRestaurantId(String(firstRestaurant.restaurantId));
      }
      if (!assignmentRestaurantId && firstRestaurant) {
        setAssignmentRestaurantId(String(firstRestaurant.restaurantId));
      }
      if (!shiftStaffId && firstStaff) {
        setShiftStaffId(String(firstStaff.staffId));
      }
      if (!assignmentStaffId && firstStaff) {
        setAssignmentStaffId(String(firstStaff.staffId));
      }
      if (!equipmentAssignmentId && firstAssignment) {
        setEquipmentAssignmentId(String(firstAssignment.assignmentId));
      }
    },
    [assignmentRestaurantId, assignmentStaffId, equipmentAssignmentId, shiftStaffId, staffMemberRestaurantId]
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [restaurantsRes, staffRes, staffMembersRes, shiftLogsRes, assignmentsRes, equipmentRes] = await Promise.all([
        fetchApi<RestaurantSummaryDto[]>("/restaurants"),
        fetchApi<StaffDto[]>("/staff"),
        fetchApi<StaffMemberDto[]>("/staff-members"),
        fetchApi<StaffShiftLogDto[]>("/staff-shift-logs"),
        fetchApi<JobAssignmentDto[]>("/job-assignments"),
        fetchApi<EquipmentDto[]>("/equipment")
      ]);

      if (!isApiSuccess(restaurantsRes)) {
        throw new Error(restaurantsRes.error.message);
      }
      if (!isApiSuccess(staffRes)) {
        throw new Error(staffRes.error.message);
      }
      if (!isApiSuccess(staffMembersRes)) {
        throw new Error(staffMembersRes.error.message);
      }
      if (!isApiSuccess(shiftLogsRes)) {
        throw new Error(shiftLogsRes.error.message);
      }
      if (!isApiSuccess(assignmentsRes)) {
        throw new Error(assignmentsRes.error.message);
      }
      if (!isApiSuccess(equipmentRes)) {
        throw new Error(equipmentRes.error.message);
      }

      setRestaurants(restaurantsRes.data);
      setStaff(staffRes.data);
      setStaffMembers(staffMembersRes.data);
      setShiftLogs(shiftLogsRes.data);
      setAssignments(assignmentsRes.data);
      setEquipment(equipmentRes.data);
      hydrateDefaults(restaurantsRes.data, staffRes.data, assignmentsRes.data);
    } catch (unknownError) {
      setError(errorMessage(unknownError, "Failed to fetch staffing and assignment data."));
    } finally {
      setLoading(false);
    }
  }, [hydrateDefaults]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleCreateStaff = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: CreateStaffRequest = {
      firstName: staffFirstName.trim(),
      lastName: staffLastName.trim()
    };

    setLoading(true);
    setError(null);
    try {
      const response = await fetchApi<StaffDto>("/staff", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (!isApiSuccess(response)) {
        throw new Error(response.error.message);
      }
      setStaffFirstName("");
      setStaffLastName("");
      await fetchData();
    } catch (unknownError) {
      setError(errorMessage(unknownError, "Unable to create staff record."));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaffMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: CreateStaffMemberRequest = {
      firstName: staffMemberFirstName.trim(),
      salary: Number(staffMemberSalary),
      restaurantId: Number(staffMemberRestaurantId),
      employerStaffId: staffMemberEmployerId ? Number(staffMemberEmployerId) : undefined
    };

    setLoading(true);
    setError(null);
    try {
      const response = await fetchApi<StaffMemberDto>("/staff-members", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (!isApiSuccess(response)) {
        throw new Error(response.error.message);
      }
      setStaffMemberFirstName("");
      setStaffMemberSalary("0");
      setStaffMemberEmployerId("");
      await fetchData();
    } catch (unknownError) {
      setError(errorMessage(unknownError, "Unable to create staff member profile."));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShiftLog = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: CreateStaffShiftLogRequest = {
      shiftTime: toIsoFromLocalInput(shiftTime)
    };

    setLoading(true);
    setError(null);
    try {
      const response = await fetchApi<StaffShiftLogDto>(`/staff/${shiftStaffId}/shift-logs`, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (!isApiSuccess(response)) {
        throw new Error(response.error.message);
      }
      setShiftTime("");
      await fetchData();
    } catch (unknownError) {
      setError(errorMessage(unknownError, "Unable to log staff shift."));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAssignment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: CreateJobAssignmentRequest = {
      staffId: Number(assignmentStaffId),
      shiftTime: toIsoFromLocalInput(assignmentShiftTime),
      restaurantId: Number(assignmentRestaurantId)
    };

    setLoading(true);
    setError(null);
    try {
      const response = await fetchApi<JobAssignmentDto>("/job-assignments", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (!isApiSuccess(response)) {
        throw new Error(response.error.message);
      }
      setAssignmentShiftTime("");
      await fetchData();
    } catch (unknownError) {
      setError(errorMessage(unknownError, "Unable to create job assignment."));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEquipment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: CreateEquipmentRequest = {
      assignmentId: Number(equipmentAssignmentId),
      name: equipmentName.trim()
    };

    setLoading(true);
    setError(null);
    try {
      const response = await fetchApi<EquipmentDto>("/equipment", {
        method: "POST",
        body: JSON.stringify(payload)
      });
      if (!isApiSuccess(response)) {
        throw new Error(response.error.message);
      }
      setEquipmentName("");
      await fetchData();
    } catch (unknownError) {
      setError(errorMessage(unknownError, "Unable to assign equipment."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-stack">
      <div className="page-card">
        <h2>Staffing & Assignments</h2>
        <p className="muted-text">Manage staff roster, shift logs, job assignments, and equipment distribution.</p>
        {error ? <p className="state-text error">{error}</p> : null}
        {loading ? <p className="state-text">Loading latest staffing data...</p> : null}
      </div>

      <div className="page-card">
        <h3>Create Staff Identity</h3>
        <form className="form-grid" onSubmit={handleCreateStaff}>
          <label className="field">
            <span>First Name</span>
            <input value={staffFirstName} onChange={(event) => setStaffFirstName(event.target.value)} required />
          </label>
          <label className="field">
            <span>Last Name</span>
            <input value={staffLastName} onChange={(event) => setStaffLastName(event.target.value)} required />
          </label>
          <button type="submit" disabled={loading}>
            Add Staff
          </button>
        </form>
      </div>

      <div className="page-card">
        <h3>Create Staff Member Profile</h3>
        <form className="form-grid" onSubmit={handleCreateStaffMember}>
          <label className="field">
            <span>Profile First Name</span>
            <input
              value={staffMemberFirstName}
              onChange={(event) => setStaffMemberFirstName(event.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Salary</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={staffMemberSalary}
              onChange={(event) => setStaffMemberSalary(event.target.value)}
              required
            />
          </label>
          <label className="field">
            <span>Employer Staff ID (optional)</span>
            <input
              type="number"
              min="1"
              value={staffMemberEmployerId}
              onChange={(event) => setStaffMemberEmployerId(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Restaurant</span>
            <select
              value={staffMemberRestaurantId}
              onChange={(event) => setStaffMemberRestaurantId(event.target.value)}
              required
            >
              <option value="">Select restaurant</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.restaurantId} value={restaurant.restaurantId}>
                  Restaurant #{restaurant.restaurantId}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" disabled={loading}>
            Add Staff Member
          </button>
        </form>
      </div>

      <div className="page-card">
        <h3>Log Staff Shift</h3>
        <form className="form-grid" onSubmit={handleCreateShiftLog}>
          <label className="field">
            <span>Staff</span>
            <select value={shiftStaffId} onChange={(event) => setShiftStaffId(event.target.value)} required>
              <option value="">Select staff</option>
              {staff.map((item) => (
                <option key={item.staffId} value={item.staffId}>
                  {item.staffId} - {item.firstName} {item.lastName}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Shift Time</span>
            <input
              type="datetime-local"
              value={shiftTime}
              onChange={(event) => setShiftTime(event.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            Log Shift
          </button>
        </form>
      </div>

      <div className="page-card">
        <h3>Create Job Assignment</h3>
        <form className="form-grid" onSubmit={handleCreateAssignment}>
          <label className="field">
            <span>Staff</span>
            <select value={assignmentStaffId} onChange={(event) => setAssignmentStaffId(event.target.value)} required>
              <option value="">Select staff</option>
              {staff.map((item) => (
                <option key={item.staffId} value={item.staffId}>
                  {item.staffId} - {item.firstName} {item.lastName}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Restaurant</span>
            <select
              value={assignmentRestaurantId}
              onChange={(event) => setAssignmentRestaurantId(event.target.value)}
              required
            >
              <option value="">Select restaurant</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.restaurantId} value={restaurant.restaurantId}>
                  Restaurant #{restaurant.restaurantId}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Shift Time</span>
            <input
              type="datetime-local"
              value={assignmentShiftTime}
              onChange={(event) => setAssignmentShiftTime(event.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            Create Assignment
          </button>
        </form>
      </div>

      <div className="page-card">
        <h3>Assign Equipment</h3>
        <form className="form-grid" onSubmit={handleCreateEquipment}>
          <label className="field">
            <span>Assignment</span>
            <select
              value={equipmentAssignmentId}
              onChange={(event) => setEquipmentAssignmentId(event.target.value)}
              required
            >
              <option value="">Select assignment</option>
              {assignments.map((assignment) => (
                <option key={assignment.assignmentId} value={assignment.assignmentId}>
                  #{assignment.assignmentId} - {assignment.staffFirstName} {assignment.staffLastName}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Equipment Name</span>
            <input value={equipmentName} onChange={(event) => setEquipmentName(event.target.value)} required />
          </label>
          <button type="submit" disabled={loading}>
            Add Equipment
          </button>
        </form>
      </div>

      <div className="page-card">
        <h3>Staff Members</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Profile ID</th>
                <th>First Name</th>
                <th>Salary</th>
                <th>Employer Staff ID</th>
                <th>Restaurant ID</th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.length === 0 ? (
                <tr>
                  <td colSpan={5}>No staff member profiles yet.</td>
                </tr>
              ) : (
                staffMembers.map((member) => (
                  <tr key={member.staffMemberId}>
                    <td>{member.staffMemberId}</td>
                    <td>{member.firstName}</td>
                    <td>{member.salary.toFixed(2)}</td>
                    <td>{member.employerStaffId ?? "-"}</td>
                    <td>{member.restaurantId}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="page-card">
        <h3>Shift Logs</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Shift Log</th>
                <th>Staff</th>
                <th>Shift Time</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {shiftLogs.length === 0 ? (
                <tr>
                  <td colSpan={4}>No shift logs yet.</td>
                </tr>
              ) : (
                shiftLogs.map((shiftLog) => (
                  <tr key={shiftLog.shiftLogId}>
                    <td>{shiftLog.shiftLogId}</td>
                    <td>
                      {shiftLog.staffFirstName} {shiftLog.staffLastName}
                    </td>
                    <td>{new Date(shiftLog.shiftTime).toLocaleString()}</td>
                    <td>{new Date(shiftLog.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="page-card">
        <h3>Job Assignments</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Staff</th>
                <th>Restaurant</th>
                <th>Shift Time</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={4}>No assignments yet.</td>
                </tr>
              ) : (
                assignments.map((assignment) => (
                  <tr key={assignment.assignmentId}>
                    <td>{assignment.assignmentId}</td>
                    <td>
                      {assignment.staffFirstName} {assignment.staffLastName}
                    </td>
                    <td>{assignment.restaurantId}</td>
                    <td>{new Date(assignment.shiftTime).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="page-card">
        <h3>Equipment</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Equipment ID</th>
                <th>Name</th>
                <th>Assignment</th>
                <th>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {equipment.length === 0 ? (
                <tr>
                  <td colSpan={4}>No equipment assignments yet.</td>
                </tr>
              ) : (
                equipment.map((item) => (
                  <tr key={item.equipmentId}>
                    <td>{item.equipmentId}</td>
                    <td>{item.name}</td>
                    <td>{item.assignmentId}</td>
                    <td>{item.assignmentStaffName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
