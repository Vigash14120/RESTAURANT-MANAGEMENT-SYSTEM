import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/floor-tables", label: "Floor & Tables" },
  { to: "/reservations", label: "Reservations" },
  { to: "/orders-kitchen", label: "Orders & Kitchen" },
  { to: "/inventory-suppliers", label: "Inventory & Suppliers" },
  { to: "/staffing-assignments", label: "Staffing & Assignments" }
];

export function AppShell() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-title">RMS</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              end={item.to === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <h1>Restaurant Management System</h1>
            <p>Foundation shell for RMS modules</p>
          </div>
        </header>
        <section className="content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
