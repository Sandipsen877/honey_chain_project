import {
  AlertCircle,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Hexagon,
  MapPin,
  Plus,
  Sprout,
  Tractor,
  TrendingUp,
} from 'lucide-react';

import {
  EmptyState,
  PageHeader,
  PrimaryButton,
  RiskBadge,
  SectionCard,
  StatCard,
  StatusBadge,
} from './DashboardUI';


/* ============================================================
   MAIN DASHBOARD HOME
   ============================================================ */

export default function DashboardHome({
  keeper,
  statistics,
  farms,
  hives,
  alerts,
  risks,
  yieldEstimate,
  onOpenSection,
  onResolveAlert,
  actionLoading,
}) {
  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">

      {/* ======================================================
          PAGE HEADER
      ======================================================= */}

      <PageHeader
        eyebrow="HoneyChain / Overview"
        title={`Welcome, ${keeper?.name || 'Keeper'}`}
        description="Monitor your apiaries, hives, honey production, alerts, and predictive insights from one place."
        action={
          farms.length === 0 ? (
            <PrimaryButton
              onClick={() => onOpenSection('farms')}
              icon={Plus}
            >
              Create Farm
            </PrimaryButton>
          ) : null
        }
      />


      {/* ======================================================
          STATISTICS
      ======================================================= */}

      <section className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5 sm:gap-3">

          <StatCard
            label="Total Farms"
            value={statistics.totalFarms}
            icon={Tractor}
          />

          <StatCard
            label="Total Hives"
            value={statistics.totalHives}
            icon={Hexagon}
          />

          <StatCard
            label="Honey Batches"
            value={statistics.totalBatches}
            icon={Boxes}
          />

          <StatCard
            label="Yield Estimate"
            value={formatYield(yieldEstimate)}
            icon={TrendingUp}
          />

          <StatCard
            label="Total Alerts"
            value={statistics.totalAlerts}
            icon={AlertCircle}
            danger={statistics.totalAlerts > 0}
          />

        </div>
      </section>


      {/* ======================================================
          RESOLVED ALERT SUMMARY
      ======================================================= */}

      <SectionCard className="relative overflow-hidden">

        <div className="absolute top-0 left-0 right-0 h-px bg-gold/50" />

        <div className="p-4 sm:p-5 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3 sm:gap-4 min-w-0">

            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center border border-green-600/20 bg-green-600/5">
              <CheckCircle2
                size={18}
                className="text-green-600"
              />
            </div>

            <div className="min-w-0">

              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.16em] text-gray dark:text-muted">
                Resolved Alerts
              </p>

              <p className="mt-1 text-lg sm:text-xl font-semibold">
                {statistics.resolvedAlerts}
              </p>

            </div>

          </div>

          <div className="hidden sm:block shrink-0 text-[9px] uppercase tracking-[0.18em] text-gray dark:text-muted">
            System Status
          </div>

        </div>

      </SectionCard>


      {/* ======================================================
          NO FARMS
      ======================================================= */}

      {farms.length === 0 && (
        <SectionCard className="overflow-hidden">

          <div className="p-6 sm:p-8 md:p-12 text-center">

            <div className="mx-auto w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border border-gold/30 bg-gold/5">
              <Sprout
                size={22}
                className="text-gold"
              />
            </div>

            <p className="mt-5 sm:mt-6 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gold">
              Get Started
            </p>

            <h2 className="mt-2 text-lg sm:text-xl md:text-2xl font-semibold">
              No farms registered yet
            </h2>

            <p className="mt-3 max-w-lg mx-auto text-xs sm:text-sm leading-6 text-gray dark:text-muted">
              Create your first farm to start managing hives, monitoring
              conditions, estimating yield, and receiving alerts.
            </p>

            <div className="mt-5 sm:mt-6 flex justify-center">
              <PrimaryButton
                onClick={() => onOpenSection('farms')}
                icon={Plus}
              >
                Create Your First Farm
              </PrimaryButton>
            </div>

          </div>

        </SectionCard>
      )}


      {/* ======================================================
          FARM + HIVE OVERVIEW
      ======================================================= */}

      {farms.length > 0 && (
        <section className="w-full min-w-0">

          {/* Section heading */}

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-3 sm:mb-4">

            <div>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gold">
                Operations
              </p>

              <h2 className="mt-1 text-lg sm:text-xl font-semibold">
                Apiary Overview
              </h2>
            </div>

            <div className="text-[9px] uppercase tracking-[0.15em] text-gray dark:text-muted">
              Live Monitoring
            </div>

          </div>


          {/* Symmetric responsive layout */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">


            {/* ==================================================
                FARM OVERVIEW
            ================================================== */}

            <SectionCard className="overflow-hidden min-w-0">

              <DashboardSectionHeader
                eyebrow="01 / Apiaries"
                title="Your Farms"
                onClick={() => onOpenSection('farms')}
              />

              <div className="max-h-[240px] sm:max-h-[280px] overflow-y-auto overflow-x-hidden scrollbar-thin divide-y divide-black/5 dark:divide-white/10">

                {farms.map((farm) => (
                  <FarmOverviewItem
                    key={getId(farm)}
                    farm={farm}
                    hives={hives}
                  />
                ))}

              </div>

            </SectionCard>


            {/* ==================================================
                HIVE RISK OVERVIEW
            ================================================== */}

            <SectionCard className="overflow-hidden min-w-0">

              <DashboardSectionHeader
                eyebrow="02 / Hive Health"
                title="Disease Risk"
                onClick={() => onOpenSection('hives')}
              />

              {hives.length === 0 ? (

                <EmptyState
                  icon={Hexagon}
                  title="No hives yet"
                  text="Create a hive inside one of your farms to start monitoring hive health."
                  action={
                    <PrimaryButton
                      onClick={() => onOpenSection('hives')}
                    >
                      Manage Hives
                    </PrimaryButton>
                  }
                />

              ) : (

                <div className="max-h-[240px] sm:max-h-[280px] overflow-y-auto overflow-x-hidden scrollbar-thin divide-y divide-black/5 dark:divide-white/10">

                  {hives.map((hive) => (
                    <HiveRiskItem
                      key={getId(hive)}
                      hive={hive}
                      risk={risks[getId(hive)]}
                    />
                  ))}

                </div>

              )}

            </SectionCard>

          </div>

        </section>
      )}


      {/* ======================================================
          ACTIVE ALERTS
      ======================================================= */}

      <SectionCard className="overflow-hidden min-w-0">

        <div className="p-4 sm:p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between gap-3">

          <div className="flex items-center gap-3 sm:gap-4 min-w-0">

            <div className="w-9 h-9 shrink-0 flex items-center justify-center border border-red-500/20 bg-red-500/5">
              <AlertCircle
                size={17}
                className="text-red-500"
              />
            </div>

            <div className="min-w-0">

              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-red-500">
                Attention Required
              </p>

              <h2 className="mt-1 text-base sm:text-lg font-semibold">
                Active Alerts
              </h2>

            </div>

          </div>

          <button
            onClick={() => onOpenSection('history')}
            className="group shrink-0 inline-flex items-center gap-1 text-[10px] sm:text-xs text-gray dark:text-muted hover:text-gold transition-colors"
          >
            <span className="hidden xs:inline">
              Alert history
            </span>

            <span className="xs:hidden">
              History
            </span>

            <ChevronRight
              size={13}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </button>

        </div>


        {alerts.length === 0 ? (

          <EmptyState
            icon={CheckCircle2}
            title="No active alerts"
            text="Your monitored farms currently have no open alerts."
          />

        ) : (

          <div className="max-h-[280px] sm:max-h-[320px] overflow-y-auto overflow-x-hidden scrollbar-thin divide-y divide-black/5 dark:divide-white/10">

            {alerts.map((alert) => (
              <AlertItem
                key={getId(alert)}
                alert={alert}
                onResolve={onResolveAlert}
                actionLoading={actionLoading}
              />
            ))}

          </div>

        )}

      </SectionCard>


      {/* ======================================================
          QUICK ACTIONS
      ======================================================= */}

      <section className="w-full">

        <div className="mb-3 sm:mb-4">

          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gold">
            Workspace
          </p>

          <h2 className="mt-1 text-lg sm:text-xl font-semibold">
            Quick Actions
          </h2>

        </div>


        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">

          <QuickAction
            number="01"
            icon={Tractor}
            title="Manage Farms"
            text="Create or update farms"
            onClick={() => onOpenSection('farms')}
          />

          <QuickAction
            number="02"
            icon={Hexagon}
            title="Manage Hives"
            text="View and create hives"
            onClick={() => onOpenSection('hives')}
          />

          <QuickAction
            number="03"
            icon={Boxes}
            title="Honey Batches"
            text="Track harvested honey"
            onClick={() => onOpenSection('batches')}
          />

          <QuickAction
            number="04"
            icon={QrCodeIcon}
            title="Digital Passport"
            text="Lab reports and QR"
            onClick={() => onOpenSection('passport')}
          />

        </div>

      </section>

    </div>
  );
}


