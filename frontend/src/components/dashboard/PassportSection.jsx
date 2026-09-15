import { useState } from 'react';

import {
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  FlaskConical,
  QrCode,
  ShieldCheck,
  Beaker,
  CalendarDays,
  Droplets,
  Weight,
  Tag,
} from 'lucide-react';

import {
  DetailOverlay,
  EmptyState,
} from './DashboardUI';

import {
  apiRequest,
  getId,
  getErrorMessage,
  formatDate,
} from '../../services/dashboardApi';


/* ============================================================
   SMALL HELPERS
   ============================================================ */

function formatLabel(key) {
  if (!key) {
    return '';
  }

  return String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}


function formatValue(value, key = '') {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return 'Not available';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    if (!value.length) {
      return 'None';
    }

    return value
      .map((item) => {
        if (
          typeof item === 'object' &&
          item !== null
        ) {
          return Object.entries(item)
            .map(
              ([itemKey, itemValue]) =>
                `${formatLabel(itemKey)}: ${formatValue(
                  itemValue,
                  itemKey,
                )}`,
            )
            .join(', ');
        }

        return String(item);
      })
      .join(', ');
  }

  if (
    typeof value === 'string' &&
    (
      key.toLowerCase().includes('date') ||
      key.toLowerCase().includes('time')
    )
  ) {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  return String(value);
}


function isObject(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}


/* ============================================================
   SECTION LABEL
   ============================================================ */

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5 sm:mb-6">
      <span className="h-px flex-1 bg-gold/20" />

      <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-gold whitespace-nowrap">
        {children}
      </span>

      <span className="h-px flex-1 bg-gold/20" />
    </div>
  );
}


/* ============================================================
   REPORT FIELD
   ============================================================ */

function ReportField({
  label,
  value,
  icon: Icon,
  highlight = false,
}) {
  return (
    <div
      className={
        highlight
          ? 'border border-gold/30 bg-gold/5 p-4'
          : 'border border-black/10 dark:border-white/10 p-4'
      }
    >
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon
            size={15}
            className="text-gold shrink-0"
          />
        )}

        <p className="text-[10px] uppercase tracking-[0.16em] text-gray dark:text-muted">
          {label}
        </p>
      </div>

      <p className="mt-2 text-sm font-semibold break-words">
        {value}
      </p>
    </div>
  );
}


/* ============================================================
   REPORT OBJECT SECTION
   ============================================================ */

function ReportObjectSection({
  title,
  data,
}) {
  if (!isObject(data)) {
    return null;
  }

  const entries = Object.entries(data).filter(
    ([, value]) =>
      value !== null &&
      value !== undefined &&
      value !== '',
  );

  if (!entries.length) {
    return null;
  }

  return (
    <div className="mt-6">
      <h4 className="text-xs uppercase tracking-[0.18em] text-gold font-semibold">
        {title}
      </h4>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {entries.map(([key, value]) => (
          <ReportField
            key={key}
            label={formatLabel(key)}
            value={
              isObject(value)
                ? Object.entries(value)
                    .map(
                      ([nestedKey, nestedValue]) =>
                        `${formatLabel(
                          nestedKey,
                        )}: ${formatValue(
                          nestedValue,
                          nestedKey,
                        )}`,
                    )
                    .join(' • ')
                : formatValue(value, key)
            }
          />
        ))}
      </div>
    </div>
  );
}


/* ============================================================
   LAB REPORT UI
   ============================================================ */

