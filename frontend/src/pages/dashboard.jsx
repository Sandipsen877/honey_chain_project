import { Link } from 'react-router-dom';
import { ArrowUpRight, UserRound } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-[calc(100vh-72px)] bg-cream dark:bg-black">
      <section className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">
            HoneyChain
          </p>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-black dark:text-cream">
            Keeper Dashboard
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-gray dark:text-muted">
            Welcome to your HoneyChain workspace. Your traceability tools will
            appear here as the platform grows.
          </p>
        </div>

        {/* Welcome Card */}
        <div className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 flex items-center justify-center bg-gold/10 border border-gold/30">
                <UserRound
                  size={22}
                  strokeWidth={1.7}
                  className="text-gold"
                />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray dark:text-muted mb-2">
                  Account
                </p>

                <h2 className="text-xl font-semibold text-black dark:text-cream">
                  Welcome, Keeper
                </h2>

                <p className="mt-2 text-sm text-gray dark:text-muted">
                  Your HoneyChain dashboard is ready.
                </p>
              </div>
            </div>

            <Link
              to="/"
              className="group inline-flex items-center justify-center gap-2 px-5 py-3 bg-black dark:bg-cream text-cream dark:text-black text-sm font-semibold hover:bg-gold hover:text-black transition-all duration-300"
            >
              Back to Home
              <ArrowUpRight
                size={15}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
              />
            </Link>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10 dark:bg-white/10">
          <div className="bg-cream dark:bg-black p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">
              01
            </p>
            <h3 className="text-lg font-semibold text-black dark:text-cream">
              Hive Monitoring
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray dark:text-muted">
              Coming soon.
            </p>
          </div>

          <div className="bg-cream dark:bg-black p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">
              02
            </p>
            <h3 className="text-lg font-semibold text-black dark:text-cream">
              Honey Batches
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray dark:text-muted">
              Coming soon.
            </p>
          </div>

          <div className="bg-cream dark:bg-black p-7">
            <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">
              03
            </p>
            <h3 className="text-lg font-semibold text-black dark:text-cream">
              Traceability
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray dark:text-muted">
              Coming soon.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}