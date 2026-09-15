import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Boxes,
  CalendarDays,
  Factory,
  LoaderCircle,
  MapPin,
  Package,
  RefreshCw,
  Search,
  UserRound,
  X,
} from 'lucide-react';

import {
  getKvicFarms,
  getKvicFarm,
} from '../../services/kvicApi';

/* =========================================================
   HELPERS
========================================================= */

const getId = (item) => {
  if (!item) return '';

  return (
    item._id ||
    item.id ||
    item.farmId ||
    item.hiveId ||
    item.batchId ||
    ''
  );
};

const getText = (value, fallback = '—') => {
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

  if (typeof value === 'object') {
    const possibleValues = [
      value.name,
      value.title,
      value.code,
      value.keeperCode,
      value.area,
      value.city,
      value.district,
      value.state,
      value._id,
      value.id,
    ];

    const validValue = possibleValues.find(
      (item) =>
        item !== null &&
        item !== undefined &&
        item !== '' &&
        (
          typeof item === 'string' ||
          typeof item === 'number'
        )
    );

    return validValue !== undefined
      ? String(validValue)
      : fallback;
  }

  return fallback;
};

const formatDate = (value) => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/* =========================================================
   FARM HELPERS
========================================================= */

const getFarmName = (farm) => {
  return getText(
    farm?.name ||
      farm?.farmName ||
      farm?.farm_code ||
      farm?.farmCode,
    'Unnamed Farm'
  );
};

const getFarmLocation = (farm) => {
  const location = farm?.location;

  if (typeof location === 'string') {
    return location;
  }

  if (
    location &&
    typeof location === 'object'
  ) {
    const parts = [
      location.area,
      location.city,
      location.district,
      location.state,
    ].filter(
      (value) =>
        value !== null &&
        value !== undefined &&
        value !== '' &&
        (
          typeof value === 'string' ||
          typeof value === 'number'
        )
    );

    if (parts.length > 0) {
      return parts
        .map((value) => String(value))
        .join(', ');
    }
  }

  const fallbackParts = [
    farm?.area,
    farm?.city,
    farm?.district,
    farm?.state,
  ].filter(
    (value) =>
      value !== null &&
      value !== undefined &&
      value !== '' &&
      (
        typeof value === 'string' ||
        typeof value === 'number'
      )
  );

  if (fallbackParts.length > 0) {
    return fallbackParts
      .map((value) => String(value))
      .join(', ');
  }

  return 'Location not available';
};

const getKeeperName = (farm) => {
  const keeper = farm?.keeper;

  if (
    keeper &&
    typeof keeper === 'object'
  ) {
    return getText(
      keeper.name ||
        keeper.fullName ||
        keeper.keeperName ||
        keeper.keeperCode,
      'Unknown Keeper'
    );
  }

  return getText(
    farm?.keeperName ||
      farm?.ownerName ||
      farm?.keeper,
    'Unknown Keeper'
  );
};

/* =========================================================
   HIVE HELPERS
========================================================= */

const getHiveCode = (hive) => {
  return getText(
    hive?.hiveCode ||
      hive?.code ||
      hive?.name ||
      hive?.hiveName ||
      getId(hive),
    'Hive'
  );
};

const getHiveStatus = (hive) => {
  return getText(
    hive?.status ||
      hive?.healthStatus ||
      hive?.state,
    'Active'
  );
};

/* =========================================================
   BATCH HELPERS
========================================================= */

const getBatchCode = (batch) => {
  return getText(
    batch?.batchCode ||
      batch?.code ||
      batch?.batchNumber ||
      batch?.name ||
      getId(batch),
    'Batch'
  );
};

const getBatchStatus = (batch) => {
  return getText(
    batch?.status ||
      batch?.state,
    'Unknown'
  );
};

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-white">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   HIVE CARD
========================================================= */

