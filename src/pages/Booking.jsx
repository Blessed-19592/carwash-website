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

const formatPrice = (price) =>
  `KSh ${price.toLocaleString('en-KE')}`

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

  // Preselect a service when the customer comes from the Services page.
  useEffect(() => {
    const requestedService = searchParams.get('service')

    const availableServices = Object.keys(prices.Car)

    if (availableServices.includes(requestedService)) {
      setService(requestedService)
    } else {
      setService('')
    }
  }, [searchParams])

  // Motorcycles can only receive a Full Wash.
  useEffect(() => {
    if (vehicle === 'Motorcycle') {
      setService('Full Wash')
    } else if (service && !prices[vehicle][service]) {
      setService('')
    }
  }, [vehicle, service])

  const availableServices = Object.keys(prices[vehicle])

  const selectedPrice = service
    ? prices[vehicle][service]
    : null

  const today = new Date().toLocaleDateString('en-CA')

  function handleVehicleChange(e) {
    setVehicle(e.target.value)
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

  function handleSubmit(e) {
    e.preventDefault()

    if (!service) {
      setMessage('Please select a wash service.')
      return
    }

    if (!selectedPrice) {
      setMessage('The selected service is unavailable.')
      return
    }

    setMessage(
      'Your form is complete, but booking submission has not been connected yet. Your booking has NOT been sent or saved.'
    )
  }

  const inputStyle =
    'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100'

  const labelStyle =
    'mb-2 block text-sm font-semibold text-gray-700'

  return (
    <main className="min-h-screen bg-gray-100 pt-32 pb-20 px-5 md:px-10">
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
                  onChange={handleInputChange}
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label htmlFor="time" className={labelStyle}>
                  Preferred Time
                </label>

                <input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  className={inputStyle}
                  required
                />
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

            {/* Submission status */}
            {message && (
              <div
                role="status"
                className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800"
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

        {/* Price summary */}
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

          <div className="flex items-center justify-between gap-4 py-6">
            <span className="text-gray-300">Total Price</span>

            <span className="text-2xl font-bold text-blue-400">
              {selectedPrice !== null
                ? formatPrice(selectedPrice)
                : '—'}
            </span>
          </div>

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

          <p className="mt-6 text-sm leading-relaxed text-gray-400">
            Your final service price is calculated automatically
            based on your vehicle and selected wash.
          </p>
        </aside>
      </div>
    </main>
  )
}

export default Booking