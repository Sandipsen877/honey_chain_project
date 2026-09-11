import { useEffect, useState } from 'react';

import {
  ChevronRight,
  Hexagon,
  LoaderCircle,
  MapPin,
  Plus,
  Tractor,
  TrendingUp,
  X,
} from 'lucide-react';

import {
  PageHeader,
  DetailOverlay,
  DetailStat,
  InfoItem,
  EmptyState,
  FormField,
} from './DashboardUI';

import { HiveForm } from './HivesSection';

import {
  apiRequest,
  getId,
  getErrorMessage,
} from '../../services/dashboardApi';

/* ============================================================
   HELPERS
   ============================================================ */

function formatYieldValue(yieldData) {
  if (yieldData == null) return '—';

  if (typeof yieldData === 'number') {
    return `${Number(yieldData).toFixed(1)} kg`;
  }

  if (typeof yieldData === 'string') {
    return yieldData.includes('kg')
      ? yieldData
      : `${yieldData} kg`;
  }

  if (typeof yieldData === 'object') {
    const value =
      yieldData.estimatedYieldKg ??
      yieldData.estimatedYield ??
      yieldData.yieldEstimate ??
      yieldData.predictedYield ??
      yieldData.yield ??
      yieldData.value ??
      yieldData.amount ??
      yieldData.kg ??
      yieldData.quantity;

    if (
      value !== undefined &&
      value !== null &&
      value !== ''
    ) {
      return `${Number(value).toFixed(1)} kg`;
    }
  }

  return '—';
}

/* ============================================================
   FARMS SECTION
   ============================================================ */

