import { useCallback, useEffect, useState } from 'react';
import {
Search,
RefreshCw,
CalendarDays,
Clock3,
CarFront,
UserRound,
Phone,
AlertCircle,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

function formatDate(dateString) {
if (!dateString) return '—';

const date = new Date(`${dateString}T00:00:00`);

return Number.isNaN(date.getTime())
? dateString
: date.toLocaleDateString('en-KE', {
day: 'numeric',
month: 'short',
year: 'numeric',
});
}

function formatTime(timeString) {
if (!timeString) return '—';

const [hours, minutes] = timeString.split(':');
const hour = Number(hours);

if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
return timeString;
}

const period = hour >= 12 ? 'PM' : 'AM';
const displayHour = hour % 12 || 12;

return `${displayHour}:${minutes} ${period}`;
}

function formatVehicle(vehicle) {
if (!vehicle) return '—';

return vehicle
.replace(/_/g, ' ')
.replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatStatus(status) {
if (!status) return 'Unknown';

return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function formatAmount(amount) {
const value = Number(amount);

if (!Number.isFinite(value)) return '—';

return `KSh ${value.toLocaleString('en-KE', {
    maximumFractionDigits: 2,
  })}`;
}

export default function AdminBookings() {
const [bookings, setBookings] = useState([]);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');
const [searchInput, setSearchInput] = useState('');
const [search, setSearch] = useState('');
const [date, setDate] = useState('');
const [status, setStatus] = useState('');
const [updatingId, setUpdatingId] = useState(null);

useEffect(() => {
const timer = setTimeout(() => {
setSearch(searchInput.trim());
}, 350);


return () => clearTimeout(timer);


}, [searchInput]);

const loadBookings = useCallback(async (isRefresh = false) => {
setError('');
setSuccess('');


if (isRefresh) {
  setRefreshing(true);
} else {
  setLoading(true);
}

try {
  const response = await adminApi.getBookings({
    search,
    date,
    status,
  });

  setBookings(response.bookings || []);
} catch (err) {
  setError(err.message || 'Unable to load bookings.');
} finally {
  setLoading(false);
  setRefreshing(false);
}


}, [search, date, status]);

useEffect(() => {
loadBookings();
}, [loadBookings]);

async function handleStatusChange(bookingId, newStatus) {
const booking = bookings.find(
(item) => item.booking_id === bookingId
);


if (!booking || booking.status === newStatus) return;

const confirmed = window.confirm(
  `Change booking #${bookingId} from "${formatStatus(
    booking.status
  )}" to "${formatStatus(newStatus)}"?`
);

if (!confirmed) return;

setUpdatingId(bookingId);
setError('');
setSuccess('');

try {
  const response = await adminApi.updateBookingStatus(
    bookingId,
    newStatus
  );

  setBookings((current) =>
    current.map((item) =>
      item.booking_id === bookingId
        ? { ...item, ...response.booking }
        : item
    )
  );

  setSuccess(`Booking #${bookingId} was updated successfully.`);
} catch (err) {
  setError(err.message || 'Unable to update booking status.');
} finally {
  setUpdatingId(null);
}


}

function clearFilters() {
setSearchInput('');
setSearch('');
setDate('');
setStatus('');
}

return ( <section> <div className="admin-page-heading"> <div> <p className="admin-eyebrow">RESERVATION MANAGEMENT</p> <h2>Bookings</h2> <p className="admin-page-description">
Review reservations and manage their current status. </p> </div>


    <button
      type="button"
      className="admin-secondary-button"
      onClick={() => loadBookings(true)}
      disabled={loading || refreshing}
    >
      <RefreshCw
        size={16}
        className={refreshing ? 'admin-spinner' : ''}
      />
      Refresh
    </button>
  </div>

  <div className="admin-booking-filters">
    <div className="admin-search-field">
      <Search size={18} />

      <input
        type="search"
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        placeholder="Search customer, phone, vehicle or service..."
        aria-label="Search bookings"
      />
    </div>

    <div className="admin-filter-field">
      <CalendarDays size={17} />

      <input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        aria-label="Filter by booking date"
      />
    </div>

    <select
      className="admin-status-filter"
      value={status}
      onChange={(event) => setStatus(event.target.value)}
      aria-label="Filter by booking status"
    >
      <option value="">All statuses</option>

      {STATUSES.map((item) => (
        <option key={item} value={item}>
          {formatStatus(item)}
        </option>
      ))}
    </select>

    <button
      type="button"
      className="admin-clear-filters"
      onClick={clearFilters}
    >
      Clear filters
    </button>
  </div>

  {error && (
    <div className="admin-alert admin-alert-error" role="alert">
      <AlertCircle size={18} />
      <span>{error}</span>
      <button type="button" onClick={() => loadBookings(true)}>
        Retry
      </button>
    </div>
  )}

  {success && (
    <div className="admin-alert admin-alert-success" role="status">
      {success}
    </div>
  )}

  <div className="admin-bookings-summary">
    <div>
      <strong>{loading ? '—' : bookings.length}</strong>
      <span>Bookings returned</span>
    </div>

    <p>Results are limited to the latest 200 matching bookings.</p>
  </div>

  <div className="admin-bookings-table-wrapper">
    {loading ? (
      <div className="admin-empty-state">
        <RefreshCw size={25} className="admin-spinner" />
        <p>Loading bookings...</p>
      </div>
    ) : bookings.length === 0 ? (
      <div className="admin-empty-state">
        <CalendarDays size={34} />
        <h3>No bookings found</h3>
        <p>
          Try changing your filters, or check again when a customer
          makes a reservation.
        </p>
      </div>
    ) : (
      <table className="admin-bookings-table">
        <thead>
          <tr>
            <th>Booking</th>
            <th>Customer</th>
            <th>Vehicle & Service</th>
            <th>Date & Time</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.booking_id}>
              <td>
                <span className="admin-booking-id">
                  #{booking.booking_id}
                </span>
              </td>

              <td>
                <div className="admin-customer-cell">
                  <span className="admin-customer-name">
                    <UserRound size={15} />
                    {booking.customer_name || 'Unknown customer'}
                  </span>

                  <span className="admin-customer-phone">
                    <Phone size={13} />
                    {booking.customer_phone || 'No phone'}
                  </span>
                </div>
              </td>

              <td>
                <div className="admin-service-cell">
                  <span className="admin-service-vehicle">
                    <CarFront size={16} />
                    {formatVehicle(booking.vehicle_type)}
                  </span>

                  <span className="admin-service-name">
                    {booking.service_name || '—'}
                  </span>
                </div>
              </td>

              <td>
                <div className="admin-date-cell">
                  <span>{formatDate(booking.booking_date)}</span>

                  <span className="admin-booking-time">
                    <Clock3 size={13} />
                    {formatTime(booking.booking_time)}
                  </span>
                </div>
              </td>

              <td className="admin-booking-amount">
                {formatAmount(booking.amount)}
              </td>

              <td>
                <div className="admin-status-cell">
                  <span
                    className={`admin-status-badge ${String(
                      booking.status
                    ).toLowerCase()}`}
                  >
                    {formatStatus(booking.status)}
                  </span>

                  <select
                    className="admin-status-select"
                    aria-label={`Update status for booking ${booking.booking_id}`}
                    value={booking.status}
                    disabled={
                      updatingId === booking.booking_id ||
                      !STATUSES.includes(
                        String(booking.status).toLowerCase()
                      )
                    }
                    onChange={(event) =>
                      handleStatusChange(
                        booking.booking_id,
                        event.target.value
                      )
                    }
                  >
                    {STATUSES.map((item) => (
                      <option key={item} value={item}>
                        {formatStatus(item)}
                      </option>
                    ))}
                  </select>

                  {updatingId === booking.booking_id && (
                    <span className="admin-updating-label">
                      Updating...
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
</section>


);
}
