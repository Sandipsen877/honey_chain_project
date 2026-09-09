import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

import {
  registerKeeper,
  verifyRegistrationOtp,
} from '../services/authService';

import honeychainLogo from '../assets/logo_project.png';

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    keeperCode: `KPR-${Date.now()}`,
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleOtpChange = (e) => {
    const value = e.target.value
      .replace(/\D/g, '')
      .slice(0, 6);

    setOtp(value);

    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Please enter your name.';
    }

    if (!formData.phone.trim()) {
      return 'Please enter your phone number.';
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(formData.phone.trim())) {
      return 'Please enter a valid 10-digit phone number.';
    }

    if (
      formData.email.trim() &&
      !/\S+@\S+\.\S+/.test(formData.email.trim())
    ) {
      return 'Please enter a valid email address.';
    }

    return '';
  };

  // ============================================
  // STEP 1 — REGISTER KEEPER + SEND OTP
  // ============================================

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');

      await registerKeeper({
        keeperCode: formData.keeperCode,
        name: formData.name.trim(),
        phone: String(formData.phone).trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
      });

      // Move to OTP verification
      setStep(2);
    } catch (err) {
      setError(
        err.message ||
          'Unable to send OTP. Please check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // STEP 2 — VERIFY REGISTRATION OTP
  // ============================================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      setError('Please enter the OTP.');
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      /*
       * Backend expects:
       *
       * {
       *   phone: "9876543210",
       *   code: "123456"
       * }
       *
       * authService converts otp → code.
       */
      const result = await verifyRegistrationOtp({
        phone: String(formData.phone).trim(),
        otp: String(otp).trim(),
      });

      /*
       * If backend returns an authentication token,
       * save it so the newly registered user is
       * considered logged in.
       */
      if (result?.token) {
        localStorage.setItem('honeychain_token', result.token);
      }

      /*
       * Save keeper information if returned by backend.
       */
      if (result?.keeper) {
        localStorage.setItem(
          'honeychain_keeper',
          JSON.stringify(result.keeper)
        );
      }

      /*
       * NEW USER:
       *
       * Registration + OTP verification is successful,
       * so go directly to the Dashboard.
       */
      navigate('/dashboard');

    } catch (err) {
      setError(
        err.message ||
          'Invalid OTP. Please check the OTP and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // GO BACK TO STEP 1
  // ============================================

  const handleBack = () => {
    setStep(1);
    setOtp('');
    setError('');
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
            {step === 1
              ? 'Create account'
              : 'Verify phone'}
          </h1>

          <p className="mt-3 text-sm text-gray dark:text-muted">
            {step === 1
              ? 'Register as a HoneyChain keeper'
              : `Enter the OTP sent to ${formData.phone}`}
          </p>

        </div>

        {/* ================= CARD ================= */}

        <div className="bg-cream-card dark:bg-black-card border border-black/10 dark:border-white/10 p-7">

          {/* ================= ERROR ================= */}

          {error && (
            <div className="mb-5 px-4 py-3 border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* ================================================== */}
          {/* STEP 1 — REGISTRATION FORM */}
          {/* ================================================== */}

          {step === 1 && (
            <form
              onSubmit={handleSendOtp}
              className="space-y-4"
            >

              {/* Keeper Code */}

              <div>
                <label
                  htmlFor="keeperCode"
                  className="block text-sm font-medium text-black dark:text-cream mb-2"
                >
                  Keeper Code
                </label>

                <input
                  id="keeperCode"
                  name="keeperCode"
                  type="text"
                  value={formData.keeperCode}
                  readOnly
                  className="w-full h-12 px-4 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-black dark:text-cream outline-none cursor-not-allowed"
                />

                <p className="mt-2 text-xs text-gray dark:text-muted">
                  Your Keeper Code is generated automatically.
                </p>
              </div>

              {/* Name */}

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

              {/* Phone */}

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
                    maxLength={10}
                    inputMode="numeric"
                    className="w-full h-12 pl-11 pr-4 bg-transparent border border-black/15 dark:border-white/15 text-black dark:text-cream placeholder:text-gray/60 dark:placeholder:text-muted/60 outline-none focus:border-gold transition-colors"
                  />

                </div>
              </div>

              {/* Email */}

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

              {/* Address */}

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

              {/* Send OTP */}

              <button
                type="submit"
                disabled={loading}
                className="group w-full h-12 mt-2 flex items-center justify-center gap-3 bg-black dark:bg-cream text-cream dark:text-black font-semibold hover:bg-gold hover:text-black disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
              >

                {loading
                  ? 'Sending OTP...'
                  : 'Send OTP'}

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                )}

              </button>

            </form>
          )}

          {/* ================================================== */}
          {/* STEP 2 — OTP VERIFICATION */}
          {/* ================================================== */}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>

              {/* Shield Icon */}

              <div className="flex justify-center mb-6">

                <div className="w-14 h-14 flex items-center justify-center bg-gold/10 border border-gold/30">

                  <ShieldCheck
                    size={28}
                    strokeWidth={1.6}
                    className="text-gold"
                  />

                </div>

              </div>

              {/* Phone */}

              <div className="text-center mb-6">

                <p className="text-sm text-gray dark:text-muted">
                  We've sent a verification code to
                </p>

                <p className="mt-1 font-medium text-black dark:text-cream">
                  {formData.phone}
                </p>

              </div>

              {/* OTP Label */}

              <label
                htmlFor="otp"
                className="block text-sm font-medium text-black dark:text-cream mb-2"
              >
                Enter OTP
              </label>

              {/* OTP Input */}

              <input
                id="otp"
                name="otp"
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Enter 6-digit OTP"
                inputMode="numeric"
                maxLength={6}
                autoComplete="one-time-code"
                autoFocus
                className="w-full h-12 px-4 text-center tracking-[0.5em] text-lg bg-transparent border border-black/15 dark:border-white/15 text-black dark:text-cream placeholder:text-gray/60 dark:placeholder:text-muted/60 outline-none focus:border-gold transition-colors"
              />

              {/* Verify */}

              <button
                type="submit"
                disabled={loading}
                className="group w-full h-12 mt-5 flex items-center justify-center gap-3 bg-black dark:bg-cream text-cream dark:text-black font-semibold hover:bg-gold hover:text-black disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
              >

                {loading
                  ? 'Verifying...'
                  : 'Verify & Continue'}

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />
                )}

              </button>

              {/* Back */}

              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="w-full mt-4 h-11 flex items-center justify-center gap-2 text-sm text-gray dark:text-muted hover:text-gold transition-colors"
              >

                <ArrowLeft size={15} />

                Change phone or details

              </button>

            </form>
          )}

          {/* ================= SIGN IN ================= */}

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

        {/* ================= FOOTER TEXT ================= */}

        <p className="text-center text-xs text-gray dark:text-muted mt-8">
          Honey Chain · SIH26021
        </p>

      </div>
    </div>
  );
}