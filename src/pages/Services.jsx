import { useEffect, useState } from "react";
import { CarFront, Sparkles, Gem } from "lucide-react";
import servicesHero from "../assets/services-hero.jpg";
import apiko2 from "../assets/apiko2.jpg";
import truck2 from "../assets/truck2.jpg";
import hero2 from "../assets/hero2.jpg";
import { Link } from "react-router-dom";

function Services() {

  
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchServices() {
      try {
        const response = await fetch("http://localhost:5000/api/services");

        if (!response.ok) {
          throw new Error("Failed to fetch services.");
        }

        const data = await response.json();
        setServices(data.services);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Unable to load service prices. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  
  return (
    <div>

      {/* SERVICES HERO */}
<section className="bg-gray-200 pt-36 pb-20 px-6 md:px-16">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

    {/* LEFT: TEXT */}
    <div>
      <p className="text-blue-600 uppercase tracking-widest text-sm font-semibold mb-4">
        What We Offer
      </p>

      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
        Professional Care for Every Vehicle
      </h1>

      <p className="text-gray-600 text-lg leading-relaxed">
        From motorcycles to cars and trucks, we provide reliable
        cleaning and detailing services to keep your vehicle
        clean and looking its best.
      </p>
    </div>

    {/* RIGHT: IMAGE */}
    <div>
          <img
  src={servicesHero}
  alt="Professional vehicle washing"
  className="w-full h-80 md:h-[450px] object-cover object-center rounded-2xl"
/>
    </div>

  </div>
</section>

{/* WHAT WE WASH */}

<section className="bg-white py-20 px-6 md:px-16">
  <div className="max-w-6xl mx-auto">


{/* Section Heading */}
<div className="text-center mb-12">
  <p className="text-blue-600 uppercase tracking-widest text-sm font-semibold mb-3">
    Vehicles We Handle
  </p>

  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
    What We Wash
  </h2>

  <p className="text-gray-600 max-w-2xl mx-auto">
    From everyday rides to heavy-duty vehicles, we have the right
    cleaning service for your needs.
  </p>
</div>

{/* Vehicle Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">

  {/* Motorcycle */}
  <div className="group overflow-hidden rounded-2xl border border-gray-200 hover:border-blue-600 transition duration-300">
    <div className="h-56 overflow-hidden">
      <img
        src={apiko2}
        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
      />
    </div>

    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Motorcycles
      </h3>

      <p className="text-gray-600 leading-relaxed">
        Careful cleaning to remove road grime and keep your motorcycle looking its best.
      </p>
    </div>
  </div>

  {/* Car */}
  <div className="group overflow-hidden rounded-2xl border border-gray-200 hover:border-blue-600 transition duration-300">
    <div className="h-56 overflow-hidden">
      <img
        src={hero2}
        alt="Car"
        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
      />
    </div>

    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Cars
      </h3>

      <p className="text-gray-600 leading-relaxed">
        Professional washing to keep your car clean, fresh, and ready for the road.
      </p>
    </div>
  </div>

  {/* Truck */}
  <div className="group overflow-hidden rounded-2xl border border-gray-200 hover:border-blue-600 transition duration-300">
    <div className="h-56 overflow-hidden">
      <img
        src={truck2}
        alt="Truck"
        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
      />
    </div>

    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        Trucks
      </h3>

      <p className="text-gray-600 leading-relaxed">
        Thorough cleaning solutions for trucks and other large vehicles.
      </p>
    </div>
  </div>

</div>


  </div>
</section>


     {/* MAIN SERVICES */}

<section className="bg-gray-200 py-24 px-6 md:px-16">
  <div className="max-w-6xl mx-auto">


{/* SECTION HEADER */}
<div className="text-center mb-16">
  <p className="text-blue-600 uppercase tracking-widest text-sm font-semibold mb-3">
    Our Services
  </p>

  <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-5">
    Choose the Right Wash for Your Vehicle
  </h2>

  <p className="text-gray-600 max-w-2xl mx-auto text-lg">
    From a quick exterior wash to a complete interior and
    exterior detail, we've got your vehicle covered.
  </p>
</div>

{/* SERVICE CARDS */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">

  {/* BASIC WASH */}
  <div className="group flex flex-col border border-gray-300 hover:border-blue-600 shadow-md hover:shadow-xl rounded-2xl p-8 transition-all duration-300">

    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
      <CarFront size={28} />
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-3">
      Basic Wash
    </h3>

    {/* PRICES FROM DATABASE */}
<div className="mb-5 rounded-lg bg-blue-50 p-4">
  <h4 className="mb-3 font-semibold text-gray-900">
    Prices by Vehicle
  </h4>

  {loading ? (
    <p className="text-sm text-gray-500">Loading prices...</p>
  ) : error ? (
    <p className="text-sm text-red-600">{error}</p>
  ) : (
    <ul className="space-y-2 text-sm text-gray-700">
      {services
        .filter((service) => service.service_name === "Basic Wash")
        .map((service) => (
          <li
            key={service.service_id}
            className="flex justify-between gap-4"
          >
            <span>{service.vehicle_type}</span>
            <span className="font-semibold">
              KSh {Number(service.price).toLocaleString("en-KE")}
            </span>
          </li>
        ))}
    </ul>
  )}
</div>

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

    <Link
  to="/booking?service=Basic%20Wash"
  className="mt-auto self-start text-blue-600 font-semibold transition hover:text-blue-800"
>
  Book this service →
</Link>
  </div>

  {/* FULL WASH */}
  <div className="group flex flex-col border border-gray-300 hover:border-blue-600 shadow-md hover:shadow-xl rounded-2xl p-8 transition-all duration-300">

    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
      <Sparkles size={28} />
    </div>

    <h3 className="text-2xl font-bold text-gray-900 mb-3">
  Full Wash
</h3>

{/* PRICES FROM DATABASE */}
<div className="mb-5 rounded-lg bg-blue-50 p-4">
  <h4 className="mb-3 font-semibold text-gray-900">
    Prices by Vehicle
  </h4>

  {loading ? (
    <p className="text-sm text-gray-500">Loading prices...</p>
  ) : error ? (
    <p className="text-sm text-red-600">{error}</p>
  ) : (
    <ul className="space-y-2 text-sm text-gray-700">
      {services
        .filter((service) => service.service_name === "Full Wash")
        .map((service) => (
          <li
            key={service.service_id}
            className="flex justify-between gap-4"
          >
            <span>{service.vehicle_type}</span>
            <span className="font-semibold">
              KSh {Number(service.price).toLocaleString("en-KE")}
            </span>
          </li>
        ))}
    </ul>
  )}
</div>

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

       <Link
  to="/booking?service=Full%20Wash"
  className="mt-auto self-start text-blue-600 font-semibold transition hover:text-blue-800"
>
  Book this service →
</Link>
  </div>

  {/* PREMIUM DETAIL */}
  <div className="group flex flex-col border border-gray-300 hover:border-blue-600 shadow-md hover:shadow-xl rounded-2xl p-8 transition-all duration-300">

    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition duration-300">
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

    <Link
  to="/booking?service=Premium%20Detail"
  className="mt-auto self-start text-blue-600 font-semibold transition hover:text-blue-800"
>
  Book this service →
</Link>
  </div>

</div>


  </div>
</section>

  {/* CTA SECTION */}

<section className="bg-white py-16 px-6 md:px-16">
  <div className="max-w-4xl mx-auto flex flex-col items-center text-center">

<h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
  Ready when you are
</h2>

<p className="text-gray-600 text-lg mb-6">
  Give your vehicle the care it deserves.
</p>

<Link
  to="/booking"
  className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
>
  Book Now
</Link>


  </div>
</section>

      


    </div>
  );
}

export default Services;