import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  Hexagon,
  Tractor,
} from 'lucide-react';

import {
  PageHeader,
  EmptyState,
} from './DashboardUI';

import {
  getId,
  formatDate,
} from '../../services/dashboardApi';

/* ============================================================
   ALERT HISTORY — 6 PARTS
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
    <div>
      <PageHeader
        eyebrow="08 / Alert History"
        title="Alert History"
        description="Open and resolved alerts — all, by hive, and by farm."
      />

      <div className="space-y-10">

        {/* ========== OPEN ALERTS ========== */}
        <SectionBlock
          title="Open Alerts"
          subtitle="Status = open"
          icon={AlertCircle}
          iconClass="text-red-500"
        >
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* 1. All open */}
            <AlertColumn
              title="All Open Alerts"
              
              alerts={openAll}
              emptyText="No open alerts."
              onResolve={onResolveAlert}
              actionLoading={actionLoading}
              showResolve
            />

            {/* 2. Open by hive */}
            <AlertColumn
              title="Open Hive Alerts"
              
              alerts={openHive}
              emptyText="No open hive alerts."
              onResolve={onResolveAlert}
              actionLoading={actionLoading}
              showResolve
              badge="Hive"
            />

            {/* 3. Open by farm */}
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

        {/* ========== RESOLVED ALERTS ========== */}
        <SectionBlock
          title="Resolved Alerts"
          subtitle="Status = resolved"
          icon={CheckCircle2}
          iconClass="text-green-600"
        >
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* 4. All resolved */}
            <AlertColumn
              title="All Resolved Alerts"
              
              alerts={resolvedAll}
              emptyText="No resolved alerts."
              showResolve={false}
            />

            {/* 5. Resolved by hive */}
            <AlertColumn
              title="Resolved Hive Alerts"
              
              alerts={resolvedHive}
              emptyText="No resolved hive alerts."
              showResolve={false}
              badge="Hive"
            />

            {/* 6. Resolved by farm */}
            <AlertColumn
              title="Resolved Farm Alerts"
              
              alerts={resolvedFarm}
              emptyText="No resolved farm alerts."
              showResolve={false}
              badge="Farm"
            />
          </div>
        </SectionBlock>

      </div>
    </div>
  );
}

/* ============================================================
   SECTION BLOCK
   ============================================================ */

function SectionBlock({ title, subtitle, icon: Icon, iconClass, children }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <Icon size={20} className={iconClass} />
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-xs text-gray dark:text-muted">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

/* ============================================================
   ALERT COLUMN
   ============================================================ */

function AlertColumn({
  title,
  description,
  alerts,
  emptyText,
  onResolve,
  actionLoading,
  showResolve = false,
  badge,
}) {
  return (
    <div className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card flex flex-col min-h-[280px]">
      <div className="p-4 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold">{title}</h3>
          {badge && (
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-gold/40 text-gold">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-1 text-[11px] text-gray dark:text-muted">{description}</p>
        <p className="mt-2 text-xs font-medium text-gold">
          {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[420px]">
        {alerts.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-gray dark:text-muted">{emptyText}</p>
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
    <div className="p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 shrink-0 border flex items-center justify-center ${
            showResolve
              ? 'border-red-500/30'
              : 'border-green-600/30'
          }`}
        >
          {showResolve ? (
            <AlertCircle size={16} className="text-red-500" />
          ) : (
            <CheckCircle2 size={16} className="text-green-600" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium break-words">
            {alert.message || alert.title || alert.type || 'Alert'}
          </p>

          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray dark:text-muted">
            {hasHive && (
              <span className="inline-flex items-center gap-1">
                <Hexagon size={11} />
                Hive
              </span>
            )}
            {hasFarm && (
              <span className="inline-flex items-center gap-1">
                <Tractor size={11} />
                Farm
              </span>
            )}
            {alert.createdAt && (
              <span>{formatDate(alert.createdAt)}</span>
            )}
            {!showResolve && (alert.resolvedAt || alert.updatedAt) && (
              <span>
                Resolved: {formatDate(alert.resolvedAt || alert.updatedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {showResolve && onResolve && (
        <button
          onClick={() => onResolve(getId(alert))}
          disabled={actionLoading}
          className="self-start inline-flex items-center gap-2 border border-green-600/30 text-green-600 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
        >
          <CheckCircle2 size={13} />
          Resolve
        </button>
      )}
    </div>
  );
}

export default HistorySection;

export {
  HistorySection,
  AlertRow,
};