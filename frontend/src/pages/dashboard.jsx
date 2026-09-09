import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  BookOpen,
  Boxes,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Cloud,
  ExternalLink,
  FileCheck2,
  FlaskConical,
  Hexagon,
  Home,
  Leaf,
  LoaderCircle,
  MapPin,
  Plus,
  QrCode,
  RefreshCw,
  ShieldAlert,
  Sprout,
  Tractor,
  TrendingUp,
  UserRound,
  X,
} from 'lucide-react';

import { getCurrentKeeper } from '../services/authService';


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';


/* ============================================================
   API HELPER
   ============================================================ */

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('honeychain_token');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(options.headers || {}),
    },
  });

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`,
    );
  }

  return data;
}


/* ============================================================
   SMALL HELPERS
   ============================================================ */

function getId(item) {
  return item?._id || item?.id;
}


function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}


function getErrorMessage(error) {
  return error?.message || 'Something went wrong.';
}


/* ============================================================
   MAIN DASHBOARD
   ============================================================ */

export default function Dashboard() {
  const [keeper, setKeeper] = useState(null);

  const [farms, setFarms] = useState([]);
  const [hives, setHives] = useState([]);
  const [batches, setBatches] = useState([]);

  const [alerts, setAlerts] = useState([]);
  const [resolvedAlerts, setResolvedAlerts] = useState([]);

  const [yieldEstimate, setYieldEstimate] = useState(null);
  const [risks, setRisks] = useState({});

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState('');

  const [activeSection, setActiveSection] = useState('dashboard');

  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedHive, setSelectedHive] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedPassport, setSelectedPassport] = useState(null);

  const [historyData, setHistoryData] = useState({
    current: [],
    resolved: [],
  });


  /* ==========================================================
     LOAD DASHBOARD DATA
     ========================================================== */

  async function loadDashboard() {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('honeychain_token');

      if (!token) {
        throw new Error('Authentication token is missing.');
      }

      const meResponse = await getCurrentKeeper(token);

      const currentKeeper = meResponse?.keeper || meResponse;

      setKeeper(currentKeeper);

      let loadedFarms = meResponse?.farms || [];

      /*
       * If /api/auth/me does not return farms, fetch them separately.
       */
      if (!loadedFarms.length && getId(currentKeeper)) {
        try {
          const farmResponse = await apiRequest(
            `/api/keepers/${getId(currentKeeper)}/farms`,
          );

          loadedFarms =
            farmResponse?.farms ||
            farmResponse ||
            [];
        } catch {
          loadedFarms = [];
        }
      }

      setFarms(Array.isArray(loadedFarms) ? loadedFarms : []);


      /* --------------------------------------------------------
         LOAD HIVES
         -------------------------------------------------------- */

      const hiveResults = await Promise.all(
        loadedFarms.map(async (farm) => {
          const farmId = getId(farm);

          if (!farmId) return [];

          try {
            const response = await apiRequest(
              `/api/hives?farmId=${farmId}`,
            );

            return response?.hives || response || [];
          } catch {
            return [];
          }
        }),
      );

      const allHives = hiveResults.flat();

      setHives(allHives);


      /* --------------------------------------------------------
         LOAD BATCHES
         -------------------------------------------------------- */

      let loadedBatches = [];

      try {
        const response = await apiRequest('/api/batches');

        loadedBatches =
          response?.batches ||
          response ||
          [];
      } catch {
        loadedBatches = [];
      }

      setBatches(Array.isArray(loadedBatches) ? loadedBatches : []);


      /* --------------------------------------------------------
         LOAD ALERTS
         -------------------------------------------------------- */

      const activeAlertResults = await Promise.all(
        loadedFarms.map(async (farm) => {
          const farmId = getId(farm);

          if (!farmId) return [];

          try {
            const response = await apiRequest(
              `/api/alerts?farmId=${farmId}&status=open`,
            );

            return response?.alerts || response || [];
          } catch {
            return [];
          }
        }),
      );

      const activeAlerts = activeAlertResults.flat();

      setAlerts(activeAlerts);


      /* --------------------------------------------------------
         LOAD RESOLVED ALERTS
         -------------------------------------------------------- */

      const resolvedAlertResults = await Promise.all(
        loadedFarms.map(async (farm) => {
          const farmId = getId(farm);

          if (!farmId) return [];

          try {
            const response = await apiRequest(
              `/api/alerts?farmId=${farmId}`,
            );

            const farmAlerts =
              response?.alerts ||
              response ||
              [];

            return farmAlerts.filter(
              (alert) =>
                String(alert?.status || '').toLowerCase() ===
                  'resolved' ||
                alert?.resolved === true,
            );
          } catch {
            return [];
          }
        }),
      );

      const resolved = resolvedAlertResults.flat();

      setResolvedAlerts(resolved);


      /* --------------------------------------------------------
         LOAD YIELD ESTIMATE
         -------------------------------------------------------- */

      if (loadedFarms.length) {
        try {
          const response = await apiRequest('/api/yield/estimate', {
            method: 'POST',
            body: JSON.stringify({
              farmId: getId(loadedFarms[0]),
              season: 'monsoon',
            }),
          });

          setYieldEstimate(
            response?.yieldEstimate ??
              response?.estimatedYield ??
              response?.yield ??
              response,
          );
        } catch {
          setYieldEstimate(null);
        }
      } else {
        setYieldEstimate(null);
      }


      /* --------------------------------------------------------
         LOAD DISEASE RISKS
         -------------------------------------------------------- */

      const riskEntries = await Promise.all(
        allHives.map(async (hive) => {
          const hiveId = getId(hive);

          if (!hiveId) return null;

          try {
            const response = await apiRequest(
              `/api/yield/disease-risk/${hiveId}`,
            );

            return [
              hiveId,
              response?.risk ??
                response?.diseaseRisk ??
                response,
            ];
          } catch {
            return null;
          }
        }),
      );

      const riskMap = {};

      riskEntries.forEach((entry) => {
        if (entry) {
          riskMap[entry[0]] = entry[1];
        }
      });

      setRisks(riskMap);


      /* --------------------------------------------------------
         BUILD ALERT HISTORY
         -------------------------------------------------------- */

      const currentHistory = activeAlerts.map((alert) => ({
        ...alert,
        historyType: 'active',
      }));

      const resolvedHistory = resolved.map((alert) => ({
        ...alert,
        historyType: 'resolved',
      }));

      setHistoryData({
        current: currentHistory,
        resolved: resolvedHistory,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadDashboard();
  }, []);


  /* ==========================================================
     NAVIGATION
     ========================================================== */

  function openSection(section) {
    setActiveSection(section);

    setSelectedFarm(null);
    setSelectedHive(null);
    setSelectedBatch(null);
    setSelectedPassport(null);
  }


  /* ==========================================================
     FARM ACTIONS
     ========================================================== */

  async function createFarm(formData) {
    setActionLoading(true);
    setError('');

    try {
      await apiRequest('/api/farms', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          keeper:
            formData.keeper ||
            getId(keeper),
        }),
      });

      await loadDashboard();

      setActiveSection('farms');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }


  async function updateFarm(farmId, formData) {
    setActionLoading(true);
    setError('');

    try {
      await apiRequest(`/api/farms/${farmId}`, {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });

      await loadDashboard();

      setSelectedFarm(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }


  /* ==========================================================
     HIVE ACTIONS
     ========================================================== */

  async function createHive(formData) {
    setActionLoading(true);
    setError('');

    try {
      await apiRequest('/api/hives', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      await loadDashboard();

      if (formData.farm) {
        const farm = farms.find(
          (item) => getId(item) === formData.farm,
        );

        if (farm) {
          setSelectedFarm(farm);
        }
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }


  /* ==========================================================
     BATCH ACTIONS
     ========================================================== */

  async function createBatch(formData) {
    setActionLoading(true);
    setError('');

    try {
      await apiRequest('/api/batches', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          keeper:
            formData.keeper ||
            getId(keeper),
        }),
      });

      await loadDashboard();

      setActiveSection('batches');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }


  async function updateBatch(batchId, formData) {
    setActionLoading(true);
    setError('');

    try {
      await apiRequest(`/api/batches/${batchId}`, {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });

      await loadDashboard();

      setSelectedBatch(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }


  /* ==========================================================
     ALERT RESOLUTION
     ========================================================== */

  async function resolveAlert(alertId) {
    setActionLoading(true);
    setError('');

    try {
      await apiRequest(`/api/alerts/${alertId}/resolve`, {
        method: 'PATCH',
      });

      await loadDashboard();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }


  /* ==========================================================
     STATISTICS
     ========================================================== */

  const statistics = useMemo(
    () => ({
      totalFarms: farms.length,
      totalHives: hives.length,
      totalBatches: batches.length,
      totalAlerts: alerts.length,
      resolvedAlerts: resolvedAlerts.length,
    }),
    [
      farms,
      hives,
      batches,
      alerts,
      resolvedAlerts,
    ],
  );


  /* ==========================================================
     LOADING SCREEN
     ========================================================== */

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-cream dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle
            className="animate-spin text-gold"
            size={32}
          />

          <p className="text-sm text-gray dark:text-muted">
            Loading your HoneyChain dashboard...
          </p>
        </div>
      </div>
    );
  }


  /* ==========================================================
     DASHBOARD
     ========================================================== */

  return (
    <div className="min-h-[calc(100vh-72px)] bg-cream dark:bg-black text-black dark:text-cream">

      <div className="flex min-h-[calc(100vh-72px)]">

        {/* ====================================================
            SIDEBAR
        ===================================================== */}

        <aside className="hidden lg:flex w-64 shrink-0 border-r border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card flex-col">

          <div className="p-6 border-b border-black/10 dark:border-white/10">

            <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
              HoneyChain
            </p>

            <h2 className="mt-2 text-lg font-semibold">
              Keeper Portal
            </h2>

          </div>


          <nav className="flex-1 p-4 space-y-1">

            <SidebarButton
              active={activeSection === 'dashboard'}
              icon={Home}
              label="Dashboard"
              onClick={() => openSection('dashboard')}
            />

            <SidebarButton
              active={activeSection === 'farms'}
              icon={Tractor}
              label="Farms"
              onClick={() => openSection('farms')}
            />

            <SidebarButton
              active={activeSection === 'hives'}
              icon={Hexagon}
              label="Hives"
              onClick={() => openSection('hives')}
            />

            <SidebarButton
              active={activeSection === 'batches'}
              icon={Boxes}
              label="Honey Batches"
              onClick={() => openSection('batches')}
            />

            <SidebarButton
              active={activeSection === 'passport'}
              icon={QrCode}
              label="Digital Passport"
              onClick={() => openSection('passport')}
            />

            <SidebarButton
              active={activeSection === 'training'}
              icon={BookOpen}
              label="Training"
              onClick={() => openSection('training')}
            />

            <SidebarButton
              active={activeSection === 'fraud'}
              icon={ShieldAlert}
              label="Fraud Alerts"
              onClick={() => openSection('fraud')}
            />

            <SidebarButton
              active={activeSection === 'blockchain'}
              icon={Boxes}
              label="Blockchain Explorer"
              onClick={() => openSection('blockchain')}
            />

            <SidebarButton
              active={activeSection === 'history'}
              icon={ClipboardList}
              label="Alert History"
              onClick={() => openSection('history')}
            />

          </nav>


          <div className="p-4 border-t border-black/10 dark:border-white/10">

            <div className="p-4 border border-black/10 dark:border-white/10">

              <UserRound
                size={18}
                className="text-gold"
              />

              <p className="mt-3 text-sm font-semibold truncate">
                {keeper?.name || 'Keeper'}
              </p>

              <p className="mt-1 text-xs text-gray dark:text-muted truncate">
                {keeper?.phone || '—'}
              </p>

            </div>

          </div>

        </aside>


        {/* ====================================================
            MAIN AREA
        ===================================================== */}

        <main className="flex-1 min-w-0">

          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8">

            {/* MOBILE SECTION NAV */}

            <div className="lg:hidden mb-6 overflow-x-auto">

              <div className="flex gap-2 min-w-max">

                {[
                  ['dashboard', 'Dashboard'],
                  ['farms', 'Farms'],
                  ['hives', 'Hives'],
                  ['batches', 'Batches'],
                  ['passport', 'Passport'],
                  ['training', 'Training'],
                  ['fraud', 'Fraud'],
                  ['blockchain', 'Blockchain'],
                  ['history', 'Alert History'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => openSection(id)}
                    className={`px-3 py-2 text-xs border ${
                      activeSection === id
                        ? 'bg-black text-cream dark:bg-cream dark:text-black border-black dark:border-cream'
                        : 'border-black/10 dark:border-white/10'
                    }`}
                  >
                    {label}
                  </button>
                ))}

              </div>

            </div>


            {/* ERROR */}

            {error && (
              <div className="mb-6 flex items-start gap-3 border border-red-500/30 bg-red-500/5 p-4">

                <AlertCircle
                  size={20}
                  className="text-red-500 shrink-0"
                />

                <div className="flex-1">

                  <p className="text-sm font-medium">
                    {error}
                  </p>

                  <button
                    onClick={() => setError('')}
                    className="mt-2 text-xs underline"
                  >
                    Dismiss
                  </button>

                </div>

              </div>
            )}


            {/* =================================================
                SECTION CONTENT
            ================================================== */}

            {activeSection === 'dashboard' && (
              <DashboardHome
                keeper={keeper}
                statistics={statistics}
                farms={farms}
                hives={hives}
                alerts={alerts}
                risks={risks}
                yieldEstimate={yieldEstimate}
                onOpenSection={openSection}
                onResolveAlert={resolveAlert}
                actionLoading={actionLoading}
              />
            )}


            {activeSection === 'farms' && (
              <FarmsSection
                farms={farms}
                hives={hives}
                alerts={alerts}
                onCreate={createFarm}
                onUpdate={updateFarm}
                onOpenFarm={setSelectedFarm}
                actionLoading={actionLoading}
              />
            )}


            {activeSection === 'hives' && (
              <HivesSection
                farms={farms}
                hives={hives}
                alerts={alerts}
                risks={risks}
                onCreate={createHive}
                onOpenHive={setSelectedHive}
                actionLoading={actionLoading}
              />
            )}


            {activeSection === 'batches' && (
              <BatchesSection
                farms={farms}
                batches={batches}
                keeper={keeper}
                onCreate={createBatch}
                onOpenBatch={setSelectedBatch}
                actionLoading={actionLoading}
              />
            )}


            {activeSection === 'passport' && (
              <PassportSection
                farms={farms}
                batches={batches}
                onOpenBatch={setSelectedPassport}
              />
            )}


            {activeSection === 'training' && (
              <TrainingSection />
            )}


            {activeSection === 'fraud' && (
              <FraudSection batches={batches} />
            )}


            {activeSection === 'blockchain' && (
              <BlockchainSection />
            )}


            {activeSection === 'history' && (
              <HistorySection
                historyData={historyData}
                onResolveAlert={resolveAlert}
                actionLoading={actionLoading}
              />
            )}

          </div>

        </main>

      </div>


      {/* ======================================================
          FARM DETAIL WINDOW
      ======================================================= */}

      {selectedFarm && (
        <FarmDetail
          farm={selectedFarm}
          farms={farms}
          hives={hives}
          alerts={alerts}
          onClose={() => setSelectedFarm(null)}
          onCreateHive={createHive}
          onUpdateFarm={updateFarm}
          onResolveAlert={resolveAlert}
          actionLoading={actionLoading}
        />
      )}


      {/* ======================================================
          HIVE DETAIL WINDOW
      ======================================================= */}

      {selectedHive && (
        <HiveDetail
          hive={selectedHive}
          farms={farms}
          alerts={alerts}
          risk={risks[getId(selectedHive)]}
          onClose={() => setSelectedHive(null)}
          onResolveAlert={resolveAlert}
          actionLoading={actionLoading}
        />
      )}


      {/* ======================================================
          BATCH DETAIL WINDOW
      ======================================================= */}

      {selectedBatch && (
        <BatchDetail
          batch={selectedBatch}
          farms={farms}
          onClose={() => setSelectedBatch(null)}
          onUpdate={updateBatch}
          actionLoading={actionLoading}
        />
      )}


      {/* ======================================================
          DIGITAL PASSPORT WINDOW
      ======================================================= */}

      {selectedPassport && (
        <PassportDetail
          batch={selectedPassport}
          onClose={() => setSelectedPassport(null)}
          actionLoading={actionLoading}
          setActionLoading={setActionLoading}
          setError={setError}
        />
      )}

    </div>
  );
}


/* ============================================================
   SIDEBAR BUTTON
   ============================================================ */

function SidebarButton({
  active,
  icon: Icon,
  label,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 text-left text-sm border ${
        active
          ? 'bg-black text-cream dark:bg-cream dark:text-black border-black dark:border-cream'
          : 'border-transparent hover:border-black/10 dark:hover:border-white/10'
      }`}
    >
      <Icon
        size={17}
        className={active ? 'text-gold' : ''}
      />

      <span>{label}</span>
    </button>
  );
}


