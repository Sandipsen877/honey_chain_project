import {
  BookOpen,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

import { getId } from '../../services/dashboardApi';

/* ============================================================
   SHARED SECTION LABEL
   ============================================================ */

function SectionLabel({ children, accent = 'gold' }) {
  return (
    <div className="flex items-center gap-3 mb-5 sm:mb-6">
      <span
        className={`h-px flex-1 ${
          accent === 'orange'
            ? 'bg-orange-500/20'
            : 'bg-gold/20'
        }`}
      />

      <span
        className={`
          text-[9px] uppercase tracking-[0.2em]
          font-semibold whitespace-nowrap
          ${
            accent === 'orange'
              ? 'text-orange-500'
              : 'text-gold'
          }
        `}
      >
        {children}
      </span>

      <span
        className={`h-px flex-1 ${
          accent === 'orange'
            ? 'bg-orange-500/20'
            : 'bg-gold/20'
        }`}
      />
    </div>
  );
}

/* ============================================================
   TRAINING
   ============================================================ */

function TrainingSection() {
  const materials = [
    {
      number: '01',
      title: 'Intro to beekeeping basics.',
      description:
        'Introduction to hive management, bee colonies and seasonal care.',
      url: 'https://alison.com/course/beekeeping-101-introduction-to-beekeeping',
      tag: 'Fundamentals',
    },
    {
      number: '02',
      title: 'Honey Bee Health',
      description:
        'Practical approaches to monitoring colony health and early disease signs.',
      url: 'https://madhukranti.in/nbb/',
      tag: 'Health',
    },
    {
      number: '03',
      title: 'Sustainable Beekeeping',
      description:
        'Open educational resources for sustainable apiary practices and ecology.',
      url: 'https://www.madhumakhiwala.com/training-programme?srsltid=AfmBOoqQkNC7TdN20DzYEC-xGoEr25khAVM04fheRPsfFCl37UksptzL',
      tag: 'Sustainability',
    },
  ];

  return (
    <div className="w-full min-w-0">
      {/* Section heading */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
            05 / Training
          </span>
          <span className="h-px w-12 bg-gold/30" />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-black dark:text-cream">
          Learn the <span className="text-gold">craft.</span>
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray dark:text-muted">
          Curated resources for hive management, bee health and
          better honey production.
        </p>
      </div>

      <SectionLabel>Learning resources</SectionLabel>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
        {materials.map((item) => (
          <div
            key={item.number}
            className="
              group
              min-w-0
              border border-black/10 dark:border-white/10
              bg-cream-card dark:bg-black-card
              flex flex-col
              overflow-hidden
            "
          >
            <div className="p-5 sm:p-6 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center justify-between gap-4">
                <span className="text-3xl sm:text-4xl font-black text-gold/20 leading-none">
                  {item.number}
                </span>

                <span className="text-[9px] uppercase tracking-[0.16em] text-gold text-right">
                  {item.tag}
                </span>
              </div>
            </div>

            <div className="flex-1 p-5 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-black dark:text-cream">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray dark:text-muted">
                {item.description}
              </p>
            </div>

            <div className="p-5 sm:p-6 pt-0">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="
                  group/link
                  w-full
                  inline-flex items-center justify-center gap-2
                  border border-black/10 dark:border-white/10
                  px-4 py-2.5
                  text-xs font-medium
                  text-black dark:text-cream
                  hover:border-gold
                  hover:text-gold
                  transition-all duration-300
                "
              >
                Open resource

                <ExternalLink
                  size={13}
                  className="
                    group-hover/link:translate-x-0.5
                    group-hover/link:-translate-y-0.5
                    transition-transform
                  "
                />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 sm:mt-8 border border-gold/20 bg-gold/5 p-5 sm:p-6">
        <div className="flex items-start gap-4 max-w-3xl mx-auto">
          <div className="w-9 h-9 shrink-0 flex items-center justify-center border border-gold/30">
            <BookOpen
              size={17}
              strokeWidth={1.8}
              className="text-gold"
            />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-black dark:text-cream">
              Keep learning
            </h3>

            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-gray dark:text-muted">
              Use public educational repositories and documentation
              to deepen knowledge of beekeeping technology and
              supply-chain traceability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FRAUD ALERTS
   ============================================================ */

function FraudSection({ batches = [] }) {
  return (
    <div className="w-full min-w-0">
      {/* Section heading */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-orange-500 font-semibold">
            06 / Fraud Detection
          </span>
          <span className="h-px w-12 bg-orange-500/30" />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-black dark:text-cream">
          Authenticity <span className="text-orange-500">checks.</span>
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray dark:text-muted">
          Demo scan of honey batches for authenticity risk.
          Not connected to a live fraud model yet.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="border border-orange-500/30 bg-orange-500/5 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert
              size={20}
              strokeWidth={1.8}
              className="text-orange-500 shrink-0 mt-0.5"
            />

            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-black dark:text-cream">
                Demo mode
              </h3>

              <p className="mt-1 text-xs sm:text-sm leading-relaxed text-gray dark:text-muted">
                Results below are illustrative only. Production
                fraud detection is not wired to a real model in
                this build.
              </p>
            </div>
          </div>
        </div>
      </div>

      <SectionLabel accent="orange">
        Batch authenticity
      </SectionLabel>

      {batches.length === 0 ? (
        <div className="max-w-xl mx-auto border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-10 sm:p-12 text-center">
          <div className="w-11 h-11 mx-auto flex items-center justify-center border border-orange-500/30">
            <ShieldAlert
              size={22}
              className="text-orange-500/70"
            />
          </div>

          <h3 className="mt-4 text-sm font-semibold text-black dark:text-cream">
            No batches to inspect
          </h3>

          <p className="mt-2 text-xs sm:text-sm text-gray dark:text-muted">
            Create honey batches to display demo authenticity
            results.
          </p>
        </div>
      ) : (
        <div className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card overflow-hidden">
          {/* Desktop table header */}
          <div className="hidden md:grid grid-cols-[1.4fr_1fr_0.7fr_0.7fr_0.7fr_110px] gap-4 px-5 py-3 border-b border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
            <span className="text-[9px] uppercase tracking-[0.18em] text-muted">
              Batch
            </span>

            <span className="text-[9px] uppercase tracking-[0.18em] text-muted">
              Source
            </span>

            <span className="text-[9px] uppercase tracking-[0.18em] text-muted">
              Quantity
            </span>

            <span className="text-[9px] uppercase tracking-[0.18em] text-muted">
              Auth
            </span>

            <span className="text-[9px] uppercase tracking-[0.18em] text-muted">
              Chain
            </span>

            <span className="text-[9px] uppercase tracking-[0.18em] text-muted text-right">
              Risk
            </span>
          </div>

          {/* Scrollable batches */}
          <div className="max-h-[500px] overflow-y-auto overflow-x-hidden scrollbar-thin">
            {batches.map((batch, index) => {
              const demoRisk =
                index % 3 === 1 ? 'Medium' : 'Low';

              const riskStyle =
                demoRisk === 'Medium'
                  ? 'border-amber-500/40 text-amber-600 bg-amber-500/5'
                  : 'border-green-600/40 text-green-600 bg-green-600/5';

              return (
                <div
                  key={getId(batch)}
                  className="
                    grid grid-cols-1
                    md:grid-cols-[1.4fr_1fr_0.7fr_0.7fr_0.7fr_110px]
                    gap-3 md:gap-4
                    p-4 sm:p-5
                    border-b border-black/5 dark:border-white/10
                    last:border-b-0
                    hover:bg-black/[0.02]
                    dark:hover:bg-white/[0.02]
                    transition-colors
                  "
                >
                  <div className="min-w-0">
                    <div className="md:hidden text-[9px] uppercase tracking-[0.16em] text-gold mb-1">
                      Batch
                    </div>

                    <p className="text-sm font-semibold break-words">
                      {batch.batchCode || 'Unnamed batch'}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <div className="md:hidden text-[9px] uppercase tracking-[0.16em] text-muted mb-1">
                      Source
                    </div>

                    <p className="text-xs text-gray dark:text-muted break-words">
                      {batch.floralSourceClaimed ||
                        'Unknown floral source'}
                    </p>
                  </div>

                  <div>
                    <div className="md:hidden text-[9px] uppercase tracking-[0.16em] text-muted mb-1">
                      Quantity
                    </div>

                    <p className="text-xs font-medium">
                      {batch.quantityKg ?? '—'} kg
                    </p>
                  </div>

                  <div>
                    <div className="md:hidden text-[9px] uppercase tracking-[0.16em] text-muted mb-1">
                      Auth
                    </div>

                    <p className="text-xs font-medium text-gold">
                      Demo
                    </p>
                  </div>

                  <div>
                    <div className="md:hidden text-[9px] uppercase tracking-[0.16em] text-muted mb-1">
                      Chain
                    </div>

                    <p className="text-xs font-medium text-muted">
                      Pending
                    </p>
                  </div>

                  <div className="md:flex md:justify-end">
                    <span
                      className={`
                        inline-flex items-center
                        px-3 py-1.5
                        text-[10px] font-semibold
                        border
                        ${riskStyle}
                      `}
                    >
                      {demoRisk} risk
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <p className="text-[11px] sm:text-xs text-muted">
          Risk labels are generated for demo display only.
        </p>

        <p className="text-[9px] uppercase tracking-[0.22em] text-orange-500/70">
          Fraud layer · Demo
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   BLOCKCHAIN EXPLORER
   ============================================================ */

function BlockchainSection() {
  const journey = [
    {
      step: '01',
      title: 'Farm Origin',
      label: 'Source',
      detail:
        'Batch is linked to the registered farm and location where the honey was produced.',
      done: true,
    },
    {
      step: '02',
      title: 'Hive Collection',
      label: 'Harvest',
      detail:
        'Honey is associated with specific hive(s). Sensor and colony context can be attached.',
      done: true,
    },
    {
      step: '03',
      title: 'Batch Created',
      label: 'Identity',
      detail:
        'A unique batch code is generated. Quantity, floral source and harvest date are recorded.',
      done: true,
    },
    {
      step: '04',
      title: 'Lab Verification',
      label: 'Quality',
      detail:
        'Laboratory tests confirm purity and quality. Results become part of the batch passport.',
      done: false,
    },
    {
      step: '05',
      title: 'Digital Passport',
      label: 'QR Ready',
      detail:
        'QR code and digital passport are issued so anyone can scan and verify the full history.',
      done: false,
    },
    {
      step: '06',
      title: 'On-Chain Record',
      label: 'Immutable',
      detail:
        'Final traceability hash is written to the blockchain for permanent, tamper-resistant proof.',
      done: false,
    },
  ];

  return (
    <div className="w-full min-w-0">
      {/* Section heading */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
            07 / Blockchain Explorer
          </span>
          <span className="h-px w-12 bg-gold/30" />
        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-black dark:text-cream">
          One batch. <span className="text-gold">Full journey.</span>
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray dark:text-muted">
          Follow how a single honey batch moves through every
          stage of the HoneyChain — from farm to immutable record.
        </p>
      </div>

      {/* Batch status */}
      <div className="max-w-3xl mx-auto mb-9 sm:mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card">
          <div className="p-5 sm:p-6 sm:border-r border-black/10 dark:border-white/10">
            <p className="text-[9px] uppercase tracking-[0.2em] text-gold">
              Tracking batch
            </p>

            <p className="mt-1 text-base sm:text-lg font-semibold break-all">
              HC-BATCH-DEMO-001
            </p>

            <p className="mt-1 text-xs text-gray dark:text-muted">
              Example journey · demo data
            </p>
          </div>

          <div className="p-5 sm:p-6">
            <p className="text-[9px] uppercase tracking-[0.2em] text-muted">
              Progress
            </p>

            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1 h-1 bg-black/10 dark:bg-white/10">
                <div className="w-1/2 h-full bg-gold" />
              </div>

              <span className="text-xs font-semibold text-gold whitespace-nowrap">
                3 / 6
              </span>
            </div>
          </div>
        </div>
      </div>

      <SectionLabel>Traceability path</SectionLabel>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Base line */}
          <div className="absolute left-[17px] sm:left-[19px] md:left-[23px] top-4 bottom-4 w-px bg-black/10 dark:bg-white/10" />

          {/* Completed line */}
          <div className="absolute left-[17px] sm:left-[19px] md:left-[23px] top-4 h-[calc(50%-8px)] w-px bg-gold" />

          <div className="space-y-5 sm:space-y-6">
            {journey.map((item) => (
              <div
                key={item.step}
                className="
                  relative
                  grid
                  grid-cols-[36px_minmax(0,1fr)]
                  sm:grid-cols-[40px_minmax(0,1fr)]
                  md:grid-cols-[48px_minmax(0,1fr)]
                  gap-4 sm:gap-5 md:gap-7
                "
              >
                {/* Node */}
                <div className="relative z-10">
                  <div
                    className={`
                      w-9 h-9
                      sm:w-10 sm:h-10
                      md:w-12 md:h-12
                      flex items-center justify-center
                      border-2
                      text-[10px] sm:text-xs
                      font-bold
                      ${
                        item.done
                          ? 'bg-gold border-gold text-black'
                          : 'bg-cream dark:bg-black border-black/15 dark:border-white/15 text-muted'
                      }
                    `}
                  >
                    {item.done ? (
                      <CheckCircle2
                        size={16}
                        strokeWidth={2}
                      />
                    ) : (
                      item.step
                    )}
                  </div>
                </div>

                {/* Journey card */}
                <div
                  className={`
                    min-w-0
                    border
                    p-4 sm:p-5 md:p-6
                    ${
                      item.done
                        ? 'border-gold/30 bg-gold/5'
                        : 'border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card'
                    }
                  `}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-gold">
                      {item.label}
                    </span>

                    <span
                      className={`
                        text-[9px]
                        uppercase tracking-wider
                        px-2 py-1
                        border
                        ${
                          item.done
                            ? 'border-green-600/30 text-green-600'
                            : 'border-black/10 dark:border-white/10 text-muted'
                        }
                      `}
                    >
                      {item.done
                        ? 'Completed'
                        : 'Pending'}
                    </span>
                  </div>

                  <h3 className="mt-2 text-base sm:text-lg md:text-xl font-semibold text-black dark:text-cream">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray dark:text-muted">
                    {item.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="max-w-3xl mx-auto mt-8 sm:mt-10 border border-black/10 dark:border-white/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-muted leading-relaxed">
          Pending stages will light up as the batch progresses.
        </p>

        <div className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-gold shrink-0">
          <span className="w-5 h-px bg-gold/50" />
          Batch → Chain
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   EXPORTS
   ============================================================ */

export {
  TrainingSection,
  FraudSection,
  BlockchainSection,
};