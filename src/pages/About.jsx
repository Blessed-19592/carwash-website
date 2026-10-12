import aboutHero from "../assets/about-hero.jpg";
import { Check, Star } from "lucide-react";


function About() {
  return (
    <div className="bg-white">

      {/* HERO SECTION */}
      <section className="pt-32 pb-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div>
            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-4">
              About Express Car Wash
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              More Than a Wash.
              <span className="block text-blue-600">
                It's Care for Your Ride.
              </span>
            </h1>

            <p className="text-gray-600 text-lg leading-8 mb-6">
              At Express Car Wash, we believe every vehicle deserves
              professional care. We are committed to delivering reliable,
              quality cleaning services that leave your vehicle looking
              clean, fresh, and ready for the road.
            </p>

            <p className="text-gray-600 leading-7">
              From motorcycles to cars and trucks, our goal is to make
              every wash a convenient and satisfying experience.
            </p>
          </div>

          {/* Hero Image */}
          <div>
            <img
              src={aboutHero}
              alt="Vehicle receiving a professional car wash"
              className="w-full h-80 md:h-[460px] object-cover rounded-2xl shadow-lg"
            />
          </div>

        </div>
      </section>

            {/* WHO WE ARE SECTION */}
      <section className="bg-slate-50 py-20 px-6 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Section Heading */}
          <div>
            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-3">
              Who We Are
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Taking Pride in Every Clean
            </h2>

            <p className="text-gray-600 leading-8 mb-4">
              Express Car Wash is dedicated to providing reliable vehicle
              cleaning services for motorcycles, cars, and trucks. We
              understand that keeping a vehicle clean is about more than
              appearance. It is also about care and maintenance.
            </p>

            <p className="text-gray-600 leading-8">
              Our focus is on quality service, attention to detail, and
              making every customer's experience convenient and satisfying.
            </p>
          </div>

          {/* Our Approach */}
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">

            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              What We Stand For
            </h3>

            <div className="space-y-6">

              <div className="flex gap-4 items-start">
                <span className="text-blue-600 text-xl font-bold">01</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Quality Service
                  </h4>
                  <p className="text-gray-600 text-sm leading-6">
                    We aim to give every vehicle the attention and care it deserves.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="text-blue-600 text-xl font-bold">02</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Customer Satisfaction
                  </h4>
                  <p className="text-gray-600 text-sm leading-6">
                    We want every customer to enjoy a smooth and satisfying experience.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <span className="text-blue-600 text-xl font-bold">03</span>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">
                    Reliability
                  </h4>
                  <p className="text-gray-600 text-sm leading-6">
                    We strive to provide dependable service customers can trust.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

       
{/* WHY CHOOSE US SECTION */}
<section className="bg-white py-20 px-6 md:px-16">
  <div className="max-w-7xl mx-auto">

    {/* Heading */}
    <div className="max-w-2xl mb-12">
      <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-3">
        Why Choose Us?
      </p>

      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
        The Right Care for Your Vehicle
      </h2>

      <p className="text-gray-600 leading-7">
        We aim to make vehicle cleaning simple, convenient, and worthwhile,
        with services designed around your vehicle's needs.
      </p>
    </div>

    {/* Benefits List */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">

      {/* Benefit 1 */}
      <div className="flex items-start gap-3">
        <span className="text-blue-600 font-bold text-xl mt-0.5">✓</span>

        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            Multiple Vehicle Types
          </h3>

          <p className="text-gray-600 leading-7">
            Cleaning options for motorcycles, cars, and trucks.
          </p>
        </div>
      </div>

      {/* Benefit 2 */}
      <div className="flex items-start gap-3">
        <span className="text-blue-600 font-bold text-xl mt-0.5">✓</span>

        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            Flexible Wash Packages
          </h3>

          <p className="text-gray-600 leading-7">
            Different service options to suit your vehicle's cleaning needs.
          </p>
        </div>
      </div>

      {/* Benefit 3 */}
      <div className="flex items-start gap-3">
        <span className="text-blue-600 font-bold text-xl mt-0.5">✓</span>

        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            Attention to Detail
          </h3>

          <p className="text-gray-600 leading-7">
            We focus on careful cleaning and the details that matter.
          </p>
        </div>
      </div>

      {/* Benefit 4 */}
      <div className="flex items-start gap-3">
        <span className="text-blue-600 font-bold text-xl mt-0.5">✓</span>

        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            Customer Satisfaction
          </h3>

          <p className="text-gray-600 leading-7">
            We value customer feedback and strive to provide a positive experience.
          </p>
        </div>
      </div>

    </div>

  </div>
</section>

{/* CUSTOMER TESTIMONIALS */}
<section className="bg-slate-50 py-20 px-6 md:px-16">
  <div className="max-w-7xl mx-auto">

    {/* Heading */}
    <div className="text-center max-w-2xl mx-auto mb-12">
      <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-3">
        Customer Testimonials
      </p>

      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        What Our Customers Say
      </h2>

      <p className="text-gray-600 leading-7">
        Every customer's experience matters to us. Here's where
        we'll showcase feedback from people who have used our services.
      </p>
    </div>

    {/* Testimonial Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

      {/* Review 1 */}
      <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm hover:shadow-lg transition duration-300">

        <div className="flex items-center gap-4 mb-5">
          <img
            src="/images/customer-1.jpg"
            alt="Customer portrait"
            className="w-14 h-14 rounded-full object-cover"
          />

          <div>
            <h3 className="font-semibold text-gray-900">
              Laura Blessed
            </h3>
            <p className="text-sm text-gray-500">
              Verified Customer
            </p>
          </div>
        </div>

        <div className="flex gap-1 mb-4" aria-label="5 out of 5 stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-amber-500 text-lg">★</span>
          ))}
        </div>

        <p className="text-gray-600 leading-7 text-sm">
          Very fast services. My car was clean before I knew it.
        </p>
      </div>

      {/* Review 2 */}
      <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm hover:shadow-lg transition duration-300">

        <div className="flex items-center gap-4 mb-5">
          <img
            src="/images/customer-2.jpg"
            alt="Customer portrait"
            className="w-14 h-14 rounded-full object-cover"
          />

          <div>
            <h3 className="font-semibold text-gray-900">
              Harisson Steven
            </h3>
            <p className="text-sm text-gray-500">
              Verified Customer
            </p>
          </div>
        </div>

        <div className="flex gap-1 mb-4" aria-label="5 out of 5 stars">
          {[1, 2, 3, 4].map((star) => (
            <span key={star} className="text-amber-500 text-lg">★</span>
          ))}
        </div>

        <p className="text-gray-600 leading-7 text-sm">
          Add a genuine review highlighting something the customer
          appreciated about the service.
        </p>
      </div>

      {/* Review 3 */}
      <div className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm hover:shadow-lg transition duration-300">

        <div className="flex items-center gap-4 mb-5">
          <img
            src="/images/customer-3.jpg"
            alt="Customer portrait"
            className="w-14 h-14 rounded-full object-cover"
          />

          <div>
            <h3 className="font-semibold text-gray-900">
              Customer Name
            </h3>
            <p className="text-sm text-gray-500">
              Verified Customer
            </p>
          </div>
        </div>

        <div className="flex gap-1 mb-4" aria-label="5 out of 5 stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className="text-amber-500 text-lg">★</span>
          ))}
        </div>

        <p className="text-gray-600 leading-7 text-sm">
          Add a genuine review about the customer's overall experience
          and what they liked about the service.
        </p>
      </div>

    </div>
  </div>
</section>

{/* FINAL CTA SECTION */}
<section className="bg-white py-16 px-6">
  <div className="max-w-4xl mx-auto text-center">

    <h2 className="text-3xl md:text-4xl font-bold text-grey-800 mb-5">
      Your Vehicle Deserves the Best Care
    </h2>

    <p className="text-gray-900 leading-7 mb-8 max-w-2xl mx-auto">
      Whether you ride a motorcycle, drive a car, or manage a truck,
      we're ready to help you keep your vehicle clean.
    </p>

    <a
      href="/contact"
      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-300"
    >
      Get in Touch
    </a>

  </div>
</section>



    </div>
  );
}

export default About;

