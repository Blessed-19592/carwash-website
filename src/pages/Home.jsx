import carwashHero from '../assets/carwash-hero.jpg'

function Home() {
  return (
    <div>

      {/* HERO / HOME */}
      <section
        className="relative min-h-screen bg-cover bg-center flex items-center px-6 md:px-16"
        style={{ backgroundImage: `url(${carwashHero})` }}
      >

        
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl text-left pt-16">

          <p className="text-gray-300 uppercase tracking-widest text-sm mb-3">
            Fast. Clean. Reliable.
          </p>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to
            <span className="block text-blue-500">
              Express Car Wash
            </span>
          </h1>

          <p className="text-gray-200 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
            We take care of your vehicle with fast, reliable, and affordable
            washing and detailing. Whether it's a motorcycle, car, or truck,
            drive in, relax, and let us handle the rest.
          </p>

          <button className="ml-auto bg-blue-600 text-white px-6 py-3 rounded-md font-semibold font-[Montserrat] hover:bg-blue-800 transition duration-300">
            Book Now
          </button>

        </div>
      </section>


      {/* SERVICES */}
      <section
        id="services"
        className="py-20 px-6 md:px-16 bg-gray-50"
      >

        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Our Services
        </h2>

        <p className="text-center text-gray-500 mb-12">
          Professional care for every type of vehicle
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <div className="bg-white shadow-md rounded-lg p-8 text-center border border-gray-200">
            <h3 className="font-bold text-xl mb-3 text-gray-800">
              Exterior Wash
            </h3>

            <p className="text-gray-600">
              Motorcycles, cars & trucks
            </p>
          </div>


          <div className="bg-white shadow-md rounded-lg p-8 text-center border border-gray-200">
            <h3 className="font-bold text-xl mb-3 text-gray-800">
              Interior Detailing
            </h3>

            <p className="text-gray-600">
              Deep cleaning for cars & trucks
            </p>
          </div>


          <div className="bg-white shadow-md rounded-lg p-8 text-center border border-gray-200">
            <h3 className="font-bold text-xl mb-3 text-gray-800">
              Waxing
            </h3>

            <p className="text-gray-600">
              Give your vehicle that fresh shine
            </p>
          </div>

        </div>
      </section>


      {/* FOOTER */}
      <footer className="bg-gray-900 text-center py-8 px-6 text-sm text-gray-400">
        <p className="text-white font-semibold mb-2">
          Express Car Wash
        </p>

        <p>
          Homabay, Kanyadhiang'
        </p>
      </footer>

    </div>
  )
}

export default Home