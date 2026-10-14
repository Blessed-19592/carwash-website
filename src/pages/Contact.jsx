import contactHero from '../assets/contact-hero.jpg';
import { MapPin, Phone, Mail } from 'lucide-react';

function Contact() {
return ( <div>

  {/* CONTACT HERO */}
  <section className="relative min-h-[420px] flex items-center justify-center px-6">

    {/* Background Image */}
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url(${contactHero})`,
      }}
    ></div>

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-gray-900/30"></div>

    {/* Hero Content */}
    <div className="relative z-10 text-center max-w-2xl mx-auto">

      <h1 className="text-4xl md:text-5xl font-bold text-blue-500 mb-5">
        CONTACT US
      </h1>

      <p className="text-white text-sm md:text-base leading-7 font-medium">
        Need assistance? You're always welcome to contact us.
        Get in touch with our team for information about our
        car wash services, packages, and bookings.
      </p>

    </div>
  </section>


  {/* CONTACT INFORMATION */}
  <section className="bg-gray-100 text-grey-980 py-20 px-6">

    <div className="max-w-6xl mx-auto">

      {/* Section Heading */}
      <div className="text-center mb-14">

        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Get In <span className="text-blue-500">Touch</span>
        </h2>

        <p className="text-gray-800 text-sm md:text-base">
          We're here to help. Reach out to us through any of the
          options below.
        </p>

      </div>


      {/* Three Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

        {/* VISIT US */}
        <div className="text-center md:border-r md:border-gray-800 md:pr-6">

          <div className="flex justify-center mb-6">
            <MapPin
              size={38}
              strokeWidth={1.5}
              className="text-blue-500"
            />
          </div>

          <h3 className="text-xl font-semibold mb-4">
            Visit Us
          </h3>

          <p className="text-gray-800 text-sm leading-7">
            Come visit our car wash and let us take care
            of your vehicle.
          </p>

          <p className="text-blue-500 text-sm mt-3">
            Homabay, Kanyadhiang' Daraja
          </p>

        </div>


        {/* CALL US */}
        <div className="text-center md:border-r md:border-gray-800 md:pr-6">

          <div className="flex justify-center mb-6">
            <Phone
              size={38}
              strokeWidth={1.5}
              className="text-blue-500"
            />
          </div>

          <h3 className="text-xl font-semibold mb-4">
            Call Us
          </h3>

          <p className="text-gray-800 text-sm leading-7">
            Have a question about our services or need
            help with a booking? Give us a call.
          </p>

          <p className="text-blue-500 text-sm mt-3">
            0713813068
          </p>

        </div>


        {/* CONTACT US */}
        <div className="text-center">

          <div className="flex justify-center mb-6">
            <Mail
              size={38}
              strokeWidth={1.5}
              className="text-blue-500"
            />
          </div>

          <h3 className="text-xl font-semibold mb-4">
            Contact Us
          </h3>

          <p className="text-gray-800 text-sm leading-7">
            Send us your questions or inquiries.
            Our team will be happy to assist you.
          </p>

          <p className="text-blue-500 text-sm mt-3">
            harrisonsteven93@gmail.com
          </p>

        </div>

      </div>

    </div>

  </section>

  
  {/* LOCATION MAP */}
  <section className="bg-gray-950 px-6 pb-20">

    <div className="max-w-7xl mx-auto">

      {/* Section Heading */}
      <div className="text-center mb-10">

        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Find <span className="text-blue-500">Us</span>
        </h2>

        <p className="text-gray-400 text-sm md:text-base">
          Visit Express Car Wash at Kanyadhiang' Daraja, Homa Bay.
        </p>

      </div>

      {/* Map */}
      <div className="w-full h-[350px] md:h-[450px] overflow-hidden rounded-xl border border-gray-800">

        <iframe
  title="Express Car Wash Location - Kanyadhiang' Daraja, Homa Bay"
  src="https://maps.google.com/maps?q=-0.380595,34.635161&z=17&output=embed"
  width="100%"
  height="100%"
  style={{ border: 0 }}
  loading="lazy"
  allowFullScreen
  referrerPolicy="no-referrer-when-downgrade"
></iframe>


      </div>

      
      {/* GET DIRECTIONS BUTTON */}
      <div className="flex justify-center mt-8">

        <a
          href="https://www.google.com/maps/dir/?api=1&destination=-0.380595,34.635161"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-7 py-3.5 rounded-lg transition duration-300"
        >
          <MapPin size={20} />
          Get Directions
        </a>

      </div>



    </div>

  </section>

  {/* CONTACT FORM */}
<section className="bg-white text-gray-900 px-6 py-20 md:py-24">
  <div className="max-w-4xl mx-auto">

    {/* Section Heading */}
    <div className="text-center mb-12">
      <p className="text-blue-600 font-semibold uppercase tracking-[0.2em] text-sm mb-3">
        Send an Inquiry
      </p>

      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Send Us a Message
      </h2>

      <p className="text-gray-500 max-w-xl mx-auto leading-7">
        Have a question about our car wash services or packages?
        Fill in the form below and let us know how we can help.
      </p>
    </div>

    {/* Contact Form */}
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("Your form is ready, but message delivery has not been connected yet.");
      }}
      className="space-y-6"
    >
      {/* Name and Email */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Full Name
          </label>

          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your full name"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>

          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Subject
        </label>

        <input
          type="text"
          id="subject"
          name="subject"
          placeholder="What is your message about?"
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Your Message
        </label>

        <textarea
          id="message"
          name="message"
          rows="6"
          placeholder="Write your message here..."
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none resize-y transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="text-center pt-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-3 rounded-lg transition duration-300"
        >
          Send Message
        </button>
      </div>
    </form>
  </div>
</section>



</div>

);
}

export default Contact;
