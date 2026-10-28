
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
  Banknote,
  X,
  CheckCircle2,
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

const STATUSES = [
  'pending',
  'confirmed',
  'completed',
  'cancelled',
  'no_show',
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'mpesa', label: 'M-PESA' },
  { value: 'card', label: 'Card' },
  { value: 'other', label: 'Other' },
];

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

  const normalized = status.toLowerCase();

  if (normalized === 'no_show') return 'No-show';

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function formatAmount(amount) {
  const value = Number(amount);

  if (!Number.isFinite(value)) return '—';

  return `KSh ${value.toLocaleString('en-KE', {
    minimumFractionDigits: 2,
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

  // Payment form state.
  const [paymentBooking, setPaymentBooking] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [transactionReference, setTransactionReference] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

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

  function openPaymentForm(booking) {
    setPaymentBooking(booking);
    setPaymentAmount('');
    setPaymentMethod('cash');
    setTransactionReference('');
    setPaymentResult(null);
    setError('');
    setSuccess('');
  }

  function closePaymentForm() {
    if (submittingPayment) return;

    setPaymentBooking(null);
    setPaymentAmount('');
    setTransactionReference('');
    setPaymentResult(null);
  }

  async function handleRecordPayment(event) {
    event.preventDefault();

    if (!paymentBooking || submittingPayment) return;

    const amount = Number(paymentAmount);

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !/^\d+(\.\d{1,2})?$/.test(paymentAmount.trim())
    ) {
      setError('Enter a valid payment amount with no more than two decimal places.');
      return;
    }

    if (
      paymentMethod === 'mpesa' &&
      !transactionReference.trim()
    ) {
      setError(
        'Enter the M-PESA transaction reference after verifying the payment.'
      );
      return;
    }

    setSubmittingPayment(true);
    setError('');
    setSuccess('');

    try {
      const response = await adminApi.recordPayment(
        paymentBooking.booking_id,
        {
          amount: paymentAmount.trim(),
          payment_method: paymentMethod,
          transaction_reference:
            transactionReference.trim() || null,
        }
      );

      setPaymentResult(response);

      setSuccess(
        `Payment for booking #${paymentBooking.booking_id} recorded successfully.`
      );

      // Refresh booking records without clearing the success message.
      try {
        const refreshed = await adminApi.getBookings({
          search,
          date,
          status,
        });

        setBookings(refreshed.bookings || []);
      } catch {
        // The payment was saved. A failed refresh must not imply otherwise.
      }
    } catch (err) {
      setError(err.message || 'Unable to record the payment.');
    } finally {
      setSubmittingPayment(false);
    }
  }

  function clearFilters() {
    setSearchInput('');
    setSearch('');
    setDate('');
    setStatus('');
  }

  return (
    <section>
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">RESERVATION MANAGEMENT</p>
          <h2>Bookings</h2>
          <p className="admin-page-description">
            Review reservations, manage booking statuses, and record
            payments received by the business.
          </p>
        </div>

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
          <button
            type="button"
            onClick={() => loadBookings(true)}
          >
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
                <th>Vehicle &amp; Service</th>
                <th>Date &amp; Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => {
                const normalizedStatus = String(
                  booking.status
                ).toLowerCase();

                const paymentAllowed = ![
                  'cancelled',
                  'no_show',
                ].includes(normalizedStatus);

                return (
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
                          className={`admin-status-badge ${normalizedStatus}`}
                        >
                          {formatStatus(booking.status)}
                        </span>

                        <select
                          className="admin-status-select"
                          aria-label={`Update status for booking ${booking.booking_id}`}
                          value={normalizedStatus}
                          disabled={
                            updatingId === booking.booking_id ||
                            !STATUSES.includes(normalizedStatus)
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

                    <td>
                      <button
                        type="button"
                        className="admin-payment-button"
                        disabled={!paymentAllowed}
                        onClick={() => openPaymentForm(booking)}
                        title={
                          paymentAllowed
                            ? 'Record money received'
                            : 'Payments are disabled for cancelled or no-show bookings'
                        }
                      >
                        <Banknote size={15} />
                        Record payment
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {paymentBooking && (
        <div
          className="admin-payment-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePaymentForm();
            }
          }}
        >
          <section
            className="admin-payment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
          >
            <div className="admin-payment-modal-heading">
              <div>
                <p className="admin-eyebrow">PAYMENT MANAGEMENT</p>
                <h3 id="payment-modal-title">
                  Booking #{paymentBooking.booking_id}
                </h3>
                <p>
                  {paymentBooking.customer_name || 'Customer'} ·{' '}
                  {paymentBooking.service_name || 'Wash service'}
                </p>
              </div>

              <button
                type="button"
                className="admin-payment-close"
                onClick={closePaymentForm}
                disabled={submittingPayment}
                aria-label="Close payment form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-payment-booking-total">
              <span>Booking amount</span>
              <strong>{formatAmount(paymentBooking.amount)}</strong>
            </div>

            {paymentResult && (
              <div className="admin-payment-result" role="status">
                <p>
                  <CheckCircle2 size={17} />
                  Payment recorded successfully
                </p>

                <div>
                  <span>Total paid</span>
                  <strong>
                    {formatAmount(paymentResult.total_paid)}
                  </strong>
                </div>

                <div>
                  <span>Remaining balance</span>
                  <strong>
                    {formatAmount(paymentResult.remaining_balance)}
                  </strong>
                </div>

                <div>
                  <span>Payment status</span>
                  <strong>
                    {paymentResult.payment_status === 'paid'
                      ? 'Paid'
                      : 'Partially paid'}
                  </strong>
                </div>

                <button
                  type="button"
                  className="admin-primary-button"
                  onClick={closePaymentForm}
                >
                  Done
                </button>
              </div>
            )}

            {!paymentResult && (
              <form
                className="admin-payment-form"
                onSubmit={handleRecordPayment}
              >
                <p className="admin-payment-notice">
                  Record only money that the business has actually
                  received. Partial payments are supported.
                </p>

                <label>
                  Amount received (KSh)
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    max="999999999"
                    required
                    value={paymentAmount}
                    onChange={(event) =>
                      setPaymentAmount(event.target.value)
                    }
                    placeholder="Enter amount received"
                    disabled={submittingPayment}
                  />
                </label>

                <label>
                  Payment method
                  <select
                    value={paymentMethod}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                    disabled={submittingPayment}
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <option
                        key={method.value}
                        value={method.value}
                      >
                        {method.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  Transaction reference
                  {paymentMethod === 'mpesa' ? (
                    <span className="admin-payment-field-hint">
                      Required for M-PESA payments
                    </span>
                  ) : (
                    <span className="admin-payment-field-hint">
                      Optional
                    </span>
                  )}

                  <input
                    type="text"
                    maxLength={100}
                    value={transactionReference}
                    onChange={(event) =>
                      setTransactionReference(event.target.value)
                    }
                    placeholder={
                      paymentMethod === 'mpesa'
                        ? 'Enter verified M-PESA receipt code'
                        : 'Enter receipt or reference if available'
                    }
                    disabled={submittingPayment}
                    required={paymentMethod === 'mpesa'}
                  />
                </label>

                <div className="admin-payment-form-actions">
                  <button
                    type="button"
                    className="admin-secondary-button"
                    onClick={closePaymentForm}
                    disabled={submittingPayment}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="admin-primary-button"
                    disabled={submittingPayment}
                  >
                    {submittingPayment ? (
                      <>
                        <RefreshCw
                          size={16}
                          className="admin-spinner"
                        />
                        Recording...
                      </>
                    ) : (
                      <>
                        <Banknote size={16} />
                        Confirm payment received
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}
    </section>
  );
}

