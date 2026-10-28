import { useCallback, useEffect, useState } from 'react';
import {
CalendarDays,
Clock3,
CheckCircle2,
CircleCheck,
XCircle,
RefreshCw,
AlertCircle,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

const statCards = [
{
key: 'total_bookings',
label: 'Total Bookings',
icon: CalendarDays,
color: 'blue',
},
{
key: 'todays_bookings',
label: "Today's Bookings",
icon: Clock3,
color: 'purple',
},
{
key: 'pending_bookings',
label: 'Pending',
icon: Clock3,
color: 'orange',
},
{
key: 'confirmed_bookings',
label: 'Confirmed',
icon: CheckCircle2,
color: 'green',
},
{
key: 'completed_bookings',
label: 'Completed',
icon: CircleCheck,
color: 'teal',
},
{
key: 'cancelled_bookings',
label: 'Cancelled',
icon: XCircle,
color: 'red',
},
];

export default function AdminDashboard() {
const [stats, setStats] = useState(null);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [error, setError] = useState('');

const loadStats = useCallback(async (isRefresh = false) => {
setError('');


if (isRefresh) {
  setRefreshing(true);
} else {
  setLoading(true);
}

try {
  const response = await adminApi.getDashboardStats();
  setStats(response.stats);
} catch (err) {
  setError(err.message || 'Unable to load dashboard statistics.');
} finally {
  setLoading(false);
  setRefreshing(false);
}


}, []);

useEffect(() => {
loadStats();
}, [loadStats]);

return ( <section> <div className="admin-page-heading"> <div> <p className="admin-eyebrow">BUSINESS OVERVIEW</p> <h2>Dashboard Overview</h2> <p className="admin-page-description">
Monitor your bookings and track your car wash activity. </p> </div>


    <button
      type="button"
      className="admin-secondary-button"
      onClick={() => loadStats(true)}
      disabled={loading || refreshing}
    >
      <RefreshCw
        size={16}
        className={refreshing ? 'admin-spinner' : ''}
      />
      Refresh
    </button>
  </div>

  {error && (
    <div className="admin-alert admin-alert-error" role="alert">
      <AlertCircle size={18} />
      <span>{error}</span>
      <button type="button" onClick={() => loadStats(true)}>
        Retry
      </button>
    </div>
  )}

  {loading ? (
    <div className="admin-panel admin-dashboard-loading">
      <RefreshCw size={24} className="admin-spinner" />
      <p>Loading your business statistics...</p>
    </div>
  ) : (
    <div className="admin-stats-grid">
      {statCards.map(({ key, label, icon: Icon, color }) => (
        <article className="admin-stat-card" key={key}>
          <div className="admin-stat-top">
            <span className={`admin-stat-icon ${color}`}>
              <Icon size={22} />
            </span>
            <span className="admin-stat-label">{label}</span>
          </div>

          <p className="admin-stat-value">
            {stats ? Number(stats[key] ?? 0).toLocaleString() : '—'}
          </p>

          <p className="admin-stat-caption">
            {key === 'todays_bookings'
              ? 'Scheduled for today'
              : key === 'total_bookings'
                ? 'All recorded bookings'
                : `${label} bookings`}
          </p>
        </article>
      ))}
    </div>
  )}

  <div className="admin-panel admin-dashboard-note">
    <div className="admin-note-icon">
      <CalendarDays size={22} />
    </div>

    <div>
      <h3>Manage your bookings</h3>
      <p>
        Open the Bookings section to review customer reservations,
        search records, and update booking statuses.
      </p>
    </div>
  </div>
</section>


);
}
