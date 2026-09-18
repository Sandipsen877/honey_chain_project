import { useEffect, useMemo, useState } from 'react';

import {
  AlertCircle,
  BookOpen,
  Boxes,
  ClipboardList,
  Hexagon,
  Home,
  LoaderCircle,
  QrCode,
  ShieldAlert,
  Tractor,
} from 'lucide-react';

import { getCurrentKeeper } from '../services/authService';

import {
  apiRequest,
  getId,
  getErrorMessage,
} from '../services/dashboardApi';

import { getRandomHistorySample } from '../data/honeyHistory';

import { SidebarButton } from '../components/dashboard/DashboardUI';

import DashboardHome from '../components/dashboard/DashboardHome';

import FarmsSection, {
  FarmDetail,
} from '../components/dashboard/FarmsSection';

import HivesSection from '../components/dashboard/HivesSection';

import BatchesSection, {
  BatchDetail,
} from '../components/dashboard/BatchesSection';

import PassportSection, {
  PassportDetail,
} from '../components/dashboard/PassportSection';

import {
  TrainingSection,
  FraudSection,
  BlockchainSection,
} from '../components/dashboard/InformationalSections';

import HistorySection from '../components/dashboard/AlertHistory';

/* ============================================================
   HELPERS
   ============================================================ */

function extractYieldKg(item) {
  if (item == null) return 0;

  if (typeof item === 'number') {
    return Number(item) || 0;
  }

  if (typeof item === 'string') {
    const n = parseFloat(item);
    return Number.isFinite(n) ? n : 0;
  }

  if (typeof item === 'object') {
    const n =
      item.estimatedYieldKg ??
      item.predicted_honey_weight_7_days_kg ??
      item.estimatedYield ??
      item.yieldEstimate ??
      item.predictedYield ??
      item.yield ??
      item.value ??
      item.amount ??
      item.kg ??
      item.quantity;

    return Number(n) || 0;
  }

  return 0;
}

/* ============================================================
   ALERT TYPE HELPERS
   ============================================================ */

function isVarroaAlert(alert) {
  if (!alert) return false;
  const type = String(alert.type || '').toLowerCase();
  return type === 'varroa';
}

function isHealthMlAlert(alert) {
  if (!alert) return false;
  const type = String(alert.type || '').toLowerCase();
  return type === 'health_ml';
}
function isCriticalHealthMlAlert(alert) {
  if (!isHealthMlAlert(alert)) return false;

  const severity = String(alert.severity || '').toLowerCase();
  if (severity === 'high') return true;

  // Fallback: check message / any nested health_status field
  const healthStatus = String(
    alert.health_status ||
    alert.healthStatus ||
    alert.message ||
    ''
  ).toLowerCase();

  return healthStatus.includes('critical');
}
// Used for Active Alerts + Alert History
function isAllowedAlert(alert) {
  return isVarroaAlert(alert) || isCriticalHealthMlAlert(alert);
}

/* ============================================================
   YIELD CACHE (per login session)
   ============================================================ */

const YIELD_CACHE_KEY = 'honeychain_yield_cache';

