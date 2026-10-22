import { Link, useLocation, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Us' },
]

function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Close the mobile menu when navigating to another page
  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Pages that get a white navbar
  const isLightPage = ['/services', '/about'].includes(location.pathname)

  const whiteNav = scrolled && isLightPage
  const blueNav = scrolled && !isLightPage

  const textColor = isLightPage ? 'text-gray-900' : 'text-white'

  const navBg = !scrolled
    ? 'bg-transparent py-4 md:py-6'
    : isLightPage
      ? 'bg-white backdrop-blur-md shadow-lg py-3 md:py-4'
      : 'bg-gray-950/95 backdrop-blur-md shadow-lg py-3 md:py-4'

  const activeColor = blueNav
    ? 'text-white underline underline-offset-8'
    : 'text-blue-500'

  const hoverColor = blueNav ? 'hover:text-blue-200' : 'hover:text-blue-500'

  const buttonStyle = blueNav
    ? 'bg-white text-blue-600 hover:bg-blue-50'
    : 'bg-blue-600 text-white hover:bg-blue-800'

  // Colors for the mobile menu button
  const menuIconColor = whiteNav
    ? 'text-gray-900'
    : textColor

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navBg} ${
        isLightPage && !scrolled ? 'border-b border-gray-300/40' : ''
      }`}
    >
      <div className="flex items-center justify-between px-5 sm:px-8 lg:px-10">

        {/* Logo */}
        <Link
          to="/"
          className={`text-xl sm:text-2xl font-bold ${textColor} tracking-wide font-[times_new_roman]`}
        >
          Express Car Wash
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-7 xl:gap-10 text-lg font-medium font-[Montserrat]">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `transition duration-300 ${
                  isActive
                    ? activeColor
                    : `${textColor} ${hoverColor}`
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop Booking Button */}
        <Link
          to="/booking"
          className={`hidden lg:inline-flex px-6 py-3 rounded-md font-semibold font-[Montserrat] transition duration-300 ${buttonStyle}`}
        >
          Book Now
        </Link>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className={`lg:hidden p-2 rounded-md transition ${menuIconColor} hover:bg-black/10`}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        id="mobile-navigation"
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-[420px] opacity-100' : 'max-h-0 opacity-0'
        } ${
          whiteNav
            ? 'bg-white'
            : blueNav
              ? 'bg-blue-700'
              : isLightPage
                ? 'bg-white'
                : 'bg-gray-950'
        }`}
      >
        <div className="flex flex-col px-6 pt-3 pb-6 space-y-1 font-[Montserrat]">

          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => {
                const mobileTextColor =
                  whiteNav || (!scrolled && isLightPage)
                    ? 'text-gray-900'
                    : 'text-white'

                const mobileActiveColor = blueNav
                  ? 'text-white font-bold underline underline-offset-4'
                  : 'text-blue-500 font-bold'

                return `block py-3 px-3 rounded-md transition duration-200 ${
                  isActive
                    ? mobileActiveColor
                    : `${mobileTextColor} hover:text-blue-500 hover:bg-gray-500/10`
                }`
              }}
            >
              {link.label}
            </NavLink>
          ))}

          {/* Mobile Booking Button */}
          <Link
            to="/booking"
            onClick={() => setMenuOpen(false)}
            className={`mt-3 text-center px-5 py-3 rounded-md font-semibold transition duration-300 ${buttonStyle}`}
          >
            Book Now
          </Link>

        </div>
      </div>
    </nav>
  )
}

export default Navbar