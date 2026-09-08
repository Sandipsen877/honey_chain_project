import { Link } from 'react-router-dom';
import { Hexagon, Mail, Lock } from 'lucide-react';

export default function Login() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gold text-black items-center justify-center mb-5">
            <Hexagon size={26} fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-black dark:text-cream">
            Welcome back
          </h1>
          <p className="mt-2 text-gray dark:text-muted text-sm">
            Sign in to your Honey Chain account
          </p>
        </div>

        <form className="space-y-5 p-8 rounded-3xl bg-cream-card dark:bg-black-card border border-black/5 dark:border-white/5 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-black dark:text-cream mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray dark:text-muted" />
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream dark:bg-black-soft border border-black/10 dark:border-white/10 text-black dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-cream mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray dark:text-muted" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-cream dark:bg-black-soft border border-black/10 dark:border-white/10 text-black dark:text-cream focus:outline-none focus:ring-2 focus:ring-gold text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gold hover:bg-gold-dark text-black font-semibold text-sm transition"
          >
            Sign In
          </button>

          <p className="text-center text-sm text-gray dark:text-muted">
            Don’t have an account?{' '}
            <Link to="/" className="text-gold font-medium hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}