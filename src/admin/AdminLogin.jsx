import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import './admin.css';

export default function AdminLogin() {
const navigate = useNavigate();

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [authenticated, setAuthenticated] = useState(false);

if (authenticated) {
return <Navigate to="/admin" replace />;
}

async function handleSubmit(event) {
event.preventDefault();
setError('');


if (!email.trim() || !password) {
  setError('Please enter your email and password.');
  return;
}

setLoading(true);

try {
  await adminApi.login(email.trim(), password);
  setPassword('');
  setAuthenticated(true);
  navigate('/admin', { replace: true });
} catch (err) {
  setError(
    err.status === 429
      ? 'Too many login attempts. Please try again later.'
      : err.status === 401
        ? 'Invalid email or password.'
        : err.message || 'Unable to log in. Please try again.'
  );
} finally {
  setLoading(false);
}


}

return ( <main className="admin-login-page"> <section className="admin-login-card"> <Link to="/" className="admin-brand">
Express <span>Car Wash</span> </Link>


    <div className="admin-login-icon">
      <ShieldCheck size={30} />
    </div>

    <h1>Administrator Login</h1>
    <p className="admin-login-description">
      Sign in to manage bookings and monitor your business.
    </p>

    {error && (
      <div className="admin-alert admin-alert-error" role="alert">
        {error}
      </div>
    )}

    <form onSubmit={handleSubmit} className="admin-login-form">
      <div className="admin-form-group">
        <label htmlFor="admin-email">Email address</label>
        <input
          id="admin-email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter administrator email"
          required
          disabled={loading}
        />
      </div>

      <div className="admin-form-group">
        <label htmlFor="admin-password">Password</label>

        <div className="admin-password-wrapper">
          <input
            id="admin-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
          />

          <button
            type="button"
            className="admin-password-toggle"
            onClick={() => setShowPassword((previous) => !previous)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            disabled={loading}
          >
            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="admin-primary-button admin-login-button"
        disabled={loading}
      >
        {loading ? (
          <>
            <LoaderCircle size={18} className="admin-spinner" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>

    <Link to="/" className="admin-back-link">
      ← Back to customer website
    </Link>

    <p className="admin-login-footer">
      Authorized administrators only.
    </p>
  </section>
</main>


);
}
