import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  AlertTriangle,
  ArrowLeft,
  Beaker,
  CheckCircle2,
  ClipboardList,
  Eye,
  FlaskConical,
  LoaderCircle,
  Package,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';

import {
  getKvicBatches,
  getKvicReports,
  getKvicReportHistory,
  submitKvicLabReport,
} from '../../services/kvicApi';


/*
|--------------------------------------------------------------------------
| SAFE DISPLAY HELPERS
|--------------------------------------------------------------------------
*/

function displayValue(value) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '—';
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
          item !== undefined
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
  return (
    item?._id ||
    item?.id ||
    item?.batchId ||
    null
  );
}


/*
|--------------------------------------------------------------------------
| BATCH HELPERS
|--------------------------------------------------------------------------
*/

function getBatchCode(batch) {
  return (
    batch?.batchCode ||
    batch?.code ||
    batch?.batch_id ||
    batch?.batchId ||
    getId(batch) ||
    'Unnamed Batch'
  );
}


function getStatus(batch) {
  return String(
    batch?.status ||
    batch?.batchStatus ||
    'unknown'
  ).toLowerCase();
}


function getStatusLabel(status) {
  if (!status) {
    return 'Unknown';
  }

  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}


function getStatusClass(status) {
  const normalized = String(
    status || ''
  ).toLowerCase();

  if (
    normalized === 'completed' ||
    normalized === 'complete' ||
    normalized === 'approved' ||
    normalized === 'passed' ||
    normalized === 'pass'
  ) {
    return 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400';
  }

  if (
    normalized === 'failed' ||
    normalized === 'rejected' ||
    normalized === 'fail'
  ) {
    return 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400';
  }

  if (
    normalized === 'processing' ||
    normalized === 'in_progress' ||
    normalized === 'pending'
  ) {
    return 'border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400';
  }

  return 'border-zinc-500/30 bg-zinc-500/10 text-zinc-600 dark:text-zinc-400';
}


/*
|--------------------------------------------------------------------------
| DATE
|--------------------------------------------------------------------------
*/

function formatDate(value) {
  if (!value) {
    return '—';
  }

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


/*
|--------------------------------------------------------------------------
| QUANTITY
|--------------------------------------------------------------------------
*/

function formatQuantity(batch) {
  const value =
    batch?.quantity ??
    batch?.quantityKg ??
    batch?.honeyQuantity ??
    batch?.honeyQuantityKg ??
    batch?.weight ??
    batch?.weightKg;

  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '—';
  }

  const unit =
    batch?.unit ||
    batch?.quantityUnit ||
    batch?.weightUnit ||
    'kg';

  return `${displayValue(value)} ${unit}`;
}


/*
|--------------------------------------------------------------------------
| FARM
|--------------------------------------------------------------------------
*/

function getFarmName(batch) {
  const farm =
    batch?.farm ||
    batch?.farmId;

  if (!farm) {
    return '—';
  }

  if (
    typeof farm === 'string' ||
    typeof farm === 'number'
  ) {
    return String(farm);
  }

  return (
    farm?.name ||
    farm?.farmName ||
    farm?.farmCode ||
    farm?._id ||
    '—'
  );
}


/*
|--------------------------------------------------------------------------
| KEEPER
|--------------------------------------------------------------------------
*/

function getKeeperName(batch) {
  const keeper =
    batch?.keeper ||
    batch?.keeperId ||
    batch?.farmer;

  if (!keeper) {
    return '—';
  }

  if (
    typeof keeper === 'string' ||
    typeof keeper === 'number'
  ) {
    return String(keeper);
  }

  return (
    keeper?.name ||
    keeper?.fullName ||
    keeper?.keeperName ||
    keeper?.phone ||
    keeper?._id ||
    '—'
  );
}


/*
|--------------------------------------------------------------------------
| CREATED DATE
|--------------------------------------------------------------------------
*/

function getCreatedDate(batch) {
  return (
    batch?.createdAt ||
    batch?.created_at ||
    batch?.date ||
    batch?.harvestDate ||
    batch?.productionDate
  );
}


/*
|--------------------------------------------------------------------------
| REPORT MATCHING
|--------------------------------------------------------------------------
*/

