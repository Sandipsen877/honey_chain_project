import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Beaker,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  LoaderCircle,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
  XCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  getKvicReports,
  getKvicReportHistory,
} from '../../services/kvicApi';


/* =========================================================
   HELPERS
========================================================= */

function displayValue(value, fallback = '—') {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return fallback;
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number'
  ) {
    return String(value);
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => displayValue(item))
      .join(', ');
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(
        ([, item]) =>
          item !== null &&
          item !== undefined &&
          item !== ''
      )
      .map(
        ([key, item]) =>
          `${key}: ${displayValue(item)}`
      )
      .join(', ');
  }

  return String(value);
}


function getId(item) {
  if (!item) return '';

  return (
    item._id ||
    item.id ||
    item.reportId ||
    item.batchId ||
    ''
  );
}


function getArrayFromResponse(response, keys = []) {
  if (Array.isArray(response)) {
    return response;
  }

  if (!response || typeof response !== 'object') {
    return [];
  }

  for (const key of keys) {
    if (Array.isArray(response[key])) {
      return response[key];
    }
  }

  return [];
}


function getBatch(report) {
  return report?.batch || report?.batchId || null;
}


function getFarm(report) {
  return (
    report?.farm ||
    getBatch(report)?.farm ||
    getBatch(report)?.farmId ||
    null
  );
}


function getKeeper(report) {
  return (
    report?.keeper ||
    getFarm(report)?.keeper ||
    null
  );
}


function getBatchCode(report) {
  const batch = getBatch(report);

  return displayValue(
    batch?.batchCode ||
      batch?.code ||
      report?.batchCode ||
      report?.code,
    'Unknown Batch'
  );
}


function getFarmName(report) {
  const farm = getFarm(report);

  return displayValue(
    farm?.name ||
      farm?.farmName ||
      farm?.farmCode ||
      report?.farmName,
    'Unknown Farm'
  );
}


function getKeeperName(report) {
  const keeper = getKeeper(report);

  return displayValue(
    keeper?.name ||
      keeper?.keeperName ||
      report?.keeperName,
    'Unknown Keeper'
  );
}


function getReportResult(report) {
  const value =
    report?.overallResult ||
    report?.result ||
    report?.status ||
    '';

  return String(value).trim().toLowerCase();
}


function isPassed(report) {
  const result = getReportResult(report);

  return (
    result === 'pass' ||
    result === 'passed' ||
    result === 'success' ||
    result === 'approved'
  );
}


function isFailed(report) {
  const result = getReportResult(report);

  return (
    result === 'fail' ||
    result === 'failed' ||
    result === 'rejected'
  );
}


function getReportDate(report) {
  return (
    report?.createdAt ||
    report?.updatedAt ||
    report?.reportDate ||
    report?.date ||
    null
  );
}


function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return displayValue(value);
  }

  return date.toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );
}


function formatDateTime(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return displayValue(value);
  }

  return date.toLocaleString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );
}


function getResultLabel(report) {
  if (isPassed(report)) return 'PASS';
  if (isFailed(report)) return 'FAIL';

  return displayValue(
    report?.overallResult ||
      report?.result ||
      report?.status,
    'PENDING'
  ).toUpperCase();
}


function getResultClasses(report) {
  if (isPassed(report)) {
    return 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400';
  }

  if (isFailed(report)) {
    return 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400';
  }

  return 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400';
}