/* ============================================================
   DASHBOARD SECTION HEADER
   ============================================================ */

function DashboardSectionHeader({
  eyebrow,
  title,
  onClick,
}) {
  return (
    <div className="p-4 sm:p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between gap-3">

      <div className="min-w-0">

        <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-gold">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-base sm:text-lg font-semibold truncate">
          {title}
        </h2>

      </div>

      <button
        onClick={onClick}
        className="group shrink-0 inline-flex items-center gap-1 text-[10px] sm:text-xs text-gray dark:text-muted hover:text-gold transition-colors"
      >
        View all

        <ChevronRight
          size={13}
          className="group-hover:translate-x-0.5 transition-transform"
        />
      </button>

    </div>
  );
}


/* ============================================================
   FARM OVERVIEW ITEM
   ============================================================ */

function FarmOverviewItem({
  farm,
  hives,
}) {
  const farmId = getId(farm);

  const farmHives = hives.filter(
    (hive) =>
      getId(hive?.farm) === farmId ||
      hive?.farm === farmId
  );

  return (
    <div className="p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">

      <div className="min-w-0 flex items-center gap-3 sm:gap-4">

        <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center border border-gold/20 bg-gold/5">
          <Tractor
            size={15}
            className="text-gold"
          />
        </div>

        <div className="min-w-0">

          <p className="text-sm font-medium truncate">
            {farm?.name ||
              farm?.farmCode ||
              'Unnamed Farm'}
          </p>

          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] sm:text-xs text-gray dark:text-muted min-w-0">

            <MapPin
              size={11}
              className="shrink-0"
            />

            <span className="truncate">
              {getFarmLocation(farm)}
            </span>

          </div>

        </div>

      </div>


      <div className="shrink-0 min-w-[48px] sm:min-w-[55px] text-center border-l border-black/10 dark:border-white/10 pl-3 sm:pl-4">

        <p className="text-base sm:text-lg font-semibold">
          {farmHives.length}
        </p>

        <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.12em] text-gray dark:text-muted">
          Hives
        </p>

      </div>

    </div>
  );
}


