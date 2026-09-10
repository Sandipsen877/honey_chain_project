import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
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
   ALERT HISTORY
   ============================================================ */

function HistorySection({
  historyData,
  onResolveAlert,
  actionLoading,
}) {
  return (
    <div>

      <PageHeader
        eyebrow="08 / Alert History"
        title="Alert History"
        description="Review current and previously resolved farm and hive alerts."
      />


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ==================================================
            CURRENT ALERTS
            ================================================== */}

        <div className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card">

          <div className="p-5 border-b border-black/10 dark:border-white/10">

            <div className="flex items-center gap-2">

              <AlertCircle
                size={18}
                className="text-red-500"
              />

              <h2 className="font-semibold">
                Current Alerts
              </h2>

            </div>

          </div>


          {historyData.current.length === 0 ? (

            <EmptyState
              icon={CheckCircle2}
              title="No current alerts"
              text="There are no active alerts right now."
            />

          ) : (

            <div className="divide-y divide-black/10 dark:divide-white/10">

              {historyData.current.map((alert) => (

                <AlertRow
                  key={getId(alert)}
                  alert={alert}
                  onResolve={onResolveAlert}
                  actionLoading={actionLoading}
                />

              ))}

            </div>

          )}

        </div>


        {/* ==================================================
            RESOLVED ALERTS
            ================================================== */}

        <div className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card">

          <div className="p-5 border-b border-black/10 dark:border-white/10">

            <div className="flex items-center gap-2">

              <CheckCircle2
                size={18}
                className="text-green-600"
              />

              <h2 className="font-semibold">
                Resolved Alerts
              </h2>

            </div>

          </div>


          {historyData.resolved.length === 0 ? (

            <EmptyState
              icon={ClipboardList}
              title="No resolved alerts"
              text="Resolved alerts will appear here."
            />

          ) : (

            <div className="divide-y divide-black/10 dark:divide-white/10">

              {historyData.resolved.map((alert) => (

                <div
                  key={getId(alert)}
                  className="p-5"
                >

                  <div className="flex items-start gap-3">

                    <CheckCircle2
                      size={18}
                      className="text-green-600 shrink-0"
                    />


                    <div>

                      <p className="text-sm font-medium">
                        {alert.message ||
                          alert.title ||
                          'Alert resolved'}
                      </p>


                      <p className="mt-2 text-xs text-gray dark:text-muted">

                        Resolved:{' '}

                        {formatDate(
                          alert.resolvedAt ||
                            alert.updatedAt,
                        )}

                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

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
}) {
  return (
    <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">

      {/* ALERT ICON */}

      <div className="w-9 h-9 shrink-0 border border-red-500/30 flex items-center justify-center">

        <AlertCircle
          size={18}
          className="text-red-500"
        />

      </div>


      {/* ALERT INFORMATION */}

      <div className="flex-1 min-w-0">

        <p className="text-sm font-medium">
          {alert.message ||
            alert.title ||
            alert.type ||
            'Hive alert'}
        </p>


        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray dark:text-muted">

          <span>
            {alert.farm
              ? 'Farm alert'
              : 'Hive alert'}
          </span>


          {alert.createdAt && (
            <span>
              {formatDate(
                alert.createdAt,
              )}
            </span>
          )}

        </div>

      </div>


      {/* RESOLVE BUTTON */}

      <button
        onClick={() =>
          onResolve(getId(alert))
        }
        disabled={actionLoading}
        className="inline-flex items-center justify-center gap-2 border border-green-600/30 text-green-600 px-3 py-2 text-xs font-medium disabled:opacity-50"
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
   EXPORTS
   ============================================================ */

export default HistorySection;

export {
  HistorySection,
  AlertRow,
};