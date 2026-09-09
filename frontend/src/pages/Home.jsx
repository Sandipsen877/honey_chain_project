import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Hexagon,
  QrCode,
  Activity,
  Shield,
  Cpu,
  Database,
  ScanLine,
  Sprout,
  PackageCheck,
} from 'lucide-react';

import HoneyScene from '../components/HoneyScene';
import drippingHoney from '../assets/dripping_honey.png';

export default function Home() {
  const [roadmapActive, setRoadmapActive] = useState(false);

  useEffect(() => {
    const roadmap = document.getElementById('roadmap');

    if (!roadmap) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setRoadmapActive(entry.isIntersecting);
      },
      {
        threshold: 0.15,
      }
    );

    observer.observe(roadmap);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-cream dark:bg-black overflow-hidden">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative min-h-[calc(100vh-72px)] flex items-center overflow-hidden">

        {/* Honey background — hero only */}
        <div
          className="absolute inset-0 z-0 opacity-[0.85] dark:opacity-[0.2]"
          style={{
            backgroundImage: `url(${drippingHoney})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Soft overlay */}

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* LEFT */}
            <div className="max-w-2xl">

              <div className="inline-flex items-center gap-2 mb-7 text-xs uppercase tracking-[0.22em] text-gold">
                
              </div>

              <h1 className="text-[clamp(3.5rem,7vw,5.2rem)] leading-[0.88] tracking-[-0.055em] font-semibold text-black dark:text-cream">
                From hive
                <br />
                <span className="text-gold">to jar.</span>
              </h1>

              <p className="mt-8 max-w-lg text-base md:text-lg leading-relaxed text-gray dark:text-muted">
                Blockchain-powered honey authenticity for rural beekeepers.
                Scan. Verify. Trust.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">

                <Link
                  to="/login"
                  className="group inline-flex items-center gap-3 px-6 py-3.5 bg-black dark:bg-cream text-cream dark:text-black text-sm font-semibold hover:bg-gold hover:text-black transition-all duration-300"
                >
                  Enter Platform
                  <ArrowUpRight
                    size={16}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </Link>

                <a
                  href="#roadmap"
                  className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-gray dark:text-muted hover:text-gold transition-colors"
                >
                  See roadmap
                  <span className="text-gold">↓</span>
                </a>

              </div>

              {/* Small trust indicators */}
              <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-xs uppercase tracking-[0.14em] text-gray/80 dark:text-muted/80">
                <span className="flex items-center gap-2">
                  <Shield size={14} />
                  Secure records
                </span>

                <span className="flex items-center gap-2">
                  <QrCode size={14} />
                  QR verification
                </span>

                <span className="flex items-center gap-2">
                  <Activity size={14} />
                  Smart monitoring
                </span>
              </div>

            </div>

            {/* RIGHT */}
            <div className="relative min-h-[420px] lg:min-h-[560px] flex items-center justify-center">
              <HoneyScene />
            </div>

          </div>
        </div>
      </section>


      {/* =====================================================
          HONEYCHAIN ECOSYSTEM
      ===================================================== */}
      <section className="relative py-24 md:py-32">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-14 lg:gap-24 items-start">

            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-gold mb-5">
                The ecosystem
              </p>

              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-black dark:text-cream leading-tight">
                One ecosystem.
                <br />
                <span className="text-gold">Every layer connected.</span>
              </h2>
            </div>

            <div>
              <p className="text-base md:text-lg leading-relaxed text-gray dark:text-muted max-w-2xl">
                HoneyChain connects beekeepers, hives, honey batches and
                consumers through IoT, AI, blockchain and QR-based
                verification — creating a digital thread from the hive to
                the final jar.
              </p>

              <div className="grid sm:grid-cols-2 gap-px bg-black/10 dark:bg-white/10 mt-10 border border-black/10 dark:border-white/10">

                <div className="bg-cream dark:bg-black p-7">
                  <Cpu className="text-gold mb-5" size={23} strokeWidth={1.5} />
                  <h3 className="font-semibold text-black dark:text-cream">
                    IoT
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray dark:text-muted">
                    Capture hive and environmental conditions for smarter
                    beekeeping.
                  </p>
                </div>

                <div className="bg-cream dark:bg-black p-7">
                  <Activity className="text-gold mb-5" size={23} strokeWidth={1.5} />
                  <h3 className="font-semibold text-black dark:text-cream">
                    AI
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray dark:text-muted">
                    Turn hive data into useful insights about colony health
                    and productivity.
                  </p>
                </div>

                <div className="bg-cream dark:bg-black p-7">
                  <Database className="text-gold mb-5" size={23} strokeWidth={1.5} />
                  <h3 className="font-semibold text-black dark:text-cream">
                    Blockchain
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray dark:text-muted">
                    Maintain a trusted digital record across the honey
                    supply chain.
                  </p>
                </div>

                <div className="bg-cream dark:bg-black p-7">
                  <ScanLine className="text-gold mb-5" size={23} strokeWidth={1.5} />
                  <h3 className="font-semibold text-black dark:text-cream">
                    QR
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray dark:text-muted">
                    Give consumers a simple way to verify product-origin
                    information.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          ROADMAP
      ===================================================== */}
      <section
        id="roadmap"
        className="relative py-24 md:py-32 bg-cream-card dark:bg-black-soft"
      >

        <div className="max-w-7xl mx-auto px-6">

          <div className="max-w-2xl mb-20">
            <p className="text-xs uppercase tracking-[0.22em] text-gold mb-5">
              How it works
            </p>

            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-black dark:text-cream">
              From hive data
              <br />
              <span className="text-gold">to trusted honey.</span>
            </h2>

            <p className="mt-6 text-base leading-relaxed text-gray dark:text-muted">
              A connected workflow designed around the real journey of honey,
              while making useful information available at every stage.
            </p>
          </div>


          <div className="relative">

            {/* Vertical glowing line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 hidden md:block">

              <div
                className={`
                  h-full w-full
                  bg-gradient-to-b
                  from-gold/80
                  via-orange/60
                  to-yellow/40
                  transition-opacity duration-700
                  ${roadmapActive ? 'opacity-100' : 'opacity-35'}
                `}
              />

              <div
                className={`
                  absolute inset-0
                  blur-[7px]
                  bg-gradient-to-b
                  from-gold/80
                  via-orange/50
                  to-yellow/20
                  transition-all duration-700
                  ${
                    roadmapActive
                      ? 'opacity-100 scale-y-100'
                      : 'opacity-0 scale-y-75'
                  }
                `}
              />

            </div>


            {/* STEP 01 */}
            <div className="relative grid md:grid-cols-2 gap-8 md:gap-20 items-center mb-20 md:mb-28">

              <div className="md:text-right md:pr-16">

                <div className="inline-flex items-center gap-2 text-gold text-xs uppercase tracking-[0.18em] mb-4">
                  <span>01</span>
                  <span className="w-8 h-px bg-gold" />
                </div>

                <h3 className="text-2xl md:text-3xl font-semibold text-black dark:text-cream">
                  Know the hive
                </h3>

                <p className="mt-4 text-sm md:text-base leading-relaxed text-gray dark:text-muted">
                  IoT monitoring captures environmental and colony signals,
                  helping beekeepers understand what is happening inside and
                  around the hive.
                </p>

              </div>

              <div className="md:pl-16">

                <div className="w-14 h-14 border border-gold/40 flex items-center justify-center text-gold mb-5">
                  <Activity size={23} strokeWidth={1.5} />
                </div>

                <span className="text-xs uppercase tracking-[0.16em] text-gray dark:text-muted">
                  Smart monitoring
                </span>

              </div>

            </div>


            {/* STEP 02 */}
            <div className="relative grid md:grid-cols-2 gap-8 md:gap-20 items-center mb-20 md:mb-28">

              <div className="md:order-2 md:pl-16">

                <div className="inline-flex items-center gap-2 text-gold text-xs uppercase tracking-[0.18em] mb-4">
                  <span>02</span>
                  <span className="w-8 h-px bg-gold" />
                </div>

                <h3 className="text-2xl md:text-3xl font-semibold text-black dark:text-cream">
                  Understand the data
                </h3>

                <p className="mt-4 text-sm md:text-base leading-relaxed text-gray dark:text-muted">
                  AI transforms hive data into actionable insights that can
                  support colony health, anomaly detection and productivity.
                </p>

              </div>

              <div className="md:order-1 md:text-right md:pr-16">

                <div className="inline-flex items-center justify-end gap-4">

                  <span className="text-xs uppercase tracking-[0.16em] text-gray dark:text-muted">
                    Intelligent insights
                  </span>

                  <div className="w-14 h-14 border border-gold/40 flex items-center justify-center text-gold">
                    <Cpu size={23} strokeWidth={1.5} />
                  </div>

                </div>

              </div>

            </div>


            {/* STEP 03 */}
            <div className="relative grid md:grid-cols-2 gap-8 md:gap-20 items-center mb-20 md:mb-28">

              <div className="md:text-right md:pr-16">

                <div className="inline-flex items-center gap-2 text-gold text-xs uppercase tracking-[0.18em] mb-4">
                  <span>03</span>
                  <span className="w-8 h-px bg-gold" />
                </div>

                <h3 className="text-2xl md:text-3xl font-semibold text-black dark:text-cream">
                  Trace the batch
                </h3>

                <p className="mt-4 text-sm md:text-base leading-relaxed text-gray dark:text-muted">
                  Blockchain-backed records connect the honey batch across
                  harvesting, processing and packaging stages.
                </p>

              </div>

              <div className="md:pl-16">

                <div className="w-14 h-14 border border-gold/40 flex items-center justify-center text-gold mb-5">
                  <Shield size={23} strokeWidth={1.5} />
                </div>

                <span className="text-xs uppercase tracking-[0.16em] text-gray dark:text-muted">
                  Immutable tracking
                </span>

              </div>

            </div>


            {/* STEP 04 */}
            <div className="relative grid md:grid-cols-2 gap-8 md:gap-20 items-center">

              <div className="md:order-2 md:pl-16">

                <div className="inline-flex items-center gap-2 text-gold text-xs uppercase tracking-[0.18em] mb-4">
                  <span>04</span>
                  <span className="w-8 h-px bg-gold" />
                </div>

                <h3 className="text-2xl md:text-3xl font-semibold text-black dark:text-cream">
                  Verify the jar
                </h3>

                <p className="mt-4 text-sm md:text-base leading-relaxed text-gray dark:text-muted">
                  A QR code gives consumers a simple gateway to relevant
                  information about the honey's recorded journey.
                </p>

              </div>

              <div className="md:order-1 md:text-right md:pr-16">

                <div className="inline-flex items-center justify-end gap-4">

                  <span className="text-xs uppercase tracking-[0.16em] text-gray dark:text-muted">
                    Consumer verification
                  </span>

                  <div className="w-14 h-14 border border-gold/40 flex items-center justify-center text-gold">
                    <QrCode size={23} strokeWidth={1.5} />
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          HONEY JOURNEY
      ===================================================== */}
      <section className="py-24 md:py-32">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-14 lg:gap-24 items-center">

            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-gold mb-5">
                The journey
              </p>

              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-black dark:text-cream leading-tight">
                Every batch has
                <br />
                <span className="text-gold">a story.</span>
              </h2>

              <p className="mt-6 text-base leading-relaxed text-gray dark:text-muted max-w-md">
                HoneyChain creates a connected digital journey across the
                stages that matter most to honey traceability.
              </p>
            </div>


            <div className="relative">

              <div className="absolute left-0 right-0 top-1/2 h-px bg-black/10 dark:bg-white/10 hidden sm:block" />

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 relative">

                {[
                  { icon: Sprout, label: 'Hive' },
                  { icon: Activity, label: 'Harvest' },
                  { icon: Shield, label: 'Test' },
                  { icon: Database, label: 'Process' },
                  { icon: PackageCheck, label: 'Package' },
                  { icon: QrCode, label: 'Consumer' },
                ].map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="flex flex-col items-center text-center"
                    >

                      <div className="w-12 h-12 bg-cream dark:bg-black border border-black/10 dark:border-white/10 flex items-center justify-center text-gold relative z-10">
                        <Icon size={19} strokeWidth={1.5} />
                      </div>

                      <span className="mt-4 text-xs uppercase tracking-[0.12em] text-gray dark:text-muted">
                        {item.label}
                      </span>

                    </div>
                  );
                })}

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          SHORT VISION
      ===================================================== */}
      <section className="py-24 md:py-32 border-y border-black/5 dark:border-white/5">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <p className="text-xs uppercase tracking-[0.22em] text-gold mb-6">
            Our vision
          </p>

          <h2 className="text-4xl md:text-6xl leading-[1.05] tracking-[-0.035em] font-semibold text-black dark:text-cream">
            A trusted honey ecosystem.
          </h2>

          <p className="mt-7 max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-gray dark:text-muted">
            Better intelligence for every beekeeper. Traceability for every
            batch. Better information for every consumer.
          </p>

          <Link
            to="/about"
            className="group inline-flex items-center gap-3 mt-9 text-sm font-semibold text-black dark:text-cream hover:text-gold transition-colors"
          >
            Learn about HoneyChain
            <ArrowUpRight
              size={16}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </Link>

        </div>
      </section>


      {/* =====================================================
          BOTTOM STRIP
      ===================================================== */}
      <section className="border-b border-black/5 dark:border-white/5">

        <div className="max-w-7xl mx-auto px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-xs text-gray dark:text-muted">
            Built for rural beekeepers · Ministry of MSME
          </p>

          <p className="text-xs tracking-[0.12em] text-gray dark:text-muted">
            Honey Chain · SIH26021
          </p>

        </div>

      </section>

    </div>
  );
}