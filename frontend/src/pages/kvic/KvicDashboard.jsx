import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ClipboardList,
  Factory,
  LoaderCircle,
  LogOut,
  Package,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  getKvicFarms,
  getKvicBatches,
} from '../../services/kvicApi';

import {
  getStoredKvicAdmin,
  logoutKvicAdmin,
} from '../../services/kvicAuthService';


// --------------------------------------------------
// Helpers
// --------------------------------------------------

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

function getArrayFromResponse(data, keys = []) {
  if (Array.isArray(data)) {
    return data;
  }

  for (const key of keys) {
    if (Array.isArray(data?.[key])) {
      return data[key];
    }
  }

  return [];
}

function getId(item) {
  return (
    item?._id ||
    item?.id ||
    item?.farmId ||
    item?.batchId ||
    null
  );
}

function getFarmName(farm) {
  return (
    farm?.name ||
    farm?.farmName ||
    farm?.farm_name ||
    farm?.farmCode ||
    'Unnamed Farm'
  );
}

function getKeeperName(farm) {
  return (
    farm?.keeper?.name ||
    farm?.keeper?.fullName ||
    farm?.keeperName ||
    farm?.owner?.name ||
    'Unknown Keeper'
  );
}

function formatLocation(location) {
  if (!location) {
    return '—';
  }

  if (typeof location === 'string') {
    return location;
  }

  if (typeof location === 'object') {
    const parts = [
      location.area,
      location.state,
    ].filter(Boolean);

    if (parts.length > 0) {
      return parts.join(', ');
    }

    return 'Location available';
  }

  return String(location);
}