function LaboratoryReport({
  report,
}) {
  if (!report) {
    return null;
  }

  const reportData =
    report?.report ||
    report;

  const entries = Object.entries(
    reportData,
  ).filter(
    ([, value]) =>
      value !== null &&
      value !== undefined &&
      value !== '',
  );

  const primitiveEntries = entries.filter(
    ([, value]) =>
      !isObject(value) &&
      !Array.isArray(value),
  );

  const objectEntries = entries.filter(
    ([, value]) =>
      isObject(value) ||
      Array.isArray(value),
  );

  const statusEntry = entries.find(
    ([key]) =>
      key.toLowerCase() === 'status' ||
      key.toLowerCase() === 'result' ||
      key.toLowerCase() === 'verificationstatus' ||
      key.toLowerCase() === 'overallresult',
  );

  const reportIdEntry = entries.find(
    ([key]) =>
      key.toLowerCase().includes('reportid') ||
      key.toLowerCase().includes('reportcode'),
  );

  const dateEntry = entries.find(
    ([key]) =>
      key.toLowerCase().includes('testdate') ||
      key.toLowerCase().includes('testeddate') ||
      key.toLowerCase().includes('reportdate') ||
      key.toLowerCase() === 'date',
  );

  const statusValue = statusEntry
    ? String(statusEntry[1]).toUpperCase()
    : '';

  const isPass = statusValue === 'PASS';

  return (
    <div className="mt-6">

      {/* ======================================================
          REPORT HEADER
         ====================================================== */}

      <div
        className={
          isPass
            ? 'border border-green-600/30 bg-green-600/5 p-5'
            : 'border border-orange-500/30 bg-orange-500/5 p-5'
        }
      >
        <div className="flex items-start justify-between gap-4">

          <div className="flex items-start gap-3 min-w-0">

            {isPass ? (
              <CheckCircle2
                size={22}
                className="text-green-600 shrink-0 mt-0.5"
              />
            ) : (
              <ShieldCheck
                size={22}
                className="text-orange-500 shrink-0 mt-0.5"
              />
            )}

            <div className="min-w-0">

              <p
                className={
                  isPass
                    ? 'text-[10px] uppercase tracking-[0.18em] text-green-700 dark:text-green-400 font-semibold'
                    : 'text-[10px] uppercase tracking-[0.18em] text-orange-600 dark:text-orange-400 font-semibold'
                }
              >
                Laboratory Report Available
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                Laboratory Report
              </h3>

              <p className="mt-1 text-xs text-gray dark:text-muted">
                Laboratory testing information for this
                honey batch.
              </p>

            </div>
          </div>

          <ShieldCheck
            size={25}
            className={
              isPass
                ? 'text-green-600 shrink-0'
                : 'text-orange-500 shrink-0'
            }
          />

        </div>
      </div>


      {/* ======================================================
          IMPORTANT REPORT INFORMATION
         ====================================================== */}

      {(statusEntry ||
        reportIdEntry ||
        dateEntry) && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

          {statusEntry && (
            <ReportField
              label="Result"
              value={formatValue(
                statusEntry[1],
                statusEntry[0],
              )}
              icon={ShieldCheck}
              highlight
            />
          )}

          {reportIdEntry && (
            <ReportField
              label={formatLabel(
                reportIdEntry[0],
              )}
              value={formatValue(
                reportIdEntry[1],
                reportIdEntry[0],
              )}
              icon={Tag}
            />
          )}

          {dateEntry && (
            <ReportField
              label={formatLabel(
                dateEntry[0],
              )}
              value={formatValue(
                dateEntry[1],
                dateEntry[0],
              )}
              icon={CalendarDays}
            />
          )}

        </div>
      )}


      {/* ======================================================
          TEST RESULTS
         ====================================================== */}

      {primitiveEntries.length > 0 && (
        <div className="mt-6">

          <div className="flex items-center gap-2">
            <Beaker
              size={17}
              className="text-gold"
            />

            <h4 className="text-sm font-semibold">
              Test Results
            </h4>
          </div>

          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">

            {primitiveEntries
              .filter(
                ([key]) =>
                  !(
                    statusEntry &&
                    key === statusEntry[0]
                  ),
              )
              .filter(
                ([key]) =>
                  !(
                    reportIdEntry &&
                    key === reportIdEntry[0]
                  ),
              )
              .filter(
                ([key]) =>
                  !(
                    dateEntry &&
                    key === dateEntry[0]
                  ),
              )
              .map(([key, value]) => (
                <ReportField
                  key={key}
                  label={formatLabel(key)}
                  value={formatValue(
                    value,
                    key,
                  )}
                />
              ))}

          </div>
        </div>
      )}


      {/* ======================================================
          NESTED REPORT INFORMATION
         ====================================================== */}

      {objectEntries.map(
        ([key, value]) => {

          if (Array.isArray(value)) {
            return (
              <div
                key={key}
                className="mt-6"
              >

                <h4 className="text-xs uppercase tracking-[0.18em] text-gold font-semibold">
                  {formatLabel(key)}
                </h4>

                <div className="mt-3 space-y-3">

                  {value.map(
                    (item, index) => (
                      <div
                        key={`${key}-${index}`}
                        className="border border-black/10 dark:border-white/10 p-4"
                      >

                        <p className="text-[10px] uppercase tracking-[0.16em] text-gray dark:text-muted">
                          Item {index + 1}
                        </p>

                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">

                          {isObject(item) ? (
                            Object.entries(item).map(
                              ([
                                itemKey,
                                itemValue,
                              ]) => (
                                <ReportField
                                  key={itemKey}
                                  label={formatLabel(
                                    itemKey,
                                  )}
                                  value={formatValue(
                                    itemValue,
                                    itemKey,
                                  )}
                                />
                              ),
                            )
                          ) : (
                            <p className="text-sm font-medium">
                              {formatValue(
                                item,
                                key,
                              )}
                            </p>
                          )}

                        </div>
                      </div>
                    ),
                  )}

                </div>
              </div>
            );
          }

          return (
            <ReportObjectSection
              key={key}
              title={formatLabel(key)}
              data={value}
            />
          );
        },
      )}
    </div>
  );
}