function getReportForBatch(
  reports,
  batch
) {
  const batchId = String(
    getId(batch) || ''
  );

  const batchCode = String(
    getBatchCode(batch) || ''
  );

  return reports.find(
    (report) => {
      const reportBatch =
        report?.batch ||
        report?.batchId;

      if (!reportBatch) {
        return false;
      }

      const reportBatchId =
        typeof reportBatch === 'object'
          ? getId(reportBatch)
          : reportBatch;

      return (
        String(
          reportBatchId || ''
        ) === batchId ||
        String(
          reportBatchId || ''
        ) === batchCode
      );
    }
  );
}


/*
|--------------------------------------------------------------------------
| REPORT STATUS
|--------------------------------------------------------------------------
*/

function ReportStatus({
  report,
}) {
  if (!report) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-500/20 bg-zinc-500/5 px-2.5 py-1 text-xs font-medium text-zinc-500">
        No Report
      </span>
    );
  }

  const result = String(
    report?.overallResult ||
      report?.overall_result ||
      report?.result ||
      ''
  ).toLowerCase();

  if (
    result === 'pass' ||
    result === 'passed'
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600 dark:text-green-400">
        <CheckCircle2 size={13} />
        Passed
      </span>
    );
  }

  if (
    result === 'fail' ||
    result === 'failed'
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400">
        <AlertTriangle size={13} />
        Failed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
      <FlaskConical size={13} />

      {displayValue(
        report?.overallResult ||
          report?.overall_result ||
          report?.result
      )}
    </span>
  );
}


/*
|--------------------------------------------------------------------------
| INFO CARD
|--------------------------------------------------------------------------
*/

function InfoCard({
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
      <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold text-zinc-900 dark:text-white">
        {displayValue(value)}
      </p>
    </div>
  );
}


/*
|--------------------------------------------------------------------------
| FORM FIELD
|--------------------------------------------------------------------------
*/

function FormField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  step,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        step={step}
        className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
      />
    </div>
  );
}


/*
|--------------------------------------------------------------------------
| LAB REPORT SUBMISSION FORM
|--------------------------------------------------------------------------
*/

