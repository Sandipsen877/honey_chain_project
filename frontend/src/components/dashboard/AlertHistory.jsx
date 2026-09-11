import {
  AlertCircle,
  CheckCircle2,
  Hexagon,
  Tractor,
} from 'lucide-react';

import {
  PageHeader,
} from './DashboardUI';

import {
  getId,
  formatDate,
} from '../../services/dashboardApi';

/* ============================================================
   ALERT HISTORY
   ============================================================ */

function HistorySection({
  historyData,
  onResolveAlert,
  actionLoading,
}) {
  const {
    openAll = [],
    openHive = [],
    openFarm = [],
    resolvedAll = [],
    resolvedHive = [],
    resolvedFarm = [],
  } = historyData || {};

  return (
    <div className="w-full min-w-0 space-y-7 sm:space-y-9">
      <PageHeader
        eyebrow="08 / Alert History"
        title="Alert History"
        description="Open and resolved alerts — all, by hive, and by farm."
      />

      {/* ======================================================
          OPEN ALERTS
      ====================================================== */}

      <SectionBlock
        title="Open Alerts"
        subtitle="Status = open"
        icon={AlertCircle}
        iconClass="text-red-500"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          <AlertColumn
            title="All Open Alerts"
            alerts={openAll}
            emptyText="No open alerts."
            onResolve={onResolveAlert}
            actionLoading={actionLoading}
            showResolve
          />

          <AlertColumn
            title="Open Hive Alerts"
            alerts={openHive}
            emptyText="No open hive alerts."
            onResolve={onResolveAlert}
            actionLoading={actionLoading}
            showResolve
            badge="Hive"
          />

          <AlertColumn
            title="Open Farm Alerts"
            alerts={openFarm}
            emptyText="No open farm alerts."
            onResolve={onResolveAlert}
            actionLoading={actionLoading}
            showResolve
            badge="Farm"
          />
        </div>
      </SectionBlock>

      {/* ======================================================
          RESOLVED ALERTS
      ====================================================== */}

      <SectionBlock
        title="Resolved Alerts"
        subtitle="Status = resolved"
        icon={CheckCircle2}
        iconClass="text-green-600"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
          <AlertColumn
            title="All Resolved Alerts"
            alerts={resolvedAll}
            emptyText="No resolved alerts."
          />

          <AlertColumn
            title="Resolved Hive Alerts"
            alerts={resolvedHive}
            emptyText="No resolved hive alerts."
            badge="Hive"
          />

          <AlertColumn
            title="Resolved Farm Alerts"
            alerts={resolvedFarm}
            emptyText="No resolved farm alerts."
            badge="Farm"
          />
        </div>
      </SectionBlock>
    </div>
  );
}

/* ============================================================
   SECTION BLOCK
   ============================================================ */

function SectionBlock({
  title,
  subtitle,
  icon: Icon,
  iconClass,
  children,
}) {
  return (
    <section className="min-w-0">
      <div className="flex items-center gap-3 mb-4 sm:mb-5">
        <div className="w-9 h-9 shrink-0 flex items-center justify-center border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card">
          <Icon
            size={17}
            strokeWidth={1.8}
            className={iconClass}
          />
        </div>

        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-black dark:text-cream">
            {title}
          </h2>

          <p className="text-[11px] sm:text-xs text-gray dark:text-muted">
            {subtitle}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

/* ============================================================
   ALERT COLUMN
   ============================================================ */

function AlertColumn({
  title,
  description,
  alerts = [],
  emptyText,
  onResolve,
  actionLoading,
  showResolve = false,
  badge,
}) {
  return (
    <div className="min-w-0 border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-black/10 dark:border-white/10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-black dark:text-cream truncate">
              {title}
            </h3>

            {description && (
              <p className="mt-1 text-[11px] text-gray dark:text-muted">
                {description}
              </p>
            )}
          </div>

          {badge && (
            <span className="shrink-0 text-[9px] sm:text-[10px] uppercase tracking-[0.15em] px-2 py-1 border border-gold/40 text-gold">
              {badge}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-[0.15em] text-gray dark:text-muted">
            Total
          </span>

          <span className="text-xs font-semibold text-gold">
            {alerts.length}
          </span>
        </div>
      </div>

      {/* Scrollable alerts */}
      <div className="flex-1 min-h-0 max-h-[300px] sm:max-h-[360px] overflow-y-auto overflow-x-hidden scrollbar-thin">
        {alerts.length === 0 ? (
          <div className="min-h-[170px] flex items-center justify-center p-6 text-center">
            <div>
              <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center border border-black/10 dark:border-white/10">
                {showResolve ? (
                  <AlertCircle
                    size={17}
                    className="text-gray dark:text-muted"
                  />
                ) : (
                  <CheckCircle2
                    size={17}
                    className="text-gray dark:text-muted"
                  />
                )}
              </div>

              <p className="text-sm text-gray dark:text-muted">
                {emptyText}
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-black/5 dark:divide-white/10">
            {alerts.map((alert) => (
              <AlertRow
                key={getId(alert)}
                alert={alert}
                onResolve={onResolve}
                actionLoading={actionLoading}
                showResolve={showResolve}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   ALERT ROW
   ============================================================ */

function AlertRow({
  alert,
  onResolve,
  actionLoading,
  showResolve = false,
}) {
  const hasHive = !!(alert?.hive || alert?.hiveId);
  const hasFarm = !!(alert?.farm || alert?.farmId);

  return (
    <div className="p-4 sm:p-5">
      <div className="flex items-start gap-3">
        {/* Status icon */}
        <div
          className={`w-8 h-8 shrink-0 flex items-center justify-center border ${
            showResolve
              ? 'border-red-500/30 bg-red-500/5'
              : 'border-green-600/30 bg-green-600/5'
          }`}
        >
          {showResolve ? (
            <AlertCircle
              size={15}
              strokeWidth={1.8}
              className="text-red-500"
            />
          ) : (
            <CheckCircle2
              size={15}
              strokeWidth={1.8}
              className="text-green-600"
            />
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-5 text-black dark:text-cream break-words">
            {alert.message ||
              alert.title ||
              alert.type ||
              'Alert'}
          </p>

          <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1.5 text-[10px] sm:text-[11px] text-gray dark:text-muted">
            {hasHive && (
              <span className="inline-flex items-center gap-1">
                <Hexagon size={10} />
                Hive
              </span>
            )}

            {hasFarm && (
              <span className="inline-flex items-center gap-1">
                <Tractor size={10} />
                Farm
              </span>
            )}

            {alert.createdAt && (
              <span>
                {formatDate(alert.createdAt)}
              </span>
            )}

            {!showResolve &&
              (alert.resolvedAt || alert.updatedAt) && (
                <span>
                  Resolved:{' '}
                  {formatDate(
                    alert.resolvedAt || alert.updatedAt
                  )}
                </span>
              )}
          </div>
        </div>
      </div>

      {/* Resolve action */}
      {showResolve && onResolve && (
        <div className="mt-3 pl-11">
          <button
            onClick={() => onResolve(getId(alert))}
            disabled={actionLoading}
            className="inline-flex items-center gap-2 border border-green-600/30 text-green-600 hover:bg-green-600/10 px-3 py-1.5 text-[11px] font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2
              size={13}
              strokeWidth={1.8}
            />
            Resolve
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   EXPORTS
   ============================================================ */

export default HistorySection;

export {
  HistorySection,
  AlertRow,
};