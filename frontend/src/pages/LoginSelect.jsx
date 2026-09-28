import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Hexagon,
  ShieldCheck,
} from 'lucide-react';

import honeychainLogo from '../assets/logo_project.png';

export default function LoginSelect() {
  return (
    <div className="min-h-[calc(100vh-72px)] bg-cream dark:bg-black flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl">

        {/* Logo */}
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

        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">
            HoneyChain
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-cream">
            Choose how to sign in
          </h1>
          <p className="mt-3 text-sm text-gray dark:text-muted">
            Select your role to continue
          </p>
        </div>

        {/* Two options */}
        <div className="grid sm:grid-cols-2 gap-4">

          {/* Beekeeper */}
          <Link
            to="/beekeeper/login"
            className="group flex flex-col items-start gap-4 p-6 bg-cream-card dark:bg-black-card border border-black/10 dark:border-white/10 hover:border-gold/50 transition-all duration-300"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-gold/10 border border-gold/30 text-gold group-hover:bg-gold group-hover:text-black transition-all duration-300">
              <Hexagon size={24} strokeWidth={1.6} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black dark:text-cream">
                Beekeeper
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-gray dark:text-muted">
                Sign in to manage farms, hives, batches and monitoring.
              </p>
            </div>

            <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-gold">
              Continue
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </span>
          </Link>

          {/* KVIC Admin */}
          <Link
            to="/kvic/login"
            className="group flex flex-col items-start gap-4 p-6 bg-cream-card dark:bg-black-card border border-black/10 dark:border-white/10 hover:border-gold/50 transition-all duration-300"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-gold/10 border border-gold/30 text-gold group-hover:bg-gold group-hover:text-black transition-all duration-300">
              <ShieldCheck size={24} strokeWidth={1.6} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-black dark:text-cream">
                KVIC Admin
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-gray dark:text-muted">
                Sign in to the administration portal for oversight and reports.
              </p>
            </div>

            <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-gold">
              Continue
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </span>
          </Link>

        </div>

        <p className="text-center text-xs text-gray dark:text-muted mt-8">
          Honey Chain · SIH26021
        </p>
      </div>
    </div>
  );
}