import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

const OPENING_TIME = '08:30'
const CLOSING_TIME = '19:30'

// Sunday = 0, Monday = 1, ..., Saturday = 6
const CLOSED_DAYS = [6]

const formatPrice = (price) =>
  `KSh ${Number(price).toLocaleString('en-KE')}`

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

  // Services and prices fetched from PostgreSQL
  const [services, setServices] = useState([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [servicesError, setServicesError] = useState('')

  // Booking form state
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

  // Fetch available services from the backend.
  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch(
          'http://localhost:5000/api/services'
        )

        if (!response.ok) {
          throw new Error('Failed to fetch services.')
        }

        const data = await response.json()

        setServices(data.services)
        setServicesError('')
      } catch (error) {
        console.error('Error fetching booking services:', error)

        setServicesError(
          'Unable to load services. Please try again later.'
        )
      } finally {
        setLoadingServices(false)
      }
    }

    fetchServices()
  }, [])

  // Get the services available for the selected vehicle.
  const availableServices = services.filter(
    (item) => item.vehicle_type === vehicle
  )

  // Find the selected service and its price in PostgreSQL data.
  const selectedService = services.find(
    (item) =>
      item.vehicle_type === vehicle &&
      item.service_name === service
  )

  const selectedPrice = selectedService
    ? Number(selectedService.price)
    : null

  // Preselect a service when arriving from the Services page.
  useEffect(() => {
    if (loadingServices || servicesError) {
      return
    }

    const requestedService = searchParams.get('service')

    const matchingService = services.find(
      (item) =>
        item.vehicle_type === 'Car' &&
        item.service_name === requestedService
    )

    if (matchingService) {
      setVehicle('Car')
      setService(matchingService.service_name)
    } else {
      setService('')
    }
  }, [searchParams, services, loadingServices, servicesError])

  // Automatically select Full Wash for motorcycles.
  useEffect(() => {
    if (vehicle === 'Motorcycle' && !loadingServices) {
      const motorcycleFullWash = services.find(
        (item) =>
          item.vehicle_type === 'Motorcycle' &&
          item.service_name === 'Full Wash'
      )

      setService(
        motorcycleFullWash ? motorcycleFullWash.service_name : ''
      )
    }
  }, [vehicle, services, loadingServices])

  function showMessage(text, type = 'error') {
    setMessage(text)
    setMessageType(type)
  }

  // Change vehicle and ensure the selected service is available.
  function handleVehicleChange(e) {
    const newVehicle = e.target.value

    setVehicle(newVehicle)
    setMessage('')

    if (newVehicle === 'Motorcycle') {
      const motorcycleFullWash = services.find(
        (item) =>
          item.vehicle_type === 'Motorcycle' &&
          item.service_name === 'Full Wash'
      )

      setService(
        motorcycleFullWash ? motorcycleFullWash.service_name : ''
      )

      return
    }

    const currentServiceAvailable = services.some(
      (item) =>
        item.vehicle_type === newVehicle &&
        item.service_name === service
    )

    if (!currentServiceAvailable) {
      setService('')
    }
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

    // Ensure services have loaded successfully.
    if (loadingServices) {
      showMessage('Please wait while our services load.')
      return
    }

    if (servicesError) {
      showMessage(
        'Services could not be loaded. Please refresh the page and try again.'
      )
      return
    }

    // Confirm that the selected service exists in the database data.
    const validService = services.find(
      (item) =>
        item.vehicle_type === vehicle &&
        item.service_name === service
    )

    if (!validService) {
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

          {/* Service loading and error messages */}
          {loadingServices && (
            <p className="mb-6 rounded-lg bg-blue-50 p-4 text-sm text-blue-700">
              Loading available services and prices...
            </p>
          )}

          {servicesError && (
            <p
              role="alert"
              className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700"
            >
              {servicesError}
            </p>
          )}

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
                disabled={loadingServices || Boolean(servicesError)}
              >
                <option value="">Choose a wash service</option>

                {availableServices.map((item) => (
                  <option
                    key={item.service_id}
                    value={item.service_name}
                  >
                    {item.service_name} — {formatPrice(item.price)}
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
              disabled={loadingServices || Boolean(servicesError)}
              className="w-full rounded-lg bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
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