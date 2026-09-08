import { Outlet, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Hexagon } from 'lucide-react';

export default function Layout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-cream/80 dark:bg-black/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold flex items-center justify-center text-black">
              <Hexagon size={20} fill="currentColor" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-black dark:text-cream">
              Honey<span className="text-gold">Chain</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full flex items-center justify-center text-gray hover:text-gold dark:text-muted dark:hover:text-gold transition"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <Link
              to="/login"
              className="px-5 py-2 rounded-full bg-gold hover:bg-gold-dark text-black text-sm font-semibold transition"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-black/5 dark:border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-10 text-center text-sm text-gray dark:text-muted">
          © 2026 Honey Chain · SIH26021
        </div>
      </footer>
    </div>
  );
}