function FarmsSection({
  farms = [],
  hives = [],
  yields = {},
  onCreate,
  onUpdate,
  onOpenFarm,
  actionLoading,
}) {
  const [showForm, setShowForm] = useState(false);

  const safeFarms = Array.isArray(farms)
    ? farms
    : [];

  const safeHives = Array.isArray(hives)
    ? hives
    : [];

  return (
    <div className="w-full min-w-0 space-y-5 sm:space-y-6">

      {/* ======================================================
          PAGE HEADER
          ====================================================== */}

      <PageHeader
        eyebrow="01 / Farms"
        title="Farms"
        description="Create and manage all your registered apiaries."
        action={
          <button
            type="button"
            onClick={() =>
              setShowForm((value) => !value)
            }
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 bg-gold text-black px-4 py-3 text-sm font-semibold hover:bg-gold-light transition-colors"
          >
            <Plus size={17} />
            Create Farm
          </button>
        }
      />

      {/* ======================================================
          CREATE FARM FORM
          ====================================================== */}

      {showForm && (
        <FarmForm
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
          FARM LIST
          ====================================================== */}

      {safeFarms.length === 0 ? (
        <EmptyState
          icon={Tractor}
          title="No farms registered"
          text="Create a farm to start adding hives."
        />
      ) : (
        <section className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card overflow-hidden">

          {/* List Header */}

          <div className="px-5 sm:px-6 py-4 border-b border-black/10 dark:border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                Registered Farms
              </p>

              <h3 className="mt-1 text-sm font-semibold">
                Farm Overview
              </h3>
            </div>

            <p className="text-xs text-gray dark:text-muted">
              {safeFarms.length} farm
              {safeFarms.length !== 1
                ? 's'
                : ''}
            </p>
          </div>

          {/* Scrollable Farm Area */}

          <div className="max-h-[600px] overflow-y-auto overflow-x-hidden scrollbar-thin p-4 sm:p-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

              {safeFarms.map((farm) => {
                const farmId = getId(farm);

                const farmHives =
                  safeHives.filter(
                    (hive) =>
                      getId(hive?.farm) ===
                        farmId ||
                      hive?.farm === farmId,
                  );

                const yieldText =
                  formatYieldValue(
                    yields[farmId],
                  );

                return (
                  <button
                    type="button"
                    key={farmId}
                    onClick={() =>
                      onOpenFarm(farm)
                    }
                    className="group text-left w-full min-w-0 border border-black/10 dark:border-white/10 bg-cream dark:bg-black p-5 sm:p-6 hover:border-gold transition-all duration-300 focus:outline-none focus:border-gold"
                  >

                    {/* ==================================================
                        CARD TOP
                        ================================================== */}

                    <div className="flex items-start justify-between gap-4">

                      <div className="w-11 h-11 border border-gold/40 flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
                        <Tractor
                          size={20}
                          className="text-gold"
                        />
                      </div>

                      <ChevronRight
                        size={18}
                        className="text-gray dark:text-muted group-hover:text-gold group-hover:translate-x-1 transition-all duration-300"
                      />
                    </div>

                    {/* ==================================================
                        FARM NAME
                        ================================================== */}

                    <div className="mt-5 min-w-0">

                      <h3 className="text-lg font-semibold break-words">
                        {farm.name ||
                          farm.farmCode ||
                          'Unnamed Farm'}
                      </h3>

                      <p className="mt-1 text-xs text-gray dark:text-muted break-all">
                        {farm.farmCode ||
                          'No farm code'}
                      </p>

                    </div>

                    {/* ==================================================
                        FARM METRICS
                        ================================================== */}

                    <div className="mt-5 grid grid-cols-1 gap-3">

                      {/* Location */}

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-8 h-8 border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0">
                          <MapPin
                            size={14}
                            className="text-gold"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[9px] uppercase tracking-[0.15em] text-gray dark:text-muted">
                            Location
                          </p>

                          <p className="mt-0.5 text-xs font-medium truncate">
                            {farm.location
                              ?.area ||
                              'Location not provided'}
                          </p>
                        </div>
                      </div>

                      {/* Hives */}

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-8 h-8 border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0">
                          <Hexagon
                            size={14}
                            className="text-gold"
                          />
                        </div>

                        <div>
                          <p className="text-[9px] uppercase tracking-[0.15em] text-gray dark:text-muted">
                            Hives
                          </p>

                          <p className="mt-0.5 text-xs font-medium">
                            {farmHives.length}
                          </p>
                        </div>
                      </div>

                      {/* Yield */}

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-8 h-8 border border-black/10 dark:border-white/10 flex items-center justify-center shrink-0">
                          <TrendingUp
                            size={14}
                            className="text-gold"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[9px] uppercase tracking-[0.15em] text-gray dark:text-muted">
                            Yield
                          </p>

                          <p className="mt-0.5 text-xs font-medium">
                            {yieldText}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* ==================================================
                        CARD FOOTER
                        ================================================== */}

                    <div className="mt-5 pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-3">

                      <span className="text-xs text-gray dark:text-muted">
                        View farm details
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
    farmCode:
      initialData.farmCode ||
      `FRM-${Date.now()}`,

    name:
      initialData.name || '',

    area:
      initialData.location?.area || '',

    state:
      initialData.location?.state || '',

    lat:
      initialData.location?.lat || '',

    lng:
      initialData.location?.lng || '',

    environmentType:
      initialData.environmentType ||
      'humid',
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

        lat: form.lat
          ? Number(form.lat)
          : undefined,

        lng: form.lng
          ? Number(form.lng)
          : undefined,
      },

      environmentType:
        form.environmentType,
    });
  }

  const isEditing =
    Boolean(initialData?.name);

  return (
    <form
      onSubmit={submit}
      className="border border-gold/30 bg-gold/5 overflow-hidden"
    >

      {/* ======================================================
          FORM HEADER
          ====================================================== */}

      <div className="px-5 sm:px-6 py-4 border-b border-gold/20 flex items-center justify-between gap-4">

        <div className="flex items-center gap-3 min-w-0">

          <div className="w-9 h-9 border border-gold/40 flex items-center justify-center shrink-0">
            <Tractor
              size={17}
              className="text-gold"
            />
          </div>

          <div className="min-w-0">

            <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
              Farm Details
            </p>

            <h2 className="mt-1 text-lg font-semibold">
              {isEditing
                ? 'Update Farm'
                : 'Create Farm'}
            </h2>

          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="w-9 h-9 border border-black/10 dark:border-white/10 flex items-center justify-center hover:border-gold shrink-0"
          aria-label="Close farm form"
        >
          <X size={17} />
        </button>
      </div>

      {/* ======================================================
          FORM FIELDS
          ====================================================== */}

      <div className="p-5 sm:p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <FormField
            label="Farm Code"
            value={form.farmCode}
            onChange={(value) =>
              update(
                'farmCode',
                value,
              )
            }
            placeholder="FRM-TEST-001"
            required
          />

          <FormField
            label="Farm Name"
            value={form.name}
            onChange={(value) =>
              update(
                'name',
                value,
              )
            }
            placeholder="Green Valley Apiary"
            required
          />

          <FormField
            label="Area"
            value={form.area}
            onChange={(value) =>
              update(
                'area',
                value,
              )
            }
            placeholder="Barasat"
            required
          />

          <FormField
            label="State"
            value={form.state}
            onChange={(value) =>
              update(
                'state',
                value,
              )
            }
            placeholder="West Bengal"
            required
          />

          <FormField
            label="Latitude"
            value={form.lat}
            onChange={(value) =>
              update(
                'lat',
                value,
              )
            }
            placeholder="22.72"
            type="number"
          />

          <FormField
            label="Longitude"
            value={form.lng}
            onChange={(value) =>
              update(
                'lng',
                value,
              )
            }
            placeholder="88.48"
            type="number"
          />

          {/* Environment */}

          <div className="min-w-0">

            <label className="text-xs font-medium">
              Environment Type
            </label>

            <select
              value={
                form.environmentType
              }
              onChange={(event) =>
                update(
                  'environmentType',
                  event.target.value,
                )
              }
              className="mt-2 w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm outline-none focus:border-gold"
            >
              <option value="humid">
                Humid
              </option>

              <option value="dry">
                Dry
              </option>

              <option value="temperate">
                Temperate
              </option>

              <option value="tropical">
                Tropical
              </option>
            </select>

          </div>
        </div>

        {/* ====================================================
            ACTIONS
            ==================================================== */}

        <div className="mt-5 pt-5 border-t border-gold/20 flex flex-col sm:flex-row gap-2">

          <button
            type="submit"
            disabled={actionLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-cream dark:bg-cream dark:text-black px-5 py-3 text-sm font-semibold disabled:opacity-50 hover:bg-gold hover:text-black dark:hover:bg-gold dark:hover:text-black transition-colors"
          >
            {actionLoading && (
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
            )}

            {isEditing
              ? 'Update Farm'
              : 'Save Farm'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-3 text-sm border border-black/10 dark:border-white/10 font-medium hover:border-gold transition-colors"
          >
            Cancel
          </button>

        </div>
      </div>
    </form>
  );
}

/* ============================================================
   FARM DETAIL
   ============================================================ */

function FarmDetail({
  farm,
  hives = [],
  onClose,
  onCreateHive,
  onUpdateFarm,
  actionLoading,
}) {
  const [showHiveForm, setShowHiveForm] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [yieldData, setYieldData] =
    useState(null);

  const [yieldLoading, setYieldLoading] =
    useState(false);

  const [yieldError, setYieldError] =
    useState('');

  const farmId = getId(farm);

  const safeHives = Array.isArray(hives)
    ? hives
    : [];

  const farmHives = safeHives.filter(
    (hive) =>
      getId(hive?.farm) === farmId ||
      hive?.farm === farmId,
  );

  /* ==========================================================
     LOAD YIELD
     ========================================================== */

  useEffect(() => {
    if (!farmId) return;

    let cancelled = false;

    async function loadYield() {
      setYieldLoading(true);
      setYieldError('');

      try {
        const response =
          await apiRequest(
            '/api/yield/estimate',
            {
              method: 'POST',

              body: JSON.stringify({
                farmId,
                season: 'monsoon',
              }),
            },
          );

        if (!cancelled) {
          setYieldData(response);
        }
      } catch (err) {
        if (!cancelled) {
          setYieldData(null);
          setYieldError(
            getErrorMessage(err),
          );
        }
      } finally {
        if (!cancelled) {
          setYieldLoading(false);
        }
      }
    }

    loadYield();

    return () => {
      cancelled = true;
    };
  }, [farmId]);

  return (
    <DetailOverlay
      title={
        farm.name ||
        farm.farmCode ||
        'Farm'
      }
      eyebrow="Farm Details"
      onClose={onClose}
    >

      {/* ======================================================
          SUMMARY
          ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-black/10 dark:bg-white/10 mb-5 sm:mb-6">

        <DetailStat
          label="Farm Code"
          value={
            farm.farmCode || '—'
          }
        />

        <DetailStat
          label="Hives"
          value={farmHives.length}
        />

        <DetailStat
          label="Yield Estimate"
          value={
            yieldLoading
              ? 'Loading...'
              : formatYieldValue(
                  yieldData,
                )
          }
        />

      </div>

      {/* ======================================================
          YIELD
          ====================================================== */}

      <div className="mb-5 sm:mb-6 border border-gold/30 bg-gold/5 p-5">

        <div className="flex items-start gap-3">

          <div className="w-10 h-10 border border-gold/40 flex items-center justify-center shrink-0">
            <TrendingUp
              size={19}
              className="text-gold"
            />
          </div>

          <div className="flex-1 min-w-0">

            <p className="text-[10px] uppercase tracking-[0.18em] text-gold font-semibold">
              Yield estimate · this farm
            </p>

            <p className="mt-1 text-lg font-semibold">
              {yieldLoading
                ? 'Fetching estimate...'
                : formatYieldValue(
                    yieldData,
                  )}
            </p>

            {yieldError ? (
              <p className="mt-1 text-xs text-red-500 break-words">
                {yieldError}
              </p>
            ) : (
              <p className="mt-1 text-xs text-gray dark:text-muted">
                From POST /api/yield/estimate · season: monsoon
              </p>
            )}

            {yieldData &&
              typeof yieldData ===
                'object' && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray dark:text-muted">

                  {yieldData.confidence !=
                    null && (
                    <span>
                      Confidence:{' '}
                      {
                        yieldData.confidence
                      }
                    </span>
                  )}

                  {yieldData.season && (
                    <span>
                      Season:{' '}
                      {
                        yieldData.season
                      }
                    </span>
                  )}

                  {yieldData.source && (
                    <span className="break-words">
                      Source:{' '}
                      {
                        yieldData.source
                      }
                    </span>
                  )}

                </div>
              )}
          </div>
        </div>
      </div>

      {/* ======================================================
          MAIN DETAIL GRID
          ====================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">

        {/* ====================================================
            FARM INFORMATION
            ==================================================== */}

        <div className="border border-black/10 dark:border-white/10 p-5 sm:p-6 min-w-0">

          <div className="flex items-center justify-between gap-3">

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                Overview
              </p>

              <h3 className="mt-1 font-semibold">
                Farm Information
              </h3>
            </div>

            <button
              type="button"
              onClick={() =>
                setEditing(
                  (value) => !value,
                )
              }
              className="text-xs font-semibold text-gold underline underline-offset-4 shrink-0"
            >
              {editing
                ? 'Close Edit'
                : 'Update Farm'}
            </button>

          </div>

          {editing ? (
            <div className="mt-5">

              <FarmForm
                initialData={farm}
                actionLoading={
                  actionLoading
                }
                onCancel={() =>
                  setEditing(false)
                }
                onSubmit={async (
                  data,
                ) => {
                  await onUpdateFarm(
                    farmId,
                    data,
                  );

                  setEditing(false);
                }}
              />

            </div>
          ) : (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5">

              <InfoItem
                label="Name"
                value={farm.name}
              />

              <InfoItem
                label="Area"
                value={
                  farm.location?.area
                }
              />

              <InfoItem
                label="State"
                value={
                  farm.location?.state
                }
              />

              <InfoItem
                label="Environment"
                value={
                  farm.environmentType
                }
              />

              <InfoItem
                label="Latitude"
                value={
                  farm.location?.lat
                }
              />

              <InfoItem
                label="Longitude"
                value={
                  farm.location?.lng
                }
              />

            </div>
          )}
        </div>

        {/* ====================================================
            HIVES
            ==================================================== */}

        <div className="border border-black/10 dark:border-white/10 p-5 sm:p-6 min-w-0">

          <div className="flex items-center justify-between gap-3">

            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                Farm Assets
              </p>

              <h3 className="mt-1 font-semibold">
                Hives
              </h3>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowHiveForm(
                  (value) => !value,
                )
              }
              className="inline-flex items-center gap-1 text-xs font-semibold text-gold shrink-0"
            >
              <Plus size={14} />
              Add Hive
            </button>

          </div>

          {/* Hive Form */}

          {showHiveForm && (
            <div className="mt-5">

              <HiveForm
                farmId={farmId}
                onSubmit={async (
                  data,
                ) => {
                  await onCreateHive(
                    data,
                  );

                  setShowHiveForm(false);
                }}
                onCancel={() =>
                  setShowHiveForm(false)
                }
                actionLoading={
                  actionLoading
                }
              />

            </div>
          )}

          {/* Hive List */}

          {farmHives.length === 0 ? (
            <div className="mt-5 border border-black/10 dark:border-white/10 p-5">
              <p className="text-sm text-gray dark:text-muted">
                No hives registered for this farm.
              </p>
            </div>
          ) : (
            <div className="mt-5 max-h-[360px] overflow-y-auto overflow-x-hidden scrollbar-thin border border-black/10 dark:border-white/10">

              <div className="divide-y divide-black/10 dark:divide-white/10">

                {farmHives.map(
                  (hive) => (
                    <div
                      key={getId(hive)}
                      className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                    >

                      <div className="min-w-0">

                        <p className="text-sm font-semibold break-all">
                          {hive.hiveCode ||
                            'Unnamed Hive'}
                        </p>

                        <p className="mt-1 text-xs text-gray dark:text-muted">
                          {hive.hiveType ||
                            'Unknown type'}
                        </p>

                      </div>

                      <div className="w-9 h-9 border border-gold/30 flex items-center justify-center shrink-0">
                        <Hexagon
                          size={17}
                          className="text-gold"
                        />
                      </div>

                    </div>
                  ),
                )}

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ======================================================
          CLOSE
          ====================================================== */}

      <div className="mt-5 sm:mt-6 flex justify-end">

        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto border border-black/10 dark:border-white/10 px-5 py-3 text-sm font-semibold hover:border-gold transition-colors"
        >
          Close
        </button>

      </div>

    </DetailOverlay>
  );
}

/* ============================================================
   EXPORTS
   ============================================================ */

export default FarmsSection;

export {
  FarmForm,
  FarmDetail,
};