/* ============================================================
   HIVE RISK ITEM
   ============================================================ */

function HiveRiskItem({
  hive,
  risk,
}) {
  return (
    <div className="p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">

      <div className="min-w-0 flex items-center gap-3 sm:gap-4">

        <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center border border-gold/20 bg-gold/5">
          <Hexagon
            size={15}
            className="text-gold"
          />
        </div>

        <div className="min-w-0">

          <p className="text-sm font-medium truncate">
            {hive?.hiveCode ||
              hive?.name ||
              `Hive ${getId(hive)}`}
          </p>

          <p className="mt-1.5 text-[11px] sm:text-xs text-gray dark:text-muted truncate">
            {getHiveFarmName(hive)}
          </p>

        </div>

      </div>


      <div className="shrink-0">
        <RiskBadge risk={risk} />
      </div>

    </div>
  );
}


/* ============================================================
   ALERT ITEM
   ============================================================ */

function AlertItem({
  alert,
  onResolve,
  actionLoading,
}) {
  const status =
    alert?.status ||
    'open';

  const title =
    alert?.title ||
    alert?.type ||
    alert?.alertType ||
    'Hive Alert';

  const message =
    alert?.message ||
    alert?.description ||
    alert?.details ||
    'An alert requires attention.';

  return (
    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">

      <div className="w-9 h-9 shrink-0 flex items-center justify-center border border-red-500/20 bg-red-500/5">
        <AlertCircle
          size={17}
          className="text-red-500"
        />
      </div>


      <div className="flex-1 min-w-0">

        <div className="flex flex-wrap items-center gap-2">

          <p className="text-sm font-medium break-words">
            {title}
          </p>

          <StatusBadge
            status={status}
          />

        </div>


        <p className="mt-1 text-xs sm:text-sm leading-5 text-gray dark:text-muted break-words">
          {message}
        </p>


        <p className="mt-1.5 text-[9px] sm:text-[10px] text-gray dark:text-muted">
          {getAlertTarget(alert)}
        </p>

      </div>


      <button
        onClick={() =>
          onResolve(getId(alert))
        }
        disabled={
          actionLoading ||
          !getId(alert)
        }
        className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 border border-black/10 dark:border-white/10 text-xs font-medium hover:border-gold hover:text-gold disabled:opacity-50 transition-colors"
      >
        <CheckCircle2
          size={14}
        />

        Resolve
      </button>

    </div>
  );
}


