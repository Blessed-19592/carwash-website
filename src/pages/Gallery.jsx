import { useState } from "react";

function Gallery() {

  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="bg-white">

      {/* GALLERY HERO SECTION */}
      <section className="pt-32 pb-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">

          <div className="max-w-3xl mx-auto text-center">

            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-4">
              Our Gallery
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              See the Difference
              <span className="block text-blue-600">
                Every Wash Makes
              </span>
            </h1>

            <p className="text-gray-600 text-lg leading-8">
              Take a look at our vehicle cleaning services, the vehicles
              we work on, and the care we put into every wash.
            </p>

          </div>

        </div>
      </section>

      {/* GALLERY FILTER SECTION */}
<section className="bg-slate-50 py-12 px-6 md:px-16">
  <div className="max-w-7xl mx-auto">

    {/* Section Heading */}
    <div className="text-center mb-8">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
        Explore Our Work
      </h2>

      <p className="text-gray-600">
        Browse our cleaning services by vehicle type.
      </p>
    </div>

    {/* Filter Buttons */}
<div className="flex flex-wrap justify-center gap-3">

  {["All", "Cars", "Motorcycles", "Trucks"].map((category) => (
    <button
      key={category}
      onClick={() => setActiveFilter(category)}
      className={`px-6 py-3 rounded-lg font-medium transition duration-300 ${
        activeFilter === category
          ? "bg-blue-600 text-white"
          : "bg-white text-gray-700 border border-gray-200 hover:border-blue-600 hover:text-blue-600"
      }`}
    >
      {category}
    </button>
  ))}

</div>

  </div>
</section>

    </div>
  );
}

export default Gallery;