function getYieldCache() {
  try {
    const raw = localStorage.getItem(YIELD_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setYieldCache(cache) {
  try {
    localStorage.setItem(YIELD_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // ignore
  }
}

/* ============================================================
   MAIN DASHBOARD
   ============================================================ */

export default function Dashboard() {
  const [keeper, setKeeper] = useState(null);

  const [farms, setFarms] = useState([]);
  const [hives, setHives] = useState([]);
  const [batches, setBatches] = useState([]);

  const [alerts, setAlerts] = useState([]);           // open varroa + open health_ml
  const [resolvedAlerts, setResolvedAlerts] = useState([]);

  const [yields, setYields] = useState({});
  const [yieldEstimate, setYieldEstimate] = useState(null);

  const [risks] = useState({});

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');

  const [selectedFarm, setSelectedFarm] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedPassport, setSelectedPassport] = useState(null);

  const [historyData, setHistoryData] = useState({
    openAll: [],
    openHive: [],
    openFarm: [],
    resolvedAll: [],
    resolvedHive: [],
    resolvedFarm: [],
  });

  /* ============================================================
     LOAD DASHBOARD DATA
     ============================================================ */

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

    /* ============================================================
       FARMS
       ============================================================ */
    let loadedFarms = meResponse?.farms || [];

    if (!loadedFarms.length && getId(currentKeeper)) {
      try {
        const farmResponse = await apiRequest(
          `/api/keepers/${getId(currentKeeper)}/farms`,
        );
        loadedFarms = farmResponse?.farms || farmResponse || [];
      } catch {
        loadedFarms = [];
      }
    }

    if (!Array.isArray(loadedFarms)) {
      loadedFarms = [];
    }

    setFarms(loadedFarms);

    /* ============================================================
       HIVES
       ============================================================ */
    const hiveResults = await Promise.all(
      loadedFarms.map(async (farm) => {
        const farmId = getId(farm);
        if (!farmId) return [];

        try {
          const response = await apiRequest(
            `/api/hives?farmId=${farmId}`,
          );
          const farmHives = response?.hives || response || [];
          return Array.isArray(farmHives) ? farmHives : [];
        } catch {
          return [];
        }
      }),
    );

    const loadedHives = hiveResults.flat();
    setHives(loadedHives);

    /* ============================================================
       BATCHES — only for the current logged-in keeper
       ============================================================ */
    let loadedBatches = [];

    try {
      const keeperId = getId(currentKeeper);

      if (keeperId) {
        const response = await apiRequest(
          `/api/batches?keeperId=${encodeURIComponent(keeperId)}`
        );
        loadedBatches = response?.batches || response || [];
      } else {
        const response = await apiRequest('/api/batches');
        loadedBatches = response?.batches || response || [];
      }
    } catch {
      loadedBatches = [];
    }

    if (!Array.isArray(loadedBatches)) {
      loadedBatches = [];
    }

    setBatches(loadedBatches);

    /* ============================================================
       ALERTS
       - Only alerts that belong to the current keeper’s farms/hives
       - Active Alerts  → open varroa + open health_ml
       - Alert History  → varroa + health_ml (open + resolved)
       - Disease Risk   → only open varroa
       ============================================================ */

    const keeperFarmIds = new Set(
      loadedFarms.map((f) => String(getId(f))).filter(Boolean)
    );

    const keeperHiveIds = new Set(
      loadedHives.map((h) => String(getId(h))).filter(Boolean)
    );

    // Does this alert belong to the current keeper?
    function belongsToCurrentKeeper(alert) {
      if (!alert) return false;

      const alertFarmId = String(
        getId(alert.farm) || alert.farm || alert.farmId || ''
      );
      const alertHiveId = String(
        getId(alert.hive) || alert.hive || alert.hiveId || ''
      );

      if (alertFarmId && keeperFarmIds.has(alertFarmId)) return true;
      if (alertHiveId && keeperHiveIds.has(alertHiveId)) return true;

      return false;
    }

    let allOpenAlerts = [];
    let allResolvedAlerts = [];

    try {
      const openRes = await apiRequest('/api/alerts?status=open');
      const rawOpen = Array.isArray(openRes) ? openRes : openRes?.alerts || [];
      allOpenAlerts = rawOpen
        .filter(isAllowedAlert)
        .filter(belongsToCurrentKeeper);
    } catch {
      allOpenAlerts = [];
    }

    try {
      const resolvedRes = await apiRequest('/api/alerts?status=resolved');
      const rawResolved = Array.isArray(resolvedRes)
        ? resolvedRes
        : resolvedRes?.alerts || [];
      allResolvedAlerts = rawResolved
        .filter(isAllowedAlert)
        .filter(belongsToCurrentKeeper);
    } catch {
      try {
        const allRes = await apiRequest('/api/alerts');
        const all = Array.isArray(allRes) ? allRes : allRes?.alerts || [];

        allResolvedAlerts = all
          .filter(isAllowedAlert)
          .filter(belongsToCurrentKeeper)
          .filter(
            (a) =>
              String(a?.status || '').toLowerCase() === 'resolved' ||
              a?.resolved === true
          );

        if (!allOpenAlerts.length) {
          allOpenAlerts = all
            .filter(isAllowedAlert)
            .filter(belongsToCurrentKeeper)
            .filter((a) => String(a?.status || '').toLowerCase() === 'open');
        }
      } catch {
        allResolvedAlerts = [];
      }
    }

    // Final safety filters
    allOpenAlerts = allOpenAlerts
      .filter(isAllowedAlert)
      .filter(belongsToCurrentKeeper);

    allResolvedAlerts = allResolvedAlerts
      .filter(isAllowedAlert)
      .filter(belongsToCurrentKeeper);

    setAlerts(allOpenAlerts);
    setResolvedAlerts(allResolvedAlerts);

    const isHiveAlert = (a) =>
      !!(getId(a?.hive) || a?.hive || a?.hiveId);

    const isFarmAlert = (a) =>
      !!(getId(a?.farm) || a?.farm || a?.farmId);

    setHistoryData({
      openAll: allOpenAlerts,
      openHive: allOpenAlerts.filter(isHiveAlert),
      openFarm: allOpenAlerts.filter(isFarmAlert),
      resolvedAll: allResolvedAlerts,
      resolvedHive: allResolvedAlerts.filter(isHiveAlert),
      resolvedFarm: allResolvedAlerts.filter(isFarmAlert),
    });

    /* ============================================================
   YIELD — call API only once per farm per login session
   ============================================================ */
const yieldMap = {};
const cache = getYieldCache();
const keeperId = getId(currentKeeper);

await Promise.all(
  loadedFarms.map(async (farm) => {
    const farmId = getId(farm);
    if (!farmId) return;

    const cacheKey = `${keeperId}_${farmId}`;

    // Already cached in this session → reuse
    if (cache[cacheKey] !== undefined) {
      yieldMap[farmId] = cache[cacheKey];
      return;
    }

    // First time → call API with random sample
    try {
      const history = getRandomHistorySample(16);
      const response = await apiRequest('/api/yield/predict', {
        method: 'POST',
        body: JSON.stringify({ history }),
      });

      yieldMap[farmId] = response;
      cache[cacheKey] = response;
    } catch {
      yieldMap[farmId] = null;
      cache[cacheKey] = null;
    }
  }),
);

// Save cache for the rest of the session
setYieldCache(cache);
setYields(yieldMap);

const totalKg = Object.values(yieldMap).reduce(
  (sum, item) => sum + extractYieldKg(item),
  0,
);

setYieldEstimate({
  estimatedYieldKg: Math.round(totalKg * 10) / 10,
  source: 'total',
  farmCount: loadedFarms.length,
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

  function openSection(section) {
    setActiveSection(section);
    setSelectedFarm(null);
    setSelectedBatch(null);
    setSelectedPassport(null);
  }

  async function createFarm(formData) {
    setActionLoading(true);
    setError('');
    try {
      await apiRequest('/api/farms', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          keeper: formData.keeper || getId(keeper),
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
          (item) => String(getId(item)) === String(formData.farm),
        );
        if (farm) setSelectedFarm(farm);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  }

  async function createBatch(formData) {
    setActionLoading(true);
    setError('');
    try {
      await apiRequest('/api/batches', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          keeper: formData.keeper || getId(keeper),
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

  /*
   * Soft refresh after Varroa detection.
   * Does NOT set loading=true, so HivesSection stays mounted
   * and the hive detail card remains open with the result + image.
   */
  async function softRefreshAlerts(savedAlert) {
    // Immediately show the new alert in the list (no full page reload)
    if (savedAlert) {
      setAlerts((prev) => {
        const id = String(getId(savedAlert) || '');
        const exists =
          id &&
          prev.some(
            (a) => String(getId(a)) === id,
          );
        if (exists) return prev;
        return [savedAlert, ...prev];
      });

      setHistoryData((prev) => {
        const nextOpenAll = Array.isArray(prev?.openAll)
          ? prev.openAll
          : [];
        const id = String(getId(savedAlert) || '');
        const exists =
          id &&
          nextOpenAll.some(
            (a) => String(getId(a)) === id,
          );
        if (exists) return prev;

        const isHive = !!(
          getId(savedAlert?.hive) ||
          savedAlert?.hive ||
          savedAlert?.hiveId
        );
        const isFarm = !!(
          getId(savedAlert?.farm) ||
          savedAlert?.farm ||
          savedAlert?.farmId
        );

        return {
          ...prev,
          openAll: [savedAlert, ...nextOpenAll],
          openHive: isHive
            ? [savedAlert, ...(prev?.openHive || [])]
            : prev?.openHive || [],
          openFarm: isFarm
            ? [savedAlert, ...(prev?.openFarm || [])]
            : prev?.openFarm || [],
        };
      });
    }

    // Background sync from API (still no loading spinner)
    try {
      const openRes = await apiRequest('/api/alerts?status=open');
      const rawOpen = Array.isArray(openRes)
        ? openRes
        : openRes?.alerts || [];

      const filtered = rawOpen.filter(isAllowedAlert);
      setAlerts(filtered);

      const isHiveAlert = (a) =>
        !!(getId(a?.hive) || a?.hive || a?.hiveId);
      const isFarmAlert = (a) =>
        !!(getId(a?.farm) || a?.farm || a?.farmId);

      setHistoryData((prev) => ({
        ...prev,
        openAll: filtered,
        openHive: filtered.filter(isHiveAlert),
        openFarm: filtered.filter(isFarmAlert),
      }));
    } catch {
      // Keep the optimistic alert if background fetch fails
    }
  }

  const statistics = useMemo(
    () => ({
      totalFarms: farms.length,
      totalHives: hives.length,
      totalBatches: batches.length,
      totalAlerts: alerts.length,
      resolvedAlerts: resolvedAlerts.length,
    }),
    [farms, hives, batches, alerts, resolvedAlerts],
  );

  // Only open Varroa alerts for Disease Risk section
  const openVarroaAlerts = useMemo(
    () => alerts.filter(isVarroaAlert),
    [alerts],
  );

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-cream dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="animate-spin text-gold" size={32} />
          <p className="text-sm text-gray dark:text-muted">
            Loading your HoneyChain dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-72px)] bg-cream dark:bg-black text-black dark:text-cream">
      <div className="flex min-h-[calc(100vh-72px)]">
        <aside className="hidden lg:flex fixed left-0 top-[72px] z-30 w-64 h-[calc(100vh-72px)] shrink-0 border-r border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card flex-col">
          <div className="p-6 border-b border-black/10 dark:border-white/10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
              HoneyChain
            </p>
            <h2 className="mt-2 text-lg font-semibold">Keeper Portal</h2>
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
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
                Signed in as
              </p>
              <p className="mt-2 text-sm font-semibold truncate">
                {keeper?.name || 'Keeper'}
              </p>
              <p className="mt-1 text-xs text-gray dark:text-muted truncate">
                {keeper?.phone || '—'}
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 lg:ml-64">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 py-8">
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
                    type="button"
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

            {error && (
              <div className="mb-6 flex items-start gap-3 border border-red-500/30 bg-red-500/5 p-4">
                <AlertCircle size={20} className="text-red-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{error}</p>
                  <button
                    type="button"
                    onClick={() => setError('')}
                    className="mt-2 text-xs underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'dashboard' && (
              <DashboardHome
                keeper={keeper}
                statistics={statistics}
                farms={farms}
                hives={hives}
                alerts={alerts}                       // open varroa + open health_ml
                varroaAlerts={openVarroaAlerts}       // only open varroa (for Disease Risk)
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
                yields={yields}
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
                risks={risks}
                alerts={alerts}
                onCreate={createHive}
                onVarroaAlert={async (savedAlert) => {
                  // Soft refresh only — keeps hive detail card open
                  await softRefreshAlerts(savedAlert);
                }}
                onSensorReadingSubmitted={async () => {
                  await loadDashboard();
                }}
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

            {activeSection === 'training' && <TrainingSection />}

            {activeSection === 'fraud' && (
              <FraudSection batches={batches} />
            )}

            {activeSection === 'blockchain' && <BlockchainSection />}

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

      {selectedFarm && (
        <FarmDetail
          farm={selectedFarm}
          hives={hives}
          yields={yields}
          onClose={() => setSelectedFarm(null)}
          onCreateHive={createHive}
          onUpdateFarm={updateFarm}
          actionLoading={actionLoading}
        />
      )}

      {selectedBatch && (
        <BatchDetail
          batch={selectedBatch}
          farms={farms}
          onClose={() => setSelectedBatch(null)}
          onUpdate={updateBatch}
          actionLoading={actionLoading}
        />
      )}

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