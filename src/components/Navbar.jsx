import { Link, useLocation } from 'react-router-dom'

function Navbar() {

  const location = useLocation()

const isLightPage = ['/services', '/about'].includes(location.pathname)

const textColor = isLightPage ? 'text-gray-900' : 'text-white'

  return (

    
    <nav
  className={`absolute top-0 left-0 w-full z-50 flex items-center px-10 py-6 ${
    isLightPage ? 'border-b border-gray-300/40' : ''
  }`}
>
      {/* Logo */}
      <Link
        to="/"
        className={`text-2xl font-bold ${textColor} tracking-wide font-[times new roman]`}
      >
        Express Car Wash
      </Link>

      {/* Center Navigation */}
      <div  className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-10 text-lg font-medium ${textColor} font-[Montserrat]`}>

        <Link
          to="/"
          className="hover:text-blue-500 transition duration-500"
        >
          Home
        </Link>

        <Link
          to="/services"
          className="hover:text-blue-500 transition duration-300"
        >
          Services
        </Link>

        <Link
          to="/about"
          className="hover:text-blue-500 transition duration-300"
        >
          About
        </Link>

        <Link
          to="/gallery"
          className="hover:text-blue-500 transition duration-300"
        >
          Gallery
        </Link>

      </div>

      {/* Booking Button */}
      <Link
        to="/booking"
        className="ml-auto bg-blue-600 text-white px-6 py-3 rounded-md font-semibold font-[Montserrat] hover:bg-blue-800 transition duration-300"
      >
        Book Now
      </Link>

    </nav>
  )
}

export default Navbar