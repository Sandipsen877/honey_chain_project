import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Camera,
  CheckCircle2,
  Hexagon,
  LoaderCircle,
  Plus,
  Search,
  Thermometer,
  X,
  Activity,
  AlertTriangle,
} from 'lucide-react';

import {
  PageHeader,
  EmptyState,
  FormField,
  RiskBadge,
} from './DashboardUI';

import {
  apiRequest,
  getId,
  getErrorMessage,
} from '../../services/dashboardApi';

const VARROA_SCAN_INTERVAL_MS = 1800;
const VARROA_IMAGE_QUALITY = 0.82;


/* ============================================================
   HIVES SECTION
   ============================================================ */

function HivesSection({
  farms,
  hives,
  risks,
  onCreate,
  onVarroaAlert,
  actionLoading,
}) {
  const [showForm, setShowForm] = useState(false);
  const [selectedHive, setSelectedHive] = useState(null);

  const [hiveSearch, setHiveSearch] = useState('');
  const [selectedFarmId, setSelectedFarmId] = useState('');

  const safeFarms = useMemo(
    () => Array.isArray(farms) ? farms : [],
    [farms],
  );

  const safeHives = useMemo(
    () => Array.isArray(hives) ? hives : [],
    [hives],
  );

  /* ==========================================================
     FILTERED HIVES
     ========================================================== */

  const filteredHives = useMemo(() => {
    const search = hiveSearch.trim().toLowerCase();

    return safeHives.filter((hive) => {
      const hiveId = String(
        getId(hive) || '',
      ).toLowerCase();

      const hiveCode = String(
        hive?.hiveCode || '',
      ).toLowerCase();

      const hiveFarmId = String(
        getId(hive?.farm) ||
          hive?.farm ||
          '',
      );

      const matchesHiveSearch =
        !search ||
        hiveId.includes(search) ||
        hiveCode.includes(search);

      const matchesFarm =
        !selectedFarmId ||
        hiveFarmId === String(selectedFarmId);

      return (
        matchesHiveSearch &&
        matchesFarm
      );
    });
  }, [
    safeHives,
    hiveSearch,
    selectedFarmId,
  ]);

  /* ==========================================================
     CLEAR FILTERS
     ========================================================== */

  function clearFilters() {
    setHiveSearch('');
    setSelectedFarmId('');
  }

  /* ==========================================================
     CLOSE DETAILS
     ========================================================== */

  function closeHiveDetails() {
    setSelectedHive(null);
  }

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">

      {/* ======================================================
          PAGE HEADER
      ====================================================== */}

      <PageHeader
        eyebrow="02 / Hives"
        title="Hives"
        description="View and manage all registered hives across your farms."
        action={
          <button
            type="button"
            onClick={() =>
              setShowForm((value) => !value)
            }
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-gold text-black px-4 py-3 text-sm font-semibold hover:bg-gold-light transition-colors"
          >
            <Plus size={17} />
            Create Hive
          </button>
        }
      />

      {/* ======================================================
          CREATE HIVE FORM
      ====================================================== */}

      {showForm && (
        <HiveForm
          farms={safeFarms}
          onSubmit={async (data) => {
            await onCreate(data);
            setShowForm(false);
          }}
          onCancel={() =>
            setShowForm(false)
          }
          actionLoading={actionLoading}
        />
      )}

      {/* ======================================================
          SEARCH & FILTER
      ====================================================== */}

      {safeHives.length > 0 && (
        <section className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card overflow-hidden">

          <div className="px-5 sm:px-6 py-4 border-b border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 border border-gold/40 flex items-center justify-center shrink-0">
                <Search
                  size={17}
                  className="text-gold"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold">
                  Search & Filter
                </h3>

                <p className="mt-0.5 text-[11px] text-gray dark:text-muted">
                  Narrow the hive list by ID or farm
                </p>
              </div>

            </div>

            <p className="text-xs text-gray dark:text-muted">
              <span className="font-semibold text-black dark:text-cream">
                {filteredHives.length}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-black dark:text-cream">
                {safeHives.length}
              </span>{' '}
              hives
            </p>

          </div>

          <div className="p-5 sm:p-6">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              <div className="min-w-0">

                <label className="text-xs font-medium">
                  Search Hive ID / Hive Code
                </label>

                <div className="relative mt-2">

                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray dark:text-muted pointer-events-none"
                  />

                  <input
                    type="text"
                    value={hiveSearch}
                    onChange={(event) =>
                      setHiveSearch(
                        event.target.value,
                      )
                    }
                    placeholder="Search hive ID or HV-TEST-001"
                    className="w-full min-w-0 border border-black/10 dark:border-white/10 bg-cream dark:bg-black pl-9 pr-3 py-3 text-sm outline-none focus:border-gold"
                  />

                </div>

              </div>

              <div className="min-w-0">

                <label className="text-xs font-medium">
                  Filter by Farm
                </label>

                <select
                  value={selectedFarmId}
                  onChange={(event) =>
                    setSelectedFarmId(
                      event.target.value,
                    )
                  }
                  className="mt-2 w-full min-w-0 border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm outline-none focus:border-gold"
                >

                  <option value="">
                    All Farms
                  </option>

                  {safeFarms.map((farm) => {
                    const farmId = getId(farm);

                    return (
                      <option
                        key={farmId}
                        value={farmId}
                      >
                        {farm.name ||
                          farm.farmCode ||
                          farmId}
                      </option>
                    );
                  })}

                </select>

              </div>

            </div>

            {(hiveSearch || selectedFarmId) && (
              <div className="mt-5 pt-4 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                <p className="text-xs text-gray dark:text-muted">
                  Active filters applied
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:underline w-fit"
                >
                  <X size={13} />
                  Clear Filters
                </button>

              </div>
            )}

          </div>
        </section>
      )}

      {/* ======================================================
          HIVE LIST
      ====================================================== */}

      {safeHives.length === 0 ? (
        <EmptyState
          icon={Hexagon}
          title="No hives registered"
          text="Create a hive inside one of your farms."
        />
      ) : filteredHives.length === 0 ? (

        <div className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-8 sm:p-10 text-center">

          <div className="mx-auto w-12 h-12 border border-gold/40 flex items-center justify-center">
            <Search
              size={20}
              className="text-gold"
            />
          </div>

          <h3 className="mt-4 text-base font-semibold">
            No hives found
          </h3>

          <p className="mt-2 max-w-md mx-auto text-sm leading-6 text-gray dark:text-muted">
            No hive matches the selected Hive ID or Farm ID.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 inline-flex items-center gap-2 border border-black/10 dark:border-white/10 px-4 py-2.5 text-xs font-semibold hover:border-gold transition-colors"
          >
            <X size={13} />
            Clear Filters
          </button>

        </div>

      ) : (

        <section className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card overflow-hidden">

          <div className="px-5 sm:px-6 py-4 border-b border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                Registered Hives
              </p>

              <h3 className="mt-1 text-sm font-semibold">
                Hive Overview
              </h3>
            </div>

            <p className="text-xs text-gray dark:text-muted">
              {filteredHives.length} result
              {filteredHives.length !== 1
                ? 's'
                : ''}
            </p>

          </div>

          <div className="max-h-[600px] overflow-y-auto overflow-x-hidden scrollbar-thin p-4 sm:p-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

              {filteredHives.map((hive) => {

                const hiveId = getId(hive);
                const hiveRisk =
                  risks?.[String(hiveId)];

                const hiveFarmId = String(
                  getId(hive?.farm) ||
                    hive?.farm ||
                    '',
                );

                const farm = safeFarms.find(
                  (item) =>
                    String(getId(item)) ===
                    hiveFarmId,
                );

                return (
                  <button
                    type="button"
                    key={hiveId}
                    onClick={() =>
                      setSelectedHive(hive)
                    }
                    className="group text-left w-full min-w-0 border border-black/10 dark:border-white/10 bg-cream dark:bg-black p-5 sm:p-6 hover:border-gold transition-all duration-300 focus:outline-none focus:border-gold"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="w-11 h-11 border border-gold/40 flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
                        <Hexagon
                          size={20}
                          className="text-gold"
                        />
                      </div>

                      <div className="shrink-0">
                        {hiveRisk ? (
                          <RiskBadge
                            risk={hiveRisk}
                          />
                        ) : (
                          <span className="text-[10px] uppercase tracking-[0.15em] text-gray dark:text-muted">
                            Hive
                          </span>
                        )}
                      </div>

                    </div>

                    <div className="mt-5 min-w-0">

                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray dark:text-muted">
                        Hive ID
                      </p>

                      <p className="mt-2 text-sm font-semibold break-all">
                        {hiveId || '—'}
                      </p>

                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">

                      <div className="min-w-0">

                        <p className="text-[10px] uppercase tracking-[0.16em] text-gray dark:text-muted">
                          Farm
                        </p>

                        <p className="mt-1.5 text-sm font-semibold text-gold break-words">
                          {farm?.name ||
                            farm?.farmCode ||
                            'Unknown'}
                        </p>

                      </div>

                      <div className="min-w-0">

                        <p className="text-[10px] uppercase tracking-[0.16em] text-gray dark:text-muted">
                          Type
                        </p>

                        <p className="mt-1.5 text-sm font-semibold break-words">
                          {hive?.hiveType ||
                            'Not specified'}
                        </p>

                      </div>

                    </div>

                    <div className="mt-5 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-3">

                      <span className="text-xs text-gray dark:text-muted">
                        View details
                      </span>

                      <span className="text-sm font-semibold text-gold group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>

                    </div>

                  </button>
                );
              })}

            </div>

          </div>

        </section>
      )}

      {/* ======================================================
          HIVE DETAIL
      ====================================================== */}

      {selectedHive && (
        <HiveDetail
          hive={selectedHive}
          farms={safeFarms}
          onVarroaAlert={onVarroaAlert}
          onClose={closeHiveDetails}
        />
      )}

    </div>
  );
}


