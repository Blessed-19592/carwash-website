
import { useCallback, useEffect, useState } from 'react';
import {
  CalendarDays,
  Clock3,
  CheckCircle2,
  CircleCheck,
  XCircle,
  RefreshCw,
  AlertCircle,
  Banknote,
  TrendingUp,
  Wallet,
  CalendarCheck,
  UserX,
  Receipt,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

const bookingCards = [
  {
    key: 'total_bookings',
    label: 'Total Bookings',
    icon: CalendarDays,
    color: 'blue',
    caption: 'All recorded bookings',
  },
  {
    key: 'todays_bookings',
    label: "Today's Bookings",
    icon: Clock3,
    color: 'purple',
    caption: 'Scheduled for today',
  },
  {
    key: 'pending_bookings',
    label: 'Pending',
    icon: Clock3,
    color: 'orange',
    caption: 'Awaiting confirmation',
  },
  {
    key: 'confirmed_bookings',
    label: 'Confirmed',
    icon: CheckCircle2,
    color: 'green',
    caption: 'Confirmed reservations',
  },
  {
    key: 'completed_bookings',
    label: 'Completed',
    icon: CircleCheck,
    color: 'teal',
    caption: 'Completed washes',
  },
  {
    key: 'cancelled_bookings',
    label: 'Cancelled',
    icon: XCircle,
    color: 'red',
    caption: 'Cancelled reservations',
  },
  {
    key: 'no_show_bookings',
    label: 'No-shows',
    icon: UserX,
    color: 'red',
    caption: 'Customers who missed appointments',
  },
];

const financialCards = [
  {
    key: 'actual_revenue',
    label: 'Actual Revenue',
    icon: Banknote,
    color: 'green',
    caption: 'Money received and recorded',
  },
  {
    key: 'todays_revenue',
    label: "Today's Revenue",
    icon: CalendarCheck,
    color: 'blue',
    caption: 'Payments received today',
  },
  {
    key: 'monthly_revenue',
    label: 'Monthly Revenue',
    icon: TrendingUp,
    color: 'purple',
    caption: 'Payments received this month',
  },
  {
    key: 'potential_revenue',
    label: 'Potential Revenue',
    icon: Wallet,
    color: 'teal',
    caption: 'Value of non-cancelled bookings',
  },
  {
    key: 'estimated_no_show_loss',
    label: 'Estimated No-show Loss',
    icon: UserX,
    color: 'orange',
    caption: 'Value of bookings marked no-show',
  },
  {
    key: 'unpaid_completed_services',
    label: 'Unpaid Completed Services',
    icon: Receipt,
    color: 'red',
    caption: 'Remaining balance for completed washes',
  },
];

const formatMoney = (value) =>
  `KSh ${Number(value ?? 0).toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

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

  return (
    <section>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">BUSINESS OVERVIEW</p>
          <h2>Dashboard Overview</h2>
          <p className="admin-page-description">
            Monitor bookings, track payments, and understand your
            car wash business performance.
          </p>
        </div>

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
      ) : stats ? (
        <>
          <section className="admin-dashboard-section">
            <div className="admin-section-heading">
              <div>
                <p className="admin-eyebrow">FINANCIAL PERFORMANCE</p>
                <h3>Revenue & Payments</h3>
              </div>
              <span className="admin-financial-badge">
                <Banknote size={16} />
                Kenyan Shillings
              </span>
            </div>

            <div className="admin-stats-grid">
              {financialCards.map(
                ({ key, label, icon: Icon, color, caption }) => (
                  <article
                    className="admin-stat-card admin-financial-card"
                    key={key}
                  >
                    <div className="admin-stat-top">
                      <span className={`admin-stat-icon ${color}`}>
                        <Icon size={22} />
                      </span>
                      <span className="admin-stat-label">{label}</span>
                    </div>

                    <p className="admin-stat-value admin-money-value">
                      {formatMoney(stats[key])}
                    </p>

                    <p className="admin-stat-caption">{caption}</p>
                  </article>
                )
              )}
            </div>
          </section>

          <section className="admin-dashboard-section">
            <div className="admin-section-heading">
              <div>
                <p className="admin-eyebrow">OPERATIONS</p>
                <h3>Booking Overview</h3>
              </div>
            </div>

            <div className="admin-stats-grid">
              {bookingCards.map(
                ({ key, label, icon: Icon, color, caption }) => (
                  <article className="admin-stat-card" key={key}>
                    <div className="admin-stat-top">
                      <span className={`admin-stat-icon ${color}`}>
                        <Icon size={22} />
                      </span>
                      <span className="admin-stat-label">{label}</span>
                    </div>

                    <p className="admin-stat-value">
                      {Number(stats[key] ?? 0).toLocaleString('en-KE')}
                    </p>

                    <p className="admin-stat-caption">{caption}</p>
                  </article>
                )
              )}
            </div>
          </section>

          <div className="admin-panel admin-dashboard-note">
            <div className="admin-note-icon">
              <CalendarDays size={22} />
            </div>

            <div>
              <h3>Manage your bookings</h3>
              <p>
                Open the Bookings section to review reservations,
                search customer records, update booking statuses,
                and manage appointments.
              </p>
            </div>
          </div>

          <div className="admin-panel admin-dashboard-note">
            <div className="admin-note-icon">
              <Banknote size={22} />
            </div>

            <div>
              <h3>Understanding your financial figures</h3>
              <p>
                Actual revenue includes recorded successful payments.
                Potential revenue is an estimate based on non-cancelled
                bookings. No-show loss is an estimate, not money
                automatically owed by customers.
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="admin-panel">
          <p>Dashboard statistics are unavailable.</p>
          <button
            type="button"
            className="admin-secondary-button"
            onClick={() => loadStats(true)}
          >
            <RefreshCw size={16} />
            Try again
          </button>
        </div>
      )}
    </section>
  );
}