/* ============================================================
   QUICK ACTION
   ============================================================ */

function QuickAction({
  number,
  icon: Icon,
  title,
  text,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full min-w-0 text-left bg-cream-card dark:bg-black-card border border-black/10 dark:border-white/10 p-4 sm:p-5 overflow-hidden hover:border-gold transition-all duration-300"
    >

      {/* Gold hover rail */}

      <div className="absolute top-0 left-0 w-full h-px bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />


      <div className="flex items-start justify-between gap-3">

        <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center border border-gold/20 bg-gold/5">
          <Icon
            size={17}
            className="text-gold"
          />
        </div>

        <span className="text-[8px] sm:text-[9px] font-medium tracking-[0.15em] text-gray dark:text-muted">
          {number}
        </span>

      </div>


      <div className="mt-5 sm:mt-6 flex items-end justify-between gap-3">

        <div className="min-w-0">

          <p className="text-sm font-semibold truncate">
            {title}
          </p>

          <p className="mt-1 text-[11px] sm:text-xs leading-5 text-gray dark:text-muted">
            {text}
          </p>

        </div>

        <ChevronRight
          size={15}
          className="shrink-0 text-gray dark:text-muted group-hover:text-gold group-hover:translate-x-1 transition-all duration-300"
        />

      </div>

    </button>
  );
}


/* ============================================================
   HELPERS
   ============================================================ */

function getId(item) {
  return (
    item?._id ||
    item?.id
  );
}


function formatYield(value) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '—';
  }

  if (typeof value === 'number') {
    return `${value} kg`;
  }

  if (typeof value === 'string') {
    return value.includes('kg')
      ? value
      : `${value} kg`;
  }

  if (typeof value === 'object') {

    const number =
      value.estimatedYieldKg ??
      value.estimatedYield ??
      value.yieldEstimate ??
      value.predictedYield ??
      value.yield ??
      value.value ??
      value.amount ??
      value.kg ??
      value.quantity;

    if (
      number !== undefined &&
      number !== null &&
      number !== ''
    ) {
      return `${number} kg`;
    }

    return '—';
  }

  return `${value} kg`;
}


function getFarmLocation(farm) {
  const location =
    farm?.location;

  if (!location) {
    return 'Location not provided';
  }

  if (
    typeof location ===
    'string'
  ) {
    return location;
  }

  const parts = [
    location.area,
    location.state,
  ].filter(Boolean);

  if (parts.length) {
    return parts.join(', ');
  }

  if (
    location.lat !==
      undefined &&
    location.lng !==
      undefined
  ) {
    return `${location.lat}, ${location.lng}`;
  }

  return 'Location not provided';
}


function getHiveFarmName(hive) {
  const farm =
    hive?.farm;

  if (!farm) {
    return 'Farm not assigned';
  }

  if (
    typeof farm ===
    'string'
  ) {
    return `Farm: ${farm}`;
  }

  return (
    farm?.name ||
    farm?.farmCode ||
    'Farm assigned'
  );
}


function getAlertTarget(alert) {
  if (alert?.hive) {

    const hive =
      alert.hive;

    if (
      typeof hive ===
      'object'
    ) {
      return `Hive: ${
        hive?.hiveCode ||
        hive?.name ||
        getId(hive)
      }`;
    }

    return `Hive: ${hive}`;
  }

  if (alert?.farm) {

    const farm =
      alert.farm;

    if (
      typeof farm ===
      'object'
    ) {
      return `Farm: ${
        farm?.name ||
        farm?.farmCode ||
        getId(farm)
      }`;
    }

    return `Farm: ${farm}`;
  }

  return 'HoneyChain monitoring system';
}


/* ============================================================
   QR ICON WRAPPER
   ============================================================ */

function QrCodeIcon(props) {
  return (
    <span
      className="inline-flex"
      {...props}
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          x="3"
          y="3"
          width="6"
          height="6"
        />

        <rect
          x="15"
          y="3"
          width="6"
          height="6"
        />

        <rect
          x="3"
          y="15"
          width="6"
          height="6"
        />

        <path d="M15 15h3v3h-3z" />
        <path d="M21 15v6" />
        <path d="M15 21h3" />
        <path d="M12 3v3" />
        <path d="M12 9v3" />
        <path d="M9 12h3" />
        <path d="M15 12h6" />
      </svg>
    </span>
  );
}