/* ============================================================
   HIVE FORM
   ============================================================ */

function HiveForm({
  farms = [],
  farmId,
  onSubmit,
  onCancel,
  actionLoading,
}) {
  const safeFarms = Array.isArray(farms)
    ? farms
    : [];

  const [form, setForm] = useState(() => ({
    hiveCode: `HV-${Date.now()}`,
    farm: farmId || '',
    hiveType: 'Langstroth',
  }));

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submit(event) {
    event.preventDefault();

    await onSubmit({
      hiveCode: form.hiveCode.trim(),
      farm: form.farm,
      hiveType: form.hiveType,
    });
  }

  return (
    <form
      onSubmit={submit}
      className="border border-gold/30 bg-gold/5 overflow-hidden"
    >

      <div className="px-5 sm:px-6 py-4 border-b border-gold/20 flex items-center gap-3">

        <div className="w-9 h-9 border border-gold/40 flex items-center justify-center shrink-0">
          <Hexagon
            size={17}
            className="text-gold"
          />
        </div>

        <div>

          <h3 className="text-sm font-semibold">
            Create Hive
          </h3>

          <p className="mt-0.5 text-[11px] text-gray dark:text-muted">
            Register a new hive under one of your farms.
          </p>

        </div>

      </div>

      <div className="p-5 sm:p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <FormField
            label="Hive Code"
            value={form.hiveCode}
            disabled
            required
          />

          {!farmId ? (

            <div>

              <label className="text-xs font-medium">
                Farm
              </label>

              <select
                value={form.farm}
                onChange={(event) =>
                  update(
                    'farm',
                    event.target.value,
                  )
                }
                required
                className="mt-2 w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm outline-none focus:border-gold"
              >

                <option value="">
                  Select farm
                </option>

                {safeFarms.map((farm) => (
                  <option
                    key={getId(farm)}
                    value={getId(farm)}
                  >
                    {farm.name ||
                      farm.farmCode}
                  </option>
                ))}

              </select>

            </div>

          ) : (

            <div>

              <label className="text-xs font-medium">
                Farm
              </label>

              <div className="mt-2 w-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3 py-3 text-sm">
                {safeFarms.find(
                  (farm) =>
                    String(getId(farm)) ===
                    String(farmId),
                )?.name ||
                  safeFarms.find(
                    (farm) =>
                      String(getId(farm)) ===
                      String(farmId),
                  )?.farmCode ||
                  farmId}
              </div>

            </div>
          )}

          <div>

            <label className="text-xs font-medium">
              Hive Type
            </label>

            <select
              value={form.hiveType}
              onChange={(event) =>
                update(
                  'hiveType',
                  event.target.value,
                )
              }
              className="mt-2 w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm outline-none focus:border-gold"
            >

              <option value="Langstroth">
                Langstroth
              </option>

              <option value="Top Bar">
                Top Bar
              </option>

              <option value="Traditional">
                Traditional
              </option>

            </select>

          </div>

        </div>

        <div className="mt-5 pt-5 border-t border-gold/20 flex flex-col sm:flex-row gap-2">

          <button
            type="submit"
            disabled={actionLoading}
            className="w-full sm:w-auto bg-black text-cream dark:bg-cream dark:text-black px-5 py-2.5 text-xs font-semibold disabled:opacity-50 hover:bg-gold hover:text-black dark:hover:bg-gold dark:hover:text-black transition-colors"
          >
            {actionLoading
              ? 'Creating...'
              : 'Create Hive'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto border border-black/10 dark:border-white/10 px-5 py-2.5 text-xs font-semibold hover:border-gold transition-colors"
          >
            Cancel
          </button>

        </div>

      </div>

    </form>
  );
}


/* ============================================================
   HIVE DETAIL
   ============================================================ */

function HiveDetail({
  hive,
  farms,
  onVarroaAlert,
  onClose,
}) {
  const hiveId = getId(hive);

  const safeFarms = Array.isArray(farms)
    ? farms
    : [];

  /* ==========================================================
     HEALTH STATE
     ========================================================== */

  const [healthData, setHealthData] =
    useState(null);

  const [healthLoading, setHealthLoading] =
    useState(true);

  const [healthError, setHealthError] =
    useState('');

  /* ==========================================================
     VARROA STATE
     ========================================================== */

  const [cameraOpen, setCameraOpen] =
    useState(false);

  const [cameraLoading, setCameraLoading] =
    useState(false);

  const [varroaLoading, setVarroaLoading] =
    useState(false);

  const [liveVarroaActive, setLiveVarroaActive] =
    useState(false);

  const [varroaResult, setVarroaResult] =
    useState(null);

  const [varroaImage, setVarroaImage] =
    useState(null);

  const [varroaImageVersion, setVarroaImageVersion] =
    useState(0);

  const [varroaError, setVarroaError] =
    useState('');

  const [varroaFrameCount, setVarroaFrameCount] =
    useState(0);

  const [varroaLastScanAt, setVarroaLastScanAt] =
    useState(null);

  /* ==========================================================
     CAMERA REFS
     ========================================================== */

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const captureTimerRef = useRef(null);
  const liveScanActiveRef = useRef(false);
  const predictionInFlightRef = useRef(false);
  const varroaImageRef = useRef(null);
  const varroaAbortControllerRef = useRef(null);
  const varroaAlertNotifiedRef = useRef(false);

  /* ==========================================================
     FIND FARM
     ========================================================== */

  const hiveFarmId = String(
    getId(hive?.farm) ||
      hive?.farm ||
      '',
  );

  const farm = safeFarms.find(
    (item) =>
      String(getId(item)) ===
      hiveFarmId,
  );

  /* ==========================================================
     BASIC HIVE DETAILS
     ========================================================== */

  const basicDetails = [
    {
      label: 'Hive ID',
      value: hiveId,
    },
    {
      label: 'Hive Code',
      value: hive?.hiveCode,
    },
    {
      label: 'Hive Type',
      value: hive?.hiveType,
    },
    {
      label: 'Farm',
      value:
        farm?.name ||
        farm?.farmCode ||
        'Unknown',
    },
    {
      label: 'Farm ID',
      value: hiveFarmId,
    },
  ];

  /* ==========================================================
     OTHER BASIC FIELDS
     ========================================================== */

  const excludedFields = new Set([
    '_id',
    'id',
    '__v',
    'hiveCode',
    'hiveType',
    'farm',
    'createdAt',
    'updatedAt',
  ]);

  const additionalDetails =
    Object.entries(hive || {}).filter(
      ([key, value]) => {
        if (excludedFields.has(key)) {
          return false;
        }

        if (
          value === null ||
          value === undefined ||
          value === ''
        ) {
          return false;
        }

        if (
          typeof value === 'object'
        ) {
          return false;
        }

        return true;
      },
    );

  /* ==========================================================
     GENERATE DIFFERENT SENSOR DATA PER HIVE
     ========================================================== */

  const generateHiveSensorData = useCallback(() => {
    const source = String(
      hiveId ||
        hive?.hiveCode ||
        'HIVE',
    );

    let hash = 0;

    for (
      let i = 0;
      i < source.length;
      i += 1
    ) {
      hash =
        (hash * 31 +
          source.charCodeAt(i)) %
        100000;
    }

    const variation = hash % 100;

    return {
      hive_id: String(
        hive?.hiveCode ||
          hiveId ||
          'HIVE',
      ),

      temperature: Number(
        (
          32 +
          (variation % 35) / 10
        ).toFixed(1),
      ),

      humidity: Number(
        (
          60 +
          (variation % 25)
        ).toFixed(1),
      ),

      outside_temperature: Number(
        (
          28 +
          (variation % 40) / 10
        ).toFixed(1),
      ),

      outside_humidity: Number(
        (
          65 +
          (variation % 20)
        ).toFixed(1),
      ),

      pressure: Number(
        (
          1005 +
          (variation % 15) / 10
        ).toFixed(1),
      ),

      co2:
        900 +
        (variation % 700),

      tvoc:
        300 +
        (variation % 500),

      light:
        180 +
        (variation % 300),

      bee_in:
        10 +
        (variation % 15),

      bee_out:
        12 +
        ((variation * 2) % 18),
    };
  }, [
    hiveId,
    hive?.hiveCode,
  ]);

  /* ==========================================================
     OVERALL HEALTH API
     ========================================================== */

  useEffect(() => {
    let cancelled = false;

    async function fetchHealth() {
      setHealthLoading(true);
      setHealthError('');
      setHealthData(null);

      try {
        const sensorData =
          generateHiveSensorData();

        const response =
          await apiRequest(
            '/api/alerts/predict',
            {
              method: 'POST',
              body: JSON.stringify(
                sensorData,
              ),
            },
          );

        if (!cancelled) {
          setHealthData({
            ...response,
            sensorData,
          });
        }
      } catch (err) {
        if (!cancelled) {
          setHealthError(
            getErrorMessage(err),
          );
        }
      } finally {
        if (!cancelled) {
          setHealthLoading(false);
        }
      }
    }

    fetchHealth();

    return () => {
      cancelled = true;
    };
  }, [
    hiveId,
    generateHiveSensorData,
  ]);

  /* ==========================================================
     CAMERA CLEANUP
     ========================================================== */

  function setLatestVarroaImageUrl(imageUrl) {
    if (varroaImageRef.current) {
      URL.revokeObjectURL(
        varroaImageRef.current,
      );
    }

    varroaImageRef.current =
      imageUrl;

    setVarroaImage(imageUrl);
    setVarroaImageVersion(
      (version) => version + 1,
    );
  }

  function scheduleNextVarroaFrame(
    delay = VARROA_SCAN_INTERVAL_MS,
  ) {
    if (!liveScanActiveRef.current) {
      return;
    }

    if (captureTimerRef.current) {
      clearTimeout(
        captureTimerRef.current,
      );
    }

    captureTimerRef.current =
      setTimeout(() => {
        captureLiveFrame();
      }, delay);
  }

  function stopCamera() {
    liveScanActiveRef.current = false;
    setLiveVarroaActive(false);

    if (captureTimerRef.current) {
      clearTimeout(
        captureTimerRef.current,
      );

      captureTimerRef.current = null;
    }

    if (varroaAbortControllerRef.current) {
      varroaAbortControllerRef.current.abort();
      varroaAbortControllerRef.current = null;
    }

    predictionInFlightRef.current = false;

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
    setCameraLoading(false);
    setVarroaLoading(false);
  }

  useEffect(() => {
    return () => {
      liveScanActiveRef.current = false;

      if (captureTimerRef.current) {
        clearTimeout(
          captureTimerRef.current,
        );
      }

      if (varroaAbortControllerRef.current) {
        varroaAbortControllerRef.current.abort();
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }

      if (varroaImageRef.current) {
        URL.revokeObjectURL(
          varroaImageRef.current,
        );
      }
    };
  }, []);

  /* ==========================================================
     START CAMERA
     ========================================================== */

  async function startVarroaScan() {
    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      setVarroaError(
        'Camera access is not supported by this browser.',
      );
      return;
    }

    setVarroaError('');
    setVarroaResult(null);
    setVarroaFrameCount(0);
    setVarroaLastScanAt(null);
    setLatestVarroaImageUrl(null);
    varroaAlertNotifiedRef.current = false;

    setCameraOpen(true);
    setCameraLoading(true);
    liveScanActiveRef.current = true;
    setLiveVarroaActive(true);

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: {
              facingMode: {
                ideal: 'environment',
              },
              width: {
                ideal: 1280,
              },
              height: {
                ideal: 720,
              },
            },
            audio: false,
          },
        );

      streamRef.current = stream;

      if (!videoRef.current) {
        throw new Error(
          'Camera preview could not be initialized.',
        );
      }

      videoRef.current.srcObject =
        stream;

      await videoRef.current.play();

      /*
       * Wait until the video has actual
       * dimensions before capturing.
       */

      const waitForVideo = () => {
        const video = videoRef.current;

        if (
          !video ||
          video.readyState < 2 ||
          !video.videoWidth ||
          !video.videoHeight
        ) {
          captureTimerRef.current =
            setTimeout(
              waitForVideo,
              200,
            );

          return;
        }

        setCameraLoading(false);

        scheduleNextVarroaFrame(300);
      };

      waitForVideo();

    } catch (err) {
      stopCamera();

      let message =
        'Unable to access the webcam.';

      if (
        err?.name ===
        'NotAllowedError'
      ) {
        message =
          'Camera permission was denied. Please allow camera access and try again.';
      } else if (
        err?.name ===
        'NotFoundError'
      ) {
        message =
          'No camera was found on this device.';
      } else if (
        err?.name ===
        'NotReadableError'
      ) {
        message =
          'The camera is already being used by another application.';
      } else if (err?.message) {
        message = err.message;
      }

      setVarroaError(message);
    }
  }

  /* ==========================================================
     CAPTURE CAMERA FRAME
     ========================================================== */

  function captureLiveFrame() {
    if (!liveScanActiveRef.current) {
      return;
    }

    if (predictionInFlightRef.current) {
      scheduleNextVarroaFrame(350);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setVarroaError(
        'Camera capture failed.',
      );

      stopCamera();
      return;
    }

    if (
      !video.videoWidth ||
      !video.videoHeight
    ) {
      setVarroaError(
        'Camera image is not ready yet. Please try again.',
      );

      stopCamera();
      return;
    }

    const width =
      video.videoWidth;

    const height =
      video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    const context =
      canvas.getContext('2d');

    if (!context) {
      setVarroaError(
        'Unable to initialize image capture.',
      );

      stopCamera();
      return;
    }

    context.drawImage(
      video,
      0,
      0,
      width,
      height,
    );

    canvas.toBlob(
      async (blob) => {
        if (!liveScanActiveRef.current) {
          return;
        }

        if (!blob) {
          setVarroaError(
            'Unable to create image from camera.',
          );

          stopCamera();
          return;
        }

        /*
         * Convert captured Blob into
         * an actual image File.
         */

        const imageFile =
          new File(
            [blob],
            `${String(
              hive?.hiveCode ||
                hiveId ||
                'hive',
            )}-varroa-scan.jpg`,
            {
              type: 'image/jpeg',
              lastModified:
                Date.now(),
            },
          );

        const imageUrl =
          URL.createObjectURL(
            blob,
          );

        await sendVarroaImage(
          imageFile,
          {
            imageUrl,
            frameSize: {
              width,
              height,
            },
          },
        );

        scheduleNextVarroaFrame();
      },
      'image/jpeg',
      VARROA_IMAGE_QUALITY,
    );
  }

  /* ==========================================================
     SEND VARROA IMAGE
     ========================================================== */

  async function sendVarroaImage(
    imageFile,
    options = {},
  ) {
    if (!(imageFile instanceof File)) {
      setVarroaError(
        'Captured image file is invalid.',
      );
      return;
    }

    const {
      imageUrl = null,
      frameSize = null,
    } = options;

    predictionInFlightRef.current = true;
    setVarroaLoading(true);
    setVarroaError('');

    if (imageUrl) {
      setLatestVarroaImageUrl(
        imageUrl,
      );
    }

    try {
      const token =
        localStorage.getItem(
          'honeychain_token',
        );

      const formData =
        new FormData();

      formData.append(
        'file',
        imageFile,
        imageFile.name,
      );

      if (hiveId) {
        formData.append(
          'hiveId',
          hiveId,
        );
      }

      if (hiveFarmId) {
        formData.append(
          'farmId',
          hiveFarmId,
        );
      }

      /*
       * VITE_API_URL should point to
       * your Express backend, for example:
       *
       * https://your-backend.onrender.com
       *
       * If empty, same-origin /api is used.
       */

      const baseUrl = String(
        import.meta.env
          .VITE_API_URL ||
          import.meta.env
            .VITE_API_BASE_URL ||
          'http://localhost:5000',
      ).replace(/\/$/, '');

      const endpoint =
        `${baseUrl}/api/alerts/varroa`;

      const controller =
        new AbortController();

      varroaAbortControllerRef.current =
        controller;

      const response =
        await fetch(
          endpoint,
          {
            method: 'POST',

            headers: token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {},

            body: formData,
            signal:
              controller.signal,
          },
        );

      let data = null;

      try {
        data =
          await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            data?.detail ||
            `Varroa detection failed with status ${response.status}.`,
        );
      }

      /*
       * Support common backend response
       * structures:
       *
       * { detected: true, ... }
       *
       * { data: { detected: true } }
       *
       * { result: { detected: true } }
       */

      const normalizedResult =
        data?.data ||
        data?.result ||
        data;

      if (
        !normalizedResult ||
        typeof normalizedResult !==
          'object'
      ) {
        throw new Error(
          'Varroa API returned an invalid response.',
        );
      }

      setVarroaResult(
        {
          ...normalizedResult,
          frame: frameSize,
          scannedAt:
            new Date().toISOString(),
        },
      );

      setVarroaFrameCount(
        (count) => count + 1,
      );

      setVarroaLastScanAt(
        new Date(),
      );

      const detected =
        normalizedResult?.detected ===
          true ||
        Number(normalizedResult?.count) >
          0;

      if (
        detected &&
        normalizedResult?.savedAlert &&
        !varroaAlertNotifiedRef.current
      ) {
        varroaAlertNotifiedRef.current = true;
        await onVarroaAlert?.(
          normalizedResult.savedAlert,
        );
      }

    } catch (err) {
      if (err?.name === 'AbortError') {
        return;
      }

      setVarroaError(
        err?.message ||
          'Unable to analyze the captured image.',
      );
    } finally {
      predictionInFlightRef.current = false;
      varroaAbortControllerRef.current = null;
      setVarroaLoading(false);
    }
  }

  /* ==========================================================
     HEALTH STATUS CLASS
     ========================================================== */

  function getHealthStatusClass(
    status,
  ) {
    const normalized =
      String(status || '')
        .toLowerCase();

    if (
      normalized ===
      'healthy'
    ) {
      return 'text-green-600 border-green-600/30 bg-green-600/5';
    }

    if (
      normalized.includes(
        'warning',
      ) ||
      normalized.includes(
        'moderate',
      )
    ) {
      return 'text-amber-600 border-amber-500/30 bg-amber-500/5';
    }

    return 'text-red-600 border-red-500/30 bg-red-500/5';
  }

  return (
    <>
      {/* ======================================================
          HIVE DETAIL OVERLAY
      ====================================================== */}

      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4">

        <div
          className="absolute inset-0"
          onClick={onClose}
        />

        <div
          className="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-hidden bg-cream-card dark:bg-black-card border border-black/10 dark:border-white/10 shadow-2xl flex flex-col"
        >

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="shrink-0 bg-cream-card dark:bg-black-card border-b border-black/10 dark:border-white/10 px-5 sm:px-6 py-4 sm:py-5 flex items-start justify-between gap-4">

            <div className="min-w-0">

              <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
                Hive Details
              </p>

              <h2 className="mt-2 text-lg sm:text-xl font-semibold break-words">
                {hive?.hiveCode ||
                  'Hive'}
              </h2>

              <p className="mt-1 text-[11px] sm:text-xs text-gray dark:text-muted break-all">
                Hive ID: {hiveId || '—'}
              </p>

            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 border border-black/10 dark:border-white/10 flex items-center justify-center hover:border-gold shrink-0"
              aria-label="Close hive details"
            >
              <X size={18} />
            </button>

          </div>

          {/* ==================================================
              CONTENT
          ================================================== */}

          <div className="overflow-y-auto scrollbar-thin">

            <div className="p-5 sm:p-6">

              {/* ==================================================
                  SUMMARY
              ================================================== */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-black/10 dark:bg-white/10">

                <DetailStat
                  label="Hive ID"
                  value={hiveId}
                />

                <DetailStat
                  label="Farm"
                  value={
                    farm?.name ||
                    farm?.farmCode ||
                    'Unknown'
                  }
                />

                <DetailStat
                  label="Hive Type"
                  value={
                    hive?.hiveType ||
                    'Not specified'
                  }
                />

              </div>

              {/* ==================================================
                  BASIC INFORMATION
              ================================================== */}

              <div className="mt-5 sm:mt-6 border border-black/10 dark:border-white/10 p-5 sm:p-6">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                    Overview
                  </p>

                  <h3 className="mt-1 font-semibold">
                    Basic Hive Information
                  </h3>

                </div>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">

                  {basicDetails.map(
                    (item) => (
                      <InfoItem
                        key={item.label}
                        label={item.label}
                        value={
                          item.value ||
                          '—'
                        }
                      />
                    ),
                  )}

                </div>

                {additionalDetails.length >
                  0 && (
                  <div className="mt-6 pt-6 border-t border-black/10 dark:border-white/10">

                    <h4 className="text-sm font-semibold">
                      Additional Details
                    </h4>

                    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">

                      {additionalDetails.map(
                        ([key, value]) => (
                          <InfoItem
                            key={key}
                            label={formatLabel(
                              key,
                            )}
                            value={String(
                              value,
                            )}
                          />
                        ),
                      )}

                    </div>

                  </div>
                )}

              </div>

              {/* ==================================================
                  OVERALL HIVE HEALTH
              ================================================== */}

              <div className="mt-5 sm:mt-6 border border-black/10 dark:border-white/10 p-5 sm:p-6">

                <div className="flex items-start gap-3">

                  <div className="w-10 h-10 border border-gold/40 flex items-center justify-center shrink-0">
                    <Activity
                      size={18}
                      className="text-gold"
                    />
                  </div>

                  <div className="min-w-0">

                    <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                      Live Analysis
                    </p>

                    <h3 className="mt-1 font-semibold">
                      Overall Hive Health
                    </h3>

                    <p className="mt-1 text-xs text-gray dark:text-muted">
                      Sensor-based health prediction for this hive
                    </p>

                  </div>

                </div>

                {healthLoading ? (

                  <div className="mt-6 border border-black/10 dark:border-white/10 p-6 flex flex-col items-center justify-center">

                    <LoaderCircle
                      size={26}
                      className="animate-spin text-gold"
                    />

                    <p className="mt-3 text-sm text-gray dark:text-muted">
                      Analyzing hive health...
                    </p>

                  </div>

                ) : healthError ? (

                  <div className="mt-6 border border-red-500/30 bg-red-500/5 p-5">

                    <div className="flex items-start gap-3">

                      <AlertTriangle
                        size={19}
                        className="text-red-500 shrink-0"
                      />

                      <div>

                        <p className="text-sm font-semibold">
                          Health analysis unavailable
                        </p>

                        <p className="mt-1 text-xs text-gray dark:text-muted">
                          {healthError}
                        </p>

                      </div>

                    </div>

                  </div>

                ) : healthData ? (

                  <div className="mt-6">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 dark:bg-white/10">

                      <HealthStat
                        label="Health Score"
                        value={`${healthData.health_score ?? '—'}/100`}
                      />

                      <HealthStat
                        label="Health Status"
                        value={
                          healthData.health_status ||
                          'Unknown'
                        }
                        valueClass={
                          getHealthStatusClass(
                            healthData.health_status,
                          )
                        }
                      />

                      <HealthStat
                        label="Bee Activity"
                        value={
                          healthData.bee_activity ??
                          '—'
                        }
                      />

                      <HealthStat
                        label="Inspection"
                        value={
                          healthData.inspection_required
                            ? 'Required'
                            : 'Not Required'
                        }
                        valueClass={
                          healthData.inspection_required
                            ? 'text-red-600'
                            : 'text-green-600'
                        }
                      />

                    </div>

                    {healthData.sensorData && (
                      <div className="mt-5 border border-black/10 dark:border-white/10 p-5">

                        <div className="flex items-center gap-2">

                          <Thermometer
                            size={16}
                            className="text-gold"
                          />

                          <h4 className="text-sm font-semibold">
                            Sensor Snapshot
                          </h4>

                        </div>

                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">

                          <SensorValue
                            label="Temperature"
                            value={`${healthData.sensorData.temperature}°C`}
                          />

                          <SensorValue
                            label="Humidity"
                            value={`${healthData.sensorData.humidity}%`}
                          />

                          <SensorValue
                            label="Outside Temp."
                            value={`${healthData.sensorData.outside_temperature}°C`}
                          />

                          <SensorValue
                            label="CO₂"
                            value={`${healthData.sensorData.co2} ppm`}
                          />

                          <SensorValue
                            label="TVOC"
                            value={`${healthData.sensorData.tvoc}`}
                          />

                          <SensorValue
                            label="Light"
                            value={`${healthData.sensorData.light}`}
                          />

                          <SensorValue
                            label="Bee In"
                            value={
                              healthData.sensorData.beе_in ??
                              healthData.sensorData.bee_in
                            }
                          />

                          <SensorValue
                            label="Bee Out"
                            value={
                              healthData.sensorData.bee_out
                            }
                          />

                          <SensorValue
                            label="Pressure"
                            value={`${healthData.sensorData.pressure} hPa`}
                          />

                        </div>

                      </div>
                    )}

                  </div>

                ) : null}

              </div>

              {/* ==================================================
                  VARROA DETECTION
              ================================================== */}

              <div className="mt-5 sm:mt-6 border border-black/10 dark:border-white/10 p-5 sm:p-6">

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-start gap-3">

                    <div className="w-10 h-10 border border-gold/40 flex items-center justify-center shrink-0">

                      <Camera
                        size={18}
                        className="text-gold"
                      />

                    </div>

                    <div className="min-w-0">

                      <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                        YOLO Detection
                      </p>

                      <h3 className="mt-1 font-semibold">
                        Varroa Detection
                      </h3>

                      <p className="mt-1 text-xs text-gray dark:text-muted">
                        Open the camera for continuous Varroa mite scanning.
                      </p>

                    </div>

                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] text-gray dark:text-muted">
                    YOLO · best.pt
                  </span>

                </div>

                <div className="mt-5">

                  <button
                    type="button"
                    onClick={
                      startVarroaScan
                    }
                    disabled={
                      varroaLoading ||
                      cameraOpen
                    }
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-black text-cream dark:bg-cream dark:text-black px-5 py-3 text-sm font-semibold disabled:opacity-50 hover:bg-gold hover:text-black dark:hover:bg-gold dark:hover:text-black transition-colors"
                  >

                    {varroaLoading ? (
                      <>
                        <LoaderCircle
                          size={17}
                          className="animate-spin"
                        />

                        Starting Live Scan...
                      </>
                    ) : (
                      <>
                        <Camera
                          size={17}
                        />

                        Start Live Scan
                      </>
                    )}

                  </button>

                </div>

                {/* ==================================================
                    ERROR
                ================================================== */}

                {varroaError && (
                  <div className="mt-5 border border-red-500/30 bg-red-500/5 p-4">

                    <div className="flex items-start gap-3">

                      <AlertTriangle
                        size={18}
                        className="text-red-500 shrink-0"
                      />

                      <p className="text-sm">
                        {varroaError}
                      </p>

                    </div>

                  </div>
                )}

                {/* ==================================================
                    RESULT
                ================================================== */}

                {varroaResult && (
                  <VarroaResult
                    result={
                      varroaResult
                    }
                    imageUrl={
                      varroaImage
                    }
                    imageVersion={
                      varroaImageVersion
                    }
                  />
                )}

              </div>

              {/* ==================================================
                  CLOSE
              ================================================== */}

              <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto border border-black/10 dark:border-white/10 px-5 py-3 text-sm font-semibold hover:border-gold transition-colors"
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        </div>
      </div>

      {/* ========================================================
          CAMERA OVERLAY
      ======================================================== */}

      {cameraOpen && (
        <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4">

          <div className="w-full max-w-3xl">

            <div className="border border-white/10 bg-black overflow-hidden">

              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">

                <div>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                    Live Camera Scan
                  </p>

                  <h3 className="mt-1 text-sm font-semibold text-white">
                    Real-time Varroa detection
                  </h3>

                </div>

                <button
                  type="button"
                  onClick={stopCamera}
                  className="w-9 h-9 border border-white/20 text-white flex items-center justify-center hover:border-gold"
                >
                  <X size={18} />
                </button>

              </div>

              <div className="relative aspect-video bg-black">

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {cameraLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">

                    <LoaderCircle
                      size={32}
                      className="animate-spin text-gold"
                    />

                    <p className="mt-3 text-sm text-white">
                      Opening camera...
                    </p>

                  </div>
                )}

                {!cameraLoading && (
                  <div className="absolute inset-0 pointer-events-none">

                    <div className="absolute inset-[10%] border border-gold/70" />

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border border-white/60" />

                  </div>
                )}

                {!cameraLoading && varroaResult && (
                  <VarroaVideoOverlay
                    result={varroaResult}
                  />
                )}

              </div>

              <div className="px-5 py-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <VarroaLiveStatus
                  result={varroaResult}
                  loading={varroaLoading}
                  frameCount={varroaFrameCount}
                  lastScanAt={varroaLastScanAt}
                  active={liveVarroaActive}
                />

                <button
                  type="button"
                  onClick={stopCamera}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 border border-white/20 text-white px-4 py-2.5 text-xs font-semibold hover:border-gold hover:text-gold transition-colors"
                >
                  <X size={15} />
                  Stop Scan
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* Hidden capture canvas */}

      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </>
  );
}


