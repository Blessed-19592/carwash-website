import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 px-6 py-12 md:px-16">
      <div className="max-w-7xl mx-auto">

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 pb-10">

          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white tracking-wide">
              Express <span className="text-blue-500">Car Wash</span>
            </h3>

            <p className="text-sm mt-3 leading-6 max-w-xs">
              Fast. Clean. Reliable.
              <br />
              Professional vehicle cleaning to keep your ride looking its best.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h4>

            <div className="flex flex-col gap-3 text-sm">
              <Link to="/" className="w-fit hover:text-blue-400 transition duration-300">
                Home
              </Link>

              <Link to="/services" className="w-fit hover:text-blue-400 transition duration-300">
                Services
              </Link>

              <Link to="/about" className="w-fit hover:text-blue-400 transition duration-300">
                About Us
              </Link>

            

              <Link to="/contact" className="w-fit hover:text-blue-400 transition duration-300">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Location */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">
              Find Us
            </h4>

            <p className="text-sm leading-6">
              Homabay, Kanyadhiang'
            </p>

            <p className="text-sm mt-3 leading-6">
              Visit us for a clean, fresh ride.
            </p>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
          <p className="text-center sm:text-left">
            © 2026 Express Car Wash. All rights reserved.
          </p>

          <p className="text-gray-500">
            Fast. Clean. Reliable.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;