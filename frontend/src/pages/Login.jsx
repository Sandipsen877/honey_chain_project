
import { useState } from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import {
  Phone,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

import {
  requestLoginOtp,
  verifyLoginOtp,
} from '../services/authService';

import honeychainLogo from '../assets/logo_project.png';


export default function Login() {

  const navigate = useNavigate();


  /*
   * Login has two steps:
   *
   * Step 1 → Enter phone number
   * Step 2 → Enter OTP
   */
  const [step, setStep] = useState(1);


  /*
   * Form values
   */
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');


  /*
   * UI states
   */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  /*
   * ============================================================
   * Phone Input
   * ============================================================
   */
  const handlePhoneChange = (event) => {

    const value = event.target.value
      .replace(/\D/g, '')
      .slice(0, 10);


    setPhone(value);


    if (error) {
      setError('');
    }
  };


  /*
   * ============================================================
   * OTP Input
   * ============================================================
   */
  const handleOtpChange = (event) => {

    const value = event.target.value
      .replace(/\D/g, '')
      .slice(0, 6);


    setOtp(value);


    if (error) {
      setError('');
    }
  };


  /*
   * ============================================================
   * STEP 1
   *
   * Request OTP
   * ============================================================
   */
  const handleSendOtp = async (event) => {

    event.preventDefault();


    /*
     * Validate phone
     */
    if (!phone.trim()) {

      setError(
        'Please enter your mobile number.'
      );

      return;
    }


    if (!/^[0-9]{10}$/.test(phone.trim())) {

      setError(
        'Please enter a valid 10-digit mobile number.'
      );

      return;
    }


    try {

      setLoading(true);
      setError('');


      /*
       * Request OTP from backend.
       */
      await requestLoginOtp({
        phone: phone.trim(),
      });


      /*
       * Move to OTP step.
       */
      setStep(2);

    } catch (err) {

      setError(
        err.message ||
        'Unable to send OTP. Please try again.'
      );

    } finally {

      setLoading(false);

    }
  };


  /*
   * ============================================================
   * STEP 2
   *
   * Verify OTP
   * ============================================================
   */
  const handleVerifyOtp = async (event) => {

    event.preventDefault();


    /*
     * Validate OTP
     */
    if (!otp.trim()) {

      setError(
        'Please enter the OTP.'
      );

      return;
    }


    if (otp.length !== 6) {

      setError(
        'Please enter the 6-digit OTP.'
      );

      return;
    }


    try {

      setLoading(true);
      setError('');


      /*
       * Verify OTP with backend.
       */
      const response =
        await verifyLoginOtp({
          phone: phone.trim(),
          otp: otp.trim(),
        });


      /*
       * Backend must return a JWT token.
       */
      if (!response?.token) {

        throw new Error(
          'Login succeeded, but no authentication token was received.'
        );
      }


      /*
       * ========================================================
       * SAVE AUTHENTICATION TOKEN
       * ========================================================
       *
       * This token will be used by the dashboard
       * to identify the logged-in keeper.
       */
      localStorage.setItem(
        'honeychain_token',
        response.token
      );


      /*
       * ========================================================
       * SAVE KEEPER DATA
       * ========================================================
       *
       * This is actual backend data.
       *
       * No dummy user is created here.
       */
      if (response.keeper) {

        localStorage.setItem(
          'honeychain_keeper',
          JSON.stringify(response.keeper)
        );
      }


      /*
       * Go to dashboard.
       */
      navigate('/dashboard');

    } catch (err) {

      setError(
        err.message ||
        'Invalid OTP. Please try again.'
      );

    } finally {

      setLoading(false);

    }
  };


  /*
   * ============================================================
   * Go Back To Phone Step
   * ============================================================
   */
  const handleBack = () => {

    setStep(1);
    setOtp('');
    setError('');
  };


  return (

    <div className="min-h-[calc(100vh-72px)] bg-cream dark:bg-black flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md">


        {/* ======================================================
            LOGO
        ======================================================= */}

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


        {/* ======================================================
            HEADING
        ======================================================= */}

        <div className="text-center mb-7">

          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">
            HoneyChain
          </p>


          <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-cream">

            {step === 1
              ? 'Welcome back'
              : 'Verify phone'}

          </h1>


          <p className="mt-3 text-sm text-gray dark:text-muted">

            {step === 1
              ? 'Sign in to your HoneyChain account'
              : `Enter the OTP sent to ${phone}`}

          </p>

        </div>


        {/* ======================================================
            LOGIN CARD
        ======================================================= */}

        <div className="bg-cream-card dark:bg-black-card border border-black/10 dark:border-white/10 p-7">


          {/* ====================================================
              ERROR
          ===================================================== */}

          {error && (

            <div className="mb-5 px-4 py-3 border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 text-sm">

              {error}

            </div>

          )}


          {/* ====================================================
              STEP 1
          ===================================================== */}

          {step === 1 && (

            <form onSubmit={handleSendOtp}>


              <label
                htmlFor="phone"
                className="block text-sm font-medium text-black dark:text-cream mb-2"
              >
                Mobile Number
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
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={10}
                  autoFocus
                  className="w-full h-12 pl-11 pr-4 bg-transparent border border-black/15 dark:border-white/15 text-black dark:text-cream placeholder:text-gray/60 dark:placeholder:text-muted/60 outline-none focus:border-gold transition-colors"
                />

              </div>


              <button
                type="submit"
                disabled={loading}
                className="group w-full h-12 mt-5 flex items-center justify-center gap-3 bg-black dark:bg-cream text-cream dark:text-black font-semibold hover:bg-gold hover:text-black disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
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


          {/* ====================================================
              STEP 2
          ===================================================== */}

          {step === 2 && (

            <form onSubmit={handleVerifyOtp}>


              {/* OTP Icon */}

              <div className="flex justify-center mb-6">

                <div className="w-14 h-14 flex items-center justify-center bg-gold/10 border border-gold/30">

                  <ShieldCheck
                    size={28}
                    strokeWidth={1.6}
                    className="text-gold"
                  />

                </div>

              </div>


              <div className="text-center mb-6">

                <p className="text-sm text-gray dark:text-muted">

                  We've sent a verification code to

                </p>


                <p className="mt-1 font-medium text-black dark:text-cream">

                  {phone}

                </p>

              </div>


              <label
                htmlFor="otp"
                className="block text-sm font-medium text-black dark:text-cream mb-2"
              >
                Enter OTP
              </label>


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


              <button
                type="submit"
                disabled={loading}
                className="group w-full h-12 mt-5 flex items-center justify-center gap-3 bg-black dark:bg-cream text-cream dark:text-black font-semibold hover:bg-gold hover:text-black disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
              >

                {loading
                  ? 'Verifying...'
                  : 'Verify & Sign In'}


                {!loading && (

                  <ArrowRight
                    size={17}
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  />

                )}

              </button>


              <button
                type="button"
                onClick={handleBack}
                disabled={loading}
                className="w-full mt-4 h-11 flex items-center justify-center gap-2 text-sm text-gray dark:text-muted hover:text-gold transition-colors"
              >

                <ArrowLeft size={15} />

                Change phone number

              </button>

            </form>

          )}


          {/* ====================================================
              REGISTER
          ===================================================== */}

          <div className="mt-7 pt-6 border-t border-black/10 dark:border-white/10 text-center">

            <p className="text-sm text-gray dark:text-muted">

              Don't have an account?{' '}

              <Link
                to="/register"
                className="text-gold font-medium hover:underline"
              >
                Create Account
              </Link>

            </p>

          </div>

        </div>


        {/* Footer */}

        <p className="text-center text-xs text-gray dark:text-muted mt-8">

          Honey Chain · SIH26021

        </p>

      </div>

    </div>
  );
}