function LabReportSubmissionForm({
  batch,
  report,
  submitting,
  submitError,
  submitSuccess,
  onSubmit,
}) {
  const [form, setForm] = useState({
    labName: '',
    sampleId: '',
    testedDate: '',
    moisturePct: '',
    hmfMgPerKg: '',
    reducingSugarPct: '',
    sucrosePct: '',
    fructoseGlucoseRatio: '',
    c4SugarTestResult: 'pass',
    diastaseActivity: '',
    pollenFloralSource: '',
    overallResult: 'pass',
  });

  const existingReport = Boolean(report);

  const updateField = (
    field,
    value
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    if (existingReport) {
      return;
    }

    const payload = {
      labName:
        form.labName.trim(),

      sampleId:
        form.sampleId.trim(),

      testedDate:
        form.testedDate
          ? new Date(
              form.testedDate
            ).toISOString()
          : new Date().toISOString(),

      moisturePct:
        Number(form.moisturePct),

      hmfMgPerKg:
        Number(form.hmfMgPerKg),

      reducingSugarPct:
        Number(
          form.reducingSugarPct
        ),

      sucrosePct:
        Number(form.sucrosePct),

      fructoseGlucoseRatio:
        Number(
          form.fructoseGlucoseRatio
        ),

      c4SugarTestResult:
        form.c4SugarTestResult,

      diastaseActivity:
        Number(
          form.diastaseActivity
        ),

      pollenFloralSource:
        form.pollenFloralSource.trim(),

      overallResult:
        form.overallResult,
    };

    await onSubmit(payload);
  };

  return (
    <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 dark:border-amber-500/20 dark:bg-amber-500/5">

      {/* HEADER */}

      <div className="mb-5 flex items-start gap-3">

        <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600">
          <Beaker size={18} />
        </div>

        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-white">
            Submit Laboratory Report
          </h3>

          <p className="mt-1 text-xs text-zinc-500">
            KVIC administrator can submit
            the laboratory verification
            results for this batch.
          </p>
        </div>

      </div>


      {/* EXISTING REPORT */}

      {existingReport ? (
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-sm text-green-600 dark:text-green-400">
          A laboratory report already
          exists for this batch. A new
          report cannot be submitted here.
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* BASIC INFORMATION */}

          <div>

            <p className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
              Report Information
            </p>

            <div className="grid gap-4 sm:grid-cols-2">

              <FormField
                label="Laboratory Name"
                value={form.labName}
                onChange={(value) =>
                  updateField(
                    'labName',
                    value
                  )
                }
                placeholder="KVIC Regional Testing Lab"
                required
              />

              <FormField
                label="Sample ID"
                value={form.sampleId}
                onChange={(value) =>
                  updateField(
                    'sampleId',
                    value
                  )
                }
                placeholder="SMPL-A1B2C3D4"
                required
              />

              <FormField
                label="Tested Date"
                type="datetime-local"
                value={form.testedDate}
                onChange={(value) =>
                  updateField(
                    'testedDate',
                    value
                  )
                }
                required
              />

              <FormField
                label="Pollen / Floral Source"
                value={
                  form.pollenFloralSource
                }
                onChange={(value) =>
                  updateField(
                    'pollenFloralSource',
                    value
                  )
                }
                placeholder="Mixed floral"
                required
              />

            </div>

          </div>


          {/* LABORATORY MEASUREMENTS */}

          <div>

            <p className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
              Laboratory Measurements
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <FormField
                label="Moisture (%)"
                type="number"
                step="0.01"
                value={
                  form.moisturePct
                }
                onChange={(value) =>
                  updateField(
                    'moisturePct',
                    value
                  )
                }
                placeholder="18.4"
                required
              />

              <FormField
                label="HMF (mg/kg)"
                type="number"
                step="0.01"
                value={
                  form.hmfMgPerKg
                }
                onChange={(value) =>
                  updateField(
                    'hmfMgPerKg',
                    value
                  )
                }
                placeholder="14.2"
                required
              />

              <FormField
                label="Reducing Sugar (%)"
                type="number"
                step="0.01"
                value={
                  form.reducingSugarPct
                }
                onChange={(value) =>
                  updateField(
                    'reducingSugarPct',
                    value
                  )
                }
                placeholder="69.8"
                required
              />

              <FormField
                label="Sucrose (%)"
                type="number"
                step="0.01"
                value={
                  form.sucrosePct
                }
                onChange={(value) =>
                  updateField(
                    'sucrosePct',
                    value
                  )
                }
                placeholder="4.1"
                required
              />

              <FormField
                label="Fructose / Glucose Ratio"
                type="number"
                step="0.01"
                value={
                  form.fructoseGlucoseRatio
                }
                onChange={(value) =>
                  updateField(
                    'fructoseGlucoseRatio',
                    value
                  )
                }
                placeholder="1.19"
                required
              />

              <FormField
                label="Diastase Activity"
                type="number"
                step="0.01"
                value={
                  form.diastaseActivity
                }
                onChange={(value) =>
                  updateField(
                    'diastaseActivity',
                    value
                  )
                }
                placeholder="11.9"
                required
              />

            </div>

          </div>


          {/* TEST RESULTS */}

          <div>

            <p className="mb-3 text-sm font-semibold text-zinc-900 dark:text-white">
              Test Results
            </p>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* C4 TEST */}

              <div>

                <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  C4 Sugar Test
                </label>

                <select
                  value={
                    form.c4SugarTestResult
                  }
                  onChange={(event) =>
                    updateField(
                      'c4SugarTestResult',
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                >

                  <option value="pass">
                    Pass
                  </option>

                  <option value="fail">
                    Fail
                  </option>

                </select>

              </div>


              {/* OVERALL RESULT */}

              <div>

                <label className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Overall Result
                </label>

                <select
                  value={
                    form.overallResult
                  }
                  onChange={(event) =>
                    updateField(
                      'overallResult',
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-amber-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                >

                  <option value="pass">
                    Pass
                  </option>

                  <option value="fail">
                    Fail
                  </option>

                </select>

              </div>

            </div>

          </div>


          {/* ERRORS */}

          {submitError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400">
              {submitError}
            </div>
          )}


          {/* SUCCESS */}

          {submitSuccess && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-sm text-green-600 dark:text-green-400">
              {submitSuccess}
            </div>
          )}


          {/* SUBMIT BUTTON */}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >

            {submitting ? (
              <>
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />

                Submitting Report...
              </>
            ) : (
              <>
                <FlaskConical
                  size={17}
                />

                Submit Lab Report
              </>
            )}

          </button>

        </form>
      )}

    </section>
  );
}