/* ============================================================
   PAGE HEADER
   ============================================================ */

function PageHeader({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-5">

      <div>

        <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
          {eyebrow}
        </p>

        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray dark:text-muted">
            {description}
          </p>
        )}

      </div>

      {action}

    </div>
  );
}


/* ============================================================
   DASHBOARD HOME
   ============================================================ */

function DashboardHome({
  keeper,
  statistics,
  farms,
  hives,
  alerts,
  risks,
  yieldEstimate,
  onOpenSection,
  onResolveAlert,
  actionLoading,
}) {
  return (
    <div>

      <PageHeader
        eyebrow="HoneyChain"
        title={`Welcome, ${keeper?.name || 'Keeper'}`}
        description="Manage your farms, hives, honey production and traceability from one place."
        action={
          <button
            onClick={() => onOpenSection('farms')}
            className="inline-flex items-center gap-2 bg-black text-cream dark:bg-cream dark:text-black px-4 py-3 text-sm font-medium"
          >
            <Tractor size={17} />
            Manage Farms
          </button>
        }
      />


      {/* STAT CARDS */}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-black/10 dark:bg-white/10 mb-8">

        <StatCard
          label="Total Farms"
          value={statistics.totalFarms}
          icon={Tractor}
        />

        <StatCard
          label="Total Hives"
          value={statistics.totalHives}
          icon={Hexagon}
        />

        <StatCard
          label="Yield Estimate"
          value={
            yieldEstimate !== null
              ? `${yieldEstimate}`
              : '—'
          }
          icon={TrendingUp}
        />

        <StatCard
          label="Total Alerts"
          value={statistics.totalAlerts}
          icon={Bell}
          danger={statistics.totalAlerts > 0}
        />

        <StatCard
          label="Resolved Alerts"
          value={statistics.resolvedAlerts}
          icon={CheckCircle2}
        />

      </div>


      {/* NO FARMS */}

      {farms.length === 0 && (
        <div className="border border-gold/50 bg-gold/5 p-8 mb-8">

          <Sprout
            size={30}
            className="text-gold"
          />

          <h2 className="mt-4 text-xl font-semibold">
            Create your first farm
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-gray dark:text-muted">
            You do not have any farms registered yet.
            Create a farm to start adding hives and monitoring
            your apiary.
          </p>

          <button
            onClick={() => onOpenSection('farms')}
            className="mt-5 inline-flex items-center gap-2 bg-gold text-black px-4 py-3 text-sm font-semibold"
          >
            <Plus size={17} />
            Create Farm
          </button>

        </div>
      )}


      {/* MAIN DASHBOARD GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ACTIVE ALERTS */}

        <div className="xl:col-span-2 border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card">

          <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
                Monitoring
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                Active Alerts
              </h2>
            </div>

            <button
              onClick={() => onOpenSection('history')}
              className="text-xs underline underline-offset-4"
            >
              View history
            </button>

          </div>


          {alerts.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="No active alerts"
              text="Your current farms and hives have no open alerts."
            />
          ) : (
            <div className="divide-y divide-black/10 dark:divide-white/10">

              {alerts.slice(0, 6).map((alert) => (
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


        {/* FARM SUMMARY */}

        <div className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card">

          <div className="p-5 border-b border-black/10 dark:border-white/10">

            <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
              Your Apiaries
            </p>

            <h2 className="mt-1 text-lg font-semibold">
              Farms
            </h2>

          </div>


          {farms.length === 0 ? (
            <EmptyState
              icon={Tractor}
              title="No farms"
              text="Create your first farm to begin."
            />
          ) : (
            <div className="divide-y divide-black/10 dark:divide-white/10">

              {farms.slice(0, 5).map((farm) => (
                <div
                  key={getId(farm)}
                  className="p-4"
                >

                  <p className="text-sm font-semibold">
                    {farm.name || farm.farmCode || 'Unnamed Farm'}
                  </p>

                  <p className="mt-1 text-xs text-gray dark:text-muted">
                    {farm.location?.area || 'Location not provided'}
                  </p>

                  <p className="mt-2 text-xs text-gold">
                    {
                      hives.filter(
                        (hive) =>
                          getId(hive?.farm) === getId(farm) ||
                          hive?.farm === getId(farm),
                      ).length
                    }{' '}
                    hives
                  </p>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>


      {/* HIVE RISK */}

      <div className="mt-6 border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card">

        <div className="p-5 border-b border-black/10 dark:border-white/10">

          <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
            Hive Health
          </p>

          <h2 className="mt-1 text-lg font-semibold">
            Disease Risk
          </h2>

        </div>


        {hives.length === 0 ? (
          <EmptyState
            icon={Hexagon}
            title="No hives yet"
            text="Create hives inside your farms to monitor disease risk."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

            {hives.slice(0, 9).map((hive) => (
              <div
                key={getId(hive)}
                className="p-5 border-b border-r border-black/10 dark:border-white/10"
              >

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <p className="text-sm font-semibold">
                      {hive.hiveCode || 'Hive'}
                    </p>

                    <p className="mt-1 text-xs text-gray dark:text-muted">
                      {hive.hiveType || 'Hive type not specified'}
                    </p>

                  </div>

                  <RiskBadge
                    risk={risks[getId(hive)]}
                  />

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}


/* ============================================================
   STAT CARD
   ============================================================ */

function StatCard({
  label,
  value,
  icon: Icon,
  danger,
}) {
  return (
    <div className="bg-cream-card dark:bg-black-card p-5">

      <div className="flex items-center justify-between">

        <p className="text-[10px] uppercase tracking-[0.15em] text-gray dark:text-muted">
          {label}
        </p>

        <Icon
          size={18}
          className={danger ? 'text-red-500' : 'text-gold'}
        />

      </div>

      <p
        className={`mt-4 text-2xl font-semibold ${
          danger ? 'text-red-500' : ''
        }`}
      >
        {value}
      </p>

    </div>
  );
}


/* ============================================================
   FARMS SECTION
   ============================================================ */

function FarmsSection({
  farms,
  hives,
  alerts,
  onCreate,
  onUpdate,
  onOpenFarm,
  actionLoading,
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>

      <PageHeader
        eyebrow="01 / Farms"
        title="Farms"
        description="Create and manage all your registered apiaries."
        action={
          <button
            onClick={() => setShowForm((value) => !value)}
            className="inline-flex items-center gap-2 bg-gold text-black px-4 py-3 text-sm font-semibold"
          >
            <Plus size={17} />
            Create Farm
          </button>
        }
      />


      {showForm && (
        <FarmForm
          onSubmit={async (data) => {
            await onCreate(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
          actionLoading={actionLoading}
        />
      )}


      {farms.length === 0 ? (
        <EmptyState
          icon={Tractor}
          title="No farms registered"
          text="Create a farm to start adding hives."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {farms.map((farm) => {

            const farmId = getId(farm);

            const farmHives = hives.filter(
              (hive) =>
                getId(hive?.farm) === farmId ||
                hive?.farm === farmId,
            );

            const farmAlerts = alerts.filter(
              (alert) =>
                getId(alert?.farm) === farmId ||
                alert?.farm === farmId,
            );

            return (
              <button
                key={farmId}
                onClick={() => onOpenFarm(farm)}
                className="text-left border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-6 hover:border-gold"
              >

                <div className="flex items-start justify-between">

                  <div className="w-11 h-11 border border-gold/40 flex items-center justify-center">
                    <Tractor
                      size={20}
                      className="text-gold"
                    />
                  </div>

                  <ChevronRight
                    size={18}
                    className="text-gray dark:text-muted"
                  />

                </div>


                <h3 className="mt-5 text-lg font-semibold">
                  {farm.name || farm.farmCode || 'Unnamed Farm'}
                </h3>

                <p className="mt-1 text-xs text-gray dark:text-muted">
                  {farm.farmCode || 'No farm code'}
                </p>


                <div className="mt-5 space-y-2 text-xs">

                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-gold" />
                    {farm.location?.area || 'Location not provided'}
                  </div>

                  <div className="flex items-center gap-2">
                    <Hexagon size={14} className="text-gold" />
                    {farmHives.length} hives
                  </div>

                  <div className="flex items-center gap-2">
                    <Bell size={14} className="text-gold" />
                    {farmAlerts.length} active alerts
                  </div>

                </div>

              </button>
            );
          })}

        </div>
      )}

    </div>
  );
}


/* ============================================================
   FARM FORM
   ============================================================ */

function FarmForm({
  onSubmit,
  onCancel,
  actionLoading,
  initialData = {},
}) {
  const [form, setForm] = useState({
    farmCode: initialData.farmCode || '',
    name: initialData.name || '',
    area: initialData.location?.area || '',
    state: initialData.location?.state || '',
    lat: initialData.location?.lat || '',
    lng: initialData.location?.lng || '',
    environmentType: initialData.environmentType || 'humid',
  });


  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }


  async function submit(event) {
    event.preventDefault();

    await onSubmit({
      farmCode: form.farmCode.trim(),
      name: form.name.trim(),
      location: {
        area: form.area.trim(),
        state: form.state.trim(),
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
      },
      environmentType: form.environmentType,
    });
  }


  return (
    <form
      onSubmit={submit}
      className="mb-8 border border-gold/40 bg-cream-card dark:bg-black-card p-6"
    >

      <div className="flex items-center justify-between mb-6">

        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
            Farm details
          </p>

          <h2 className="mt-1 text-lg font-semibold">
            {initialData?.name ? 'Update Farm' : 'Create Farm'}
          </h2>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="p-2 border border-black/10 dark:border-white/10"
        >
          <X size={17} />
        </button>

      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <FormField
          label="Farm Code"
          value={form.farmCode}
          onChange={(value) => update('farmCode', value)}
          placeholder="FRM-TEST-001"
          required
        />

        <FormField
          label="Farm Name"
          value={form.name}
          onChange={(value) => update('name', value)}
          placeholder="Green Valley Apiary"
          required
        />

        <FormField
          label="Area"
          value={form.area}
          onChange={(value) => update('area', value)}
          placeholder="Barasat"
          required
        />

        <FormField
          label="State"
          value={form.state}
          onChange={(value) => update('state', value)}
          placeholder="West Bengal"
          required
        />

        <FormField
          label="Latitude"
          value={form.lat}
          onChange={(value) => update('lat', value)}
          placeholder="22.72"
          type="number"
        />

        <FormField
          label="Longitude"
          value={form.lng}
          onChange={(value) => update('lng', value)}
          placeholder="88.48"
          type="number"
        />

        <div>

          <label className="text-xs font-medium">
            Environment Type
          </label>

          <select
            value={form.environmentType}
            onChange={(event) =>
              update(
                'environmentType',
                event.target.value,
              )
            }
            className="mt-2 w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm"
          >
            <option value="humid">Humid</option>
            <option value="dry">Dry</option>
            <option value="temperate">Temperate</option>
            <option value="tropical">Tropical</option>
          </select>

        </div>

      </div>


      <div className="mt-6 flex gap-3">

        <button
          type="submit"
          disabled={actionLoading}
          className="inline-flex items-center gap-2 bg-black text-cream dark:bg-cream dark:text-black px-5 py-3 text-sm font-semibold disabled:opacity-50"
        >
          {actionLoading && (
            <LoaderCircle
              size={16}
              className="animate-spin"
            />
          )}

          Save Farm
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 text-sm border border-black/10 dark:border-white/10"
        >
          Cancel
        </button>

      </div>

    </form>
  );
}


/* ============================================================
   FARM DETAIL
   ============================================================ */

function FarmDetail({
  farm,
  farms,
  hives,
  alerts,
  onClose,
  onCreateHive,
  onUpdateFarm,
  onResolveAlert,
  actionLoading,
}) {
  const [showHiveForm, setShowHiveForm] = useState(false);
  const [editing, setEditing] = useState(false);

  const farmId = getId(farm);

  const farmHives = hives.filter(
    (hive) =>
      getId(hive?.farm) === farmId ||
      hive?.farm === farmId,
  );

  const farmAlerts = alerts.filter(
    (alert) =>
      getId(alert?.farm) === farmId ||
      alert?.farm === farmId,
  );


  return (
    <DetailOverlay
      title={farm.name || farm.farmCode || 'Farm'}
      eyebrow="Farm Details"
      onClose={onClose}
    >

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10 dark:bg-white/10 mb-8">

        <DetailStat
          label="Farm Code"
          value={farm.farmCode || '—'}
        />

        <DetailStat
          label="Hives"
          value={farmHives.length}
        />

        <DetailStat
          label="Active Alerts"
          value={farmAlerts.length}
        />

      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="border border-black/10 dark:border-white/10 p-6">

          <div className="flex items-center justify-between">

            <h3 className="font-semibold">
              Farm Information
            </h3>

            <button
              onClick={() => setEditing((value) => !value)}
              className="text-xs underline underline-offset-4"
            >
              {editing ? 'Close Edit' : 'Update Farm'}
            </button>

          </div>


          {editing ? (
            <div className="mt-5">

              <FarmForm
                initialData={farm}
                actionLoading={actionLoading}
                onCancel={() => setEditing(false)}
                onSubmit={async (data) => {
                  await onUpdateFarm(farmId, data);
                  setEditing(false);
                }}
              />

            </div>
          ) : (
            <div className="mt-5 space-y-4">

              <InfoItem
                label="Name"
                value={farm.name}
              />

              <InfoItem
                label="Area"
                value={farm.location?.area}
              />

              <InfoItem
                label="State"
                value={farm.location?.state}
              />

              <InfoItem
                label="Environment"
                value={farm.environmentType}
              />

              <InfoItem
                label="Latitude"
                value={farm.location?.lat}
              />

              <InfoItem
                label="Longitude"
                value={farm.location?.lng}
              />

            </div>
          )}

        </div>


        <div className="border border-black/10 dark:border-white/10 p-6">

          <div className="flex items-center justify-between">

            <h3 className="font-semibold">
              Hives
            </h3>

            <button
              onClick={() => setShowHiveForm((value) => !value)}
              className="inline-flex items-center gap-1 text-xs text-gold"
            >
              <Plus size={14} />
              Add Hive
            </button>

          </div>


          {showHiveForm && (
            <HiveForm
              farmId={farmId}
              onSubmit={async (data) => {
                await onCreateHive(data);
                setShowHiveForm(false);
              }}
              onCancel={() => setShowHiveForm(false)}
              actionLoading={actionLoading}
            />
          )}


          {farmHives.length === 0 ? (
            <div className="mt-5 text-sm text-gray dark:text-muted">
              No hives registered for this farm.
            </div>
          ) : (
            <div className="mt-5 divide-y divide-black/10 dark:divide-white/10">

              {farmHives.map((hive) => (
                <div
                  key={getId(hive)}
                  className="py-4 flex items-center justify-between"
                >

                  <div>

                    <p className="text-sm font-semibold">
                      {hive.hiveCode}
                    </p>

                    <p className="mt-1 text-xs text-gray dark:text-muted">
                      {hive.hiveType || 'Unknown type'}
                    </p>

                  </div>

                  <Hexagon
                    size={18}
                    className="text-gold"
                  />

                </div>
              ))}

            </div>
          )}

        </div>

      </div>


      {/* FARM ALERTS */}

      <div className="mt-6 border border-black/10 dark:border-white/10 p-6">

        <div className="flex items-center gap-2">

          <Bell
            size={18}
            className="text-gold"
          />

          <h3 className="font-semibold">
            Farm Alerts
          </h3>

        </div>


        <div className="mt-5">

          {farmAlerts.length === 0 ? (
            <p className="text-sm text-gray dark:text-muted">
              No active alerts for this farm.
            </p>
          ) : (
            farmAlerts.map((alert) => (
              <AlertRow
                key={getId(alert)}
                alert={alert}
                onResolve={onResolveAlert}
                actionLoading={actionLoading}
              />
            ))
          )}

        </div>

      </div>

    </DetailOverlay>
  );
}


/* ============================================================
   HIVES SECTION
   ============================================================ */

function HivesSection({
  farms,
  hives,
  alerts,
  risks,
  onCreate,
  onOpenHive,
  actionLoading,
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>

      <PageHeader
        eyebrow="02 / Hives"
        title="Hives"
        description="Monitor all registered hives across your farms."
        action={
          <button
            onClick={() => setShowForm((value) => !value)}
            className="inline-flex items-center gap-2 bg-gold text-black px-4 py-3 text-sm font-semibold"
          >
            <Plus size={17} />
            Create Hive
          </button>
        }
      />


      {showForm && (
        <HiveForm
          farms={farms}
          onSubmit={async (data) => {
            await onCreate(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
          actionLoading={actionLoading}
        />
      )}


      {hives.length === 0 ? (
        <EmptyState
          icon={Hexagon}
          title="No hives registered"
          text="Create a hive inside one of your farms."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {hives.map((hive) => {

            const hiveId = getId(hive);

            const hiveAlerts = alerts.filter(
              (alert) =>
                getId(alert?.hive) === hiveId ||
                alert?.hive === hiveId,
            );

            const farm = farms.find(
              (item) =>
                getId(item) === getId(hive?.farm) ||
                getId(item) === hive?.farm,
            );

            return (
              <button
                key={hiveId}
                onClick={() => onOpenHive(hive)}
                className="text-left border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-6 hover:border-gold"
              >

                <div className="flex items-start justify-between">

                  <div className="w-11 h-11 border border-gold/40 flex items-center justify-center">
                    <Hexagon
                      size={20}
                      className="text-gold"
                    />
                  </div>

                  <ChevronRight
                    size={18}
                    className="text-gray dark:text-muted"
                  />

                </div>


                <h3 className="mt-5 text-lg font-semibold">
                  {hive.hiveCode || 'Unnamed Hive'}
                </h3>

                <p className="mt-1 text-xs text-gray dark:text-muted">
                  {hive.hiveType || 'Type not specified'}
                </p>

                <p className="mt-4 text-xs">
                  Farm:{' '}
                  <span className="text-gold">
                    {farm?.name || farm?.farmCode || 'Unknown'}
                  </span>
                </p>

                <div className="mt-4 flex items-center justify-between">

                  <RiskBadge
                    risk={risks[hiveId]}
                  />

                  {hiveAlerts.length > 0 && (
                    <span className="text-xs text-red-500">
                      {hiveAlerts.length} alert
                      {hiveAlerts.length > 1 ? 's' : ''}
                    </span>
                  )}

                </div>

              </button>
            );
          })}

        </div>
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
  const [form, setForm] = useState({
    hiveCode: '',
    farm: farmId || '',
    hiveType: 'Langstroth',
  });


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
      className="mt-5 p-4 border border-gold/30 bg-gold/5"
    >

      <FormField
        label="Hive Code"
        value={form.hiveCode}
        onChange={(value) => update('hiveCode', value)}
        placeholder="HV-TEST-001"
        required
      />


      {!farmId && (
        <div className="mt-4">

          <label className="text-xs font-medium">
            Farm
          </label>

          <select
            value={form.farm}
            onChange={(event) =>
              update('farm', event.target.value)
            }
            required
            className="mt-2 w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm"
          >

            <option value="">
              Select farm
            </option>

            {farms.map((farm) => (
              <option
                key={getId(farm)}
                value={getId(farm)}
              >
                {farm.name || farm.farmCode}
              </option>
            ))}

          </select>

        </div>
      )}


      <div className="mt-4">

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
          className="mt-2 w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm"
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


      <div className="mt-5 flex gap-2">

        <button
          type="submit"
          disabled={actionLoading}
          className="bg-black text-cream dark:bg-cream dark:text-black px-4 py-2 text-xs font-semibold"
        >
          Create Hive
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="border border-black/10 dark:border-white/10 px-4 py-2 text-xs"
        >
          Cancel
        </button>

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
  alerts,
  risk,
  onClose,
  onResolveAlert,
  actionLoading,
}) {
  const hiveId = getId(hive);

  const farm = farms.find(
    (item) =>
      getId(item) === getId(hive?.farm) ||
      getId(item) === hive?.farm,
  );

  const hiveAlerts = alerts.filter(
    (alert) =>
      getId(alert?.hive) === hiveId ||
      alert?.hive === hiveId,
  );


  return (
    <DetailOverlay
      eyebrow="Hive Details"
      title={hive.hiveCode || 'Hive'}
      onClose={onClose}
    >

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10 dark:bg-white/10">

        <DetailStat
          label="Hive Code"
          value={hive.hiveCode}
        />

        <DetailStat
          label="Hive Type"
          value={hive.hiveType}
        />

        <DetailStat
          label="Disease Risk"
          value={
            risk?.risk ||
            risk?.level ||
            risk ||
            '—'
          }
        />

      </div>


      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="border border-black/10 dark:border-white/10 p-6">

          <h3 className="font-semibold">
            Hive Information
          </h3>

          <div className="mt-5 space-y-4">

            <InfoItem
              label="Hive Code"
              value={hive.hiveCode}
            />

            <InfoItem
              label="Hive Type"
              value={hive.hiveType}
            />

            <InfoItem
              label="Farm"
              value={
                farm?.name ||
                farm?.farmCode ||
                'Unknown'
              }
            />

          </div>

        </div>


        <div className="border border-black/10 dark:border-white/10 p-6">

          <div className="flex items-center gap-2">

            <ShieldAlert
              size={18}
              className="text-gold"
            />

            <h3 className="font-semibold">
              Disease Risk
            </h3>

          </div>

          <div className="mt-5">
            <RiskBadge risk={risk} large />
          </div>

        </div>

      </div>


      <div className="mt-6 border border-black/10 dark:border-white/10 p-6">

        <h3 className="font-semibold">
          Hive Alerts
        </h3>

        <div className="mt-5">

          {hiveAlerts.length === 0 ? (
            <p className="text-sm text-gray dark:text-muted">
              No active alerts for this hive.
            </p>
          ) : (
            hiveAlerts.map((alert) => (
              <AlertRow
                key={getId(alert)}
                alert={alert}
                onResolve={onResolveAlert}
                actionLoading={actionLoading}
              />
            ))
          )}

        </div>

      </div>

    </DetailOverlay>
  );
}


/* ============================================================
   BATCHES SECTION
   ============================================================ */

function BatchesSection({
  farms,
  batches,
  keeper,
  onCreate,
  onOpenBatch,
  actionLoading,
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div>

      <PageHeader
        eyebrow="03 / Honey Batches"
        title="Honey Batches"
        description="Create, view and update harvested honey batches."
        action={
          <button
            onClick={() => setShowForm((value) => !value)}
            className="inline-flex items-center gap-2 bg-gold text-black px-4 py-3 text-sm font-semibold"
          >
            <Plus size={17} />
            Create Batch
          </button>
        }
      />


      {showForm && (
        <BatchForm
          farms={farms}
          keeper={keeper}
          onSubmit={async (data) => {
            await onCreate(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
          actionLoading={actionLoading}
        />
      )}


      {batches.length === 0 ? (
        <EmptyState
          icon={Boxes}
          title="No honey batches"
          text="Create a batch after harvesting honey."
        />
      ) : (
        <div className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card">

          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead className="border-b border-black/10 dark:border-white/10">

                <tr className="text-left">

                  <th className="p-4 text-xs uppercase tracking-wider">
                    Batch
                  </th>

                  <th className="p-4 text-xs uppercase tracking-wider">
                    Farm
                  </th>

                  <th className="p-4 text-xs uppercase tracking-wider">
                    Harvest Date
                  </th>

                  <th className="p-4 text-xs uppercase tracking-wider">
                    Quantity
                  </th>

                  <th className="p-4 text-xs uppercase tracking-wider">
                    Floral Source
                  </th>

                  <th className="p-4" />

                </tr>

              </thead>


              <tbody>

                {batches.map((batch) => {

                  const farm = farms.find(
                    (item) =>
                      getId(item) === getId(batch?.farm) ||
                      getId(item) === batch?.farm,
                  );

                  return (
                    <tr
                      key={getId(batch)}
                      className="border-b border-black/10 dark:border-white/10"
                    >

                      <td className="p-4 font-semibold">
                        {batch.batchCode || '—'}
                      </td>

                      <td className="p-4 text-gray dark:text-muted">
                        {farm?.name ||
                          farm?.farmCode ||
                          '—'}
                      </td>

                      <td className="p-4">
                        {formatDate(batch.harvestDate)}
                      </td>

                      <td className="p-4">
                        {batch.quantityKg ?? '—'} kg
                      </td>

                      <td className="p-4">
                        {batch.floralSourceClaimed || '—'}
                      </td>

                      <td className="p-4 text-right">

                        <button
                          onClick={() => onOpenBatch(batch)}
                          className="inline-flex items-center gap-1 text-xs text-gold"
                        >
                          View
                          <ChevronRight size={14} />
                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}


/* ============================================================
   BATCH FORM
   ============================================================ */

function BatchForm({
  farms,
  keeper,
  onSubmit,
  onCancel,
  actionLoading,
  initialData = {},
}) {
  const [form, setForm] = useState({
    batchCode: initialData.batchCode || '',
    farm: getId(initialData?.farm) || '',
    keeper:
      getId(initialData?.keeper) ||
      getId(keeper) ||
      '',
    harvestDate:
      initialData.harvestDate
        ? String(initialData.harvestDate).slice(0, 10)
        : '',
    quantityKg: initialData.quantityKg || '',
    floralSourceClaimed:
      initialData.floralSourceClaimed || '',
    priceInrPerKg:
      initialData.priceInrPerKg || '',
  });


  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }


  async function submit(event) {
    event.preventDefault();

    await onSubmit({
      batchCode: form.batchCode.trim(),
      farm: form.farm,
      keeper: form.keeper,
      harvestDate: form.harvestDate,
      quantityKg: Number(form.quantityKg),
      floralSourceClaimed:
        form.floralSourceClaimed.trim(),
      priceInrPerKg:
        form.priceInrPerKg
          ? Number(form.priceInrPerKg)
          : undefined,
    });
  }


  return (
    <form
      onSubmit={submit}
      className="mb-8 border border-gold/40 bg-cream-card dark:bg-black-card p-6"
    >

      <h2 className="text-lg font-semibold">
        {initialData?.batchCode
          ? 'Update Batch'
          : 'Create Honey Batch'}
      </h2>


      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">

        <FormField
          label="Batch Code"
          value={form.batchCode}
          onChange={(value) =>
            update('batchCode', value)
          }
          placeholder="BATCH-TEST-001"
          required
        />


        <div>

          <label className="text-xs font-medium">
            Farm
          </label>

          <select
            value={form.farm}
            onChange={(event) =>
              update('farm', event.target.value)
            }
            required
            className="mt-2 w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm"
          >

            <option value="">
              Select farm
            </option>

            {farms.map((farm) => (
              <option
                key={getId(farm)}
                value={getId(farm)}
              >
                {farm.name || farm.farmCode}
              </option>
            ))}

          </select>

        </div>


        <FormField
          label="Harvest Date"
          type="date"
          value={form.harvestDate}
          onChange={(value) =>
            update('harvestDate', value)
          }
          required
        />


        <FormField
          label="Quantity (kg)"
          type="number"
          value={form.quantityKg}
          onChange={(value) =>
            update('quantityKg', value)
          }
          placeholder="25"
          required
        />


        <FormField
          label="Floral Source"
          value={form.floralSourceClaimed}
          onChange={(value) =>
            update(
              'floralSourceClaimed',
              value,
            )
          }
          placeholder="Mustard"
        />


        <FormField
          label="Price per kg (INR)"
          type="number"
          value={form.priceInrPerKg}
          onChange={(value) =>
            update('priceInrPerKg', value)
          }
          placeholder="450"
        />

      </div>


      <div className="mt-6 flex gap-3">

        <button
          type="submit"
          disabled={actionLoading}
          className="bg-black text-cream dark:bg-cream dark:text-black px-5 py-3 text-sm font-semibold"
        >
          Save Batch
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="border border-black/10 dark:border-white/10 px-5 py-3 text-sm"
        >
          Cancel
        </button>

      </div>

    </form>
  );
}


/* ============================================================
   BATCH DETAIL
   ============================================================ */

function BatchDetail({
  batch,
  farms,
  onClose,
  onUpdate,
  actionLoading,
}) {
  const [editing, setEditing] = useState(false);

  const farm = farms.find(
    (item) =>
      getId(item) === getId(batch?.farm) ||
      getId(item) === batch?.farm,
  );


  return (
    <DetailOverlay
      eyebrow="Honey Batch"
      title={batch.batchCode || 'Batch'}
      onClose={onClose}
    >

      {!editing ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10 dark:bg-white/10">

            <DetailStat
              label="Quantity"
              value={`${batch.quantityKg ?? '—'} kg`}
            />

            <DetailStat
              label="Harvest Date"
              value={formatDate(batch.harvestDate)}
            />

            <DetailStat
              label="Floral Source"
              value={batch.floralSourceClaimed || '—'}
            />

          </div>


          <div className="mt-6 border border-black/10 dark:border-white/10 p-6">

            <div className="flex items-center justify-between">

              <h3 className="font-semibold">
                Batch Information
              </h3>

              <button
                onClick={() => setEditing(true)}
                className="text-xs underline"
              >
                Update Batch
              </button>

            </div>


            <div className="mt-5 space-y-4">

              <InfoItem
                label="Batch Code"
                value={batch.batchCode}
              />

              <InfoItem
                label="Farm"
                value={
                  farm?.name ||
                  farm?.farmCode ||
                  '—'
                }
              />

              <InfoItem
                label="Keeper"
                value={getId(batch?.keeper)}
              />

              <InfoItem
                label="Harvest Date"
                value={formatDate(batch.harvestDate)}
              />

              <InfoItem
                label="Quantity"
                value={
                  batch.quantityKg !== undefined
                    ? `${batch.quantityKg} kg`
                    : '—'
                }
              />

              <InfoItem
                label="Floral Source"
                value={batch.floralSourceClaimed}
              />

              <InfoItem
                label="Price"
                value={
                  batch.priceInrPerKg
                    ? `₹${batch.priceInrPerKg}/kg`
                    : '—'
                }
              />

            </div>

          </div>
        </>
      ) : (
        <BatchForm
          farms={farms}
          initialData={batch}
          onCancel={() => setEditing(false)}
          actionLoading={actionLoading}
          onSubmit={async (data) => {
            await onUpdate(getId(batch), data);
            setEditing(false);
          }}
        />
      )}

    </DetailOverlay>
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
              onClick={() => onOpenBatch(batch)}
              className="text-left border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-6 hover:border-gold"
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
                {batch.floralSourceClaimed || 'Unknown source'}
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


/* ============================================================
   DIGITAL PASSPORT DETAIL
   ============================================================ */

function PassportDetail({
  batch,
  onClose,
  actionLoading,
  setActionLoading,
  setError,
}) {
  const [report, setReport] = useState(null);
  const [qrData, setQrData] = useState(null);

  const [loadingReport, setLoadingReport] =
    useState(false);

  const [loadingQr, setLoadingQr] =
    useState(false);


  const batchId = getId(batch);


  async function submitToLab() {
    setActionLoading(true);
    setError('');

    try {
      await apiRequest(`/api/lab/submit/${batchId}`, {
        method: 'POST',
        body: JSON.stringify({
          delayMs: 5000,
        }),
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }


  async function fetchReport() {
    setLoadingReport(true);
    setError('');

    try {
      const response = await apiRequest(
        `/api/lab/report/${batchId}`,
      );

      setReport(
        response?.report ||
          response,
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingReport(false);
    }
  }


  async function generateQr() {
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


  async function fetchQr() {
    setLoadingQr(true);
    setError('');

    try {
      const response = await apiRequest(
        `/api/qr/scan/${batchId}`,
      );

      setQrData(response);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingQr(false);
    }
  }


  return (
    <DetailOverlay
      eyebrow="Digital Passport"
      title={batch.batchCode || 'Batch'}
      onClose={onClose}
    >

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LAB */}

        <div className="border border-black/10 dark:border-white/10 p-6">

          <FlaskConical
            size={25}
            className="text-gold"
          />

          <h3 className="mt-4 text-lg font-semibold">
            Laboratory Verification
          </h3>

          <p className="mt-2 text-sm text-gray dark:text-muted">
            Submit this batch for laboratory testing and
            retrieve its report.
          </p>


          <div className="mt-6 flex flex-wrap gap-2">

            <button
              onClick={submitToLab}
              disabled={actionLoading}
              className="bg-black text-cream dark:bg-cream dark:text-black px-4 py-3 text-xs font-semibold"
            >
              Submit to Lab
            </button>

            <button
              onClick={fetchReport}
              disabled={loadingReport}
              className="border border-black/10 dark:border-white/10 px-4 py-3 text-xs"
            >
              {loadingReport
                ? 'Fetching...'
                : 'Fetch Report'}
            </button>

          </div>


          {report && (
            <div className="mt-6 border border-black/10 dark:border-white/10 p-4">

              <div className="flex items-center gap-2">

                <CheckCircle2
                  size={17}
                  className="text-green-600"
                />

                <p className="text-sm font-semibold">
                  Laboratory Report
                </p>

              </div>


              <pre className="mt-4 whitespace-pre-wrap break-words text-xs text-gray dark:text-muted">
                {JSON.stringify(report, null, 2)}
              </pre>

            </div>
          )}

        </div>


        {/* QR */}

        <div className="border border-black/10 dark:border-white/10 p-6">

          <QrCode
            size={25}
            className="text-gold"
          />

          <h3 className="mt-4 text-lg font-semibold">
            Digital QR Passport
          </h3>

          <p className="mt-2 text-sm text-gray dark:text-muted">
            Generate or retrieve the public QR passport for
            this honey batch.
          </p>


          <div className="mt-6 flex flex-wrap gap-2">

            <button
              onClick={generateQr}
              disabled={loadingQr}
              className="bg-gold text-black px-4 py-3 text-xs font-semibold"
            >
              Generate QR
            </button>

            <button
              onClick={fetchQr}
              disabled={loadingQr}
              className="border border-black/10 dark:border-white/10 px-4 py-3 text-xs"
            >
              Fetch QR
            </button>

          </div>


          {qrData && (
            <div className="mt-6">

              {qrData.qrImageDataUrl && (
                <img
                  src={qrData.qrImageDataUrl}
                  alt="Honey batch QR code"
                  className="w-48 h-48 border border-black/10 dark:border-white/10 p-3 bg-white"
                />
              )}


              {qrData.publicUrl && (
                <a
                  href={qrData.publicUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-xs text-gold underline"
                >
                  Open Public Passport
                  <ExternalLink size={13} />
                </a>
              )}

            </div>
          )}

        </div>

      </div>

    </DetailOverlay>
  );
}


/* ============================================================
   TRAINING
   ============================================================ */

function TrainingSection() {
  const materials = [
    {
      title: 'Beekeeping Basics',
      description:
        'Introduction to hive management, bee colonies and seasonal care.',
      url: 'https://www.fao.org',
    },
    {
      title: 'Honey Bee Health',
      description:
        'Learn practical approaches to monitoring colony health.',
      url: 'https://www.usda.gov',
    },
    {
      title: 'Sustainable Beekeeping',
      description:
        'Explore open educational resources for sustainable apiary practices.',
      url: 'https://www.open.edu',
    },
  ];


  return (
    <div>

      <PageHeader
        eyebrow="05 / Training"
        title="Training"
        description="Learning resources for better hive management, bee health and honey production."
      />


      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {materials.map((material) => (
          <div
            key={material.title}
            className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-6"
          >

            <BookOpen
              size={23}
              className="text-gold"
            />

            <h3 className="mt-5 font-semibold">
              {material.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray dark:text-muted">
              {material.description}
            </p>

            <a
              href={material.url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-xs text-gold underline underline-offset-4"
            >
              Open Resource
              <ExternalLink size={13} />
            </a>

          </div>
        ))}

      </div>


      <div className="mt-6 border border-black/10 dark:border-white/10 p-6">

        <div className="flex gap-3">

          <ExternalLink
            size={20}
            className="text-gold"
          />

          <div>

            <h3 className="font-semibold">
              Open-source learning
            </h3>

            <p className="mt-2 text-sm text-gray dark:text-muted">
              Use public educational repositories and
              documentation to continue learning about
              beekeeping technology and traceability.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   FRAUD ALERTS
   ============================================================ */

function FraudSection({ batches }) {
  return (
    <div>

      <PageHeader
        eyebrow="06 / Fraud Detection"
        title="Fraud Alerts"
        description="Demo interface for honey batch authenticity and fraud detection."
      />


      <div className="border border-orange-500/30 bg-orange-500/5 p-5 mb-6">

        <div className="flex gap-3">

          <ShieldAlert
            size={22}
            className="text-orange-500 shrink-0"
          />

          <div>

            <h3 className="font-semibold">
              Demo fraud detection
            </h3>

            <p className="mt-1 text-sm text-gray dark:text-muted">
              This section currently contains dummy
              detection results. It is not connected to a
              production fraud-detection model.
            </p>

          </div>

        </div>

      </div>


      {batches.length === 0 ? (
        <EmptyState
          icon={ShieldAlert}
          title="No batches to inspect"
          text="Create honey batches to display demo fraud results."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {batches.map((batch, index) => {

            const demoRisk =
              index % 3 === 0
                ? 'Low'
                : index % 3 === 1
                  ? 'Medium'
                  : 'Low';

            return (
              <div
                key={getId(batch)}
                className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-6"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm font-semibold">
                      {batch.batchCode}
                    </p>

                    <p className="mt-1 text-xs text-gray dark:text-muted">
                      {batch.floralSourceClaimed ||
                        'Unknown floral source'}
                    </p>

                  </div>

                  <span className="px-2 py-1 border border-green-600/30 text-xs text-green-600">
                    {demoRisk} risk
                  </span>

                </div>


                <div className="mt-5 space-y-2 text-xs text-gray dark:text-muted">

                  <p>
                    Claimed quantity:{' '}
                    {batch.quantityKg ?? '—'} kg
                  </p>

                  <p>
                    Authenticity status: Demo
                  </p>

                  <p>
                    Blockchain verification: Pending
                  </p>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}


/* ============================================================
   BLOCKCHAIN EXPLORER
   ============================================================ */

function BlockchainSection() {
  const stages = [
    {
      title: 'Farm Registration',
      status: 'Current',
      description:
        'Farm identity and location are recorded in the HoneyChain system.',
    },
    {
      title: 'Hive Data',
      status: 'Connected',
      description:
        'Hive and sensor information can be associated with registered farms.',
    },
    {
      title: 'Honey Batch',
      status: 'Connected',
      description:
        'Harvested honey batches receive traceable identifiers.',
    },
    {
      title: 'Laboratory Verification',
      status: 'Planned',
      description:
        'Verified laboratory results can become part of the traceability chain.',
    },
    {
      title: 'Blockchain Record',
      status: 'Planned',
      description:
        'Future blockchain integration can provide tamper-resistant traceability.',
    },
  ];


  return (
    <div>

      <PageHeader
        eyebrow="07 / Blockchain"
        title="Blockchain Explorer"
        description="Demo roadmap showing how HoneyChain traceability can evolve toward blockchain-backed records."
      />


      <div className="border border-gold/30 bg-gold/5 p-6 mb-6">

        <div className="flex gap-3">

          <Boxes
            size={23}
            className="text-gold shrink-0"
          />

          <div>

            <h3 className="font-semibold">
              Current blockchain stage
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray dark:text-muted">
              Blockchain functionality is currently represented
              as a demo roadmap. The present application
              focuses on digital traceability and data flow.
            </p>

          </div>

        </div>

      </div>


      <div className="space-y-3">

        {stages.map((stage, index) => (
          <div
            key={stage.title}
            className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-5"
          >

            <div className="flex gap-4">

              <div className="w-8 h-8 shrink-0 border border-gold flex items-center justify-center text-xs text-gold">
                {index + 1}
              </div>

              <div className="flex-1">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                  <h3 className="font-semibold">
                    {stage.title}
                  </h3>

                  <span className="text-xs text-gold">
                    {stage.status}
                  </span>

                </div>

                <p className="mt-2 text-sm text-gray dark:text-muted">
                  {stage.description}
                </p>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}


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

        {/* CURRENT */}

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


        {/* RESOLVED */}

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

      <div className="w-9 h-9 shrink-0 border border-red-500/30 flex items-center justify-center">

        <AlertCircle
          size={18}
          className="text-red-500"
        />

      </div>


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
              {formatDate(alert.createdAt)}
            </span>
          )}

        </div>

      </div>


      <button
        onClick={() => onResolve(getId(alert))}
        disabled={actionLoading}
        className="inline-flex items-center justify-center gap-2 border border-green-600/30 text-green-600 px-3 py-2 text-xs font-medium disabled:opacity-50"
      >

        <CheckCircle2 size={14} />

        Resolve

      </button>

    </div>
  );
}


/* ============================================================
   RISK BADGE
   ============================================================ */

function RiskBadge({
  risk,
  large = false,
}) {
  const raw =
    risk?.risk ??
    risk?.level ??
    risk?.status ??
    risk;

  const value =
    raw === null ||
    raw === undefined
      ? 'Unknown'
      : String(raw);

  const normalized =
    value.toLowerCase();

  let className =
    'border-gray-400/30 text-gray-500';

  if (
    normalized.includes('high') ||
    normalized.includes('severe')
  ) {
    className =
      'border-red-500/30 text-red-500';
  } else if (
    normalized.includes('medium') ||
    normalized.includes('moderate')
  ) {
    className =
      'border-amber-500/30 text-amber-600';
  } else if (
    normalized.includes('low') ||
    normalized.includes('safe')
  ) {
    className =
      'border-green-600/30 text-green-600';
  }


  return (
    <span
      className={`inline-flex items-center px-2 py-1 border ${
        large ? 'text-sm px-3 py-2' : 'text-[10px]'
      } ${className}`}
    >
      {value}
    </span>
  );
}


/* ============================================================
   DETAIL OVERLAY
   ============================================================ */

function DetailOverlay({
  eyebrow,
  title,
  children,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 p-4 sm:p-6 overflow-y-auto"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >

      <div className="min-h-full flex items-start justify-center">

        <div className="w-full max-w-5xl bg-cream dark:bg-black border border-black/10 dark:border-white/10 shadow-2xl my-4 sm:my-8">

          <div className="sticky top-0 z-10 bg-cream dark:bg-black border-b border-black/10 dark:border-white/10 p-5 flex items-center justify-between">

            <div className="flex items-center gap-4">

              <button
                onClick={onClose}
                className="w-9 h-9 border border-black/10 dark:border-white/10 flex items-center justify-center"
                aria-label="Close"
              >
                <ArrowLeft size={17} />
              </button>

              <div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
                  {eyebrow}
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {title}
                </h2>

              </div>

            </div>


            <button
              onClick={onClose}
              className="w-9 h-9 border border-black/10 dark:border-white/10 flex items-center justify-center"
              aria-label="Close"
            >
              <X size={17} />
            </button>

          </div>


          <div className="p-5 sm:p-7">
            {children}
          </div>

        </div>

      </div>

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
    <div className="bg-cream-card dark:bg-black-card p-5">

      <p className="text-[10px] uppercase tracking-[0.15em] text-gray dark:text-muted">
        {label}
      </p>

      <p className="mt-3 text-lg font-semibold break-words">
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
    <div>

      <p className="text-[10px] uppercase tracking-[0.15em] text-gray dark:text-muted">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium break-words">
        {value || '—'}
      </p>

    </div>
  );
}


/* ============================================================
   FORM FIELD
   ============================================================ */

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}) {
  return (
    <div>

      <label className="text-xs font-medium">
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
        className="mt-2 w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm"
      />

    </div>
  );
}


/* ============================================================
   EMPTY STATE
   ============================================================ */

function EmptyState({
  icon: Icon,
  title,
  text,
}) {
  return (
    <div className="p-10 text-center">

      <Icon
        size={30}
        className="mx-auto text-gold"
      />

      <h3 className="mt-4 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray dark:text-muted max-w-md mx-auto">
        {text}
      </p>

    </div>
  );
}