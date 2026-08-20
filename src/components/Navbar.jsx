import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6 bg-gray-900">
      <span className="text-2xl font-bold text-gray-100 tracking-wide">
        Express Car Wash
      </span>
      <div className="flex gap-8 text-sm text-gray-300">
        <Link to="/" className="hover:text-white">Home</Link>
        <Link to="/services" className="hover:text-white">Services</Link>
        <Link to="/about" className="hover:text-white">About</Link>
        <Link to="/gallery" className="hover:text-white">Gallery</Link>
        <Link to="/contact" className="hover:text-white">Contact</Link>
      </div>
    </nav>
  )
}

export default Navbar