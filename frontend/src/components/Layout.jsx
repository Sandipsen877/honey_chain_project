import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useEffect, useState } from 'react';

import { useTheme } from '../context/ThemeContext';

import {
  Sun,
  Moon,
  ArrowUpRight,
  House,
  BookOpen,
  LogOut,
  UserRound,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  X,
  LoaderCircle,
  AlertCircle,
} from 'lucide-react';

import honeychainLogo from '../assets/logo_project.png';

import {
  getCurrentKeeper,
} from '../services/authService';


export default function Layout() {

  const {
    theme,
    toggleTheme,
  } = useTheme();


  const location = useLocation();

  const navigate = useNavigate();


  /* 
   * ============================================================
   * CHECK CURRENT PAGE
   * ============================================================
   */

  const isDashboard =
    location.pathname.startsWith(
      '/dashboard'
    );


  /* 
   * ============================================================
   * PROFILE MODAL
   * ============================================================
   */

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false);


  /* 
   * ============================================================
   * KEEPER DATA
   * ============================================================
   */

  const [
    keeper,
    setKeeper,
  ] = useState(null);


  /* 
   * ============================================================
   * PROFILE LOADING
   * ============================================================
   */

  const [
    profileLoading,
    setProfileLoading,
  ] = useState(false);


  /* 
   * ============================================================
   * PROFILE ERROR
   * ============================================================
   */

  const [
    profileError,
    setProfileError,
  ] = useState('');


  /* 
   * ============================================================
   * LOAD PROFILE
   * ============================================================
   *
   * This runs when the user opens the profile modal.
   *
   * The data comes from:
   *
   * GET /api/auth/me
   *
   * using the JWT token.
   * ============================================================
   */

  useEffect(() => {

    /*
     * Do nothing when modal is closed.
     */

    if (
      !profileOpen ||
      !isDashboard
    ) {
      return;
    }


    const loadProfile = async () => {

      /*
       * Get JWT token.
       */

      const token =
        localStorage.getItem(
          'honeychain_token'
        );


      /*
       * No token.
       */

      if (!token) {

        setProfileError(
          'Your session has expired. Please sign in again.'
        );

        return;
      }


      try {

        setProfileLoading(true);
        setProfileError('');


        /*
         * Ask backend for the
         * currently authenticated keeper.
         */

        const response =
          await getCurrentKeeper(
            token
          );


        /*
         * Support either response:
         *
         * {
         *   keeper: {...}
         * }
         *
         * OR
         *
         * {
         *   name: "...",
         *   email: "...",
         * }
         */

        const currentKeeper =
          response?.keeper ||
          response;


        if (!currentKeeper) {

          throw new Error(
            'Keeper information was not received.'
          );
        }


        /*
         * Store actual backend data.
         */

        setKeeper(
          currentKeeper
        );


        /*
         * Keep local copy updated.
         */

        localStorage.setItem(
          'honeychain_keeper',
          JSON.stringify(
            currentKeeper
          )
        );

      } catch (error) {

        console.error(
          'Profile loading error:',
          error
        );


        setProfileError(
          error.message ||
          'Unable to load your profile.'
        );

      } finally {

        setProfileLoading(false);

      }
    };


    loadProfile();

  }, [
    profileOpen,
    isDashboard,
  ]);


  /* 
   * ============================================================
   * CLOSE PROFILE
   * ============================================================
   */

  const closeProfile = () => {

    setProfileOpen(false);

    setProfileError('');
  };


  /* 
   * ============================================================
   * LOGOUT
   * ============================================================
   */

  const handleLogout = () => {

    /*
     * Remove authentication token.
     */

    localStorage.removeItem(
      'honeychain_token'
    );


    /*
     * Remove cached keeper information.
     */

    localStorage.removeItem(
      'honeychain_keeper'
    );


    /*
     * Close profile modal.
     */

    setProfileOpen(false);


    /*
     * Remove keeper from state.
     */

    setKeeper(null);


    /*
     * Go to login.
     */

    navigate('/login');
  };


  /* 
   * ============================================================
   * ESCAPE KEY
   * ============================================================
   */

  useEffect(() => {

    const handleEscape = (event) => {

      if (
        event.key === 'Escape' &&
        profileOpen
      ) {

        closeProfile();

      }

    };


    document.addEventListener(
      'keydown',
      handleEscape
    );


    return () => {

      document.removeEventListener(
        'keydown',
        handleEscape
      );

    };

  }, [
    profileOpen,
  ]);


  return (

    <div className="min-h-screen flex flex-col font-sans bg-cream dark:bg-black">


      {/* ======================================================
          NAVBAR
      ======================================================= */}

      <header className="sticky top-0 z-50">


        {/* Navbar Background */}

        <div className="absolute inset-0 bg-cream/85 dark:bg-black/85 backdrop-blur-xl" />


        {/* Navbar Border */}

        <div className="absolute bottom-0 left-0 right-0 h-px bg-black/5 dark:bg-white/5" />


        <div className="relative max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">


          {/* ==================================================
              LOGO
          =================================================== */}

          <Link
            to={
              isDashboard
                ? '/dashboard'
                : '/'
            }
            className="group flex items-center gap-3"
          >

            <div className="relative">

              <div className="absolute inset-0 bg-gold/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />


              <div className="relative w-11 h-11 flex items-center justify-center">

                <img
                  src={honeychainLogo}
                  alt="HoneyChain"
                  className="w-full h-full object-contain"
                />

              </div>

            </div>


            <span className="text-lg font-semibold tracking-tight text-black dark:text-cream">

              Honey

              <span className="text-gold">
                Chain
              </span>

            </span>

          </Link>


          {/* ==================================================
              DASHBOARD NAVBAR
          =================================================== */}

          {isDashboard ? (

            <div className="flex items-center gap-3">


              {/* ==============================================
                  PROFILE BUTTON
              =============================================== */}

              <button
                type="button"
                onClick={() =>
                  setProfileOpen(true)
                }
                className="group w-10 h-10 flex items-center justify-center border border-black/10 dark:border-white/10 text-gray dark:text-muted hover:text-gold hover:border-gold/40 transition-all duration-300"
                aria-label="Open profile"
                title="My Profile"
              >

                <UserRound
                  size={18}
                  strokeWidth={1.8}
                  className="group-hover:scale-105 transition-transform duration-300"
                />

              </button>


              {/* ==============================================
                  THEME BUTTON
              =============================================== */}

              <button
                type="button"
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center border border-black/10 dark:border-white/10 text-gray dark:text-muted hover:text-gold hover:border-gold/40 transition-all duration-300"
                aria-label="Toggle theme"
              >

                {theme === 'light' ? (

                  <Moon
                    size={17}
                    strokeWidth={1.8}
                  />

                ) : (

                  <Sun
                    size={17}
                    strokeWidth={1.8}
                  />

                )}

              </button>


              {/* ==============================================
                  LOGOUT
              =============================================== */}

              <button
                type="button"
                onClick={handleLogout}
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-cream text-cream dark:text-black text-sm font-semibold hover:bg-gold hover:text-black transition-all duration-300"
              >

                Logout

                <LogOut
                  size={15}
                  strokeWidth={1.8}
                  className="group-hover:translate-x-0.5 transition-transform duration-300"
                />

              </button>

            </div>

          ) : (

            /* ==================================================
               PUBLIC NAVBAR
            =================================================== */

            <>

              {/* Center Navigation */}

              <nav className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-2">


                {/* HOME */}

                <Link
                  to="/"
                  className={`group relative flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    location.pathname === '/'
                      ? 'text-gold'
                      : 'text-gray dark:text-muted hover:text-gold'
                  }`}
                >

                  <House
                    size={16}
                    strokeWidth={1.8}
                    className="group-hover:-translate-y-0.5 transition-transform duration-300"
                  />

                  <span>
                    Home
                  </span>


                  {location.pathname === '/' && (

                    <span className="absolute bottom-0 left-5 right-5 h-px bg-gold" />

                  )}

                </Link>


                {/* ABOUT */}

                <Link
                  to="/about"
                  className={`group relative flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                    location.pathname === '/about'
                      ? 'text-gold'
                      : 'text-gray dark:text-muted hover:text-gold'
                  }`}
                >

                  <BookOpen
                    size={16}
                    strokeWidth={1.8}
                    className="group-hover:-translate-y-0.5 transition-transform duration-300"
                  />

                  <span>
                    About
                  </span>


                  {location.pathname === '/about' && (

                    <span className="absolute bottom-0 left-5 right-5 h-px bg-gold" />

                  )}

                </Link>

              </nav>


              {/* Public Right Side */}

              <div className="flex items-center gap-3">


                {/* Theme */}

                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-10 h-10 flex items-center justify-center border border-black/10 dark:border-white/10 text-gray dark:text-muted hover:text-gold hover:border-gold/40 transition-all duration-300"
                  aria-label="Toggle theme"
                >

                  {theme === 'light' ? (

                    <Moon
                      size={17}
                      strokeWidth={1.8}
                    />

                  ) : (

                    <Sun
                      size={17}
                      strokeWidth={1.8}
                    />

                  )}

                </button>


                {/* Login */}

                <Link
                  to="/login"
                  className="group inline-flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-cream text-cream dark:text-black text-sm font-semibold hover:bg-gold hover:text-black transition-all duration-300"
                >

                  Login

                  <ArrowUpRight
                    size={14}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                  />

                </Link>

              </div>

            </>

          )}

        </div>

      </header>


      {/* ======================================================
          MAIN CONTENT
      ======================================================= */}

      <main className="flex-1">

        <Outlet />

      </main>


      {/* ======================================================
          FOOTER
      ======================================================= */}

      <footer className="border-t border-black/5 dark:border-white/5">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <p className="text-xs text-gray dark:text-muted">

            © 2026 Honey Chain · SIH26021

          </p>

        </div>

      </footer>


      {/* ======================================================
          PROFILE MODAL
      ======================================================= */}

      {profileOpen && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-5 py-6 sm:py-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-title"
        >


          {/* ==================================================
              DARK OVERLAY
          =================================================== */}

          <button
            type="button"
            onClick={closeProfile}
            className="absolute inset-0 bg-black/45 dark:bg-black/70 backdrop-blur-sm cursor-default"
            aria-label="Close profile"
          />


          {/* ==================================================
              MODAL
          =================================================== */}

          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden bg-cream-card dark:bg-black-card border border-black/10 dark:border-white/10 shadow-2xl">


            {/* =================================================
                MODAL HEADER
            ================================================== */}

            <div className="px-5 sm:px-7 py-5 border-b border-black/10 dark:border-white/10">

              <div className="flex items-center justify-between gap-4">


                {/* Header Identity */}

                <div className="flex items-center gap-4 min-w-0">

                  <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center bg-gold/10 border border-gold/30">

                    <UserRound
                      size={21}
                      strokeWidth={1.6}
                      className="text-gold"
                    />

                  </div>


                  <div className="min-w-0">

                    <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-gold font-medium">

                      HoneyChain

                    </p>


                    <h2
                      id="profile-title"
                      className="mt-1 text-lg sm:text-xl font-semibold text-black dark:text-cream"
                    >

                      My Profile

                    </h2>

                  </div>

                </div>


                {/* Close Button */}

                <button
                  type="button"
                  onClick={closeProfile}
                  className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center border border-black/10 dark:border-white/10 text-gray dark:text-muted hover:text-gold hover:border-gold/40 transition-all duration-300"
                  aria-label="Close profile"
                >

                  <X
                    size={18}
                    strokeWidth={1.8}
                  />

                </button>

              </div>

            </div>


            {/* =================================================
                MODAL BODY
            ================================================== */}

            <div className="max-h-[calc(90vh-82px)] overflow-y-auto scrollbar-thin">

              <div className="p-5 sm:p-7">


                {/* =================================================
                    LOADING
                ================================================== */}

                {profileLoading && (

                  <div className="py-12 sm:py-16 text-center">

                    <LoaderCircle
                      size={30}
                      className="mx-auto text-gold animate-spin"
                    />


                    <p className="mt-4 text-sm text-gray dark:text-muted">

                      Loading your profile...

                    </p>

                  </div>

                )}


                {/* =================================================
                    ERROR
                ================================================== */}

                {!profileLoading &&
                  profileError && (

                    <div className="py-10 sm:py-14 text-center">

                      <div className="mx-auto w-12 h-12 flex items-center justify-center bg-red-500/10 border border-red-500/20">

                        <AlertCircle
                          size={24}
                          className="text-red-500"
                        />

                      </div>


                      <p className="mt-4 max-w-md mx-auto text-sm leading-6 text-red-600 dark:text-red-400">

                        {profileError}

                      </p>


                      <button
                        type="button"
                        onClick={closeProfile}
                        className="mt-6 px-5 py-2.5 bg-black dark:bg-cream text-cream dark:text-black text-sm font-semibold hover:bg-gold hover:text-black transition-all duration-300"
                      >

                        Close

                      </button>

                    </div>

                  )}


                {/* =================================================
                    PROFILE CONTENT
                ================================================== */}

                {!profileLoading &&
                  !profileError &&
                  keeper && (

                    <div>


                      {/* =========================================
                          PROFILE IDENTITY
                      ========================================== */}

                      <div className="border border-black/10 dark:border-white/10 bg-cream dark:bg-black">

                        <div className="p-5 sm:p-6">

                          <div className="flex flex-col sm:flex-row sm:items-center gap-5">


                            {/* Avatar */}

                            <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0 flex items-center justify-center bg-gold/10 border border-gold/30">

                              <UserRound
                                size={30}
                                strokeWidth={1.5}
                                className="text-gold"
                              />

                            </div>


                            {/* Identity */}

                            <div className="min-w-0 flex-1">

                              <p className="text-[9px] uppercase tracking-[0.2em] text-gold font-semibold">

                                Keeper Account

                              </p>


                              <h3 className="mt-1.5 text-xl sm:text-2xl font-semibold text-black dark:text-cream break-words">

                                {keeper.name ||
                                  'Not provided'}

                              </h3>


                              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">

                                {keeper.keeperCode && (

                                  <span className="text-xs text-gray dark:text-muted break-all">

                                    {keeper.keeperCode}

                                  </span>

                                )}


                                {keeper.phone && (

                                  <span className="text-xs text-gray dark:text-muted">

                                    {keeper.phone}

                                  </span>

                                )}

                              </div>

                            </div>

                          </div>

                        </div>


                        {/* Gold Accent */}

                        <div className="h-px bg-gold/30" />

                      </div>


                      {/* =========================================
                          PROFILE DETAILS
                      ========================================== */}

                      <div className="mt-5 sm:mt-6">


                        {/* Section Heading */}

                        <div className="flex items-center gap-3 mb-3">

                          <span className="text-[9px] uppercase tracking-[0.22em] text-gold font-semibold">

                            Account Information

                          </span>

                          <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />

                        </div>


                        {/* Details */}

                        <div className="grid grid-cols-1 md:grid-cols-2 border border-black/10 dark:border-white/10">


                          {/* Full Name */}

                          <ProfileItem
                            icon={
                              <UserRound
                                size={17}
                              />
                            }
                            label="Full Name"
                            value={keeper.name}
                          />


                          {/* Email */}

                          <ProfileItem
                            icon={
                              <Mail
                                size={17}
                              />
                            }
                            label="Email Address"
                            value={keeper.email}
                          />


                          {/* Phone */}

                          <ProfileItem
                            icon={
                              <Phone
                                size={17}
                              />
                            }
                            label="Mobile Number"
                            value={keeper.phone}
                          />


                          {/* Address */}

                          <ProfileItem
                            icon={
                              <MapPin
                                size={17}
                              />
                            }
                            label="Address"
                            value={keeper.address}
                          />


                          {/* Keeper Code */}

                          <div className="md:col-span-2">

                            <ProfileItem
                              icon={
                                <ShieldCheck
                                  size={17}
                                />
                              }
                              label="Keeper Code"
                              value={keeper.keeperCode}
                              last
                            />

                          </div>

                        </div>

                      </div>


                      {/* =========================================
                          CLOSE
                      ========================================== */}

                      <div className="mt-6 flex justify-end">

                        <button
                          type="button"
                          onClick={closeProfile}
                          className="w-full sm:w-auto px-6 py-3 bg-black dark:bg-cream text-cream dark:text-black text-sm font-semibold hover:bg-gold hover:text-black transition-all duration-300"
                        >

                          Close

                        </button>

                      </div>

                    </div>

                  )}

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}


/*
 * ============================================================
 * PROFILE ITEM
 * ============================================================
 *
 * Reusable row inside profile modal.
 *
 * No dummy value is inserted.
 *
 * If backend sends an empty value,
 * "Not provided" is displayed.
 *
 * ============================================================
 */

function ProfileItem({
  icon,
  label,
  value,
  last = false,
}) {

  const displayValue =
    value !== undefined &&
    value !== null &&
    String(value).trim() !== ''
      ? String(value)
      : 'Not provided';


  return (

    <div
      className={`
        flex items-start gap-4
        p-4 sm:p-5
        min-w-0
        ${
          !last
            ? 'border-b border-black/10 dark:border-white/10'
            : ''
        }
      `}
    >


      {/* Icon */}

      <div className="w-9 h-9 shrink-0 flex items-center justify-center bg-gold/10 border border-gold/20 text-gold">

        {icon}

      </div>


      {/* Information */}

      <div className="min-w-0 flex-1">

        <p className="text-[9px] uppercase tracking-[0.18em] text-gray dark:text-muted">

          {label}

        </p>


        <p className="mt-1.5 text-sm font-medium text-black dark:text-cream break-words">

          {displayValue}

        </p>

      </div>

    </div>

  );
}