function getReportIcon(report) {
  if (isPassed(report)) {
    return (
      <CheckCircle2 className="h-4 w-4" />
    );
  }

  if (isFailed(report)) {
    return (
      <XCircle className="h-4 w-4" />
    );
  }

  return (
    <Clock3 className="h-4 w-4" />
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  title,
  value,
  description,
}) {
  return (
    <div
      className="
        rounded-2xl
        border border-black/10
        bg-white
        p-5
        shadow-sm
        dark:border-white/10
        dark:bg-zinc-950
      "
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100">
            {value}
          </p>

          {description && (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              {description}
            </p>
          )}
        </div>

        <div
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl
            border border-black/10
            bg-zinc-50
            text-zinc-700
            dark:border-white/10
            dark:bg-white/5
            dark:text-zinc-200
          "
        >
          {icon}
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   REPORT DETAILS MODAL
========================================================= */

function ReportDetailsModal({
  report,
  onClose,
  onViewHistory,
}) {
  if (!report) return null;

  const result = getResultLabel(report);

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/60
        p-4
        backdrop-blur-sm
      "
      onMouseDown={onClose}
    >
      <div
        className="
          max-h-[90vh]
          w-full
          max-w-3xl
          overflow-y-auto
          rounded-3xl
          border border-black/10
          bg-white
          shadow-2xl
          dark:border-white/10
          dark:bg-zinc-950
        "
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}
        <div
          className="
            sticky top-0 z-10
            flex items-center justify-between
            border-b border-black/10
            bg-white/95
            px-6 py-5
            backdrop-blur
            dark:border-white/10
            dark:bg-zinc-950/95
          "
        >
          <div>
            <div className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-zinc-700 dark:text-zinc-200" />

              <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-100">
                Laboratory Report
              </h2>
            </div>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {getBatchCode(report)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              border border-black/10
              p-2
              text-zinc-500
              hover:bg-zinc-100
              dark:border-white/10
              dark:hover:bg-white/5
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Result */}
          <div
            className={`
              flex items-center justify-between
              rounded-2xl border p-4
              ${getResultClasses(report)}
            `}
          >
            <div className="flex items-center gap-3">
              {getReportIcon(report)}

              <div>
                <p className="text-xs uppercase tracking-wider opacity-70">
                  Overall Result
                </p>

                <p className="mt-1 font-semibold">
                  {result}
                </p>
              </div>
            </div>

            <ShieldCheck className="h-6 w-6 opacity-70" />
          </div>

          {/* Basic information */}
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Report Information
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoItem
                label="Batch"
                value={getBatchCode(report)}
              />

              <InfoItem
                label="Farm"
                value={getFarmName(report)}
              />

              <InfoItem
                label="Keeper"
                value={getKeeperName(report)}
              />

              <InfoItem
                label="Report Date"
                value={formatDate(
                  getReportDate(report)
                )}
              />

              <InfoItem
                label="Report ID"
                value={getId(report)}
              />

              <InfoItem
                label="Overall Result"
                value={result}
              />
            </div>
          </section>

          {/* Quality information */}
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Quality Information
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoItem
                label="Moisture"
                value={
                  report?.moisture ??
                  report?.moistureContent ??
                  report?.quality?.moisture
                }
              />

              <InfoItem
                label="HMF"
                value={
                  report?.hmf ??
                  report?.hmfValue ??
                  report?.quality?.hmf
                }
              />

              <InfoItem
                label="Sucrose"
                value={
                  report?.sucrose ??
                  report?.quality?.sucrose
                }
              />

              <InfoItem
                label="Reducing Sugar"
                value={
                  report?.reducingSugar ??
                  report?.quality?.reducingSugar
                }
              />
            </div>
          </section>

          {/* Remarks */}
          {(report?.remarks ||
            report?.comments ||
            report?.notes ||
            report?.quality?.remarks) && (
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
                Remarks
              </h3>

              <div
                className="
                  rounded-2xl
                  border border-black/10
                  bg-zinc-50
                  p-4
                  text-sm leading-6
                  text-zinc-700
                  dark:border-white/10
                  dark:bg-white/5
                  dark:text-zinc-300
                "
              >
                {displayValue(
                  report?.remarks ||
                    report?.comments ||
                    report?.notes ||
                    report?.quality?.remarks
                )}
              </div>
            </section>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                onViewHistory(report)
              }
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl
                border border-black/10
                px-4 py-2.5
                text-sm font-medium
                text-zinc-800
                hover:bg-zinc-100
                dark:border-white/10
                dark:text-zinc-200
                dark:hover:bg-white/5
              "
            >
              <Clock3 className="h-4 w-4" />
              View Report History
            </button>

            <button
              type="button"
              onClick={onClose}
              className="
                rounded-xl
                bg-zinc-950
                px-4 py-2.5
                text-sm font-medium
                text-white
                hover:bg-zinc-800
                dark:bg-white
                dark:text-zinc-950
                dark:hover:bg-zinc-200
              "
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  label,
  value,
}) {
  return (
    <div
      className="
        rounded-xl
        border border-black/10
        bg-zinc-50
        px-4 py-3
        dark:border-white/10
        dark:bg-white/5
      "
    >
      <p className="text-xs text-zinc-500 dark:text-zinc-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-zinc-900 dark:text-zinc-200">
        {displayValue(value)}
      </p>
    </div>
  );
}


/* =========================================================
   HISTORY MODAL
========================================================= */

function HistoryModal({
  batch,
  history,
  loading,
  error,
  onClose,
}) {
  if (!batch) return null;

  return (
    <div
      className="
        fixed inset-0 z-[60]
        flex items-center justify-center
        bg-black/60
        p-4
        backdrop-blur-sm
      "
      onMouseDown={onClose}
    >
      <div
        className="
          max-h-[90vh]
          w-full
          max-w-3xl
          overflow-hidden
          rounded-3xl
          border border-black/10
          bg-white
          shadow-2xl
          dark:border-white/10
          dark:bg-zinc-950
        "
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        {/* Header */}
        <div
          className="
            flex items-center justify-between
            border-b border-black/10
            px-6 py-5
            dark:border-white/10
          "
        >
          <div>
            <div className="flex items-center gap-2">
              <Clock3 className="h-5 w-5" />

              <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-100">
                Report History
              </h2>
            </div>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {displayValue(batch)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              border border-black/10
              p-2
              text-zinc-500
              hover:bg-zinc-100
              dark:border-white/10
              dark:hover:bg-white/5
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-90px)] overflow-y-auto p-6">
          {loading && (
            <div className="flex min-h-40 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Loading report history...
              </div>
            </div>
          )}

          {!loading && error && (
            <div
              className="
                rounded-2xl
                border border-red-500/30
                bg-red-500/10
                p-5
                text-sm text-red-600
                dark:text-red-400
              "
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

                <div>
                  <p className="font-semibold">
                    Unable to load history
                  </p>

                  <p className="mt-1">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!loading &&
            !error &&
            history.length === 0 && (
              <div className="flex min-h-40 flex-col items-center justify-center text-center">
                <FileText className="h-10 w-10 text-zinc-400" />

                <p className="mt-3 font-medium text-zinc-800 dark:text-zinc-200">
                  No report history found
                </p>

                <p className="mt-1 text-sm text-zinc-500">
                  No previous laboratory reports are available for this batch.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            history.length > 0 && (
              <div className="relative">
                <div
                  className="
                    absolute left-4 top-3 bottom-3
                    w-px
                    bg-zinc-200
                    dark:bg-white/10
                  "
                />

                <div className="space-y-6">
                  {history.map(
                    (item, index) => (
                      <HistoryItem
                        key={
                          getId(item) ||
                          `${index}-${getReportDate(item)}`
                        }
                        report={item}
                        index={index}
                      />
                    )
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   HISTORY ITEM
========================================================= */

function HistoryItem({
  report,
  index,
}) {
  return (
    <div className="relative flex gap-4">
      <div
        className="
          relative z-10
          flex h-8 w-8 shrink-0
          items-center justify-center
          rounded-full
          border border-black/10
          bg-white
          dark:border-white/10
          dark:bg-zinc-950
        "
      >
        {isPassed(report) ? (
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
        ) : isFailed(report) ? (
          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        ) : (
          <Clock3 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        )}
      </div>

      <div
        className="
          min-w-0 flex-1
          rounded-2xl
          border border-black/10
          bg-zinc-50
          p-4
          dark:border-white/10
          dark:bg-white/5
        "
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              Report #{index + 1}
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              {formatDateTime(
                getReportDate(report)
              )}
            </p>
          </div>

          <span
            className={`
              inline-flex w-fit items-center gap-1.5
              rounded-full
              border
              px-2.5 py-1
              text-xs font-semibold
              ${getResultClasses(report)}
            `}
          >
            {getReportIcon(report)}
            {getResultLabel(report)}
          </span>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-zinc-500">
              Report ID
            </p>

            <p className="mt-1 break-all text-sm text-zinc-800 dark:text-zinc-300">
              {displayValue(getId(report))}
            </p>
          </div>

          <div>
            <p className="text-xs text-zinc-500">
              Result
            </p>

            <p className="mt-1 text-sm text-zinc-800 dark:text-zinc-300">
              {getResultLabel(report)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


/* =========================================================
   MAIN PAGE
========================================================= */

export default function KvicReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [resultFilter, setResultFilter] =
    useState('all');

  const [selectedReport, setSelectedReport] =
    useState(null);

  const [historyBatch, setHistoryBatch] =
    useState(null);

  const [history, setHistory] =
    useState([]);

  const [historyLoading, setHistoryLoading] =
    useState(false);

  const [historyError, setHistoryError] =
    useState('');


  /* =======================================================
     LOAD REPORTS
  ======================================================= */

  const loadReports = async () => {
    try {
      setLoading(true);
      setError('');

      const response =
        await getKvicReports();

      const data =
        getArrayFromResponse(
          response,
          [
            'reports',
            'data',
            'items',
            'results',
          ]
        );

      setReports(data);
    } catch (err) {
      console.error(
        'Failed to load KVIC reports:',
        err
      );

      setError(
        err?.message ||
          'Failed to load laboratory reports.'
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadReports();
  }, []);


  /* =======================================================
     FILTER REPORTS
  ======================================================= */

  const filteredReports = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return reports.filter((report) => {
      const result =
        getReportResult(report);

      if (
        resultFilter === 'pass' &&
        !isPassed(report)
      ) {
        return false;
      }

      if (
        resultFilter === 'fail' &&
        !isFailed(report)
      ) {
        return false;
      }

      if (
        resultFilter === 'pending' &&
        (isPassed(report) ||
          isFailed(report))
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchable = [
        getBatchCode(report),
        getFarmName(report),
        getKeeperName(report),
        getId(report),
        result,
      ]
        .map((value) =>
          String(value || '').toLowerCase()
        )
        .join(' ');

      return searchable.includes(query);
    });
  }, [
    reports,
    search,
    resultFilter,
  ]);


  /* =======================================================
     STATISTICS
  ======================================================= */

  const statistics = useMemo(() => {
    const total = reports.length;

    const passed =
      reports.filter(isPassed).length;

    const failed =
      reports.filter(isFailed).length;

    const pending =
      total - passed - failed;

    return {
      total,
      passed,
      failed,
      pending,
    };
  }, [reports]);


  /* =======================================================
     HISTORY
  ======================================================= */

  const openHistory = async (report) => {
    const batch = getBatch(report);

    const batchId =
      getId(batch) ||
      report?.batchId ||
      report?.batch;

    if (!batchId) {
      setHistoryError(
        'Batch ID is not available for this report.'
      );

      setHistoryBatch(
        getBatchCode(report)
      );

      setHistory([]);
      return;
    }

    setHistoryBatch(
      getBatchCode(report)
    );

    setHistory([]);
    setHistoryError('');
    setHistoryLoading(true);

    try {
      const response =
        await getKvicReportHistory(
          batchId
        );

      const data =
        getArrayFromResponse(
          response,
          [
            'history',
            'reports',
            'data',
            'items',
            'results',
          ]
        );

      setHistory(data);
    } catch (err) {
      console.error(
        'Failed to load report history:',
        err
      );

      setHistoryError(
        err?.message ||
          'Failed to load report history.'
      );
    } finally {
      setHistoryLoading(false);
    }
  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        min-h-screen
        bg-zinc-50
        text-zinc-950
        dark:bg-black
        dark:text-zinc-100
      "
    >
      {/* Header */}
      <header
        className="
          border-b border-black/10
          bg-white/80
          backdrop-blur
          dark:border-white/10
          dark:bg-black/80
        "
      >
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <button
                type="button"
                onClick={() =>
                  navigate('/kvic/dashboard')
                }
                className="
                  mb-3
                  inline-flex items-center gap-2
                  text-sm
                  text-zinc-500
                  transition
                  hover:text-zinc-900
                  dark:hover:text-zinc-100
                "
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </button>

              <div className="flex items-center gap-3">
                <div
                  className="
                    flex h-11 w-11
                    items-center justify-center
                    rounded-2xl
                    border border-black/10
                    bg-zinc-100
                    dark:border-white/10
                    dark:bg-white/5
                  "
                >
                  <Beaker className="h-5 w-5" />
                </div>

                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Laboratory Reports
                  </h1>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Review beekeeper-submitted laboratory reports and their history.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={loadReports}
              disabled={loading}
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl
                border border-black/10
                bg-white
                px-4 py-2.5
                text-sm font-medium
                text-zinc-800
                shadow-sm
                hover:bg-zinc-50
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:border-white/10
                dark:bg-white/5
                dark:text-zinc-200
                dark:hover:bg-white/10
              "
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading
                    ? 'animate-spin'
                    : ''
                }`}
              />

              Refresh
            </button>
          </div>
        </div>
      </header>


      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={
              <FileText className="h-5 w-5" />
            }
            title="Total Reports"
            value={statistics.total}
            description="All submitted reports"
          />

          <StatCard
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
            title="Passed"
            value={statistics.passed}
            description="Reports marked PASS"
          />

          <StatCard
            icon={
              <XCircle className="h-5 w-5" />
            }
            title="Failed"
            value={statistics.failed}
            description="Reports marked FAIL"
          />

          <StatCard
            icon={
              <Clock3 className="h-5 w-5" />
            }
            title="Pending"
            value={statistics.pending}
            description="Reports without final result"
          />
        </div>


        {/* Information banner */}
        <div
          className="
            mt-6
            flex items-start gap-3
            rounded-2xl
            border border-blue-500/20
            bg-blue-500/5
            p-4
            text-sm
            text-zinc-700
            dark:text-zinc-300
          "
        >
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />

          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              Read-only laboratory records
            </p>

            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              Laboratory reports are filed from the beekeeper's Digital Passport. KVIC Admin can review submitted reports and inspect their history here.
            </p>
          </div>
        </div>


        {/* Reports section */}
        <section
          className="
            mt-6
            overflow-hidden
            rounded-3xl
            border border-black/10
            bg-white
            shadow-sm
            dark:border-white/10
            dark:bg-zinc-950
          "
        >
          {/* Toolbar */}
          <div
            className="
              border-b border-black/10
              p-4
              dark:border-white/10
            "
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative w-full lg:max-w-md">
                <Search
                  className="
                    pointer-events-none
                    absolute left-3 top-1/2
                    h-4 w-4
                    -translate-y-1/2
                    text-zinc-400
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search batch, farm, keeper or report ID..."
                  className="
                    w-full
                    rounded-xl
                    border border-black/10
                    bg-zinc-50
                    py-2.5 pl-9 pr-4
                    text-sm
                    outline-none
                    placeholder:text-zinc-400
                    focus:border-zinc-400
                    dark:border-white/10
                    dark:bg-white/5
                    dark:text-zinc-100
                    dark:focus:border-zinc-600
                  "
                />
              </div>

              {/* Filter */}
              <div className="flex flex-wrap gap-2">
                {[
                  ['all', 'All'],
                  ['pass', 'Passed'],
                  ['fail', 'Failed'],
                  ['pending', 'Pending'],
                ].map(
                  ([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setResultFilter(
                          value
                        )
                      }
                      className={`
                        rounded-xl
                        border
                        px-3 py-2
                        text-sm font-medium
                        transition
                        ${
                          resultFilter ===
                          value
                            ? 'border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-zinc-950'
                            : 'border-black/10 text-zinc-600 hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-white/5'
                        }
                      `}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>


          {/* Loading */}
          {loading && (
            <div className="flex min-h-80 items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <LoaderCircle className="h-5 w-5 animate-spin" />
                Loading laboratory reports...
              </div>
            </div>
          )}


          {/* Error */}
          {!loading && error && (
            <div className="p-6">
              <div
                className="
                  rounded-2xl
                  border border-red-500/30
                  bg-red-500/10
                  p-5
                  text-sm text-red-600
                  dark:text-red-400
                "
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />

                  <div>
                    <p className="font-semibold">
                      Failed to load reports
                    </p>

                    <p className="mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Empty */}
          {!loading &&
            !error &&
            filteredReports.length === 0 && (
              <div className="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                <FileText className="h-10 w-10 text-zinc-400" />

                <p className="mt-4 font-medium text-zinc-800 dark:text-zinc-200">
                  No laboratory reports found
                </p>

                <p className="mt-1 max-w-md text-sm text-zinc-500">
                  {reports.length === 0
                    ? 'No laboratory reports have been submitted yet.'
                    : 'Try changing the search or result filter.'}
                </p>
              </div>
            )}


          {/* Desktop table */}
          {!loading &&
            !error &&
            filteredReports.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr
                      className="
                        border-b border-black/10
                        text-left
                        dark:border-white/10
                      "
                    >
                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Batch
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Farm
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Keeper
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Report Date
                      </th>

                      <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Result
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredReports.map(
                      (report, index) => (
                        <tr
                          key={
                            getId(report) ||
                            `report-${index}`
                          }
                          className="
                            border-b border-black/5
                            last:border-0
                            hover:bg-zinc-50
                            dark:border-white/5
                            dark:hover:bg-white/[0.03]
                          "
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="
                                  flex h-9 w-9
                                  items-center justify-center
                                  rounded-xl
                                  border border-black/10
                                  bg-zinc-50
                                  dark:border-white/10
                                  dark:bg-white/5
                                "
                              >
                                <Beaker className="h-4 w-4" />
                              </div>

                              <div>
                                <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                  {getBatchCode(
                                    report
                                  )}
                                </p>

                                <p className="mt-0.5 text-xs text-zinc-500">
                                  {displayValue(
                                    getId(
                                      report
                                    )
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                            {getFarmName(
                              report
                            )}
                          </td>

                          <td className="px-5 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                            {getKeeperName(
                              report
                            )}
                          </td>

                          <td className="px-5 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                            {formatDate(
                              getReportDate(
                                report
                              )
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`
                                inline-flex
                                items-center gap-1.5
                                rounded-full
                                border
                                px-2.5 py-1
                                text-xs font-semibold
                                ${getResultClasses(
                                  report
                                )}
                              `}
                            >
                              {getReportIcon(
                                report
                              )}

                              {getResultLabel(
                                report
                              )}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setSelectedReport(
                                    report
                                  )
                                }
                                className="
                                  inline-flex items-center gap-1.5
                                  rounded-xl
                                  border border-black/10
                                  px-3 py-2
                                  text-xs font-medium
                                  text-zinc-700
                                  hover:bg-zinc-100
                                  dark:border-white/10
                                  dark:text-zinc-300
                                  dark:hover:bg-white/5
                                "
                              >
                                View
                                <ChevronRight className="h-3.5 w-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  openHistory(
                                    report
                                  )
                                }
                                className="
                                  inline-flex items-center gap-1.5
                                  rounded-xl
                                  bg-zinc-950
                                  px-3 py-2
                                  text-xs font-medium
                                  text-white
                                  hover:bg-zinc-800
                                  dark:bg-white
                                  dark:text-zinc-950
                                  dark:hover:bg-zinc-200
                                "
                              >
                                History
                                <Clock3 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
        </section>

        {/* Footer count */}
        {!loading &&
          !error &&
          reports.length > 0 && (
            <div className="mt-4 text-sm text-zinc-500">
              Showing{' '}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {filteredReports.length}
              </span>{' '}
              of{' '}
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                {reports.length}
              </span>{' '}
              reports
            </div>
          )}
      </main>


      {/* Details Modal */}
      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          onClose={() =>
            setSelectedReport(null)
          }
          onViewHistory={async (report) => {
            setSelectedReport(null);
            await openHistory(report);
          }}
        />
      )}


      {/* History Modal */}
      {historyBatch && (
        <HistoryModal
          batch={historyBatch}
          history={history}
          loading={historyLoading}
          error={historyError}
          onClose={() => {
            setHistoryBatch(null);
            setHistory([]);
            setHistoryError('');
          }}
        />
      )}
    </div>
  );
}