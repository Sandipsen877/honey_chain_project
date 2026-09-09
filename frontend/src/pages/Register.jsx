import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  KeyRound,
  ArrowRight,
} from 'lucide-react';

import { registerUser } from '../services/authService';
import honeychainLogo from '../assets/logo_project.png';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    keeperCode: '',
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError('');
    }
  };

  /* ================= VALIDATION ================= */

  const validateForm = () => {
    // Keeper Code
    if (!formData.keeperCode.trim()) {
      return 'Please enter your Keeper Code.';
    }

    // Name
    if (!formData.name.trim()) {
      return 'Please enter your name.';
    }

    // Phone
    if (!formData.phone.trim()) {
      return 'Please enter your phone number.';
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(formData.phone.trim())) {
      return 'Please enter a valid 10-digit phone number.';
    }

    // Email is optional
    if (
      formData.email.trim() &&
      !/\S+@\S+\.\S+/.test(formData.email.trim())
    ) {
      return 'Please enter a valid email address.';
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

      const response = await registerUser({
        keeperCode: formData.keeperCode.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
      });

      console.log('Registration successful:', response);

      navigate('/login');
    } catch (err) {
      setError(
        err.message ||
          'Unable to create your account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-cream dark:bg-black flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md">

        {/* ================= LOGO ================= */}

        <div className="flex justify-center mb-6">
          <div className="relative group">

            <div className="absolute inset-0 bg-gold/25 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <img
              src={honeychainLogo}
              alt="HoneyChain"
              className="relative w-20 h-20 object-contain"
            />

          </div>
        </div>

        {/* ================= HEADING ================= */}

        <div className="text-center mb-7">

          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">
            HoneyChain
          </p>

          <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-cream">
            Create account
          </h1>

          <p className="mt-3 text-sm text-gray dark:text-muted">
            Register as a HoneyChain keeper
          </p>

        </div>

        {/* ================= FORM CARD ================= */}

        <div className="bg-cream-card dark:bg-black-card border border-black/10 dark:border-white/10 p-7">

          {/* Error */}

          {error && (
            <div className="mb-5 px-4 py-3 border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* ================= KEEPER CODE ================= */}

            <div>

              <label
                htmlFor="keeperCode"
                className="block text-sm font-medium text-black dark:text-cream mb-2"
              >
                Keeper Code
                <span className="text-gold ml-1">*</span>
              </label>

              <div className="relative">

                <KeyRound
                  size={17}
                  strokeWidth={1.7}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray dark:text-muted"
                />

                <input
                  id="keeperCode"
                  name="keeperCode"
                  type="text"
                  value={formData.keeperCode}
                  onChange={handleChange}
                  placeholder="Enter your keeper code"
                  autoComplete="off"
                  className="w-full h-12 pl-11 pr-4 bg-transparent border border-black/15 dark:border-white/15 text-black dark:text-cream placeholder:text-gray/60 dark:placeholder:text-muted/60 outline-none focus:border-gold transition-colors"
                />

              </div>

            </div>

            {/* ================= NAME ================= */}

            <div>

              <label
                htmlFor="name"
                className="block text-sm font-medium text-black dark:text-cream mb-2"
              >
                Name
                <span className="text-gold ml-1">*</span>
              </label>

              <div className="relative">

                <User
                  size={17}
                  strokeWidth={1.7}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray dark:text-muted"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  autoComplete="name"
                  className="w-full h-12 pl-11 pr-4 bg-transparent border border-black/15 dark:border-white/15 text-black dark:text-cream placeholder:text-gray/60 dark:placeholder:text-muted/60 outline-none focus:border-gold transition-colors"
                />

              </div>

            </div>

            {/* ================= PHONE ================= */}

            <div>

              <label
                htmlFor="phone"
                className="block text-sm font-medium text-black dark:text-cream mb-2"
              >
                Phone
                <span className="text-gold ml-1">*</span>
              </label>

              <div className="relative">

                <Phone
                  size={17}
                  strokeWidth={1.7}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray dark:text-muted"
                />

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  autoComplete="tel"
                  maxLength="10"
                  inputMode="numeric"
                  className="w-full h-12 pl-11 pr-4 bg-transparent border border-black/15 dark:border-white/15 text-black dark:text-cream placeholder:text-gray/60 dark:placeholder:text-muted/60 outline-none focus:border-gold transition-colors"
                />

              </div>

            </div>

            {/* ================= EMAIL ================= */}

            <div>

              <label
                htmlFor="email"
                className="block text-sm font-medium text-black dark:text-cream mb-2"
              >
                Email

                <span className="text-xs text-gray dark:text-muted ml-2 font-normal">
                  Optional
                </span>
              </label>

              <div className="relative">

                <Mail
                  size={17}
                  strokeWidth={1.7}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray dark:text-muted"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full h-12 pl-11 pr-4 bg-transparent border border-black/15 dark:border-white/15 text-black dark:text-cream placeholder:text-gray/60 dark:placeholder:text-muted/60 outline-none focus:border-gold transition-colors"
                />

              </div>

            </div>

            {/* ================= ADDRESS ================= */}

            <div>

              <label
                htmlFor="address"
                className="block text-sm font-medium text-black dark:text-cream mb-2"
              >
                Address

                <span className="text-xs text-gray dark:text-muted ml-2 font-normal">
                  Optional
                </span>
              </label>

              <div className="relative">

                <MapPin
                  size={17}
                  strokeWidth={1.7}
                  className="absolute left-4 top-4 text-gray dark:text-muted"
                />

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your address"
                  rows="3"
                  className="w-full min-h-[84px] pl-11 pr-4 py-3 bg-transparent border border-black/15 dark:border-white/15 text-black dark:text-cream placeholder:text-gray/60 dark:placeholder:text-muted/60 outline-none resize-none focus:border-gold transition-colors"
                />

              </div>

            </div>

            {/* ================= SUBMIT ================= */}

            <button
              type="submit"
              disabled={loading}
              className="group w-full h-12 mt-2 flex items-center justify-center gap-3 bg-black dark:bg-cream text-cream dark:text-black font-semibold hover:bg-gold hover:text-black disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
            >

              {loading
                ? 'Creating account...'
                : 'Create Account'}

              {!loading && (
                <ArrowRight
                  size={17}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              )}

            </button>

          </form>

          {/* ================= LOGIN ================= */}

          <div className="mt-7 pt-6 border-t border-black/10 dark:border-white/10 text-center">

            <p className="text-sm text-gray dark:text-muted">

              Already have an account?{' '}

              <Link
                to="/login"
                className="text-gold font-medium hover:underline"
              >
                Sign In
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