/* ============================================================
   DIGITAL PASSPORT SECTION
   ============================================================ */

function PassportSection({
  batches,
  onOpenBatch,
}) {
  const safeBatches = Array.isArray(batches)
    ? batches
    : [];

  return (
    <div className="w-full min-w-0">

      {/* ======================================================
          SECTION HEADING
         ====================================================== */}

      <div className="mb-8 sm:mb-10">

        <div className="flex items-center gap-3 mb-3">

          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
            04 / Traceability
          </span>

          <span className="h-px w-12 bg-gold/30" />

        </div>

        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-black dark:text-cream">
          Digital <span className="text-gold">Passport.</span>
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray dark:text-muted">
          View laboratory verification results and
          generate a digital QR passport for verified
          honey batches.
        </p>

      </div>


      <SectionLabel>
        Batch verification
      </SectionLabel>


      {/* ======================================================
          INFORMATION BANNER
         ====================================================== */}

      <div className="border border-gold/30 bg-gold/5 p-5 mb-7 sm:mb-8">

        <div className="flex items-start gap-3">

          <FileCheck2
            size={22}
            className="text-gold shrink-0"
          />

          <div className="min-w-0">

            <h3 className="font-semibold">
              Batch verification
            </h3>

            <p className="mt-1 text-sm text-gray dark:text-muted">
              Laboratory reports are submitted and managed
              by KVIC administrators. Here you can view the
              report and generate the public QR passport once
              the result is approved.
            </p>

          </div>
        </div>
      </div>


      {/* ======================================================
          NO BATCHES
         ====================================================== */}

      {safeBatches.length === 0 ? (
        <EmptyState
          icon={QrCode}
          title="No batches available"
          text="Create a honey batch first."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">

          {safeBatches.map((batch) => (
            <button
              key={getId(batch)}
              onClick={() =>
                onOpenBatch(batch)
              }
              className="
                group
                text-left
                min-w-0
                border border-black/10 dark:border-white/10
                bg-cream-card dark:bg-black-card
                p-5 sm:p-6
                hover:border-gold
                transition-all duration-300
              "
            >

              <div className="flex items-center justify-between gap-3">

                <div className="w-10 h-10 flex items-center justify-center border border-gold/30 bg-gold/5">

                  <QrCode
                    size={21}
                    className="text-gold"
                  />

                </div>

                <span className="text-[9px] uppercase tracking-[0.18em] text-muted">
                  Passport
                </span>

              </div>

              <h3 className="mt-5 font-semibold text-black dark:text-cream break-words">
                {batch.batchCode}
              </h3>

              <p className="mt-2 text-xs leading-5 text-gray dark:text-muted">
                {batch.quantityKg ?? '—'} kg ·{' '}
                {batch.floralSourceClaimed ||
                  'Unknown source'}
              </p>

              <div className="mt-5 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-3">

                <span className="text-xs text-gold">
                  Open Digital Passport
                </span>

                <ExternalLink
                  size={14}
                  className="
                    text-gold
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                    transition-transform
                  "
                />

              </div>

            </button>
          ))}

        </div>
      )}

    </div>
  );
}


