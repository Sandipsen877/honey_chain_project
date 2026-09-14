import { useEffect, useState } from 'react';
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
   X,
  Image as ImageIcon,
  ExternalLink,
} from 'lucide-react';

import {
  EmptyState,
  PageHeader,
  PrimaryButton,
  SectionCard,
  StatCard,
  StatusBadge,
} from './DashboardUI';

import { getId } from '../../services/dashboardApi';

/* ============================================================
   MAIN DASHBOARD HOME
   ============================================================ */

export default function DashboardHome({
  keeper,
  statistics,
  farms,
  hives,
  alerts,            // open varroa + open health_ml
  varroaAlerts = [], // only open varroa (for Disease Risk)
  risks,
  yieldEstimate,
  onOpenSection,
  onResolveAlert,
  onVarroaClick,
  actionLoading,
}) {
   const [selectedVarroaAlert, setSelectedVarroaAlert] = useState(null);

  useEffect(() => {
    if (!selectedVarroaAlert) return;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedVarroaAlert(null);
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedVarroaAlert]);

  const handleVarroaClick = (alert) => {
    if (!alert) return;

    setSelectedVarroaAlert(alert);

    if (onVarroaClick) {
      onVarroaClick(alert);
    }
  };
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
                DISEASE RISK — ONLY OPEN VARROA ALERTS
            ================================================== */}

            <SectionCard className="overflow-hidden min-w-0">

              <DashboardSectionHeader
                eyebrow="02 / Hive Health"
                title="Disease Risk"
                onClick={() => onOpenSection('hives')}
              />

              {varroaAlerts.length === 0 ? (

                <EmptyState
                  icon={Hexagon}
                  title="No Varroa alerts"
                  text="No open Varroa detections at the moment. All clear."
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

                  {varroaAlerts.map((alert) => (
                      <VarroaRiskItem
                        key={getId(alert)}
                        alert={alert}
                        hives={hives}
                        farms={farms}
                        onClick={() => handleVarroaClick(alert)}
                      />
                    ))}

                </div>

              )}

            </SectionCard>

          </div>

        </section>
      )}

      {/* ======================================================
          ACTIVE ALERTS (open varroa + open health_ml)
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
            text="Your monitored farms currently have no open Varroa or health alerts."
          />

        ) : (

          <div className="max-h-[280px] sm:max-h-[320px] overflow-y-auto overflow-x-hidden scrollbar-thin divide-y divide-black/5 dark:divide-white/10">
              {alerts.map((alert) => (
                <AlertItem
                  key={getId(alert)}
                  alert={alert}
                  hives={hives}
                  farms={farms}
                  onResolve={onResolveAlert}
                  actionLoading={actionLoading}
                  onVarroaClick={handleVarroaClick}
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

      {selectedVarroaAlert && (
  <VarroaImageModal
    alert={selectedVarroaAlert}
    hives={hives}
    farms={farms}
    onClose={() => setSelectedVarroaAlert(null)}
  />
)}

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
   VARROA RISK ITEM (Disease Risk section)
   ============================================================ */
function VarroaRiskItem({
  alert,
  hives = [],
  farms = [],
  onClick,
}) {
  const imageUrl = alert?.imageUrl;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!imageUrl}
      className={`w-full text-left p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 transition-colors ${
        imageUrl
          ? 'cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.03]'
          : 'cursor-default'
      }`}
    >
      <div className="min-w-0 flex items-center gap-3 sm:gap-4">
        <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center border border-red-500/30 bg-red-500/5">
          <AlertCircle
            size={15}
            className="text-red-500"
          />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {alert?.message || 'Varroa detected'}
          </p>

          <p className="mt-1.5 text-[11px] sm:text-xs text-gray dark:text-muted truncate">
            {getAlertTarget(alert, hives, farms)}
          </p>

          {imageUrl && (
            <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-gold">
              View detected image
            </p>
          )}
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        {imageUrl && (
          <ImageIcon
            size={14}
            className="text-gold"
          />
        )}

        <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider border border-red-500/40 text-red-500 bg-red-500/5">
          Varroa
        </span>
      </div>
    </button>
  );
}