function HiveCard({ hive }) {
  const hiveType = getText(
    hive?.type ||
      hive?.hiveType ||
      hive?.beeType,
    'Standard'
  );

  const hiveCreatedAt =
    hive?.createdAt ||
    hive?.created_at;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-amber-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-amber-500/40">

      <div className="flex items-start justify-between gap-3">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
            <Boxes size={19} />
          </div>

          <div className="min-w-0">

            <h4 className="truncate font-semibold text-zinc-900 dark:text-white">
              {getHiveCode(hive)}
            </h4>

            <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
              ID: {getText(getId(hive))}
            </p>

          </div>

        </div>

        <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium capitalize text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          {getHiveStatus(hive)}
        </span>

      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">

        <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Created
          </p>

          <p className="mt-1 truncate font-medium text-zinc-800 dark:text-zinc-200">
            {formatDate(hiveCreatedAt)}
          </p>

        </div>

        <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Type
          </p>

          <p className="mt-1 truncate font-medium text-zinc-800 dark:text-zinc-200">
            {hiveType}
          </p>

        </div>

      </div>
    </div>
  );
}

/* =========================================================
   BATCH CARD
========================================================= */

function BatchCard({ batch }) {
  const status = getBatchStatus(batch);

  const normalizedStatus =
    String(status).toLowerCase();

  const statusClass =
    normalizedStatus === 'completed' ||
    normalizedStatus === 'complete'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
      : normalizedStatus === 'pending'
        ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
        : normalizedStatus === 'failed'
          ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
          : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300';

  const quantity = getText(
    batch?.quantity ??
      batch?.weight ??
      batch?.quantityKg,
    '—'
  );

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-amber-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-amber-500/40">

      <div className="flex items-start justify-between gap-3">

        <div className="flex min-w-0 items-center gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
            <Package size={19} />
          </div>

          <div className="min-w-0">

            <h4 className="truncate font-semibold text-zinc-900 dark:text-white">
              {getBatchCode(batch)}
            </h4>

            <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
              ID: {getText(getId(batch))}
            </p>

          </div>

        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusClass}`}
        >
          {status}
        </span>

      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">

        <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Created
          </p>

          <p className="mt-1 truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {formatDate(
              batch?.createdAt ||
                batch?.created_at
            )}
          </p>

        </div>

        <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Quantity
          </p>

          <p className="mt-1 truncate text-sm font-medium text-zinc-800 dark:text-zinc-200">
            {quantity}
          </p>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   FARM DETAILS MODAL
========================================================= */

function FarmDetailsModal({
  farm,
  hives,
  batches,
  loading,
  error,
  onClose,
}) {
  if (!farm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">

      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">

        {/* HEADER */}

        <div className="flex items-start justify-between gap-4 border-b border-zinc-200 p-5 dark:border-zinc-800">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
              <Factory size={21} />
            </div>

            <div className="min-w-0">

              <h2 className="truncate text-xl font-bold text-zinc-900 dark:text-white">
                {getFarmName(farm)}
              </h2>

              <p className="mt-1 truncate text-sm text-zinc-500 dark:text-zinc-400">
                Farm details, hives and batches
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-white"
          >
            <X size={20} />
          </button>

        </div>

        {/* CONTENT */}

        <div className="overflow-y-auto p-5">

          {loading ? (

            <div className="flex min-h-[300px] items-center justify-center">

              <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">

                <LoaderCircle
                  size={22}
                  className="animate-spin"
                />

                <span>
                  Loading farm details...
                </span>

              </div>

            </div>

          ) : error ? (

            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <X size={25} />
              </div>

              <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">
                Failed to load farm details
              </h3>

              <p className="mt-2 max-w-md text-sm text-red-600 dark:text-red-400">
                {error}
              </p>

            </div>

          ) : (

            <>

              {/* =====================================================
                  FARM LOCATION
              ===================================================== */}

              <div className="grid gap-4 md:grid-cols-4">

                {/* AREA */}

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">

                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">

                    <MapPin size={17} />

                    <span className="text-xs font-medium uppercase tracking-wider">
                      Area
                    </span>

                  </div>

                  <p className="mt-2 break-words font-medium text-zinc-900 dark:text-white">
                    {getText(
                      farm?.location?.area,
                      '—'
                    )}
                  </p>

                </div>

                {/* STATE */}

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">

                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">

                    <MapPin size={17} />

                    <span className="text-xs font-medium uppercase tracking-wider">
                      State
                    </span>

                  </div>

                  <p className="mt-2 break-words font-medium text-zinc-900 dark:text-white">
                    {getText(
                      farm?.location?.state,
                      '—'
                    )}
                  </p>

                </div>

                {/* LATITUDE */}

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">

                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">

                    <MapPin size={17} />

                    <span className="text-xs font-medium uppercase tracking-wider">
                      Latitude
                    </span>

                  </div>

                  <p className="mt-2 break-words font-medium text-zinc-900 dark:text-white">
                    {farm?.location?.lat !== null &&
                    farm?.location?.lat !== undefined
                      ? String(
                          farm.location.lat
                        )
                      : '—'}
                  </p>

                </div>

                {/* LONGITUDE */}

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">

                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">

                    <MapPin size={17} />

                    <span className="text-xs font-medium uppercase tracking-wider">
                      Longitude
                    </span>

                  </div>

                  <p className="mt-2 break-words font-medium text-zinc-900 dark:text-white">
                    {farm?.location?.lng !== null &&
                    farm?.location?.lng !== undefined
                      ? String(
                          farm.location.lng
                        )
                      : '—'}
                  </p>

                </div>

              </div>

              {/* =====================================================
                  KEEPER
              ===================================================== */}

              <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">

                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">

                  <UserRound size={17} />

                  <span className="text-xs font-medium uppercase tracking-wider">
                    Keeper
                  </span>

                </div>

                <p className="mt-2 break-words font-medium text-zinc-900 dark:text-white">
                  {getKeeperName(farm)}
                </p>

              </div>

              {/* =====================================================
                  CREATED
              ===================================================== */}

              <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">

                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">

                  <CalendarDays size={17} />

                  <span className="text-xs font-medium uppercase tracking-wider">
                    Created
                  </span>

                </div>

                <p className="mt-2 font-medium text-zinc-900 dark:text-white">
                  {formatDate(
                    farm?.createdAt ||
                      farm?.created_at
                  )}
                </p>

              </div>

              {/* =====================================================
                  COUNTS
              ===================================================== */}

              <div className="mt-5 grid gap-4 sm:grid-cols-2">

                <StatCard
                  icon={Boxes}
                  label="Total Hives"
                  value={hives.length}
                />

                <StatCard
                  icon={Package}
                  label="Total Batches"
                  value={batches.length}
                />

              </div>

              {/* =====================================================
                  HIVES
              ===================================================== */}

              <section className="mt-7">

                <div className="mb-4 flex items-center justify-between gap-3">

                  <div>

                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                      Hives
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      Hives registered under this farm
                    </p>

                  </div>

                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                    {hives.length}
                  </span>

                </div>

                {hives.length === 0 ? (

                  <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">

                    <Boxes
                      size={30}
                      className="mx-auto text-zinc-400"
                    />

                    <p className="mt-3 font-medium text-zinc-700 dark:text-zinc-300">
                      No hives found
                    </p>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      This farm currently has no registered hives.
                    </p>

                  </div>

                ) : (

                  <div className="grid gap-4 md:grid-cols-2">

                    {hives.map(
                      (hive, index) => (
                        <HiveCard
                          key={
                            getId(hive) ||
                            `hive-${index}`
                          }
                          hive={hive}
                        />
                      )
                    )}

                  </div>

                )}

              </section>

              {/* =====================================================
                  BATCHES
              ===================================================== */}

              <section className="mt-8">

                <div className="mb-4 flex items-center justify-between gap-3">

                  <div>

                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                      Batches
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      Honey batches associated with this farm
                    </p>

                  </div>

                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
                    {batches.length}
                  </span>

                </div>

                {batches.length === 0 ? (

                  <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700">

                    <Package
                      size={30}
                      className="mx-auto text-zinc-400"
                    />

                    <p className="mt-3 font-medium text-zinc-700 dark:text-zinc-300">
                      No batches found
                    </p>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      This farm currently has no registered batches.
                    </p>

                  </div>

                ) : (

                  <div className="grid gap-4 md:grid-cols-2">

                    {batches.map(
                      (batch, index) => (
                        <BatchCard
                          key={
                            getId(batch) ||
                            `batch-${index}`
                          }
                          batch={batch}
                        />
                      )
                    )}

                  </div>

                )}

              </section>

            </>

          )}

        </div>

        {/* FOOTER */}

        <div className="flex justify-end border-t border-zinc-200 p-4 dark:border-zinc-800">

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Close
          </button>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   MAIN KVIC FARMS PAGE
========================================================= */

export default function KvicFarms() {

  const [farms, setFarms] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [selectedFarm, setSelectedFarm] =
    useState(null);

  const [selectedHives, setSelectedHives] =
    useState([]);

  const [selectedBatches, setSelectedBatches] =
    useState([]);

  const [detailsLoading, setDetailsLoading] =
    useState(false);

  const [detailsError, setDetailsError] =
    useState('');

  /* =====================================================
     LOAD FARMS
  ===================================================== */

  const loadFarms = async (
    showLoader = true
  ) => {

    try {

      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError('');

      const response =
        await getKvicFarms();

      let farmList = [];

      if (Array.isArray(response)) {

        farmList = response;

      } else if (
        Array.isArray(response?.farms)
      ) {

        farmList = response.farms;

      } else if (
        Array.isArray(response?.data)
      ) {

        farmList = response.data;

      }

      setFarms(
        Array.isArray(farmList)
          ? farmList
          : []
      );

    } catch (err) {

      console.error(
        'Failed to load KVIC farms:',
        err
      );

      setError(
        err?.message ||
          'Failed to load farms.'
      );

      setFarms([]);

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadFarms();
  }, []);

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredFarms = useMemo(() => {

    const query =
      search.trim().toLowerCase();

    if (!query) {
      return farms;
    }

    return farms.filter((farm) => {

      const name =
        getFarmName(farm)
          .toLowerCase();

      const location =
        getFarmLocation(farm)
          .toLowerCase();

      const keeper =
        getKeeperName(farm)
          .toLowerCase();

      const id =
        getText(
          getId(farm),
          ''
        ).toLowerCase();

      return (
        name.includes(query) ||
        location.includes(query) ||
        keeper.includes(query) ||
        id.includes(query)
      );

    });

  }, [farms, search]);

  /* =====================================================
     OPEN FARM DETAILS
  ===================================================== */

  const openFarmDetails = async (
    farm
  ) => {

    const farmId = getId(farm);

    if (!farmId) {

      setDetailsError(
        'This farm does not have a valid ID.'
      );

      setSelectedFarm(farm);

      return;
    }

    setSelectedFarm(farm);
    setSelectedHives([]);
    setSelectedBatches([]);
    setDetailsError('');
    setDetailsLoading(true);

    try {

      const response =
        await getKvicFarm(farmId);

      const detailFarm =
        response?.farm ||
        response?.data?.farm ||
        farm;

      const hives =
        Array.isArray(
          response?.hives
        )
          ? response.hives
          : Array.isArray(
              response?.data?.hives
            )
            ? response.data.hives
            : [];

      const batches =
        Array.isArray(
          response?.batches
        )
          ? response.batches
          : Array.isArray(
              response?.data?.batches
            )
            ? response.data.batches
            : [];

      setSelectedFarm(
        detailFarm
      );

      setSelectedHives(
        hives
      );

      setSelectedBatches(
        batches
      );

    } catch (err) {

      console.error(
        'Failed to load farm details:',
        err
      );

      setDetailsError(
        err?.message ||
          'Failed to load farm details.'
      );

    } finally {

      setDetailsLoading(false);

    }

  };

  /* =====================================================
     CLOSE DETAILS
  ===================================================== */

  const closeFarmDetails = () => {

    setSelectedFarm(null);
    setSelectedHives([]);
    setSelectedBatches([]);
    setDetailsError('');
    setDetailsLoading(false);

  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (

    <div className="min-h-full bg-zinc-50 dark:bg-black">

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                <Factory size={23} />
              </div>

              <div>

                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                  Farm Management
                </h1>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Monitor farms, hives and honey batches
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() =>
                loadFarms(false)
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >

              <RefreshCw
                size={17}
                className={
                  refreshing
                    ? 'animate-spin'
                    : ''
                }
              />

              Refresh

            </button>

          </div>

        </div>

      </div>

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ERROR */}

        {error && (

          <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <span>
                {error}
              </span>

              <button
                type="button"
                onClick={() =>
                  loadFarms()
                }
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>

            </div>

          </div>

        )}

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          <StatCard
            icon={Factory}
            label="Total Farms"
            value={farms.length}
          />

          <StatCard
            icon={Search}
            label="Matching Farms"
            value={filteredFarms.length}
          />

          <StatCard
            icon={Boxes}
            label="Details"
            value="Available"
          />

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">

          <div className="relative">

            <Search
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search farms, keeper, location or farm ID..."
              className="w-full rounded-xl border border-zinc-300 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            />

          </div>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="flex min-h-[350px] items-center justify-center rounded-3xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">

            <div className="flex flex-col items-center gap-3 text-zinc-500 dark:text-zinc-400">

              <LoaderCircle
                size={30}
                className="animate-spin"
              />

              <p className="text-sm">
                Loading farms...
              </p>

            </div>

          </div>

        ) : filteredFarms.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white px-6 text-center dark:border-zinc-700 dark:bg-zinc-950">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
              <Factory size={28} />
            </div>

            <h3 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-white">
              No farms found
            </h3>

            <p className="mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">

              {search
                ? 'No farms match your search.'
                : 'There are currently no farms available for KVIC management.'}

            </p>

            {search && (

              <button
                type="button"
                onClick={() =>
                  setSearch('')
                }
                className="mt-4 rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Clear Search
              </button>

            )}

          </div>

        ) : (

          /* =================================================
             FARM LIST
          ================================================= */

          <div className="space-y-4">

            {filteredFarms.map(
              (farm, index) => {

                const farmId =
                  getId(farm);

                return (

                  <div
                    key={
                      farmId ||
                      `farm-${index}`
                    }
                    className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-amber-500/40"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      {/* FARM INFO */}

                      <div className="flex min-w-0 items-start gap-4">

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                          <Factory size={25} />
                        </div>

                        <div className="min-w-0">

                          <h2 className="truncate text-lg font-bold text-zinc-900 dark:text-white">
                            {getFarmName(farm)}
                          </h2>

                          <div className="mt-2 flex flex-col gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">

                            <div className="flex min-w-0 items-center gap-2">

                              <MapPin
                                size={15}
                                className="shrink-0"
                              />

                              <span className="truncate">
                                {getFarmLocation(
                                  farm
                                )}
                              </span>

                            </div>

                            <div className="flex min-w-0 items-center gap-2">

                              <UserRound
                                size={15}
                                className="shrink-0"
                              />

                              <span className="truncate">
                                {getKeeperName(
                                  farm
                                )}
                              </span>

                            </div>

                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-2">

                            <span className="max-w-full truncate rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
                              ID:{' '}
                              {getText(
                                farmId
                              )}
                            </span>

                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                              Farm
                            </span>

                          </div>

                        </div>

                      </div>

                      {/* VIEW DETAILS */}

                      <div className="flex shrink-0">

                        <button
                          type="button"
                          onClick={() =>
                            openFarmDetails(
                              farm
                            )
                          }
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 lg:w-auto dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >

                          View Details

                          <ArrowRight
                            size={17}
                          />

                        </button>

                      </div>

                    </div>

                    {/* QUICK INFORMATION */}

                    <div className="mt-5 grid gap-3 border-t border-zinc-100 pt-5 sm:grid-cols-3 dark:border-zinc-800">

                      <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">

                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Created
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                          {formatDate(
                            farm?.createdAt ||
                              farm?.created_at
                          )}
                        </p>

                      </div>

                      <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">

                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Area
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                          {getText(
                            farm?.location?.area,
                            '—'
                          )}
                        </p>

                      </div>

                      <div className="rounded-xl bg-zinc-50 p-3 dark:bg-zinc-900">

                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          State
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                          {getText(
                            farm?.location?.state,
                            '—'
                          )}
                        </p>

                      </div>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}

        {/* =================================================
            FOOTER INFO
        ================================================= */}

        {!loading &&
          filteredFarms.length > 0 && (

            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 sm:flex-row sm:items-center sm:justify-between">

              <span>

                Showing{' '}

                <strong className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {filteredFarms.length}
                </strong>{' '}

                of{' '}

                <strong className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {farms.length}
                </strong>{' '}

                farms

              </span>

              <div className="flex items-center gap-2">

                <ArrowLeft
                  size={15}
                  className="opacity-50"
                />

                <span>
                  Open a farm to view its hives and batches
                </span>

                <ArrowRight
                  size={15}
                  className="opacity-50"
                />

              </div>

            </div>

          )}

      </div>

      {/* ===================================================
          FARM DETAILS MODAL
      =================================================== */}

      {selectedFarm && (

        <FarmDetailsModal
          farm={selectedFarm}
          hives={selectedHives}
          batches={selectedBatches}
          loading={detailsLoading}
          error={detailsError}
          onClose={closeFarmDetails}
        />

      )}

    </div>

  );
}