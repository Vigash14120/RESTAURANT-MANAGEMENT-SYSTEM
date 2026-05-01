import React, { useEffect, useState } from "react";
import { fetchApi, isApiSuccess } from "../api/client";
import type {
  SupplierDto,
  IngredientStockDto,
  SupplementMaintenanceLogDto
} from "@rms/shared-types";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function InventorySuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierDto[]>([]);
  const [inventory, setInventory] = useState<IngredientStockDto[]>([]);
  const [logs, setLogs] = useState<SupplementMaintenanceLogDto[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Supplier Form
  const [companyName, setCompanyName] = useState("");

  // Inventory Form
  const [stockLevel, setStockLevel] = useState("0");

  // Maintenance Log Form
  const [logSupplierId, setLogSupplierId] = useState("");
  const [logDetails, setLogDetails] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const supRes = await fetchApi<SupplierDto[]>("/suppliers");
      if (isApiSuccess(supRes)) setSuppliers(supRes.data);

      const invRes = await fetchApi<IngredientStockDto[]>("/ingredient-stock");
      if (isApiSuccess(invRes)) setInventory(invRes.data);

      const logsRes = await fetchApi<SupplementMaintenanceLogDto[]>("/maintenance-logs");
      if (isApiSuccess(logsRes)) setLogs(logsRes.data);
    } catch (error: unknown) {
      setError(errorMessage(error, "Failed to fetch data"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetchApi<SupplierDto>("/suppliers", {
        method: "POST",
        body: JSON.stringify({ companyName })
      });
      if (!isApiSuccess(res)) throw new Error(res.error.message);
      setCompanyName("");
      fetchData();
    } catch (error: unknown) {
      setError(errorMessage(error, "Error creating supplier"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetchApi<IngredientStockDto>("/ingredient-stock", {
        method: "POST",
        body: JSON.stringify({ stockLevel: Number(stockLevel) })
      });
      if (!isApiSuccess(res)) throw new Error(res.error.message);
      setStockLevel("0");
      fetchData();
    } catch (error: unknown) {
      setError(errorMessage(error, "Error creating inventory record"));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const supplier = suppliers.find(s => s.supplierId === Number(logSupplierId));
      if (!supplier) throw new Error("Please select a valid supplier.");

      const res = await fetchApi<SupplementMaintenanceLogDto>("/maintenance-logs", {
        method: "POST",
        body: JSON.stringify({
          supplierId: supplier.supplierId,
          companyName: supplier.companyName,
          details: logDetails
        })
      });
      if (!isApiSuccess(res)) throw new Error(res.error.message);
      setLogSupplierId("");
      setLogDetails("");
      fetchData();
    } catch (error: unknown) {
      setError(errorMessage(error, "Error logging maintenance"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2>Inventory, Suppliers & Maintenance</h2>
      
      {error && <div style={{ color: "red", padding: "0.5rem", border: "1px solid red" }}>{error}</div>}

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {/* Suppliers */}
        <div style={{ flex: 1, minWidth: "300px", background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
          <h3>Suppliers</h3>
          <form onSubmit={handleCreateSupplier} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <input type="text" placeholder="Company Name" required value={companyName} onChange={e => setCompanyName(e.target.value)} />
            <button type="submit" disabled={loading}>Add</button>
          </form>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {suppliers.map(s => (
              <li key={s.supplierId} style={{ padding: "0.25rem 0", borderBottom: "1px solid #eee" }}>
                <strong>{s.companyName}</strong> <small>(ID: {s.supplierId})</small>
              </li>
            ))}
          </ul>
        </div>

        {/* Inventory */}
        <div style={{ flex: 1, minWidth: "300px", background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
          <h3>Ingredient Stock</h3>
          <form onSubmit={handleCreateInventory} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <input type="number" placeholder="Initial Stock Level" required value={stockLevel} onChange={e => setStockLevel(e.target.value)} />
            <button type="submit" disabled={loading}>Add Stock Item</button>
          </form>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {inventory.map(inv => (
              <li key={inv.ingredientId} style={{ padding: "0.25rem 0", borderBottom: "1px solid #eee" }}>
                Item ID: {inv.ingredientId} | <strong>Level: {inv.stockLevel}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <hr />

      {/* Maintenance Logs */}
      <div>
        <h3>Supplement Maintenance Logs</h3>
        <form onSubmit={handleCreateLog} style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", alignItems: "flex-start" }}>
          <select required value={logSupplierId} onChange={e => setLogSupplierId(e.target.value)}>
            <option value="">-- Select Supplier --</option>
            {suppliers.map(s => (
              <option key={s.supplierId} value={s.supplierId}>{s.companyName}</option>
            ))}
          </select>
          <textarea placeholder="Maintenance Details..." required value={logDetails} onChange={e => setLogDetails(e.target.value)} />
          <button type="submit" disabled={loading}>Log Maintenance</button>
        </form>
        
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr style={{ background: "#eee", textAlign: "left" }}>
              <th style={{ padding: "0.5rem" }}>ID</th>
              <th style={{ padding: "0.5rem" }}>Supplier</th>
              <th style={{ padding: "0.5rem" }}>Details</th>
              <th style={{ padding: "0.5rem" }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr><td colSpan={4} style={{ padding: "0.5rem", textAlign: "center" }}>No logs found.</td></tr>
            )}
            {logs.map(log => (
              <tr key={log.maintenanceLogId} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "0.5rem" }}>{log.maintenanceLogId}</td>
                <td style={{ padding: "0.5rem" }}>{log.companyName}</td>
                <td style={{ padding: "0.5rem" }}>{log.details}</td>
                <td style={{ padding: "0.5rem" }}>{new Date(log.loggedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