// --------------------------------------------------
// Stat Card
// --------------------------------------------------

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {displayValue(value)}
          </p>

          {subtitle && (
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-200">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}


// --------------------------------------------------
// Management Card
// --------------------------------------------------

function ManagementCard({
  title,
  description,
  icon: Icon,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full rounded-2xl border border-black/10 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-black/20 hover:shadow-md dark:border-white/10 dark:bg-zinc-950 dark:hover:border-white/20"
    >
      <div className="flex items-start justify-between gap-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-800 dark:bg-white/10 dark:text-zinc-100">
          <Icon size={23} />
        </div>

        <ArrowRight
          size={20}
          className="text-zinc-400 transition group-hover:translate-x-1 group-hover:text-zinc-900 dark:group-hover:text-white"
        />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
        {description}
      </p>

      <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-200">
        Open Management
        <ArrowRight size={15} />
      </div>
    </button>
  );
}


// --------------------------------------------------
// Recent Farm Card
// --------------------------------------------------

function RecentFarmCard({ farm }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-zinc-950">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h4 className="truncate font-semibold text-zinc-900 dark:text-white">
            {displayValue(getFarmName(farm))}
          </h4>

          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Farm ID: {displayValue(getId(farm))}
          </p>
        </div>

        <Factory
          size={18}
          className="shrink-0 text-zinc-400"
        />
      </div>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-zinc-500 dark:text-zinc-400">
            Keeper
          </span>

          <span className="text-right font-medium text-zinc-800 dark:text-zinc-200">
            {displayValue(getKeeperName(farm))}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-zinc-500 dark:text-zinc-400">
            Location
          </span>

          <span className="text-right font-medium text-zinc-800 dark:text-zinc-200">
            {formatLocation(
              farm?.location ||
                farm?.address
            )}
          </span>
        </div>

        <div className="flex items-center justify-between gap-4">
          <span className="text-zinc-500 dark:text-zinc-400">
            Hives
          </span>

          <span className="font-medium text-zinc-800 dark:text-zinc-200">
            {Array.isArray(farm?.hives)
              ? farm.hives.length
              : displayValue(
                  farm?.hiveCount ??
                    farm?.hives
                )}
          </span>
        </div>
      </div>
    </div>
  );
}


// --------------------------------------------------
// Main Dashboard
// --------------------------------------------------

export default function KvicDashboard() {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);

  const [farms, setFarms] = useState([]);
  const [batches, setBatches] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // ------------------------------------------------
  // Load Dashboard
  // ------------------------------------------------

  const loadDashboard = async ({
    showRefresh = false,
  } = {}) => {
    try {
      setError('');

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [
        farmsResponse,
        batchesResponse,
      ] = await Promise.all([
        getKvicFarms(),
        getKvicBatches(),
      ]);

      const farmsData =
        getArrayFromResponse(
          farmsResponse,
          ['farms', 'data']
        );

      const batchesData =
        getArrayFromResponse(
          batchesResponse,
          ['batches', 'data']
        );

      setFarms(farmsData);
      setBatches(batchesData);
    } catch (err) {
      console.error(
        'KVIC dashboard loading failed:',
        err
      );

      setError(
        err?.message ||
          'Failed to load KVIC dashboard data.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ------------------------------------------------
  // Initial Load
  // ------------------------------------------------

  useEffect(() => {
    const storedAdmin =
      getStoredKvicAdmin();

    setAdmin(storedAdmin);

    loadDashboard();
  }, []);

  // ------------------------------------------------
  // Logout
  // ------------------------------------------------

  const handleLogout = () => {
    logoutKvicAdmin();

    navigate(
      '/kvic/login',
      { replace: true }
    );
  };

  // ------------------------------------------------
  // Statistics
  // ------------------------------------------------

  const statistics = useMemo(() => {
    const totalFarms =
      farms.length;

    const totalBatches =
      batches.length;

    const totalHives = farms.reduce(
      (total, farm) => {
        if (Array.isArray(farm?.hives)) {
          return (
            total +
            farm.hives.length
          );
        }

        const count =
          Number(
            farm?.hiveCount ||
              farm?.numberOfHives ||
              0
          );

        return (
          total +
          (Number.isFinite(count)
            ? count
            : 0)
        );
      },
      0
    );

    const activeBatches =
      batches.filter((batch) => {
        const status =
          String(
            batch?.status || ''
          ).toLowerCase();

        return (
          status !== 'completed' &&
          status !== 'closed' &&
          status !== 'rejected'
        );
      }).length;

    return {
      totalFarms,
      totalBatches,
      totalHives,
      activeBatches,
    };
  }, [farms, batches]);

  // ------------------------------------------------
  // Recent Farms
  // ------------------------------------------------

  const recentFarms = useMemo(() => {
    return farms.slice(0, 5);
  }, [farms]);

  // ------------------------------------------------
  // Loading Screen
  // ------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-zinc-50 px-6 dark:bg-black">
        <div className="flex flex-col items-center gap-3 text-center">
          <LoaderCircle
            size={30}
            className="animate-spin text-zinc-700 dark:text-zinc-200"
          />

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Loading KVIC dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------------------------
  // Dashboard
  // ------------------------------------------------

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ------------------------------------------ */}
        {/* Header */}
        {/* ------------------------------------------ */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black">
                <ShieldCheck size={23} />
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
                  KVIC Administration
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Dashboard
                </h1>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Monitor registered beekeeping farms,
              hives and honey production batches
              from the KVIC administration panel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() =>
                loadDashboard({
                  showRefresh: true,
                })
              }
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-white/10"
            >
              <RefreshCw
                size={16}
                className={
                  refreshing
                    ? 'animate-spin'
                    : ''
                }
              />

              Refresh
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* ------------------------------------------ */}
        {/* Admin Info */}
        {/* ------------------------------------------ */}

        <div className="mb-6 rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-white/10">
                <UserRound
                  size={19}
                  className="text-zinc-700 dark:text-zinc-200"
                />
              </div>

              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  Logged in as
                </p>

                <p className="font-semibold text-zinc-900 dark:text-white">
                  {displayValue(
                    admin?.name ||
                      admin?.fullName ||
                      admin?.email
                  )}
                </p>
              </div>
            </div>

            {admin?.email && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {displayValue(admin.email)}
              </p>
            )}
          </div>
        </div>

        {/* ------------------------------------------ */}
        {/* Error */}
        {/* ------------------------------------------ */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-red-700 dark:text-red-300">
            <AlertTriangle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="font-semibold">
                Unable to load dashboard
              </p>

              <p className="mt-1 text-sm opacity-90">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ------------------------------------------ */}
        {/* Statistics */}
        {/* ------------------------------------------ */}

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Overview
            </h2>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Current platform statistics.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Farms"
              value={
                statistics.totalFarms
              }
              subtitle="Registered farms"
              icon={Factory}
            />

            <StatCard
              title="Total Hives"
              value={
                statistics.totalHives
              }
              subtitle="Across registered farms"
              icon={Users}
            />

            <StatCard
              title="Total Batches"
              value={
                statistics.totalBatches
              }
              subtitle="Honey production batches"
              icon={Package}
            />

            <StatCard
              title="Active Batches"
              value={
                statistics.activeBatches
              }
              subtitle="Currently in progress"
              icon={ClipboardList}
            />
          </div>
        </section>

        {/* ------------------------------------------ */}
        {/* Management */}
        {/* ------------------------------------------ */}

        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-lg font-semibold">
              Management
            </h2>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Access and manage KVIC platform data.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Farm Management */}
            <ManagementCard
              title="Farm Management"
              description="View registered farms, keeper information, locations, hive counts and individual farm details."
              icon={Factory}
              onClick={() =>
                navigate('/kvic/farms')
              }
            />

            {/* Batch Management */}
            <ManagementCard
              title="Batch Management"
              description="View honey production batches, their status, farm information and batch details."
              icon={Package}
              onClick={() =>
                navigate('/kvic/batches')
              }
            />

          </div>
        </section>

        {/* ------------------------------------------ */}
        {/* Recent Farms */}
        {/* ------------------------------------------ */}

        <section className="mt-10">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Recent Farms
              </h2>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Recently returned registered farms.
              </p>
            </div>

            {farms.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  navigate('/kvic/farms')
                }
                className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
              >
                View all farms
                <ArrowRight size={15} />
              </button>
            )}
          </div>

          {recentFarms.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/10 bg-white p-8 text-center dark:border-white/10 dark:bg-zinc-950">
              <Factory
                size={28}
                className="mx-auto text-zinc-400"
              />

              <p className="mt-3 font-medium">
                No farms found
              </p>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Registered farms will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {recentFarms.map((farm) => (
                <RecentFarmCard
                  key={
                    getId(farm) ||
                    Math.random()
                  }
                  farm={farm}
                />
              ))}
            </div>
          )}
        </section>

        {/* ------------------------------------------ */}
        {/* System Notice */}
        {/* ------------------------------------------ */}

        <section className="mt-10">
          <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-950">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 dark:bg-white/10">
                <ShieldCheck
                  size={19}
                  className="text-zinc-700 dark:text-zinc-200"
                />
              </div>

              <div>
                <h3 className="font-semibold">
                  KVIC Administration Panel
                </h3>

                <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  Farm and batch information is
                  retrieved directly from the
                  HoneyChain backend. Laboratory
                  report filing is handled outside
                  this administration dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}