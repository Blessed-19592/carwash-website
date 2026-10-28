import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
LayoutDashboard,
CalendarDays,
LogOut,
Menu,
X,
ExternalLink,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import './admin.css';

export default function AdminLayout() {
const navigate = useNavigate();
const [sidebarOpen, setSidebarOpen] = useState(false);
const [loggingOut, setLoggingOut] = useState(false);
const [logoutError, setLogoutError] = useState('');

async function handleLogout() {
setLoggingOut(true);
setLogoutError('');


try {
  await adminApi.logout();
  navigate('/admin/login', { replace: true });
} catch (error) {
  if (error.status === 401) {
    navigate('/admin/login', { replace: true });
    return;
  }

  setLogoutError(
    error.message || 'Unable to log out. Please try again.'
  );
} finally {
  setLoggingOut(false);
}


}

const navigation = [
{
label: 'Overview',
path: '/admin',
icon: LayoutDashboard,
end: true,
},
{
label: 'Bookings',
path: '/admin/bookings',
icon: CalendarDays,
},
];

return ( <div className="admin-shell">
{sidebarOpen && (
<button
type="button"
className="admin-sidebar-backdrop"
aria-label="Close navigation"
onClick={() => setSidebarOpen(false)}
/>
)}


  <aside
    className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar-open' : ''}`}
  >
    <div className="admin-sidebar-brand">
      <div className="admin-brand-mark">EC</div>

      <div>
        <h2>Express Car Wash</h2>
        <p>ADMINISTRATION</p>
      </div>

      <button
        type="button"
        className="admin-mobile-close"
        aria-label="Close menu"
        onClick={() => setSidebarOpen(false)}
      >
        <X size={21} />
      </button>
    </div>

    <div className="admin-sidebar-section">WORKSPACE</div>

    <nav className="admin-sidebar-nav" aria-label="Admin navigation">
      {navigation.map(({ label, path, icon: Icon, end }) => (
        <NavLink
          key={path}
          to={path}
          end={end}
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `admin-nav-link ${isActive ? 'admin-nav-link-active' : ''}`
          }
        >
          <Icon size={19} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>

    <div className="admin-sidebar-bottom">
      <Link to="/" className="admin-public-site-link">
        <ExternalLink size={17} />
        <span>View customer website</span>
      </Link>

      <button
        type="button"
        className="admin-logout-button"
        onClick={handleLogout}
        disabled={loggingOut}
      >
        <LogOut size={19} />
        <span>{loggingOut ? 'Signing out...' : 'Sign Out'}</span>
      </button>
    </div>
  </aside>

  <div className="admin-main">
    <header className="admin-topbar">
      <button
        type="button"
        className="admin-mobile-menu"
        aria-label="Open navigation"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={23} />
      </button>

      <div>
        <p className="admin-topbar-label">EXPRESS CAR WASH</p>
        <h1>Management Dashboard</h1>
      </div>

      <div className="admin-topbar-badge">
        <span className="admin-status-dot" />
        Administrator
      </div>
    </header>

    <main className="admin-content">
      {logoutError && (
        <div className="admin-alert admin-alert-error" role="alert">
          {logoutError}
        </div>
      )}

      <Outlet />
    </main>
  </div>
</div>


);
}
