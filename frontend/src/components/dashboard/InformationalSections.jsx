import {
  BookOpen,
  Boxes,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

import {
  PageHeader,
  EmptyState,
} from './DashboardUI';

import { getId } from '../../services/dashboardApi';

/* ============================================================
   TRAINING — Redesigned
   ============================================================ */

function TrainingSection() {
  const materials = [
    {
      number: '01',
      title: 'Beekeeping Basics',
      description:
        'Introduction to hive management, bee colonies and seasonal care.',
      url: 'https://www.fao.org',
      tag: 'Fundamentals',
    },
    {
      number: '02',
      title: 'Honey Bee Health',
      description:
        'Practical approaches to monitoring colony health and early disease signs.',
      url: 'https://www.usda.gov',
      tag: 'Health',
    },
    {
      number: '03',
      title: 'Sustainable Beekeeping',
      description:
        'Open educational resources for sustainable apiary practices and ecology.',
      url: 'https://www.open.edu',
      tag: 'Sustainability',
    },
  ];

  return (
    <div className="relative overflow-hidden">

      {/* Giant number */}
      <div className="pointer-events-none absolute -top-4 -left-2 text-[120px] md:text-[180px] font-black text-gold/10 dark:text-gold/5 leading-none select-none">
        05
      </div>

      {/* Header */}
      <div className="relative mb-14 md:mb-20 max-w-xl">
        <p className="text-[10px] uppercase tracking-[0.28em] text-gold font-semibold mb-4">
          05 / Training
        </p>

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[0.95] text-black dark:text-cream">
          Learn the
          <br />
          <span className="text-gold">craft.</span>
        </h1>

        <p className="mt-5 text-sm md:text-base leading-relaxed text-gray dark:text-muted max-w-md">
          Curated resources for hive management, bee health
          and better honey production.
        </p>
      </div>

      {/* Asymmetric resource list */}
      <div className="relative space-y-5 md:space-y-6">
        {materials.map((item, index) => (
          <div
            key={item.number}
            className={`
              border border-black/10 dark:border-white/10
              bg-cream-card dark:bg-black-card
              p-6 md:p-8
              grid md:grid-cols-[80px_1fr_auto] gap-5 md:gap-8 items-start
              ${index === 1 ? 'md:ml-8 lg:ml-16' : ''}
              ${index === 2 ? 'md:mr-8 lg:mr-12' : ''}
            `}
          >
            <span className="text-3xl md:text-4xl font-black text-gold/25 leading-none">
              {item.number}
            </span>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-[0.18em] text-gold">
                  {item.tag}
                </span>
              </div>

              <h3 className="text-lg md:text-xl font-semibold text-black dark:text-cream">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-gray dark:text-muted max-w-lg">
                {item.description}
              </p>
            </div>

            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-medium text-gold hover:text-gold-dark transition-colors self-start md:self-center shrink-0"
            >
              Open resource
              <ExternalLink size={13} />
            </a>
          </div>
        ))}
      </div>

      {/* Bottom note */}
      <div className="mt-12 md:mt-16 border border-black/10 dark:border-white/10 p-6 md:p-8 flex gap-4 max-w-2xl">
        <BookOpen size={22} className="text-gold shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-black dark:text-cream">
            Keep learning
          </h3>
          <p className="mt-2 text-sm text-gray dark:text-muted leading-relaxed">
            Use public educational repositories and documentation
            to deepen knowledge of beekeeping technology and
            supply-chain traceability.
          </p>
        </div>
      </div>

    </div>
  );
}


/* ============================================================
   FRAUD ALERTS — Redesigned
   ============================================================ */

function FraudSection({ batches }) {
  return (
    <div className="relative overflow-hidden">

      {/* Giant number */}
      <div className="pointer-events-none absolute -top-4 -left-2 text-[120px] md:text-[180px] font-black text-orange/10 dark:text-orange/5 leading-none select-none">
        06
      </div>

      {/* Header */}
      <div className="relative mb-12 md:mb-16 max-w-xl">
        <p className="text-[10px] uppercase tracking-[0.28em] text-orange font-semibold mb-4">
          06 / Fraud Detection
        </p>

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[0.95] text-black dark:text-cream">
          Authenticity
          <br />
          <span className="text-orange">checks.</span>
        </h1>

        <p className="mt-5 text-sm md:text-base leading-relaxed text-gray dark:text-muted max-w-md">
          Demo scan of honey batches for authenticity risk.
          Not connected to a live fraud model yet.
        </p>
      </div>

      {/* Warning banner — offset */}
      <div className="relative mb-10 md:mb-14 md:ml-[6%] max-w-2xl border border-orange-500/30 bg-orange-500/5 p-5 md:p-6">
        <div className="flex gap-3">
          <ShieldAlert
            size={22}
            className="text-orange-500 shrink-0 mt-0.5"
          />
          <div>
            <h3 className="font-semibold text-black dark:text-cream">
              Demo mode
            </h3>
            <p className="mt-1 text-sm text-gray dark:text-muted leading-relaxed">
              Results below are illustrative only. Production
              fraud detection is not wired to a real model in
              this build.
            </p>
          </div>
        </div>
      </div>

      {/* Batch list */}
      {batches.length === 0 ? (
        <div className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-12 text-center max-w-lg">
          <ShieldAlert size={28} className="mx-auto text-orange-500/70" />
          <h3 className="mt-4 font-semibold">No batches to inspect</h3>
          <p className="mt-2 text-sm text-gray dark:text-muted">
            Create honey batches to display demo authenticity results.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {batches.map((batch, index) => {
            const demoRisk =
              index % 3 === 0
                ? 'Low'
                : index % 3 === 1
                  ? 'Medium'
                  : 'Low';

            const riskStyle =
              demoRisk === 'Medium'
                ? 'border-amber-500/40 text-amber-600 bg-amber-500/5'
                : 'border-green-600/40 text-green-600 bg-green-600/5';

            return (
              <div
                key={getId(batch)}
                className={`
                  border border-black/10 dark:border-white/10
                  bg-cream-card dark:bg-black-card
                  p-5 md:p-6
                  grid md:grid-cols-[1fr_auto] gap-5 items-center
                  ${index % 2 === 1 ? 'md:ml-6 lg:ml-10' : ''}
                `}
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-gold">
                      Batch
                    </span>
                    <span className="text-xs text-muted">
                      #{index + 1}
                    </span>
                  </div>

                  <h3 className="text-base md:text-lg font-semibold text-black dark:text-cream">
                    {batch.batchCode || 'Unnamed batch'}
                  </h3>

                  <p className="mt-1 text-xs text-gray dark:text-muted">
                    {batch.floralSourceClaimed || 'Unknown floral source'}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray dark:text-muted">
                    <span>
                      Qty:{' '}
                      <span className="text-black dark:text-cream font-medium">
                        {batch.quantityKg ?? '—'} kg
                      </span>
                    </span>
                    <span>
                      Auth:{' '}
                      <span className="text-black dark:text-cream font-medium">
                        Demo
                      </span>
                    </span>
                    <span>
                      Chain:{' '}
                      <span className="text-black dark:text-cream font-medium">
                        Pending
                      </span>
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <span
                    className={`inline-flex items-center px-3 py-2 text-xs font-semibold border ${riskStyle}`}
                  >
                    {demoRisk} risk
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 md:mt-16 border-t border-black/10 dark:border-white/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-muted max-w-sm">
          Risk labels are generated for demo display only
          and do not reflect a trained detection pipeline.
        </p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-orange/70 shrink-0">
          Fraud layer · Demo
        </p>
      </div>

    </div>
  );
}


/* ============================================================
   BLOCKCHAIN EXPLORER — Batch Journey Timeline
   ============================================================ */

function BlockchainSection() {
  const journey = [
    {
      step: '01',
      title: 'Farm Origin',
      label: 'Source',
      detail: 'Batch is linked to the registered farm and location where the honey was produced.',
      icon: 'farm',
      done: true,
    },
    {
      step: '02',
      title: 'Hive Collection',
      label: 'Harvest',
      detail: 'Honey is associated with specific hive(s). Sensor and colony context can be attached.',
      icon: 'hive',
      done: true,
    },
    {
      step: '03',
      title: 'Batch Created',
      label: 'Identity',
      detail: 'A unique batch code is generated. Quantity, floral source and harvest date are recorded.',
      icon: 'batch',
      done: true,
    },
    {
      step: '04',
      title: 'Lab Verification',
      label: 'Quality',
      detail: 'Laboratory tests confirm purity and quality. Results become part of the batch passport.',
      icon: 'lab',
      done: false,
    },
    {
      step: '05',
      title: 'Digital Passport',
      label: 'QR Ready',
      detail: 'QR code and digital passport are issued so anyone can scan and verify the full history.',
      icon: 'qr',
      done: false,
    },
    {
      step: '06',
      title: 'On-Chain Record',
      label: 'Immutable',
      detail: 'Final traceability hash is written to the blockchain for permanent, tamper-resistant proof.',
      icon: 'chain',
      done: false,
    },
  ];

  return (
    <div>

      {/* Header */}
      <div className="mb-14 md:mb-20">
        <p className="text-[10px] uppercase tracking-[0.28em] text-gold font-semibold mb-4">
          07 / Blockchain Explorer
        </p>

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[0.95] text-black dark:text-cream max-w-2xl">
          One batch.
          <br />
          <span className="text-gold">Full journey.</span>
        </h1>

        <p className="mt-5 text-sm md:text-base text-gray dark:text-muted max-w-lg leading-relaxed">
          Follow how a single honey batch moves through every
          stage of the HoneyChain — from farm to immutable record.
        </p>
      </div>

      {/* Sample batch strip */}
      <div className="mb-12 md:mb-16 border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-5 md:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
            Tracking batch
          </p>
          <p className="mt-1 text-lg font-semibold">
            HC-BATCH-DEMO-001
          </p>
          <p className="mt-1 text-xs text-gray dark:text-muted">
            Example journey · demo data
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted">
            Progress
          </p>
          <p className="mt-1 text-sm font-medium text-gold">
            3 of 6 stages complete
          </p>
        </div>
      </div>

      {/* Vertical timeline */}
      <div className="relative max-w-3xl mx-auto">

        {/* Continuous path */}
        <div className="absolute left-[19px] md:left-[23px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-gold via-gold/50 to-black/10 dark:to-white/10" />

        <div className="space-y-0">
          {journey.map((item, index) => {
            const isLast = index === journey.length - 1;

            return (
              <div
                key={item.step}
                className={`relative flex gap-5 md:gap-8 ${
                  isLast ? 'pb-2' : 'pb-10 md:pb-12'
                }`}
              >
                {/* Node */}
                <div className="relative z-10 shrink-0">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 text-xs font-bold ${
                      item.done
                        ? 'bg-gold border-gold text-black'
                        : 'bg-cream dark:bg-black border-black/20 dark:border-white/20 text-gray dark:text-muted'
                    }`}
                  >
                    {item.done ? '✓' : item.step}
                  </div>
                </div>

                {/* Content card */}
                <div
                  className={`flex-1 border p-5 md:p-6 ${
                    item.done
                      ? 'border-gold/40 bg-gold/5'
                      : 'border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-gold">
                      {item.label}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 border ${
                        item.done
                          ? 'border-green-600/40 text-green-600'
                          : 'border-black/15 dark:border-white/15 text-muted'
                      }`}
                    >
                      {item.done ? 'Completed' : 'Pending'}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold text-black dark:text-cream">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray dark:text-muted">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* End note */}
      <div className="mt-12 md:mt-16 max-w-3xl mx-auto border-t border-black/10 dark:border-white/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-muted">
          Stages marked Pending are part of the full
          traceability path and will light up as the batch
          progresses.
        </p>
        <p className="text-[10px] uppercase tracking-[0.22em] text-gold/70 shrink-0">
          Batch → Chain
        </p>
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