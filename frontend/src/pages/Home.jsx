import { Link } from 'react-router-dom';
import { ArrowUpRight, Hexagon, QrCode, Activity, Shield } from 'lucide-react';
import HoneyScene from '../components/HoneyScene';
import drippingHoney from '../assets/dripping_honey.png';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 opacity-[0.12] dark:opacity-[0.07]"
        style={{
          backgroundImage: `url(${drippingHoney})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10">
        {/* ========== HERO ========== */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* LEFT - Deconstructed */}
            <div className="relative">
              <div className="absolute -top-8 -left-2 text-[140px] md:text-[180px] font-black text-gold/10 dark:text-gold/5 leading-none select-none pointer-events-none">
                01
              </div>

              <p className="text-xs font-medium tracking-[0.25em] uppercase text-gold mb-6 relative">
                SIH 2026 · Traceability
              </p>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[0.95] text-black dark:text-cream relative">
                From
                <br />
                <span className="text-gold">hive</span>
                <br />
                to jar.
              </h1>

              <p className="mt-8 max-w-md text-base text-gray dark:text-muted leading-relaxed">
                Blockchain-powered honey authenticity for rural beekeepers. 
                Scan. Verify. Trust.
              </p>

              <div className="mt-10 flex items-center gap-5">
                <Link
                  to="/login"
                  className="group inline-flex items-center gap-3 px-7 py-4 bg-black dark:bg-cream text-cream dark:text-black text-sm font-semibold rounded-none hover:bg-gold hover:text-black transition-colors duration-300"
                >
                  Enter Platform
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
                </Link>

                <a href="#roadmap" className="text-sm text-gray hover:text-gold transition underline underline-offset-4">
                  See roadmap
                </a>
              </div>
            </div>

            {/* RIGHT - Bees (unchanged) */}
            <div className="relative">
              <HoneyScene />
            </div>
          </div>
        </section>

        {/* ========== ROADMAP FEATURES ========== */}
        <section id="roadmap" className="max-w-5xl mx-auto px-6 py-24 md:py-32">
          
          {/* Header */}
          <div className="flex items-baseline gap-4 mb-20 md:mb-28">
            <span className="text-6xl md:text-8xl font-black text-gold/20">02</span>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-cream">
                The Roadmap
              </h2>
              <p className="text-sm text-muted mt-1">How Honey Chain works</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Glowing vertical path */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2">
              <div className="h-full w-full bg-gradient-to-b from-gold/80 via-orange/60 to-yellow/40" />
              {/* Soft glow */}
              <div className="absolute inset-0 blur-[6px] bg-gradient-to-b from-gold/50 via-orange/30 to-transparent" />
            </div>

            {/* ========== Step 1 - Left ========== */}
            <div className="relative flex justify-start mb-24 md:mb-32">
              <div className="w-full md:w-[45%] md:pr-12">
                <div className="p-7 md:p-8 border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                      <QrCode size={18} className="text-gold" />
                    </div>
                    <span className="text-xs tracking-widest text-gold">STEP 01</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-black dark:text-cream mb-3">
                    QR Verification
                  </h3>
                  <p className="text-sm text-gray dark:text-muted leading-relaxed">
                    Every jar carries an immutable digital passport. 
                    One scan reveals the complete journey from hive to bottle.
                  </p>
                </div>
              </div>

              {/* Center dot */}
              <div className="absolute left-1/2 top-8 -translate-x-1/2 w-4 h-4 rounded-full bg-gold border-4 border-cream dark:border-black shadow-[0_0_12px_rgba(212,175,55,0.6)]" />
            </div>

            {/* ========== Step 2 - Right ========== */}
            <div className="relative flex justify-end mb-24 md:mb-32">
              <div className="w-full md:w-[45%] md:pl-12">
                <div className="p-7 md:p-8 border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-orange/20 flex items-center justify-center">
                      <Activity size={18} className="text-orange" />
                    </div>
                    <span className="text-xs tracking-widest text-orange">STEP 02</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-black dark:text-cream mb-3">
                    Smart Monitoring
                  </h3>
                  <p className="text-sm text-gray dark:text-muted leading-relaxed">
                    IoT sensors track temperature, humidity and colony health in real time. 
                    AI flags disease risks early.
                  </p>
                </div>
              </div>

              {/* Center dot */}
              <div className="absolute left-1/2 top-8 -translate-x-1/2 w-4 h-4 rounded-full bg-orange border-4 border-cream dark:border-black shadow-[0_0_12px_rgba(249,115,22,0.5)]" />
            </div>

            {/* ========== Step 3 - Left ========== */}
            <div className="relative flex justify-start">
              <div className="w-full md:w-[45%] md:pr-12">
                <div className="p-7 md:p-8 border border-black/10 dark:border-white/10 bg-white/60 dark:bg-black-card/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-yellow/20 flex items-center justify-center">
                      <Shield size={18} className="text-yellow" />
                    </div>
                    <span className="text-xs tracking-widest text-yellow">STEP 03</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-black dark:text-cream mb-3">
                    Immutable Tracking
                  </h3>
                  <p className="text-sm text-gray dark:text-muted leading-relaxed">
                    Every batch is permanently recorded on the blockchain. 
                    Counterfeit honey has nowhere left to hide.
                  </p>
                </div>
              </div>

              {/* Center dot */}
              <div className="absolute left-1/2 top-8 -translate-x-1/2 w-4 h-4 rounded-full bg-yellow border-4 border-cream dark:border-black shadow-[0_0_12px_rgba(250,204,21,0.5)]" />
            </div>
          </div>
        </section>

        {/* Bottom strip */}
        <section className="border-t border-black/10 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <p className="text-sm text-muted">
              Built for rural beekeepers · Ministry of MSME
            </p>
            <p className="text-xs tracking-widest uppercase text-gold/70">
              Honey Chain · SIH26021
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}