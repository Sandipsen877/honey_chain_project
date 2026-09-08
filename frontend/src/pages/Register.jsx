import { Link } from 'react-router-dom';
import {
  Hexagon,
  User,
  Mail,
  Lock,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export default function Register() {
  return (
    <div className="relative min-h-[calc(100vh-72px)] flex items-center overflow-hidden bg-cream dark:bg-black">

      {/* =====================================================
          BACKGROUND DETAILS
      ===================================================== */}

      <div className="absolute -right-32 -top-32 w-[520px] h-[520px] border border-gold/10 rotate-30 pointer-events-none" />

      <div className="absolute -left-40 -bottom-40 w-[500px] h-[500px] border border-gold/5 rotate-30 pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />


      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-16">

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">


          {/* =================================================
              LEFT — BRAND MESSAGE
          ================================================= */}

          <div className="hidden lg:block">

            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-gold mb-8">
              <span className="w-8 h-px bg-gold" />
              HoneyChain
            </div>

            <h1 className="text-6xl xl:text-7xl font-semibold tracking-[-0.05em] leading-[0.9] text-black dark:text-cream">
              Start your
              <br />
              <span className="text-gold">journey.</span>
            </h1>

            <p className="mt-8 max-w-md text-base leading-relaxed text-gray dark:text-muted">
              Create your HoneyChain account and become part of a more
              connected and transparent honey ecosystem.
            </p>


            {/* Brand information */}
            <div className="mt-14 flex items-start gap-4">

              <div className="w-11 h-11 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                <ShieldCheck
                  size={20}
                  strokeWidth={1.5}
                />
              </div>

              <div>

                <p className="text-sm font-medium text-black dark:text-cream">
                  Built around trust
                </p>

                <p className="mt-1 text-xs leading-relaxed text-gray dark:text-muted max-w-xs">
                  Connect hive intelligence, honey traceability and
                  consumer verification through one ecosystem.
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT — REGISTRATION
          ================================================= */}

          <div className="w-full max-w-md mx-auto lg:ml-auto">

            {/* Mobile heading */}
            <div className="lg:hidden mb-10">

              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-gold mb-6">
                <span className="w-7 h-px bg-gold" />
                HoneyChain
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-cream">
                Start your <span className="text-gold">journey.</span>
              </h1>

            </div>


            {/* Form heading */}
            <div className="mb-8">

              <div className="w-12 h-12 bg-gold flex items-center justify-center text-black mb-6">
                <Hexagon
                  size={25}
                  strokeWidth={1.7}
                />
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-cream">
                Create account
              </h2>

              <p className="mt-2 text-sm text-gray dark:text-muted">
                Register for your Honey Chain account
              </p>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card">

              <div className="p-7 md:p-8 space-y-5">


                {/* FULL NAME */}
                <div>

                  <label className="block text-xs uppercase tracking-[0.12em] font-medium text-gray dark:text-muted mb-3">
                    Full Name
                  </label>

                  <div className="relative">

                    <User
                      size={17}
                      strokeWidth={1.5}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray dark:text-muted"
                    />

                    <input
                      type="text"
                      placeholder="Your name"
                      className="
                        w-full
                        pl-11 pr-4 py-3.5
                        bg-cream dark:bg-black-soft
                        border border-black/10 dark:border-white/10
                        text-black dark:text-cream
                        placeholder:text-gray/60 dark:placeholder:text-muted/60
                        text-sm
                        focus:outline-none
                        focus:border-gold
                        transition-colors duration-300
                      "
                    />

                  </div>

                </div>


                {/* EMAIL */}
                <div>

                  <label className="block text-xs uppercase tracking-[0.12em] font-medium text-gray dark:text-muted mb-3">
                    Email
                  </label>

                  <div className="relative">

                    <Mail
                      size={17}
                      strokeWidth={1.5}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray dark:text-muted"
                    />

                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="
                        w-full
                        pl-11 pr-4 py-3.5
                        bg-cream dark:bg-black-soft
                        border border-black/10 dark:border-white/10
                        text-black dark:text-cream
                        placeholder:text-gray/60 dark:placeholder:text-muted/60
                        text-sm
                        focus:outline-none
                        focus:border-gold
                        transition-colors duration-300
                      "
                    />

                  </div>

                </div>


                {/* PASSWORD */}
                <div>

                  <label className="block text-xs uppercase tracking-[0.12em] font-medium text-gray dark:text-muted mb-3">
                    Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={17}
                      strokeWidth={1.5}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray dark:text-muted"
                    />

                    <input
                      type="password"
                      placeholder="••••••••"
                      className="
                        w-full
                        pl-11 pr-4 py-3.5
                        bg-cream dark:bg-black-soft
                        border border-black/10 dark:border-white/10
                        text-black dark:text-cream
                        placeholder:text-gray/60 dark:placeholder:text-muted/60
                        text-sm
                        focus:outline-none
                        focus:border-gold
                        transition-colors duration-300
                      "
                    />

                  </div>

                </div>


                {/* CONFIRM PASSWORD */}
                <div>

                  <label className="block text-xs uppercase tracking-[0.12em] font-medium text-gray dark:text-muted mb-3">
                    Confirm Password
                  </label>

                  <div className="relative">

                    <Lock
                      size={17}
                      strokeWidth={1.5}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray dark:text-muted"
                    />

                    <input
                      type="password"
                      placeholder="••••••••"
                      className="
                        w-full
                        pl-11 pr-4 py-3.5
                        bg-cream dark:bg-black-soft
                        border border-black/10 dark:border-white/10
                        text-black dark:text-cream
                        placeholder:text-gray/60 dark:placeholder:text-muted/60
                        text-sm
                        focus:outline-none
                        focus:border-gold
                        transition-colors duration-300
                      "
                    />

                  </div>

                </div>


                {/* REGISTER */}
                <button
                  type="submit"
                  className="
                    group
                    w-full
                    flex items-center justify-center gap-2
                    py-3.5
                    bg-black dark:bg-cream
                    text-cream dark:text-black
                    text-sm font-semibold
                    hover:bg-gold hover:text-black
                    transition-all duration-300
                  "
                >
                  Create Account

                  <ArrowUpRight
                    size={15}
                    className="
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                      transition-transform duration-300
                    "
                  />
                </button>

              </div>


              {/* LOGIN */}
              <div className="border-t border-black/10 dark:border-white/10 px-7 md:px-8 py-5">

                <p className="text-center text-sm text-gray dark:text-muted">

                  Already have an account?{' '}

                  <Link
                    to="/login"
                    className="text-gold font-medium hover:underline underline-offset-4"
                  >
                    Sign In
                  </Link>

                </p>

              </div>

            </form>


            {/* Bottom label */}
            <p className="mt-6 text-center text-[11px] uppercase tracking-[0.14em] text-gray/60 dark:text-muted/60">
              Honey Chain · SIH26021
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}