/* ============================================================
   VARROA LIVE STATUS
   ============================================================ */

function VarroaLiveStatus({
  result,
  loading,
  frameCount,
  lastScanAt,
  active,
}) {
  const detections =
    Array.isArray(
      result?.detections,
    )
      ? result.detections
      : [];

  const count =
    Number(result?.count) ||
    detections.length ||
    0;

  const detected =
    result?.detected === true ||
    count > 0;

  const bestConfidence =
    detections.reduce(
      (best, detection) =>
        Math.max(
          best,
          Number(detection?.confidence) || 0,
        ),
      0,
    );

  let statusText =
    'Waiting for live frames...';

  if (detected) {
    statusText = loading
      ? `${count} Varroa mite${count === 1 ? '' : 's'} detected - scanning next frame`
      : `${count} Varroa mite${count === 1 ? '' : 's'} detected`;
  } else if (loading) {
    statusText =
      'Analyzing live frame...';
  } else if (frameCount > 0) {
    statusText = 'No Varroa detected';
  } else if (!active) {
    statusText = 'Live scan stopped';
  }

  return (
    <div className="min-w-0">

      <div className="flex flex-wrap items-center gap-2">

        <span
          className={`inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] font-semibold ${
            detected
              ? 'text-red-400'
              : 'text-green-400'
          }`}
        >
          {loading && (
            <LoaderCircle
              size={13}
              className="animate-spin"
            />
          )}
          {statusText}
        </span>

      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] uppercase tracking-[0.12em] text-white/60">

        <span>
          Frames: {frameCount}
        </span>

        <span>
          Interval: {VARROA_SCAN_INTERVAL_MS / 1000}s
        </span>

        {bestConfidence > 0 && (
          <span>
            Best: {(bestConfidence * 100).toFixed(0)}%
          </span>
        )}

        {lastScanAt && (
          <span>
            Last: {lastScanAt.toLocaleTimeString()}
          </span>
        )}

      </div>

    </div>
  );
}


