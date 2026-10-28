import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ScrollToTop from './ScrollToTop';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Booking from './pages/Booking';

import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminBookings from './admin/AdminBookings';
import AdminLayout from './admin/AdminLayout';
import AdminProtectedRoute from './admin/AdminProtectedRoute';

function App() {
return ( <BrowserRouter> <ScrollToTop />


  <Routes>
    {/* Public customer website */}
    <Route
      path="/"
      element={
        <>
          <Navbar />
          <Home />
          <Footer />
        </>
      }
    />

    <Route
      path="/services"
      element={
        <>
          <Navbar />
          <Services />
          <Footer />
        </>
      }
    />

    <Route
      path="/about"
      element={
        <>
          <Navbar />
          <About />
          <Footer />
        </>
      }
    />

    <Route
      path="/contact"
      element={
        <>
          <Navbar />
          <Contact />
          <Footer />
        </>
      }
    />

    <Route
      path="/booking"
      element={
        <>
          <Navbar />
          <Booking />
          <Footer />
        </>
      }
    />

    {/* Administrator login */}
    <Route path="/admin/login" element={<AdminLogin />} />

    {/* Protected administrator area */}
    <Route
      path="/admin"
      element={
        <AdminProtectedRoute>
          <AdminLayout />
        </AdminProtectedRoute>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="bookings" element={<AdminBookings />} />
    </Route>
  </Routes>
</BrowserRouter>


);
}

export default App;
