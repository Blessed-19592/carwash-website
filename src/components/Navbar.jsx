import { Link, useLocation, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
]

function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)

    // Check the initial scroll position
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Pages that get a white navbar: Services and About Us
  const isLightPage = ['/services', '/about'].includes(location.pathname)

  // When scrolled: light pages get white, all other pages (Home, Contact Us) get blue
  const whiteNav = scrolled && isLightPage
  const blueNav = scrolled && !isLightPage

  // Dark text on light pages (and on the white bar), white text everywhere else
  const textColor = isLightPage ? 'text-gray-900' : 'text-white'

  const navBg = !scrolled
    ? 'bg-transparent py-6'
    : isLightPage
      ? 'bg-white/130 backdrop-blur-md shadow-lg py-4'
      : 'bg-gray-950/95 backdrop-blur-md shadow-lg py-4'

  // Active link must stay visible on the blue bar
  const activeColor = blueNav
    ? 'text-white underline underline-offset-8'
    : 'text-blue-500'

  const hoverColor = blueNav ? 'hover:text-blue-200' : 'hover:text-blue-500'

  // Book Now button must not blend into the blue bar
  const buttonStyle = blueNav
    ? 'bg-white text-blue-600 hover:bg-blue-50'
    : 'bg-blue-600 text-white hover:bg-blue-800'

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 flex items-center px-10 transition-all duration-300 ${navBg} ${
        isLightPage && !scrolled ? 'border-b border-gray-300/40' : ''
      }`}
    >
      {/* Logo */}
      <Link
        to="/"
        className={`text-2xl font-bold ${textColor} tracking-wide font-[times_new_roman]`}
      >
        Express Car Wash
      </Link>

      {/* Center Navigation */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-10 text-lg font-medium font-[Montserrat]">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `transition duration-300 ${
                isActive ? activeColor : `${textColor} ${hoverColor}`
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Booking Button */}
      <Link
        to="/booking"
        className={`ml-auto px-6 py-3 rounded-md font-semibold font-[Montserrat] transition duration-300 ${buttonStyle}`}
      >
        Book Now
      </Link>
    </nav>
  )
}

export default Navbar