/* ============================================================
   VARROA VIDEO OVERLAY
   ============================================================ */

function VarroaVideoOverlay({
  result,
}) {
  const detections =
    Array.isArray(
      result?.detections,
    )
      ? result.detections
      : [];

  const imageSize =
    result?.frame || {
      width: 1,
      height: 1,
    };

  const count =
    Number(result?.count) ||
    detections.length ||
    0;

  const detected =
    result?.detected === true ||
    count > 0;

  const bestConfidence =
    detections.reduce(
      (best, detection) =>
        Math.max(
          best,
          Number(detection?.confidence) || 0,
        ),
      0,
    );

  return (
    <div className="absolute inset-0 pointer-events-none">
      {detected && (
        <div className="absolute left-4 right-4 top-4 z-10 border border-red-400/70 bg-red-600/90 px-4 py-3 text-white shadow-lg">

          <div className="flex items-center gap-3">

            <AlertTriangle
              size={22}
              className="shrink-0"
            />

            <div className="min-w-0">

              <p className="text-sm font-bold uppercase tracking-[0.12em]">
                Varroa Detected
              </p>

              <p className="mt-1 text-xs text-white/85">
                {count} mite{count === 1 ? '' : 's'} found
                {bestConfidence > 0
                  ? ` - ${(bestConfidence * 100).toFixed(0)}% confidence`
                  : ''}
              </p>

            </div>

          </div>

        </div>
      )}

      <DetectionBoxes
        detections={detections}
        imageSize={imageSize}
      />
    </div>
  );
}


