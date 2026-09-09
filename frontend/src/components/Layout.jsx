import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  Sun,
  Moon,
  ArrowUpRight,
  House,
  BookOpen,
} from 'lucide-react';

import honeychainLogo from '../assets/logo_project.png';

export default function Layout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-cream dark:bg-black">

      {/* Header */}
      <header className="sticky top-0 z-50">
        {/* Glass Background */}
        <div className="absolute inset-0 bg-cream/85 dark:bg-black/85 backdrop-blur-xl" />

        {/* Bottom Border */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-black/5 dark:bg-white/5" />

        <div className="relative max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">

          {/* ================= LOGO ================= */}
          <Link
            to="/"
            className="group flex items-center gap-3"
          >
            <div className="relative">

              {/* Logo Glow */}
              <div className="absolute inset-0 bg-gold/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Logo */}
              <div className="relative w-11 h-11 flex items-center justify-center">
                <img
                  src={honeychainLogo}
                  alt="HoneyChain"
                  className="w-full h-full object-contain"
                />
              </div>

            </div>

            {/* Brand Name */}
            <span className="text-lg font-semibold tracking-tight text-black dark:text-cream">
              Honey<span className="text-gold">Chain</span>
            </span>
          </Link>


          {/* ================= CENTER NAVIGATION ================= */}
          <nav className="absolute left-1/2 -translate-x-1/2 hidden sm:flex items-center gap-2">

            {/* Home */}
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

              <span>Home</span>

              {location.pathname === '/' && (
                <span className="absolute bottom-0 left-5 right-5 h-px bg-gold" />
              )}
            </Link>


            {/* About */}
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

              <span>About</span>

              {location.pathname === '/about' && (
                <span className="absolute bottom-0 left-5 right-5 h-px bg-gold" />
              )}
            </Link>

          </nav>


          {/* ================= RIGHT ACTIONS ================= */}
          <div className="flex items-center gap-3">

            {/* Theme Toggle */}
            <button
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

        </div>
      </header>


      {/* ================= MAIN ================= */}
      <main className="flex-1">
        <Outlet />
      </main>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-black/5 dark:border-white/5">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <p className="text-xs text-gray dark:text-muted">
            © 2026 Honey Chain · SIH26021
          </p>

        </div>

      </footer>

    </div>
  );
}