/*
|--------------------------------------------------------------------------
| BATCH DETAILS MODAL
|--------------------------------------------------------------------------
*/

function BatchDetailsModal({
  batch,
  report,
  history,
  historyLoading,
  historyError,
  submittingReport,
  reportSubmitError,
  reportSubmitSuccess,
  onSubmitLabReport,
  onLoadHistory,
  onClose,
}) {
  if (!batch) {
    return null;
  }

  const batchCode =
    getBatchCode(batch);

  const status =
    getStatus(batch);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">

        {/* MODAL HEADER */}

        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white/95 px-6 py-5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
              Batch Details
            </p>

            <h2 className="mt-1 text-xl font-bold text-zinc-900 dark:text-white">
              {displayValue(batchCode)}
            </h2>

          </div>


          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-200 p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-white"
          >
            <X size={20} />
          </button>

        </div>


        <div className="space-y-6 p-6">

          {/* STATUS */}

          <div className="flex flex-wrap items-center gap-3">

            <span
              className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                status
              )}`}
            >
              {getStatusLabel(status)}
            </span>

            <ReportStatus
              report={report}
            />

          </div>


          {/* BASIC DETAILS */}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <InfoCard
              label="Farm"
              value={getFarmName(batch)}
            />

            <InfoCard
              label="Keeper"
              value={getKeeperName(batch)}
            />

            <InfoCard
              label="Quantity"
              value={formatQuantity(batch)}
            />

            <InfoCard
              label="Created"
              value={formatDate(
                getCreatedDate(batch)
              )}
            />

            <InfoCard
              label="Harvest Date"
              value={formatDate(
                batch?.harvestDate
              )}
            />

            <InfoCard
              label="Batch ID"
              value={getId(batch)}
            />

          </div>


          {/* EXISTING LAB REPORT */}

          <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">

            <div className="mb-4 flex items-center gap-3">

              <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600">
                <Beaker size={18} />
              </div>

              <div>

                <h3 className="font-semibold text-zinc-900 dark:text-white">
                  Laboratory Report
                </h3>

                <p className="text-xs text-zinc-500">
                  Latest report associated
                  with this batch
                </p>

              </div>

            </div>


            {!report ? (
              <div className="rounded-xl border border-dashed border-zinc-300 p-5 text-center text-sm text-zinc-500 dark:border-zinc-700">
                No laboratory report is
                available for this batch.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">

                <InfoCard
                  label="Result"
                  value={
                    report?.overallResult ||
                    report?.overall_result ||
                    report?.result
                  }
                />

                <InfoCard
                  label="Report Date"
                  value={formatDate(
                    report?.createdAt ||
                      report?.testedDate ||
                      report?.date
                  )}
                />

                <InfoCard
                  label="Report ID"
                  value={getId(report)}
                />

                <InfoCard
                  label="Laboratory"
                  value={
                    report?.laboratory ||
                    report?.labName ||
                    report?.lab
                  }
                />

                <InfoCard
                  label="Sample ID"
                  value={
                    report?.sampleId
                  }
                />

                <InfoCard
                  label="Tested Date"
                  value={formatDate(
                    report?.testedDate
                  )}
                />

              </div>
            )}

          </section>


          {/* SUBMIT LAB REPORT */}

          <LabReportSubmissionForm
            batch={batch}
            report={report}
            submitting={
              submittingReport
            }
            submitError={
              reportSubmitError
            }
            submitSuccess={
              reportSubmitSuccess
            }
            onSubmit={
              onSubmitLabReport
            }
          />


          {/* REPORT HISTORY */}

          <section className="rounded-2xl border border-zinc-200 p-5 dark:border-zinc-800">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="rounded-xl bg-blue-500/10 p-2 text-blue-600">
                  <ClipboardList size={18} />
                </div>

                <div>

                  <h3 className="font-semibold text-zinc-900 dark:text-white">
                    Report History
                  </h3>

                  <p className="text-xs text-zinc-500">
                    Previous laboratory
                    reports
                  </p>

                </div>

              </div>


              <button
                type="button"
                onClick={onLoadHistory}
                disabled={historyLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:hover:bg-zinc-900"
              >

                {historyLoading ? (
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <RefreshCw
                    size={16}
                  />
                )}

                Load History

              </button>

            </div>


            {/* HISTORY ERROR */}

            {historyError && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400">
                {historyError}
              </div>
            )}


            {/* HISTORY ITEMS */}

            {Array.isArray(history) &&
              history.length > 0 && (
                <div className="mt-5 space-y-3">

                  {history.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          getId(item) ||
                          `${batchCode}-${index}`
                        }
                        className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
                      >

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                          <div>

                            <p className="font-medium text-zinc-900 dark:text-white">
                              Report #{index + 1}
                            </p>

                            <p className="text-xs text-zinc-500">
                              {formatDate(
                                item?.createdAt ||
                                  item?.testedDate ||
                                  item?.date
                              )}
                            </p>

                          </div>

                          <ReportStatus
                            report={item}
                          />

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}


            {/* EMPTY HISTORY */}

            {Array.isArray(history) &&
              history.length === 0 &&
              !historyLoading && (
                <div className="mt-5 rounded-xl border border-dashed border-zinc-300 p-5 text-center text-sm text-zinc-500 dark:border-zinc-700">
                  No previous report
                  history found.
                </div>
              )}

          </section>

        </div>

      </div>

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| MAIN PAGE
|--------------------------------------------------------------------------
*/

export default function KvicBatches() {

  const [batches, setBatches] =
    useState([]);

  const [reports, setReports] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [
    statusFilter,
    setStatusFilter,
  ] = useState('');

  const [
    selectedBatch,
    setSelectedBatch,
  ] = useState(null);

  const [
    selectedReport,
    setSelectedReport,
  ] = useState(null);

  const [history, setHistory] =
    useState([]);

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(false);

  const [
    historyError,
    setHistoryError,
  ] = useState('');

  const [
    submittingReport,
    setSubmittingReport,
  ] = useState(false);

  const [
    reportSubmitError,
    setReportSubmitError,
  ] = useState('');

  const [
    reportSubmitSuccess,
    setReportSubmitSuccess,
  ] = useState('');


  /*
  |--------------------------------------------------------------------------
  | LOAD DATA
  |--------------------------------------------------------------------------
  */

  const loadData = async () => {
    try {

      setLoading(true);
      setError('');

      const [
        batchesResponse,
        reportsResponse,
      ] = await Promise.all([
        getKvicBatches(
          statusFilter
        ),
        getKvicReports(),
      ]);

      const batchData =
        Array.isArray(
          batchesResponse
        )
          ? batchesResponse
          : batchesResponse?.batches ||
            batchesResponse?.data ||
            [];

      const reportData =
        Array.isArray(
          reportsResponse
        )
          ? reportsResponse
          : reportsResponse?.reports ||
            reportsResponse?.data ||
            [];

      setBatches(batchData);
      setReports(reportData);

    } catch (err) {

      console.error(
        'KVIC batch loading error:',
        err
      );

      setError(
        err?.message ||
          'Failed to load batch data.'
      );

    } finally {

      setLoading(false);

    }
  };


  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD / FILTER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadData();
  }, [statusFilter]);


  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const filteredBatches =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return batches;
      }

      return batches.filter(
        (batch) => {

          const values = [
            getBatchCode(batch),
            getFarmName(batch),
            getKeeperName(batch),
            batch?.status,
          ];

          return values.some(
            (value) =>
              displayValue(value)
                .toLowerCase()
                .includes(query)
          );

        }
      );

    }, [
      batches,
      search,
    ]);


  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const statistics =
    useMemo(() => {

      const total =
        batches.length;

      const completed =
        batches.filter(
          (batch) =>
            [
              'completed',
              'complete',
            ].includes(
              getStatus(batch)
            )
        ).length;

      const processing =
        batches.filter(
          (batch) =>
            [
              'processing',
              'pending',
              'in_progress',
            ].includes(
              getStatus(batch)
            )
        ).length;

      const failed =
        batches.filter(
          (batch) =>
            [
              'failed',
              'rejected',
            ].includes(
              getStatus(batch)
            )
        ).length;

      return {
        total,
        completed,
        processing,
        failed,
      };

    }, [batches]);


  /*
  |--------------------------------------------------------------------------
  | OPEN BATCH
  |--------------------------------------------------------------------------
  */

  const openBatch = (
    batch
  ) => {

    setSelectedBatch(
      batch
    );

    setSelectedReport(
      getReportForBatch(
        reports,
        batch
      )
    );

    setHistory([]);

    setHistoryError('');

    setReportSubmitError('');

    setReportSubmitSuccess('');
  };


  /*
  |--------------------------------------------------------------------------
  | CLOSE BATCH
  |--------------------------------------------------------------------------
  */

  const closeBatch = () => {

    setSelectedBatch(null);

    setSelectedReport(null);

    setHistory([]);

    setHistoryError('');

    setReportSubmitError('');

    setReportSubmitSuccess('');

  };


  /*
  |--------------------------------------------------------------------------
  | SUBMIT LAB REPORT
  |--------------------------------------------------------------------------
  */

  const handleSubmitLabReport =
    async (payload) => {

      if (!selectedBatch) {
        return;
      }

      const batchId =
        getId(selectedBatch);

      if (!batchId) {

        setReportSubmitError(
          'Batch ID is not available.'
        );

        return;
      }

      try {

        setSubmittingReport(
          true
        );

        setReportSubmitError('');

        setReportSubmitSuccess('');

        await submitKvicLabReport(
          batchId,
          {
            ...payload,
            batch: batchId,
          }
        );

        setReportSubmitSuccess(
          'Laboratory report submitted successfully.'
        );

        /*
         * Reload all batch/report data.
         */
        await loadData();

        /*
         * Fetch reports again so that
         * the selected batch immediately
         * gets its new report.
         */
        const refreshedReportsResponse =
          await getKvicReports();

        const refreshedReports =
          Array.isArray(
            refreshedReportsResponse
          )
            ? refreshedReportsResponse
            : refreshedReportsResponse?.reports ||
              refreshedReportsResponse?.data ||
              [];

        setReports(
          refreshedReports
        );

        const updatedReport =
          getReportForBatch(
            refreshedReports,
            selectedBatch
          );

        setSelectedReport(
          updatedReport || null
        );

      } catch (err) {

        console.error(
          'KVIC lab report submission error:',
          err
        );

        setReportSubmitError(
          err?.message ||
            'Failed to submit laboratory report.'
        );

      } finally {

        setSubmittingReport(
          false
        );

      }
    };


  /*
  |--------------------------------------------------------------------------
  | LOAD REPORT HISTORY
  |--------------------------------------------------------------------------
  */

  const loadHistory =
    async () => {

      if (!selectedBatch) {
        return;
      }

      const batchId =
        getId(selectedBatch);

      if (!batchId) {

        setHistoryError(
          'Batch ID is not available.'
        );

        return;
      }

      try {

        setHistoryLoading(
          true
        );

        setHistoryError('');

        const response =
          await getKvicReportHistory(
            batchId
          );

        const historyData =
          Array.isArray(response)
            ? response
            : response?.reports ||
              response?.history ||
              response?.data ||
              [];

        setHistory(
          historyData
        );

      } catch (err) {

        console.error(
          'KVIC report history error:',
          err
        );

        setHistoryError(
          err?.message ||
            'Failed to load report history.'
        );

      } finally {

        setHistoryLoading(
          false
        );

      }
    };


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-white">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <button
              type="button"
              onClick={() =>
                window.history.back()
              }
              className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
            >
              <ArrowLeft size={16} />

              Back
            </button>

            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600">
              KVIC Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Batch Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-zinc-500">
              Monitor honey batches,
              production status and
              laboratory verification.
            </p>

          </div>


          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
          >

            {loading ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
              />
            ) : (
              <RefreshCw
                size={17}
              />
            )}

            Refresh

          </button>

        </div>


        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}


        {/* STATISTICS */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <StatCard
            icon={Package}
            label="Total Batches"
            value={
              statistics.total
            }
          />

          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={
              statistics.completed
            }
          />

          <StatCard
            icon={LoaderCircle}
            label="Processing"
            value={
              statistics.processing
            }
          />

          <StatCard
            icon={AlertTriangle}
            label="Failed"
            value={
              statistics.failed
            }
          />

        </div>


        {/* SEARCH / FILTER */}

        <div className="mb-6 flex flex-col gap-3 lg:flex-row">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search batch, farm, keeper..."
              className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-amber-500 dark:border-zinc-800 dark:bg-zinc-900"
            />

          </div>


          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none dark:border-zinc-800 dark:bg-zinc-900"
          >

            <option value="">
              All Statuses
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="processing">
              Processing
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="failed">
              Failed
            </option>

          </select>

        </div>


        {/* TABLE */}

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">

          {loading ? (

            <div className="flex min-h-[300px] items-center justify-center">

              <div className="flex items-center gap-3 text-sm text-zinc-500">

                <LoaderCircle
                  size={20}
                  className="animate-spin"
                />

                Loading batches...

              </div>

            </div>

          ) : filteredBatches.length === 0 ? (

            <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

              <Package
                size={38}
                className="text-zinc-300 dark:text-zinc-700"
              />

              <h3 className="mt-4 font-semibold">
                No batches found
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                Try changing the search
                or status filter.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px] text-left">

                <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60">

                  <tr>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Batch
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Farm
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Keeper
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Quantity
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Lab Report
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">

                  {filteredBatches.map(
                    (batch) => {

                      const report =
                        getReportForBatch(
                          reports,
                          batch
                        );

                      const status =
                        getStatus(batch);

                      return (
                        <tr
                          key={
                            getId(batch) ||
                            getBatchCode(
                              batch
                            )
                          }
                          className="transition hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                        >

                          {/* BATCH */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="rounded-xl bg-amber-500/10 p-2 text-amber-600">
                                <Package
                                  size={17}
                                />
                              </div>

                              <div>

                                <p className="font-semibold">
                                  {displayValue(
                                    getBatchCode(
                                      batch
                                    )
                                  )}
                                </p>

                                <p className="mt-0.5 text-xs text-zinc-500">
                                  {formatDate(
                                    getCreatedDate(
                                      batch
                                    )
                                  )}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* FARM */}

                          <td className="px-5 py-4 text-sm">
                            {displayValue(
                              getFarmName(
                                batch
                              )
                            )}
                          </td>


                          {/* KEEPER */}

                          <td className="px-5 py-4 text-sm">
                            {displayValue(
                              getKeeperName(
                                batch
                              )
                            )}
                          </td>


                          {/* QUANTITY */}

                          <td className="px-5 py-4 text-sm font-medium">
                            {formatQuantity(
                              batch
                            )}
                          </td>


                          {/* STATUS */}

                          <td className="px-5 py-4">

                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                                status
                              )}`}
                            >
                              {getStatusLabel(
                                status
                              )}
                            </span>

                          </td>


                          {/* REPORT */}

                          <td className="px-5 py-4">

                            <ReportStatus
                              report={
                                report
                              }
                            />

                          </td>


                          {/* ACTION */}

                          <td className="px-5 py-4">

                            <button
                              type="button"
                              onClick={() =>
                                openBatch(
                                  batch
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold transition hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"
                            >

                              <Eye
                                size={15}
                              />

                              View

                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>


        {/* RESULT COUNT */}

        {!loading &&
          filteredBatches.length >
            0 && (
            <p className="mt-4 text-xs text-zinc-500">
              Showing{' '}
              {filteredBatches.length}{' '}
              of{' '}
              {batches.length}{' '}
              batches
            </p>
          )}

      </div>


      {/* DETAILS MODAL */}

      {selectedBatch && (
        <BatchDetailsModal
          batch={
            selectedBatch
          }
          report={
            selectedReport
          }
          history={history}
          historyLoading={
            historyLoading
          }
          historyError={
            historyError
          }
          submittingReport={
            submittingReport
          }
          reportSubmitError={
            reportSubmitError
          }
          reportSubmitSuccess={
            reportSubmitSuccess
          }
          onSubmitLabReport={
            handleSubmitLabReport
          }
          onLoadHistory={
            loadHistory
          }
          onClose={
            closeBatch
          }
        />
      )}

    </div>
  );
}


/*
|--------------------------------------------------------------------------
| STAT CARD
|--------------------------------------------------------------------------
*/

function StatCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-zinc-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold">
            {value}
          </p>

        </div>


        <div className="rounded-xl bg-amber-500/10 p-3 text-amber-600">

          <Icon size={21} />

        </div>

      </div>

    </div>
  );
}