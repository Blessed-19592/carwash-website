import carwashHero from '../assets/carwash-hero.jpg'

function Home() {
  return (
    <div className="pt-24">

      <section
        className="relative bg-cover bg-center min-h-[70vh] flex items-center px-6"
        style={{ backgroundImage: `url(${carwashHero})` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 max-w-xl text-left">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to Express Car Wash
          </h1>
          <p className="text-gray-100 text-lg mb-6">
            We take care of your vehicle with fast, reliable, and affordable
            washing and detailing — whether it's a motorcycle, car, or truck.
            Drive in, relax, and let us handle the rest.
          </p>
          <button className="bg-gray-100 text-gray-900 px-6 py-3 rounded font-semibold">
            Book Now
          </button>
        </div>
      </section>

      <section className="py-12 px-6 bg-gray-50">
        <h2 className="text-xl font-bold text-center mb-8 text-gray-800">
          Our Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white shadow rounded p-6 text-center border border-gray-200">
            <h3 className="font-bold mb-2 text-gray-800">Exterior Wash</h3>
            <p className="text-sm text-gray-600">Motorcycles, cars & trucks</p>
          </div>

          <div className="bg-white shadow rounded p-6 text-center border border-gray-200">
            <h3 className="font-bold mb-2 text-gray-800">Interior Detailing</h3>
            <p className="text-sm text-gray-600">Cars & trucks</p>
          </div>

          <div className="bg-white shadow rounded p-6 text-center border border-gray-200">
            <h3 className="font-bold mb-2 text-gray-800">Waxing</h3>
            <p className="text-sm text-gray-600">Leave it shining</p>
          </div>

        </div>
      </section>

      <footer className="bg-gray-900 text-center py-6 px-6 text-sm text-gray-400">
        <p>Express Car Wash</p>
        <p>Homaba, Kanyadhiang', near RA</p>
      </footer>

    </div>
  )
}

export default Home