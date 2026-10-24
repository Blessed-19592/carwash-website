
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const prices = {
  Car: {
    'Basic Wash': 300,
    'Full Wash': 600,
    'Premium Detail': 1000,
  },
  'Small Truck': {
    'Basic Wash': 500,
    'Full Wash': 900,
    'Premium Detail': 1200,
  },
  'Large Truck': {
    'Basic Wash': 650,
    'Full Wash': 1000,
    'Premium Detail': 1500,
  },
  Motorcycle: {
    'Full Wash': 150,
  },
}

const OPENING_TIME = '08:30'
const CLOSING_TIME = '19:30'

// Sunday = 0, Monday = 1, ..., Saturday = 6
const CLOSED_DAYS = [6]

const formatPrice = (price) =>
  `KSh ${price.toLocaleString('en-KE')}`

// Format today's date using the computer's local calendar date.
function getToday() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function Booking() {
  const [searchParams] = useSearchParams()

  const [vehicle, setVehicle] = useState('Car')
  const [service, setService] = useState('')
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    date: '',
    time: '',
    notes: '',
  })

  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error')

  const today = getToday()

  // Preselect a service when arriving from the Services page.
  useEffect(() => {
    const requestedService = searchParams.get('service')
    const availableServices = Object.keys(prices.Car)

    if (availableServices.includes(requestedService)) {
      setService(requestedService)
    } else {
      setService('')
    }
  }, [searchParams])

  // Automatically select Full Wash for motorcycles.
  // Only depend on vehicle to prevent unnecessary effect loops.
  useEffect(() => {
    if (vehicle === 'Motorcycle') {
      setService('Full Wash')
    }
  }, [vehicle])

  const availableServices = Object.keys(prices[vehicle])

  // Prevent undefined prices from being formatted during state changes.
  const selectedPrice =
    service && prices[vehicle][service] !== undefined
      ? prices[vehicle][service]
      : null

  function showMessage(text, type = 'error') {
    setMessage(text)
    setMessageType(type)
  }

  function handleVehicleChange(e) {
    const newVehicle = e.target.value

    setVehicle(newVehicle)

    // Update the service immediately when changing vehicle.
    if (newVehicle === 'Motorcycle') {
      setService('Full Wash')
    } else if (service && prices[newVehicle][service] === undefined) {
      setService('')
    }

    setMessage('')
  }

  function handleServiceChange(e) {
    setService(e.target.value)
    setMessage('')
  }

  function handleInputChange(e) {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setMessage('')
  }

  // Validate the selected date.
  function isBookingDateAllowed(dateValue) {
    if (!dateValue || dateValue < today) {
      return false
    }

    const [year, month, day] = dateValue.split('-').map(Number)
    const selectedDate = new Date(year, month - 1, day)

    // Reject invalid calendar dates.
    if (
      selectedDate.getFullYear() !== year ||
      selectedDate.getMonth() !== month - 1 ||
      selectedDate.getDate() !== day
    ) {
      return false
    }

    // Saturday is closed.
    if (CLOSED_DAYS.includes(selectedDate.getDay())) {
      return false
    }

    return true
  }

  // Validate the selected time against opening hours.
  function isBookingTimeAllowed(timeValue) {
    if (!timeValue) {
      return false
    }

    return (
      timeValue >= OPENING_TIME &&
      timeValue <= CLOSING_TIME
    )
  }

  function handleDateChange(e) {
    const value = e.target.value

    setFormData((previous) => ({
      ...previous,
      date: value,
    }))

    if (!value) {
      setMessage('')
      return
    }

    if (value < today) {
      showMessage('Please choose today or a future date.')
      return
    }

    if (!isBookingDateAllowed(value)) {
      showMessage(
        'We are closed on Saturdays. Please choose Sunday to Friday.'
      )
      return
    }

    setMessage('')
  }

  function handleTimeChange(e) {
    const value = e.target.value

    setFormData((previous) => ({
      ...previous,
      time: value,
    }))

    if (!value) {
      setMessage('')
      return
    }

    if (!isBookingTimeAllowed(value)) {
      showMessage(
        'Our working hours are 8:30 AM to 7:30 PM.'
      )
      return
    }

    setMessage('')
  }

  function handleSubmit(e) {
    e.preventDefault()

    // Confirm that the selected service is available.
    if (prices[vehicle][service] === undefined) {
      showMessage('Please select a valid wash service.')
      return
    }

    // Check the date.
    if (!isBookingDateAllowed(formData.date)) {
      showMessage(
        'Please choose a valid date. We are closed on Saturdays and do not accept bookings for past dates.'
      )
      return
    }

    // Check the time.
    if (!isBookingTimeAllowed(formData.time)) {
      showMessage(
        'Please choose a time between 8:30 AM and 7:30 PM.'
      )
      return
    }

    showMessage(
      'Your details are valid, but booking submission has not been connected yet. Your booking has NOT been sent or saved.',
      'success'
    )
  }

  const inputStyle =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100'

  const labelStyle =
    'mb-2 block text-sm font-semibold text-gray-700'

  return (
    <main className="min-h-screen bg-gray-100 px-5 pb-20 pt-32 md:px-10">

      {/* Page heading */}
      <div className="mx-auto mb-12 max-w-3xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
          Express Car Wash
        </p>

        <h1 className="mb-4 font-[times_new_roman] text-4xl font-bold text-gray-900 md:text-5xl">
          Book Your Wash
        </h1>

        <p className="text-lg leading-relaxed text-gray-600">
          Choose your vehicle, select a service, and schedule a
          convenient time for your wash.
        </p>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 lg:grid-cols-3">

        {/* Booking form */}
        <section className="rounded-2xl bg-white p-6 shadow-md md:p-8 lg:col-span-2">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Booking Details
          </h2>

          <p className="mb-8 text-gray-500">
            Fill in your details to arrange your vehicle wash.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Customer name */}
            <div>
              <label htmlFor="fullName" className={labelStyle}>
                Full Name
              </label>

              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleInputChange}
                className={inputStyle}
                required
              />
            </div>

            {/* Phone number */}
            <div>
              <label htmlFor="phone" className={labelStyle}>
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleInputChange}
                className={inputStyle}
                required
              />
            </div>

            {/* Vehicle */}
            <div>
              <label htmlFor="vehicle" className={labelStyle}>
                Vehicle Type
              </label>

              <select
                id="vehicle"
                value={vehicle}
                onChange={handleVehicleChange}
                className={inputStyle}
              >
                <option value="Car">Car</option>
                <option value="Small Truck">Small Truck</option>
                <option value="Large Truck">Large Truck</option>
                <option value="Motorcycle">Motorcycle</option>
              </select>
            </div>

            {/* Service */}
            <div>
              <label htmlFor="service" className={labelStyle}>
                Wash Service
              </label>

              <select
                id="service"
                value={service}
                onChange={handleServiceChange}
                className={inputStyle}
                required
              >
                <option value="">Choose a wash service</option>

                {availableServices.map((serviceName) => (
                  <option key={serviceName} value={serviceName}>
                    {serviceName}
                  </option>
                ))}
              </select>

              {vehicle === 'Motorcycle' && (
                <p className="mt-2 text-sm text-blue-600">
                  Motorcycles are eligible for Full Wash only.
                </p>
              )}
            </div>

            {/* Date and time */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

              {/* Date */}
              <div>
                <label htmlFor="date" className={labelStyle}>
                  Preferred Date
                </label>

                <input
                  id="date"
                  name="date"
                  type="date"
                  min={today}
                  value={formData.date}
                  onChange={handleDateChange}
                  className={inputStyle}
                  required
                />

                <p className="mt-2 text-xs text-gray-500">
                  Available Sunday through Friday. Closed Saturday.
                </p>
              </div>

              {/* Time */}
              <div>
                <label htmlFor="time" className={labelStyle}>
                  Preferred Time
                </label>

                <input
                  id="time"
                  name="time"
                  type="time"
                  min={OPENING_TIME}
                  max={CLOSING_TIME}
                  value={formData.time}
                  onChange={handleTimeChange}
                  className={inputStyle}
                  required
                />

                <p className="mt-2 text-xs text-gray-500">
                  Available from 8:30 AM to 7:30 PM.
                </p>
              </div>
            </div>

            {/* Additional notes */}
            <div>
              <label htmlFor="notes" className={labelStyle}>
                Additional Notes (Optional)
              </label>

              <textarea
                id="notes"
                name="notes"
                rows="4"
                placeholder="Anything we should know about your vehicle?"
                value={formData.notes}
                onChange={handleInputChange}
                className={inputStyle}
              />
            </div>

            {/* Status message */}
            {message && (
              <div
                role="status"
                aria-live="polite"
                className={`rounded-lg p-4 text-sm ${
                  messageType === 'success'
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
            >
              Submit Booking
            </button>
          </form>
        </section>

        {/* Booking summary */}
        <aside className="rounded-2xl bg-gray-950 p-6 text-white shadow-md md:p-8">
          <h2 className="mb-2 text-2xl font-bold">
            Booking Summary
          </h2>

          <p className="mb-8 text-gray-400">
            Review your selected service.
          </p>

          <div className="space-y-5 border-b border-gray-700 pb-6">

            <div>
              <p className="mb-1 text-sm text-gray-400">
                Vehicle
              </p>

              <p className="text-lg font-semibold">
                {vehicle}
              </p>
            </div>

            <div>
              <p className="mb-1 text-sm text-gray-400">
                Selected Service
              </p>

              <p className="text-lg font-semibold">
                {service || 'No service selected'}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between gap-4 py-6">
            <span className="text-gray-300">Total Price</span>

            <span className="text-2xl font-bold text-blue-400">
              {selectedPrice !== null
                ? formatPrice(selectedPrice)
                : '—'}
            </span>
          </div>

          {/* Location */}
          <div className="rounded-xl bg-gray-800 p-4">
            <p className="mb-2 font-semibold">
              Our Location
            </p>

            <p className="text-sm leading-relaxed text-gray-300">
              Kanyadhiang' Daraja,
              <br />
              Homa Bay, Kenya
            </p>
          </div>

          {/* Working hours */}
          <div className="mt-5 rounded-xl bg-gray-800 p-4">
            <p className="mb-2 font-semibold">
              Working Hours
            </p>

            <p className="text-sm leading-relaxed text-gray-300">
              Sunday – Friday
              <br />
              8:30 AM – 7:30 PM
              <br />
              <span className="text-red-300">
                Saturday - Closed
              </span>
            </p>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-gray-400">
            Your price is calculated automatically based on
            your vehicle and selected wash service.
          </p>
        </aside>
      </div>
    </main>
  )
}

export default Booking

