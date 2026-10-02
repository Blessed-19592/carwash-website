import { CarFront, Sparkles, Gem } from "lucide-react";

function Services() {
  return (
    <div>

      {/* SERVICES HERO */}
      <section className="bg-white py-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center">

          <p className="text-blue-400 uppercase tracking-widest text-sm font-semibold mb-3">
            What We Offer
          </p>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Our Services
          </h1>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Professional cleaning and detailing services designed to
            keep your vehicle looking and feeling its best.
          </p>

        </div>
      </section>


      {/* MAIN SERVICES */}
      <section className="bg-white py-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">

          {/* SECTION HEADER */}
          <div className="text-center mb-16">

            <p className="text-blue-600 uppercase tracking-widest text-sm font-semibold mb-3">
              Our Services
            </p>

            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5">
              Choose the right clean for your car
            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              From a quick exterior wash to a complete interior and
              exterior detail, we've got your vehicle covered.
            </p>

          </div>


          {/* SERVICE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">


            {/* BASIC WASH */}
            <div className="border border-gray-200 hover:border-blue-600 shadow-xl rounded-2xl p-8 transition duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
  <CarFront size={28} />
</div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Basic Wash
              </h3>

              <p className="text-gray-600 mb-6">
                A quick and effective clean for keeping your vehicle
                fresh and looking great every day.
              </p>

              <ul className="space-y-3 text-gray-600 mb-8">
                <li>✓ Exterior wash</li>
                <li>✓ Wheel cleaning</li>
                <li>✓ Tyre cleaning</li>
                <li>✓ Exterior drying</li>
              </ul>

              <button className="text-blue-600 font-semibold hover:text-blue-800 transition">
                Book this service →
              </button>

            </div>


            {/* FULL WASH */}
            <div className="border border-gray-200 hover:border-blue-600 shadow-xl rounded-2xl p-8 transition duration-300">

              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
  <Sparkles size={28} />
</div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Full Wash
              </h3>

              <p className="text-gray-600 mb-6">
                A complete cleaning service for both the exterior and
                interior of your vehicle.
              </p>

              <ul className="space-y-3 text-gray-600 mb-8">
                <li>✓ Everything in Basic Wash</li>
                <li>✓ Interior vacuuming</li>
                <li>✓ Dashboard cleaning</li>
                <li>✓ Interior wipe-down</li>
              </ul>

              <button className="text-blue-600 font-semibold hover:text-blue-800 transition">
                Book this service →
              </button>

            </div>


            {/* PREMIUM DETAIL */}
            <div className="border border-gray-200 hover:border-blue-600 shadow-xl rounded-2xl p-8 transition duration-300">

              

              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
  <Gem size={28} />
</div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Premium Detail
              </h3>

              <p className="text-gray-600 mb-6">
                Our complete detailing service for customers who want
                their vehicle looking its absolute best.
              </p>

              <ul className="space-y-3 text-gray-600 mb-8">
                <li>✓ Full exterior wash</li>
                <li>✓ Deep interior cleaning</li>
                <li>✓ Vacuuming</li>
                <li>✓ Tyre & wheel treatment</li>
              </ul>

              <button className="text-blue-600 font-semibold hover:text-blue-800 transition">
                Book this service →
              </button>

            </div>


          </div>
        </div>
      </section>


      {/* CALL TO ACTION */}
      <section className="bg-gray-900 text-white py-20 px-6 md:px-16">
        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl md:text-5xl font-bold mb-5">
            Ready when you are
          </h2>

          <p className="text-gray-300 text-lg mb-8">
            Give your car the care it deserves. Book your wash today.
          </p>

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition duration-300">
            Book Now
          </button>

        </div>
      </section>


    </div>
  );
}

export default Services;