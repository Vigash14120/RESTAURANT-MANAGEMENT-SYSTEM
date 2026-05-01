import React, { useEffect, useState } from "react";
import { fetchApi, isApiSuccess } from "../api/client";
import type { CustomerOrderDto, KitchenOrderDto, TicketDto } from "@rms/shared-types";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export function OrdersKitchenPage() {
  const [orders, setOrders] = useState<CustomerOrderDto[]>([]);
  const [tickets, setTickets] = useState<TicketDto[]>([]);
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrderDto[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [dishType, setDishType] = useState("");
  const [partySize, setPartySize] = useState("1");
  const [staffMemberId, setStaffMemberId] = useState("1");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const ordersRes = await fetchApi<CustomerOrderDto[]>("/orders");
      if (isApiSuccess(ordersRes)) setOrders(ordersRes.data);

      const ticketsRes = await fetchApi<TicketDto[]>("/tickets");
      if (isApiSuccess(ticketsRes)) setTickets(ticketsRes.data);

      const kitchenRes = await fetchApi<KitchenOrderDto[]>("/kitchen-orders");
      if (isApiSuccess(kitchenRes)) setKitchenOrders(kitchenRes.data);

    } catch (error: unknown) {
      setError(errorMessage(error, "Failed to fetch data"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Create Order
      const orderRes = await fetchApi<CustomerOrderDto>("/orders", {
        method: "POST",
        body: JSON.stringify({
          customerId: Number(customerId),
          tableNumber: Number(tableNumber),
          dishType
        })
      });

      if (!isApiSuccess(orderRes)) throw new Error(orderRes.error.message);

      // Create Ticket
      const ticketRes = await fetchApi<TicketDto>("/tickets", {
        method: "POST",
        body: JSON.stringify({
          customerOrderId: orderRes.data.customerOrderId,
          partySize: Number(partySize)
        })
      });
      if (!isApiSuccess(ticketRes)) throw new Error(ticketRes.error.message);

      // Create OrderTicket Link
      await fetchApi("/order-tickets", {
        method: "POST",
        body: JSON.stringify({
          ticketId: ticketRes.data.ticketId,
          customerOrderId: orderRes.data.customerOrderId
        })
      });

      setCustomerId("");
      setTableNumber("");
      setDishType("");
      fetchData();
    } catch (error: unknown) {
      setError(errorMessage(error, "Error creating order"));
    } finally {
      setLoading(false);
    }
  };

  const handleSendToKitchen = async (tableNum: number) => {
    try {
      setLoading(true);
      const res = await fetchApi<KitchenOrderDto>("/kitchen-orders", {
        method: "POST",
        body: JSON.stringify({
          tableNumber: tableNum,
          staffMemberId: Number(staffMemberId)
        })
      });
      if (!isApiSuccess(res)) throw new Error(res.error.message);
      fetchData();
    } catch (error: unknown) {
      setError(errorMessage(error, "Error sending to kitchen"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <h2>Orders & Kitchen Board</h2>
      
      {error && <div style={{ color: "red", padding: "0.5rem", border: "1px solid red" }}>{error}</div>}
      
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {/* Order Intake Form */}
        <div style={{ flex: 1, minWidth: "300px", background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
          <h3>New Customer Order</h3>
          <form onSubmit={handleCreateOrder} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div>
              <label>Customer ID:</label><br />
              <input type="number" required value={customerId} onChange={e => setCustomerId(e.target.value)} />
            </div>
            <div>
              <label>Table Number:</label><br />
              <input type="number" required value={tableNumber} onChange={e => setTableNumber(e.target.value)} />
            </div>
            <div>
              <label>Dish Type:</label><br />
              <input type="text" required value={dishType} onChange={e => setDishType(e.target.value)} />
            </div>
            <div>
              <label>Party Size:</label><br />
              <input type="number" required value={partySize} min="1" onChange={e => setPartySize(e.target.value)} />
            </div>
            <div>
              <label>Kitchen Staff ID:</label><br />
              <input type="number" required min="1" value={staffMemberId} onChange={e => setStaffMemberId(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
              Submit Order
            </button>
          </form>
        </div>

        {/* Live Orders/Tickets */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3>Recent Tickets</h3>
          {tickets.length === 0 && <p>No tickets available.</p>}
          <ul style={{ listStyle: "none", padding: 0 }}>
            {tickets.map(t => {
              const ord = orders.find(o => o.customerOrderId === t.customerOrderId);
              return (
                <li key={t.ticketId} style={{ borderBottom: "1px solid #ccc", padding: "0.5rem 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong>Ticket #{t.ticketId}</strong> - Table {ord?.tableNumber} ({ord?.dishType})<br />
                    <small>Party: {t.partySize} | Time: {new Date(t.createdAt).toLocaleTimeString()}</small>
                  </div>
                  <button onClick={() => ord && handleSendToKitchen(ord.tableNumber)} disabled={loading}>
                    Send to Kitchen
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <hr />

      {/* Kitchen Service Board */}
      <div>
        <h3>Kitchen Board</h3>
        <div style={{ display: "flex", gap: "1rem", overflowX: "auto" }}>
          {kitchenOrders.length === 0 && <p>Kitchen is clear.</p>}
          {kitchenOrders.map(ko => (
            <div key={ko.kitchenOrderId} style={{ background: "#333", color: "#fff", padding: "1rem", borderRadius: "8px", minWidth: "200px" }}>
              <h4>Order #{ko.kitchenOrderId}</h4>
              <p>Table: {ko.tableNumber}</p>
              <p>Staff ID: {ko.staffMemberId}</p>
              <small>Ordered: {new Date(ko.createdAt).toLocaleTimeString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
