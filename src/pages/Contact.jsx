function Contact() {
  return (
    <div className="bg-white">

      {/* CONTACT HERO SECTION */}
      <section className="pt-32 pb-16 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">

          <div className="max-w-3xl mx-auto text-center">

            <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-4">
              Get in Touch
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              We're Here to Help
              <span className="block text-blue-600">
                Let's Talk About Your Vehicle
              </span>
            </h1>

            <p className="text-gray-600 text-lg leading-8">
              Have a question about our car wash services? Need help choosing
              a wash package? Get in touch with us, and we'll be happy to help.
            </p>

          </div>

        </div>
      </section>
      {/* CONTACT INFORMATION SECTION */}
<section className="bg-slate-50 py-16 px-6 md:px-16">
  <div className="max-w-6xl mx-auto">

    {/* Section Heading */}
    <div className="mb-12">
      <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-3">
        Contact Information
      </p>

      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        Let's Get You Connected
      </h2>

      <p className="text-gray-600 leading-7 max-w-2xl">
        Whether you need information about our services or want to plan
        a visit, here's how you can reach us.
      </p>
    </div>

    {/* Contact Details */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

      {/* Phone */}
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl">
          ☎
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Give Us a Call
          </h3>

          <p className="text-gray-600 text-sm leading-6 mb-2">
            Have a question about our services? We'd be happy to help.
          </p>

          <p className="text-blue-600 font-semibold">
            Your business phone number
          </p>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-start gap-4 md:border-l md:border-gray-300 md:pl-8">
        <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl">
          ⌖
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Find Our Location
          </h3>

          <p className="text-gray-600 text-sm leading-6 mb-2">
            Visit us for a professional clean and a fresh-looking vehicle.
          </p>

          <p className="text-blue-600 font-semibold">
            Kanyadhiang', Homabay
          </p>
        </div>
      </div>

      {/* Business Hours */}
      <div className="flex items-start gap-4 md:border-l md:border-gray-300 md:pl-8">
        <div className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-xl">
          ◷
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            When We're Open
          </h3>

          <p className="text-gray-600 text-sm leading-6 mb-2">
            Plan your visit around our opening hours.
          </p>

          <p className="text-blue-600 font-semibold">
            Business hours to be confirmed
          </p>
        </div>
      </div>

    </div>

  </div>
</section>

    </div>
  );
}

export default Contact;