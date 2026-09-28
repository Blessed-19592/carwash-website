import { CarFront, Sparkles, Droplets, Check } from 'lucide-react'
import { Link } from 'react-router-dom'

import carwashHero from '../assets/carwash-hero.jpg'

function Home() {
  return (
    <div>

      {/* HERO / HOME */}
      <section
        className="relative min-h-screen bg-cover bg-center flex items-center px-6 md:px-16"
        style={{ backgroundImage: `url(${carwashHero})` }}
      >

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent"></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-2xl text-left pt-16">

          <p className="text-gray-300 uppercase tracking-widest text-sm mb-3">
            Fast. Clean. Reliable.
          </p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
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

          <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold font-[Montserrat] hover:bg-blue-800 transition duration-300">
            Book Now
          </button>

        </div>
      </section>


      {/* SERVICES */}
      <section
        id="services"
        className="py-20 px-6 md:px-16 bg-gray-50"
      >

        {/* Section Heading */}
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
          Our Services
        </h2>

        <p className="text-center text-gray-500 mb-12">
          Professional care for every type of vehicle
        </p>


        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Exterior Wash */}
          <div className="bg-white shadow-sm hover:shadow-xl rounded-lg p-8 text-center border border-gray-200 transition duration-300">

            <div className="flex justify-center mb-5">
              <CarFront className="w-10 h-10 text-blue-600" />
            </div>

            <h3 className="font-bold text-xl mb-3 text-gray-800">
              Exterior Wash
            </h3>

            <p className="text-gray-600">
              Thorough exterior cleaning for motorcycles, cars and trucks.
            </p>

          </div>


          {/* Interior Detailing */}
          <div className="bg-white shadow-sm hover:shadow-xl rounded-lg p-8 text-center border border-gray-200 transition duration-300">

            <div className="flex justify-center mb-5">
              <Sparkles className="w-10 h-10 text-blue-600" />
            </div>

            <h3 className="font-bold text-xl mb-3 text-gray-800">
              Interior Detailing
            </h3>

            <p className="text-gray-600">
              Deep interior cleaning to keep your vehicle fresh and comfortable.
            </p>

          </div>


          {/* Waxing */}
          <div className="bg-white shadow-sm hover:shadow-xl rounded-lg p-8 text-center border border-gray-200 transition duration-300">

            <div className="flex justify-center mb-5">
              <Droplets className="w-10 h-10 text-blue-600" />
            </div>

            <h3 className="font-bold text-xl mb-3 text-gray-800">
              Waxing
            </h3>

            <p className="text-gray-600">
              Give your vehicle a clean finish and a fresh, polished shine.
            </p>

          </div>

        </div>
      </section>


      {/* WHY CHOOSE EXPRESS */}
<section className="py-20 px-6 md:px-16 bg-white">

  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

    {/* Left Side */}
    <div>
      <p className="text-blue-600 uppercase tracking-widest text-sm font-semibold mb-3">
        Why Choose Us
      </p>

      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
        We Treat Your Vehicle Like Our Own
      </h2>

      <p className="text-gray-600 leading-relaxed mb-8">
        At Express Car Wash, we believe a great car wash is more than
        just making your vehicle look clean. We focus on quality,
        efficiency, and reliable service every time you visit.
      </p>

      {/* Benefits */}
      <div className="space-y-6">

        {/* Fast Service */}
        <div className="flex gap-4">
          <div className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
             <Check className="w-6 h-6 text-blue-600" />
          </div>

          <div>
            <h3 className="font-bold text-gray-800 text-lg">
              Fast Service
            </h3>

            <p className="text-gray-600 text-sm mt-1">
              Get your vehicle cleaned efficiently without unnecessary
              waiting.
            </p>
          </div>
        </div>


        {/* Quality Cleaning */}
        <div className="flex gap-4">
          <div className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
             <Check className="w-6 h-6 text-blue-600" />
          </div>

          <div>
            <h3 className="font-bold text-gray-800 text-lg">
              Quality Cleaning
            </h3>

            <p className="text-gray-600 text-sm mt-1">
              We pay attention to the details to give your vehicle
              the care it deserves.
            </p>
          </div>
        </div>


        {/* Affordable */}
        <div className="flex gap-4">
          <div className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
             <Check className="w-6 h-6 text-blue-600" />
          </div>

          <div>
            <h3 className="font-bold text-gray-800 text-lg">
              Affordable Prices
            </h3>

            <p className="text-gray-600 text-sm mt-1">
              Professional vehicle care at prices that make sense.
            </p>
          </div>
        </div>


        {/* Reliable */}
        <div className="flex gap-4">
          <div className="w-12 h-12 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
             <Check className="w-6 h-6 text-blue-600" />
          </div>

          <div>
            <h3 className="font-bold text-gray-800 text-lg">
              Reliable Service
            </h3>

            <p className="text-gray-600 text-sm mt-1">
              A dependable car wash experience whenever you need us.
            </p>
          </div>
        </div>

      </div>
    </div>


    {/* Right Side */}
    <div className="relative">
      <img
        src={carwashHero}
        alt="Express Car Wash"
        className="w-full h-[500px] object-cover rounded-lg shadow-lg"
      />

      
    </div>

  </div>

</section>

{/* HOW IT WORKS */}
<section className="py-20 px-6 md:px-16 bg-gray-50">

  <div className="max-w-6xl mx-auto">

    {/* Section Heading */}
    <div className="text-center mb-14">
      <p className="text-blue-600 uppercase tracking-widest text-sm font-semibold mb-3">
        Simple Process
      </p>

      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        How It Works
      </h2>

      <p className="text-gray-500 max-w-2xl mx-auto">
        Getting your vehicle clean and fresh is quick and easy.
      </p>
    </div>


    {/* Steps */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

      {/* Step 1 */}
      <div className="text-center">

        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
          01
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Choose a Service
        </h3>

        <p className="text-gray-600 leading-relaxed">
          Select the cleaning or detailing service that suits your vehicle.
        </p>

      </div>


      {/* Step 2 */}
      <div className="text-center">

        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
          02
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Drive In
        </h3>

        <p className="text-gray-600 leading-relaxed">
          Bring your vehicle to Express Car Wash at a convenient time.
        </p>

      </div>


      {/* Step 3 */}
      <div className="text-center">

        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
          03
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3">
          We Do the Rest
        </h3>

        <p className="text-gray-600 leading-relaxed">
          Sit back while our team takes care of your vehicle.
        </p>

      </div>

    </div>

  </div>

</section>

{/* FINAL CTA */}
<section className="py-14 px-6 bg-white text-center">

  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
    Ready when you are
  </h2>

  <button className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-md font-semibold transition duration-300">
    Book Now
  </button>

</section>


      {/* FOOTER */}
<footer className="bg-gray-900 text-gray-400 px-6 py-10">

  <div className="max-w-6xl mx-auto">

    <div className="flex flex-col md:flex-row justify-between items-center gap-6">

      {/* Logo / Brand */}
      <div className="text-center md:text-left">
        <h3 className="text-xl font-bold text-white">
          Express Car Wash
        </h3>

        <p className="text-sm mt-1">
          Fast. Clean. Reliable.
        </p>
      </div>


      {/* Location */}
      <div className="text-sm text-center">
        <p>
          Homabay, Kanyadhiang'
        </p>
      </div>


      {/* Navigation */}
      <div className="flex gap-6 text-sm">

        <Link
          to="/"
          className="hover:text-blue-400 transition"
        >
          Home
        </Link>

        <Link
          to="/services"
          className="hover:text-blue-400 transition"
        >
          Services
        </Link>

        <Link
          to="/about"
          className="hover:text-blue-400 transition"
        >
          About
        </Link>

        <Link
          to="/gallery"
          className="hover:text-blue-400 transition"
        >
          Gallery
        </Link>

      </div>

    </div>


    {/* Bottom */}
    <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
      <p>
        © 2026 Express Car Wash. All rights reserved.
      </p>
    </div>

  </div>

</footer>

    </div>
  )
}

export default Home