/* ============================================================
   ALERT ITEM (Active Alerts)
   ============================================================ */

function AlertItem({
  alert,
  hives = [],
  farms = [],
  onResolve,
  onVarroaClick,
  actionLoading,
}) {
  const status = alert?.status || 'open';
  const isVarroa = String(alert?.type || '').toLowerCase() === 'varroa';
const hasDetectionImage = Boolean(alert?.imageUrl);

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
    <div
  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 ${
    isVarroa && hasDetectionImage
      ? 'cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.03]'
      : ''
  }`}
  onClick={
    isVarroa && hasDetectionImage
      ? () => onVarroaClick?.(alert)
      : undefined
  }
  role={
    isVarroa && hasDetectionImage
      ? 'button'
      : undefined
  }
  tabIndex={
    isVarroa && hasDetectionImage
      ? 0
      : undefined
  }
  onKeyDown={
    isVarroa && hasDetectionImage
      ? (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onVarroaClick?.(alert);
          }
        }
      : undefined
  }
>
      <div className="w-9 h-9 shrink-0 flex items-center justify-center border border-red-500/20 bg-red-500/5">
        <AlertCircle size={17} className="text-red-500" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium break-words">{title}</p>
          <StatusBadge status={status} />
        </div>

        <p className="mt-1 text-xs sm:text-sm leading-5 text-gray dark:text-muted break-words">
          {message}
        </p>

        <p className="mt-1.5 text-[9px] sm:text-[10px] text-gray dark:text-muted">
          {getAlertTarget(alert, hives, farms)}
        </p>
      </div>

      <button
  onClick={(event) => {
    event.stopPropagation();
    onResolve(getId(alert));
  }}
  disabled={actionLoading || !getId(alert)}
  className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-3.5 py-2.5 border border-black/10 dark:border-white/10 text-xs font-medium hover:border-gold hover:text-gold disabled:opacity-50 transition-colors"
>
  <CheckCircle2 size={14} />
  Resolve
</button>
    </div>
  );
}

function VarroaImageModal({
  alert,
  hives = [],
  farms = [],
  onClose,
}) {
  const imageUrl = alert?.imageUrl;

  if (!imageUrl) {
    return null;
  }

  const detectedAt =
    alert?.createdAt
      ? formatDate(alert.createdAt)
      : 'Detection time unavailable';

  const target = getAlertTarget(
    alert,
    hives,
    farms,
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="varroa-modal-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-hidden border border-white/10 bg-black-card dark:bg-black shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5 sm:py-4 border-b border-white/10">
          <div className="min-w-0">
            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-gold">
              Varroa Detection
            </p>

            <h2
              id="varroa-modal-title"
              className="mt-1 text-base sm:text-lg font-semibold text-cream truncate"
            >
              Detected Image
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Varroa detection"
            className="w-9 h-9 shrink-0 flex items-center justify-center border border-white/10 text-muted hover:text-cream hover:border-gold transition-colors"
          >
            <X size={17} />
          </button>
        </div>

        {/* Image */}
        <div className="bg-black p-3 sm:p-5">
          <div className="relative w-full max-h-[58vh] flex items-center justify-center overflow-hidden border border-white/10 bg-black">
            <img
              src={imageUrl}
              alt="Varroa detection captured by the HoneyChain inspection system"
              className="block max-w-full max-h-[58vh] w-auto h-auto object-contain"
              onError={(event) => {
                event.currentTarget.style.display = 'none';

                const fallback =
                  event.currentTarget.nextElementSibling;

                if (fallback) {
                  fallback.classList.remove('hidden');
                }
              }}
            />

            <div className="hidden absolute inset-0 min-h-[240px] items-center justify-center p-6 text-center">
              <div>
                <ImageIcon
                  size={32}
                  className="mx-auto text-muted"
                />

                <p className="mt-3 text-sm text-cream">
                  Unable to load detection image
                </p>

                <p className="mt-1 text-xs text-muted">
                  The saved image may no longer be available.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="px-4 py-4 sm:px-5 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <InfoItem
              label="Detection"
              value={alert?.message || 'Varroa detected'}
            />

            <InfoItem
              label="Target"
              value={target}
            />

            <InfoItem
              label="Detected At"
              value={detectedAt}
            />
          </div>

          {alert?.suggestedAction && (
            <div className="mt-4 p-3 sm:p-4 border border-gold/20 bg-gold/5">
              <p className="text-[9px] uppercase tracking-[0.18em] text-gold">
                Suggested Action
              </p>

              <p className="mt-1.5 text-xs sm:text-sm leading-5 text-muted">
                {alert.suggestedAction}
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-[10px] text-muted">
              Image saved by HoneyChain detection service.
            </p>

            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2 border border-white/10 text-xs text-cream hover:border-gold hover:text-gold transition-colors"
            >
              Open Full Image
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="min-w-0 border border-white/10 p-3">
      <p className="text-[9px] uppercase tracking-[0.16em] text-muted">
        {label}
      </p>

      <p className="mt-1.5 text-xs sm:text-sm text-cream break-words">
        {value || '—'}
      </p>
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

      <h3 className="mt-4 text-sm font-semibold">
        {title}
      </h3>

      <p className="mt-1.5 text-xs text-gray dark:text-muted">
        {text}
      </p>

    </button>
  );
}

/* ============================================================
   HELPERS
   ============================================================ */

function formatYield(yieldEstimate) {
  if (!yieldEstimate) return '—';
  const kg = yieldEstimate.estimatedYieldKg;
  if (kg == null) return '—';
  return `${kg} kg`;
}

/**
 * Safe farm location helper
 * Fixes the crash: Objects are not valid as a React child
 * (location is sometimes stored as { area, state, lat, lng })
 */
function getFarmLocation(farm) {
  if (!farm) return 'Location not set';

  // If location is an object → convert to readable string
  if (farm.location && typeof farm.location === 'object') {
    const { area, state, lat, lng } = farm.location;
    const parts = [];

    if (area) parts.push(String(area));
    if (state) parts.push(String(state));
    if (lat != null && lng != null) {
      parts.push(`${lat}, ${lng}`);
    }

    return parts.length > 0 ? parts.join(', ') : 'Location not set';
  }

  // Normal string cases
  return (
    farm.location ||
    farm.address ||
    farm.region ||
    'Location not set'
  );
}
function getAlertTarget(alert, hives = [], farms = []) {
  if (!alert) return 'Target unknown';

  const hiveId =
    getId(alert.hive) ||
    alert.hiveId ||
    (typeof alert.hive === 'string' ? alert.hive : null);

  const farmId =
    getId(alert.farm) ||
    alert.farmId ||
    (typeof alert.farm === 'string' ? alert.farm : null);

  // 1) Prefer populated object on the alert itself
  if (alert.hive && typeof alert.hive === 'object') {
    const code =
      alert.hive.hiveCode ||
      alert.hive.name ||
      getId(alert.hive);
    if (code) return `Hive: ${code}`;
  }

  // 2) Look up hive in loaded hives list
  if (hiveId) {
    const hive = (Array.isArray(hives) ? hives : []).find(
      (h) => String(getId(h)) === String(hiveId),
    );
    if (hive) {
      return `Hive: ${hive.hiveCode || hive.name || getId(hive)}`;
    }
    return `Hive: ${hiveId}`;
  }

  // 3) Prefer populated farm on the alert
  if (alert.farm && typeof alert.farm === 'object') {
    const name =
      alert.farm.name ||
      alert.farm.farmCode ||
      getId(alert.farm);
    if (name) return `Farm: ${name}`;
  }

  // 4) Look up farm in loaded farms list
  if (farmId) {
    const farm = (Array.isArray(farms) ? farms : []).find(
      (f) => String(getId(f)) === String(farmId),
    );
    if (farm) {
      return `Farm: ${farm.name || farm.farmCode || getId(farm)}`;
    }
    return `Farm: ${farmId}`;
  }

  return 'Target unknown';
}

function QrCodeIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <path d="M14 14h.01M17 14h.01M14 17h.01M17 17h.01M20 14h.01M20 17h.01M14 20h.01M17 20h.01M20 20h.01" />
    </svg>
  );
}