/* ============================================================
   PASSPORT DETAIL
   ============================================================ */

export function PassportDetail({
  batch,
  onClose,
}) {
  const [report, setReport] = useState(null);
  const [qrData, setQrData] = useState(null);

  const [loadingReport, setLoadingReport] =
    useState(false);

  const [loadingQr, setLoadingQr] =
    useState(false);

  const [error, setError] =
    useState('');

  const batchId = getId(batch);

  const reportData =
    report?.report ||
    report;

  const overallResult = String(
    reportData?.overallResult ??
      reportData?.overall_result ??
      reportData?.result ??
      '',
  )
    .trim()
    .toUpperCase();

  const canGenerateQr =
    Boolean(report) &&
    overallResult === 'PASS';


  /* ==========================================================
     FETCH LAB REPORT
     ========================================================== */

  async function fetchReport() {
    if (!batchId) {
      setError(
        'Unable to identify this batch.',
      );
      return;
    }

    setLoadingReport(true);
    setError('');
    setQrData(null);

    try {
      const response = await apiRequest(
        `/api/lab/report/${batchId}`,
      );

      const fetchedReport =
        response?.report ||
        response;

      setReport(fetchedReport);

    } catch (err) {
      setReport(null);

      setError(
        getErrorMessage(err),
      );
    } finally {
      setLoadingReport(false);
    }
  }


  /* ==========================================================
     GENERATE QR
     ========================================================== */

  async function generateQr() {
    if (!report) {
      setError(
        'Laboratory report is not available yet.',
      );
      return;
    }

    if (overallResult !== 'PASS') {
      setError(
        'QR passport can only be generated when the laboratory result is PASS.',
      );
      return;
    }

    if (!batchId) {
      setError(
        'Unable to identify this batch.',
      );
      return;
    }

    setLoadingQr(true);
    setError('');

    try {
      const response = await apiRequest(
        `/api/qr/generate/${batchId}`,
        {
          method: 'POST',
        },
      );

      setQrData(response);

    } catch (err) {
      setError(
        getErrorMessage(err),
      );
    } finally {
      setLoadingQr(false);
    }
  }


  /* ==========================================================
     DETAIL UI
     ========================================================== */

  return (
    <DetailOverlay
      eyebrow="Digital Passport"
      title={batch?.batchCode || 'Batch'}
      onClose={onClose}
    >

      {/* ======================================================
          ERROR
         ====================================================== */}

      {error && (
        <div className="mb-5 border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">

        {/* ====================================================
            LABORATORY VERIFICATION
           ==================================================== */}

        <div className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-5 sm:p-6">

          <div className="flex items-center justify-between gap-3">

            <div className="w-10 h-10 flex items-center justify-center border border-gold/30 bg-gold/5">

              <FlaskConical
                size={21}
                className="text-gold"
              />

            </div>

            <span className="text-[9px] uppercase tracking-[0.18em] text-gold">
              Verification
            </span>

          </div>


          <h3 className="mt-5 text-lg font-semibold">
            Laboratory Verification
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray dark:text-muted">
            Laboratory reports are submitted by KVIC
            administrators. Fetch the latest report here
            to view the verification result for this batch.
          </p>


          {/* Batch summary */}

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">

            <ReportField
              label="Batch"
              value={
                batch?.batchCode || '—'
              }
              icon={Tag}
            />

            <ReportField
              label="Quantity"
              value={
                batch?.quantityKg !== undefined
                  ? `${batch.quantityKg} kg`
                  : '—'
              }
              icon={Weight}
            />

            <ReportField
              label="Harvest Date"
              value={formatDate(
                batch?.harvestDate,
              )}
              icon={CalendarDays}
            />

            <ReportField
              label="Floral Source"
              value={
                batch?.floralSourceClaimed ||
                'Unknown'
              }
              icon={Droplets}
            />

          </div>


          {/* Fetch report */}

          <div className="mt-6">

            <button
              onClick={fetchReport}
              disabled={loadingReport}
              className="
                w-full
                bg-black
                text-cream
                dark:bg-cream
                dark:text-black
                px-4 py-3
                text-xs font-semibold
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-opacity
              "
            >
              {loadingReport
                ? 'Fetching Laboratory Report...'
                : 'Fetch Laboratory Report'}
            </button>

          </div>


          {/* Report status */}

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">

            <span
              className={`
                px-2 py-2
                border
                ${
                  report
                    ? 'border-green-600/40 text-green-600'
                    : 'border-black/15 dark:border-white/15 text-muted'
                }
              `}
            >
              {report
                ? '✓ Report available'
                : '1. Laboratory report pending'}
            </span>

            <span
              className={`
                px-2 py-2
                border
                ${
                  canGenerateQr
                    ? 'border-green-600/40 text-green-600'
                    : 'border-black/15 dark:border-white/15 text-muted'
                }
              `}
            >
              {canGenerateQr
                ? '✓ Approved for QR'
                : '2. Await PASS result'}
            </span>

          </div>


          {/* Laboratory report */}

          {report && (
            <LaboratoryReport
              report={report}
            />
          )}

        </div>


        {/* ====================================================
            DIGITAL QR PASSPORT
           ==================================================== */}

        <div className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-5 sm:p-6">

          <div className="flex items-center justify-between gap-3">

            <div className="w-10 h-10 flex items-center justify-center border border-gold/30 bg-gold/5">

              <QrCode
                size={21}
                className="text-gold"
              />

            </div>

            <span className="text-[9px] uppercase tracking-[0.18em] text-gold">
              Public Passport
            </span>

          </div>


          <h3 className="mt-5 text-lg font-semibold">
            Digital QR Passport
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray dark:text-muted">
            A public QR passport can only be generated
            after a laboratory report with a PASS result
            is available.
          </p>


          {/* Locked state */}

          {!canGenerateQr && (
            <div className="mt-6 border border-dashed border-orange-500/30 bg-orange-500/5 p-5">

              <div className="flex items-start gap-3">

                <ShieldCheck
                  size={20}
                  className="text-orange-500 shrink-0"
                />

                <div>

                  <p className="text-sm font-semibold">
                    QR locked
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray dark:text-muted">
                    Fetch the laboratory report first.
                    The QR passport becomes available only
                    when the laboratory result is PASS.
                  </p>

                </div>

              </div>

            </div>
          )}


          {/* QR action */}

          <div className="mt-6">

            <button
              onClick={generateQr}
              disabled={
                !canGenerateQr ||
                loadingQr
              }
              className="
                w-full
                bg-gold
                text-black
                px-4 py-3
                text-xs font-semibold
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              {loadingQr
                ? 'Generating...'
                : canGenerateQr
                  ? 'Generate QR'
                  : 'Waiting for PASS result'}
            </button>

          </div>


          {/* QR result */}

          {qrData && (
            <div className="mt-6 border border-black/10 dark:border-white/10 p-5">

              <div className="flex items-center gap-2">

                <CheckCircle2
                  size={17}
                  className="text-green-600"
                />

                <p className="text-sm font-semibold">
                  QR Passport Generated
                </p>

              </div>


              {qrData.qrImageDataUrl && (
                <div className="mt-5">

                  <p className="text-[10px] uppercase tracking-[0.16em] text-gray dark:text-muted mb-3">
                    Scan this QR code
                  </p>

                  <div className="inline-flex border border-black/10 dark:border-white/10 p-3 bg-white">

                    <img
                      src={
                        qrData.qrImageDataUrl
                      }
                      alt="Honey batch QR code"
                      className="w-48 h-48"
                    />

                  </div>

                </div>
              )}


              <a
                href={`/passport/${batchId}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-xs text-gold underline"
              >
                Open Public Passport
                <ExternalLink size={13} />
              </a>

            </div>
          )}


          {/* Report ready */}

          {canGenerateQr && !qrData && (
            <div className="mt-6 border border-dashed border-green-600/30 bg-green-600/5 p-5">

              <div className="flex items-start gap-3">

                <QrCode
                  size={20}
                  className="text-gold shrink-0"
                />

                <div>

                  <p className="text-sm font-semibold">
                    Report approved — generate QR
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray dark:text-muted">
                    The laboratory result is PASS.
                    You can now create the public digital
                    passport for this batch.
                  </p>

                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </DetailOverlay>
  );
}


/* ============================================================
   EXPORTS
   ============================================================ */

export default PassportSection;