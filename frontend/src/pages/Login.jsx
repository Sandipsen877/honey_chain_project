import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Phone,
  ArrowRight,
} from 'lucide-react';

import { loginUser } from '../services/authService';
import honeychainLogo from '../assets/logo_project.png';

export default function Login() {
  const navigate = useNavigate();

  // Phone is intentionally stored as a STRING
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* ================= HANDLE PHONE INPUT ================= */

  const handlePhoneChange = (e) => {
    // Keep phone as a string
    // Remove anything that isn't a number
    const value = e.target.value.replace(/\D/g, '');

    // Keep maximum 10 digits
    setPhone(value.slice(0, 10));

    // Clear previous error
    if (error) {
      setError('');
    }
  };

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    // Required field
    if (!phone.trim()) {
      return 'Please enter your mobile number.';
    }

    // Must contain exactly 10 digits
    if (!/^[0-9]{10}$/.test(phone)) {
      return 'Please enter a valid 10-digit mobile number.';
    }

    return '';
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Phone is sent as a STRING
      const response = await loginUser({
        phone: phone.trim(),
      });

      console.log('Login successful:', response);

      /*
       * Temporary navigation.
       * Change this when the actual dashboard route
       * is provided by your team.
       */
      navigate('/dashboard');

    } catch (err) {
      setError(
        err.message ||
        'Unable to sign in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-cream dark:bg-black flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md">

        {/* ================= LOGO ================= */}

        <div className="flex justify-center mb-8">

          <div className="relative group">

            {/* Logo Glow */}
            <div className="absolute inset-0 bg-gold/25 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Logo */}
            <img
              src={honeychainLogo}
              alt="HoneyChain"
              className="relative w-20 h-20 object-contain"
            />

          </div>

        </div>


        {/* ================= HEADING ================= */}

        <div className="text-center mb-8">

          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">
            HoneyChain
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-cream">
            Welcome back
          </h1>

          <p className="mt-3 text-sm text-gray dark:text-muted">
            Sign in using your mobile number
          </p>

        </div>


        {/* ================= FORM CARD ================= */}

        <div className="bg-cream-card dark:bg-black-card border border-black/10 dark:border-white/10 p-7">

          {/* ================= ERROR ================= */}

          {error && (
            <div className="mb-5 px-4 py-3 border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}


          {/* ================= FORM ================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* ================= PHONE ================= */}

            <div>

              <label
                htmlFor="phone"
                className="block text-sm font-medium text-black dark:text-cream mb-2"
              >
                Mobile Number
                <span className="text-gold ml-1">*</span>
              </label>

              <div className="relative">

                {/* Phone Icon */}
                <Phone
                  size={17}
                  strokeWidth={1.7}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray dark:text-muted"
                />

                {/* Phone Input */}
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit mobile number"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={10}
                  required
                  className="w-full h-12 pl-11 pr-4 bg-transparent border border-black/15 dark:border-white/15 text-black dark:text-cream placeholder:text-gray/60 dark:placeholder:text-muted/60 outline-none focus:border-gold transition-colors"
                />

              </div>

            </div>


            {/* ================= SUBMIT ================= */}

            <button
              type="submit"
              disabled={loading}
              className="group w-full h-12 flex items-center justify-center gap-3 bg-black dark:bg-cream text-cream dark:text-black font-semibold hover:bg-gold hover:text-black disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
            >

              {loading
                ? 'Signing in...'
                : 'Continue'
              }

              {!loading && (
                <ArrowRight
                  size={17}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              )}

            </button>

          </form>


          {/* ================= REGISTER ================= */}

          <div className="mt-7 pt-6 border-t border-black/10 dark:border-white/10 text-center">

            <p className="text-sm text-gray dark:text-muted">

              Don't have an account?{' '}

              <Link
                to="/register"
                className="text-gold font-medium hover:underline"
              >
                Register
              </Link>

            </p>

          </div>

        </div>


        {/* ================= FOOTER ================= */}

        <p className="text-center text-xs text-gray dark:text-muted mt-8">
          Honey Chain · SIH26021
        </p>

      </div>

    </div>
  );
}