/* ============================================================
   VARROA RESULT
   ============================================================ */

function VarroaResult({
  result,
  imageUrl,
  imageVersion,
}) {
  const detections =
    Array.isArray(
      result?.detections,
    )
      ? result.detections
      : [];

  const count =
    Number(result?.count) ||
    detections.length ||
    0;

  const detected =
    result?.detected === true ||
    count > 0;

  const bestConfidence =
    detections.reduce(
      (best, detection) =>
        Math.max(
          best,
          Number(detection?.confidence) || 0,
        ),
      0,
    );

  return (
    <div className="mt-6 border border-black/10 dark:border-white/10 overflow-hidden">

      {/* ==================================================
          RESULT HEADER
      ================================================== */}

      <div className="p-5 border-b border-black/10 dark:border-white/10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div className="flex items-center gap-3">

            <div
              className={`w-10 h-10 border flex items-center justify-center ${
                detected
                  ? 'border-red-500/40 bg-red-500/5'
                  : 'border-green-600/40 bg-green-600/5'
              }`}
            >

              {detected ? (
                <AlertTriangle
                  size={19}
                  className="text-red-500"
                />
              ) : (
                <CheckCircle2
                  size={19}
                  className="text-green-600"
                />
              )}

            </div>

            <div>

              <p className="text-[10px] uppercase tracking-[0.2em] text-gray dark:text-muted">
                Varroa Analysis
              </p>

              <h4
                className={`mt-1 text-base font-semibold ${
                  detected
                    ? 'text-red-500'
                    : 'text-green-600'
                }`}
              >
                {detected
                  ? 'Varroa Detected'
                  : 'No Varroa Detected'}
              </h4>

              {detected && (
                <p className="mt-1 text-xs text-red-500">
                  Immediate hive inspection recommended.
                </p>
              )}

            </div>

          </div>

          <div className="border border-black/10 dark:border-white/10 px-4 py-3">

            <p className="text-[9px] uppercase tracking-[0.18em] text-gray dark:text-muted">
              Varroa Count
            </p>

            <p
              className={`mt-1 text-xl font-bold ${
                detected
                  ? 'text-red-500'
                  : 'text-green-600'
              }`}
            >
              {count}
            </p>

            {bestConfidence > 0 && (
              <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-gray dark:text-muted">
                Best {(bestConfidence * 100).toFixed(0)}%
              </p>
            )}

          </div>

        </div>

      </div>

      {detected && (
        <div className="border-b border-red-500/30 bg-red-500/10 px-5 py-4">

          <div className="flex items-start gap-3 text-red-600">

            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div className="min-w-0">

              <p className="text-sm font-semibold">
                Varroa mite detected in the latest analyzed frame.
              </p>

              <p className="mt-1 text-xs text-gray dark:text-muted">
                Review the marked bounding boxes and inspect this hive.
              </p>

            </div>

          </div>

        </div>
      )}

      {/* ==================================================
          CAPTURED IMAGE
      ================================================== */}

      {imageUrl && (
        <div className="p-5">

          <p className="text-[10px] uppercase tracking-[0.18em] text-gray dark:text-muted mb-3">
            Latest Analyzed Frame
          </p>

          <BoundingBoxImage
            imageUrl={imageUrl}
            imageVersion={imageVersion}
            detections={detections}
          />

        </div>
      )}

      {/* ==================================================
          DETECTION DETAILS
      ================================================== */}

      {detections.length > 0 && (
        <div className="border-t border-black/10 dark:border-white/10 p-5">

          <h4 className="text-sm font-semibold">
            YOLO Detection Details
          </h4>

          <div className="mt-4 space-y-3">

            {detections.map(
              (detection, index) => (
                <div
                  key={`${detection?.class_id}-${index}`}
                  className="border border-black/10 dark:border-white/10 p-4"
                >

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                    <InfoItem
                      label="Class"
                      value={
                        detection?.class_name ||
                        'varroa'
                      }
                    />

                    <InfoItem
                      label="Confidence"
                      value={
                        Number.isFinite(
                          Number(
                            detection?.confidence,
                          ),
                        )
                          ? `${
                              (
                                Number(
                                  detection.confidence,
                                ) * 100
                              ).toFixed(1)
                            }%`
                          : '—'
                      }
                    />

                    <InfoItem
                      label="Class ID"
                      value={
                        detection?.class_id ??
                        '—'
                      }
                    />

                    <InfoItem
                      label="Bounding Box"
                      value={
                        detection?.bbox
                          ? `${detection.bbox.x1}, ${detection.bbox.y1}, ${detection.bbox.x2}, ${detection.bbox.y2}`
                          : '—'
                      }
                    />

                  </div>

                </div>
              ),
            )}

          </div>

        </div>
      )}

      {/* ==================================================
          BACKEND STATUS
      ================================================== */}

      <div className="border-t border-black/10 dark:border-white/10 px-5 py-4">

        <div className="flex flex-wrap items-center gap-4 text-[10px] uppercase tracking-[0.14em] text-gray dark:text-muted">

          <span>
            Model: {result?.model || 'best.pt'}
          </span>

          <span>
            Source: {result?.source || 'ml_service'}
          </span>

          <span>
            Status: {result?.status || 'ok'}
          </span>

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   BOUNDING BOX IMAGE
   ============================================================ */

function DetectionBoxes({
  detections,
  imageSize,
}) {
  return (
    <>
      {detections.map(
        (detection, index) => {
          const bbox =
            detection?.bbox;

          if (!bbox) {
            return null;
          }

          const x1 =
            Number(bbox.x1);

          const y1 =
            Number(bbox.y1);

          const x2 =
            Number(bbox.x2);

          const y2 =
            Number(bbox.y2);

          const sourceWidth =
            Number(imageSize?.width) ||
            1;

          const sourceHeight =
            Number(imageSize?.height) ||
            1;

          if (
            !Number.isFinite(x1) ||
            !Number.isFinite(y1) ||
            !Number.isFinite(x2) ||
            !Number.isFinite(y2)
          ) {
            return null;
          }

          const left =
            (x1 / sourceWidth) * 100;

          const top =
            (y1 / sourceHeight) * 100;

          const width =
            ((x2 - x1) /
              sourceWidth) *
            100;

          const height =
            ((y2 - y1) /
              sourceHeight) *
            100;

          return (
            <div
              key={`${detection?.class_id || 'varroa'}-${index}`}
              className="absolute border-2 border-blue-500 pointer-events-none"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
            >

              <span className="absolute -top-6 left-0 bg-blue-500 text-white text-[9px] font-semibold px-1.5 py-1 whitespace-nowrap">
                {detection?.class_name ||
                  'varroa'}{' '}

                {Number.isFinite(
                  Number(
                    detection?.confidence,
                  ),
                )
                  ? `${
                      (
                        Number(
                          detection.confidence,
                        ) * 100
                      ).toFixed(0)
                    }%`
                  : ''}
              </span>

            </div>
          );
        },
      )}
    </>
  );
}

function BoundingBoxImage({
  imageUrl,
  imageVersion,
  detections,
}) {
  const [imageSize, setImageSize] =
    useState({
      width: 1,
      height: 1,
    });

  function handleImageLoad(event) {
    setImageSize({
      width:
        event.currentTarget
          .naturalWidth || 1,
      height:
        event.currentTarget
          .naturalHeight || 1,
    });
  }

  return (
    <div className="relative w-full overflow-hidden bg-black border border-black/10 dark:border-white/10">

      <img
        key={imageVersion}
        src={imageUrl}
        alt="Captured hive for Varroa detection"
        onLoad={handleImageLoad}
        className="block w-full h-auto"
      />

      <DetectionBoxes
        detections={detections}
        imageSize={imageSize}
      />

    </div>
  );
}


/* ============================================================
   HEALTH STAT
   ============================================================ */

function HealthStat({
  label,
  value,
  valueClass = '',
}) {
  return (
    <div className="bg-cream-card dark:bg-black-card p-5 min-w-0">

      <p className="text-[10px] uppercase tracking-[0.18em] text-gray dark:text-muted">
        {label}
      </p>

      <p
        className={`mt-2 text-lg font-semibold break-words ${
          valueClass || ''
        }`}
      >
        {value || '—'}
      </p>

    </div>
  );
}


/* ============================================================
   SENSOR VALUE
   ============================================================ */

function SensorValue({
  label,
  value,
}) {
  return (
    <div className="border border-black/10 dark:border-white/10 p-3 min-w-0">

      <p className="text-[9px] uppercase tracking-[0.14em] text-gray dark:text-muted">
        {label}
      </p>

      <p className="mt-1 text-xs font-semibold break-words">
        {value ?? '—'}
      </p>

    </div>
  );
}


/* ============================================================
   DETAIL STAT
   ============================================================ */

function DetailStat({
  label,
  value,
}) {
  return (
    <div className="bg-cream-card dark:bg-black-card p-5 min-w-0">

      <p className="text-[10px] uppercase tracking-[0.18em] text-gray dark:text-muted">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold break-all">
        {value || '—'}
      </p>

    </div>
  );
}


/* ============================================================
   INFO ITEM
   ============================================================ */

function InfoItem({
  label,
  value,
}) {
  return (
    <div className="min-w-0">

      <p className="text-[10px] uppercase tracking-[0.18em] text-gray dark:text-muted">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium break-words">
        {value || '—'}
      </p>

    </div>
  );
}


/* ============================================================
   FORMAT LABEL
   ============================================================ */

function formatLabel(key) {
  return String(key)
    .replace(
      /([A-Z])/g,
      ' $1',
    )
    .replace(
      /[_-]/g,
      ' ',
    )
    .replace(
      /\s+/g,
      ' ',
    )
    .replace(
      /^./,
      (char) =>
        char.toUpperCase(),
    )
    .trim();
}


/* ============================================================
   EXPORTS
   ============================================================ */

export default HivesSection;

export {
  HiveForm,
  HiveDetail,
};
