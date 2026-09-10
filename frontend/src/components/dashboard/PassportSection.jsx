
import { useState } from 'react';

import {
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  FlaskConical,
  QrCode,
  Clock3,
  ShieldCheck,
  Beaker,
  CalendarDays,
  Droplets,
  Thermometer,
  Weight,
  Tag,
} from 'lucide-react';

import {
  PageHeader,
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

/*
 * Convert backend field names into readable labels.
 *
 * Example:
 * moistureContent -> Moisture Content
 * testDate        -> Test Date
 * labName         -> Lab Name
 */
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


/*
 * Format values coming from the backend.
 */
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


/*
 * Check whether an object is a simple object.
 */
function isObject(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
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
            className="text-gold"
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


  /*
   * Some APIs return:
   *
   * {
   *   report: {...}
   * }
   *
   * while others return the report object directly.
   */
  const reportData =
    report?.report ||
    report;


  /*
   * Remove wrapper/meta fields from the
   * general fields section when possible.
   */
  const entries = Object.entries(
    reportData,
  ).filter(
    ([, value]) =>
      value !== null &&
      value !== undefined &&
      value !== '',
  );


  /*
   * Separate primitive fields from
   * nested objects and arrays.
   */
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


  /*
   * Find common fields that deserve
   * highlighted presentation.
   */
  const statusEntry = entries.find(
    ([key]) =>
      key.toLowerCase() === 'status' ||
      key.toLowerCase() === 'result' ||
      key.toLowerCase() === 'verificationstatus',
  );


  const reportIdEntry = entries.find(
    ([key]) =>
      key.toLowerCase().includes('reportid') ||
      key.toLowerCase().includes('reportcode'),
  );


  const dateEntry = entries.find(
    ([key]) =>
      key.toLowerCase().includes('testdate') ||
      key.toLowerCase().includes('reportdate') ||
      key.toLowerCase() === 'date',
  );


  return (

    <div className="mt-6">

      {/* ======================================================
          REPORT HEADER
         ====================================================== */}

      <div className="border border-green-600/30 bg-green-600/5 p-5">

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="mt-0.5">

              <CheckCircle2
                size={22}
                className="text-green-600"
              />

            </div>

            <div>

              <p className="text-[10px] uppercase tracking-[0.18em] text-green-700 dark:text-green-400 font-semibold">
                Verification Complete
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
            className="text-green-600 shrink-0"
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
              label="Status"
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

  return (

    <div>

      <PageHeader
        eyebrow="04 / Traceability"
        title="Digital Passport"
        description="Submit honey batches for laboratory verification and generate their digital QR passport."
      />


      {/* ======================================================
          INFORMATION BANNER
         ====================================================== */}

      <div className="border border-gold/30 bg-gold/5 p-5 mb-6">

        <div className="flex gap-3">

          <FileCheck2
            size={22}
            className="text-gold shrink-0"
          />

          <div>

            <h3 className="font-semibold">
              Batch verification
            </h3>

            <p className="mt-1 text-sm text-gray dark:text-muted">
              Laboratory submission and QR generation are
              handled here, separately from Honey Batch
              management.
            </p>

          </div>

        </div>

      </div>


      {/* ======================================================
          NO BATCHES
         ====================================================== */}

      {batches.length === 0 ? (

        <EmptyState
          icon={QrCode}
          title="No batches available"
          text="Create a honey batch first."
        />

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {batches.map((batch) => (

            <button
              key={getId(batch)}
              onClick={() =>
                onOpenBatch(batch)
              }
              className="text-left border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-6 hover:border-gold transition-colors"
            >

              <QrCode
                size={24}
                className="text-gold"
              />

              <h3 className="mt-5 font-semibold">
                {batch.batchCode}
              </h3>

              <p className="mt-2 text-xs text-gray dark:text-muted">
                {batch.quantityKg ?? '—'} kg ·{' '}
                {batch.floralSourceClaimed ||
                  'Unknown source'}
              </p>

              <p className="mt-5 text-xs text-gold">
                Open Digital Passport →
              </p>

            </button>

          ))}

        </div>

      )}

    </div>

  );
}

function PassportDetail({
  batch,
  onClose,
  actionLoading,
  setActionLoading,
  setError,
}) {
  const [report, setReport] = useState(null);
  const [qrData, setQrData] = useState(null);

  const [loadingReport, setLoadingReport] = useState(false);
  const [loadingQr, setLoadingQr] = useState(false);

  const [labSuccess, setLabSuccess] = useState('');
  const [labSubmitted, setLabSubmitted] = useState(false);

  const batchId = getId(batch);

  // QR only after report is ready
  const canGenerateQr = !!report;

  /* ==========================================================
     SUBMIT TO LAB
     ========================================================== */

  async function submitToLab() {
    setActionLoading(true);
    setError('');
    setLabSuccess('');

    try {
      await apiRequest(`/api/lab/submit/${batchId}`, {
        method: 'POST',
        body: JSON.stringify({
          delayMs: 5000,
        }),
      });

      setLabSubmitted(true);
      setLabSuccess('Successfully submitted to laboratory.');

      setTimeout(() => {
        setLabSuccess('');
      }, 5000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }

  /* ==========================================================
     FETCH LAB REPORT
     ========================================================== */

  async function fetchReport() {
    setLoadingReport(true);
    setError('');
    setLabSuccess('');

    try {
      const response = await apiRequest(
        `/api/lab/report/${batchId}`,
      );

      setReport(response?.report || response);
    } catch (err) {
      setReport(null);
      setError(getErrorMessage(err));
    } finally {
      setLoadingReport(false);
    }
  }

  /* ==========================================================
     GENERATE QR — only if report is ready
     ========================================================== */

  async function generateQr() {
    if (!report) {
      setError(
        'Lab report is not ready yet. Submit the sample and fetch the report first.',
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
      setError(getErrorMessage(err));
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
      title={batch.batchCode || 'Batch'}
      onClose={onClose}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ==================================================
           LABORATORY VERIFICATION
           ================================================== */}

        <div className="border border-black/10 dark:border-white/10 p-6">
          <FlaskConical size={25} className="text-gold" />

          <h3 className="mt-4 text-lg font-semibold">
            Laboratory Verification
          </h3>

          <p className="mt-2 text-sm text-gray dark:text-muted">
            Submit this batch for laboratory testing and
            retrieve its report before generating a QR.
          </p>

          {/* Batch summary */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ReportField
              label="Batch"
              value={batch.batchCode || '—'}
              icon={Tag}
            />
            <ReportField
              label="Quantity"
              value={
                batch.quantityKg !== undefined
                  ? `${batch.quantityKg} kg`
                  : '—'
              }
              icon={Weight}
            />
            <ReportField
              label="Harvest Date"
              value={formatDate(batch.harvestDate)}
              icon={CalendarDays}
            />
            <ReportField
              label="Floral Source"
              value={batch.floralSourceClaimed || 'Unknown'}
              icon={Droplets}
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={submitToLab}
              disabled={actionLoading}
              className="bg-black text-cream dark:bg-cream dark:text-black px-4 py-3 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {actionLoading ? 'Submitting...' : 'Submit to Lab'}
            </button>

            <button
              onClick={fetchReport}
              disabled={loadingReport}
              className="border border-black/10 dark:border-white/10 px-4 py-3 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingReport ? 'Fetching...' : 'Fetch Report'}
            </button>
          </div>

          {/* Step status */}
          <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
            <span
              className={`px-2 py-1 border ${
                labSubmitted
                  ? 'border-green-600/40 text-green-600'
                  : 'border-black/15 dark:border-white/15 text-muted'
              }`}
            >
              {labSubmitted ? '✓ Submitted' : '1. Submit sample'}
            </span>
            <span
              className={`px-2 py-1 border ${
                report
                  ? 'border-green-600/40 text-green-600'
                  : 'border-black/15 dark:border-white/15 text-muted'
              }`}
            >
              {report ? '✓ Report ready' : '2. Report ready'}
            </span>
            <span
              className={`px-2 py-1 border ${
                qrData
                  ? 'border-green-600/40 text-green-600'
                  : 'border-black/15 dark:border-white/15 text-muted'
              }`}
            >
              {qrData ? '✓ QR generated' : '3. Generate QR'}
            </span>
          </div>

          {labSuccess && (
            <div className="mt-4 flex items-start gap-3 border border-green-600/30 bg-green-600/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">
                  Laboratory submission successful
                </p>
                <p className="mt-0.5 text-xs">{labSuccess}</p>
              </div>
            </div>
          )}

          {report && <LaboratoryReport report={report} />}
        </div>

        {/* ==================================================
           DIGITAL QR PASSPORT
           ================================================== */}

        <div className="border border-black/10 dark:border-white/10 p-6">
          <QrCode size={25} className="text-gold" />

          <h3 className="mt-4 text-lg font-semibold">
            Digital QR Passport
          </h3>

          <p className="mt-2 text-sm text-gray dark:text-muted">
            QR can be generated only after the lab report is ready.
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
                  <p className="mt-1 text-xs text-gray dark:text-muted">
                    Submit the batch sample to the lab, then fetch
                    the report. Once the report is available, you
                    can generate the QR passport.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* QR action */}
          <div className="mt-6">
            <button
              onClick={generateQr}
              disabled={!canGenerateQr || loadingQr}
              className="bg-gold text-black px-4 py-3 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loadingQr
                ? 'Generating...'
                : canGenerateQr
                  ? 'Generate QR'
                  : 'Waiting for lab report'}
            </button>
          </div>

          {/* QR result */}
          {qrData && (
            <div className="mt-6 border border-black/10 dark:border-white/10 p-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-600" />
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
                      src={qrData.qrImageDataUrl}
                      alt="Honey batch QR code"
                      className="w-48 h-48"
                    />
                  </div>
                </div>
              )}

              {qrData.publicUrl && (
                <a
                  href={qrData.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-xs text-gold underline"
                >
                  Open Public Passport
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          )}

          {/* Empty when report ready but QR not generated */}
          {canGenerateQr && !qrData && (
            <div className="mt-6 border border-dashed border-black/10 dark:border-white/10 p-5">
              <div className="flex items-start gap-3">
                <QrCode size={20} className="text-gold shrink-0" />
                <div>
                  <p className="text-sm font-semibold">
                    Report ready — generate QR
                  </p>
                  <p className="mt-1 text-xs text-gray dark:text-muted">
                    Lab report is available. You can now create the
                    public digital passport for this batch.
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

export {
  PassportDetail,
};


