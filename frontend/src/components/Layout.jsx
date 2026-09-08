import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Hexagon, ArrowUpRight } from 'lucide-react';

export default function Layout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-cream dark:bg-black">

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50">

        {/* Glass background */}
        <div className="absolute inset-0 bg-cream/85 dark:bg-black/85 backdrop-blur-xl" />

        

        {/* SAME WIDTH AS HOME HERO */}
        <div className="relative max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">

          {/* ================= LOGO ================= */}
          <Link
            to="/"
            className="group flex items-center gap-3"
          >

            <div className="relative">

              {/* Subtle hover glow */}
              <div className="absolute inset-0 bg-gold/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative w-10 h-10 bg-gold flex items-center justify-center text-black">
                <Hexagon
                  size={21}
                  strokeWidth={1.8}
                />
              </div>

            </div>

            <span className="text-lg font-semibold tracking-tight text-black dark:text-cream">
              Honey<span className="text-gold">Chain</span>
            </span>

          </Link>


          {/* ================= RIGHT SIDE ================= */}
          <div className="flex items-center gap-3">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="
                w-10
                h-10
                flex
                items-center
                justify-center
                border
                border-black/10
                dark:border-white/10
                text-gray
                dark:text-muted
                hover:text-gold
                hover:border-gold/40
                transition-all
                duration-300
              "
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
              className="
                group
                inline-flex
                items-center
                gap-2
                px-5
                py-2.5
                bg-black
                dark:bg-cream
                text-cream
                dark:text-black
                text-sm
                font-semibold
                hover:bg-gold
                hover:text-black
                transition-all
                duration-300
              "
            >
              Login

              <ArrowUpRight
                size={14}
                className="
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                  transition-transform
                  duration-300
                "
              />

            </Link>

          </div>

        </div>
      </header>


      {/* ================= PAGE CONTENT ================= */}
      <main className="flex-1">
        <Outlet />
      </main>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-black/5 dark:border-white/5">

        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-xs text-gray dark:text-muted">
            © 2026 Honey Chain · SIH26021
          </p>

          <p className="text-[10px] tracking-[0.2em] uppercase text-gold/70">
            Honey Chain
          </p>

        </div>

      </footer>

    </div>
  );
}