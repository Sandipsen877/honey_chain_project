import { useMemo, useState } from 'react';

import {
  Hexagon,
  Plus,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react';

import {
  PageHeader,
  EmptyState,
  FormField,
  RiskBadge,
} from './DashboardUI';

import { getId } from '../../services/dashboardApi';

/* ============================================================
   HIVES SECTION
   ============================================================ */

function HivesSection({
  farms,
  hives,
  risks,
  onCreate,
  actionLoading,
}) {
  const [showForm, setShowForm] = useState(false);
  const [selectedHive, setSelectedHive] = useState(null);

  const [hiveSearch, setHiveSearch] = useState('');
  const [selectedFarmId, setSelectedFarmId] = useState('');

  const safeFarms = Array.isArray(farms) ? farms : [];
  const safeHives = Array.isArray(hives) ? hives : [];

  /* ==========================================================
     FILTERED HIVES
     ========================================================== */

  const filteredHives = useMemo(() => {
    const search = hiveSearch.trim().toLowerCase();

    return safeHives.filter((hive) => {
      const hiveId = String(getId(hive) || '').toLowerCase();

      const hiveCode = String(
        hive?.hiveCode || '',
      ).toLowerCase();

      /*
       * hive.farm can be:
       *
       * 1. "FARM_ID"
       *
       * OR
       *
       * 2. { _id: "FARM_ID", name: "Farm Name" }
       */

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

  /* ==========================================================
     RETURN
     ========================================================== */

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

          {/* Header */}

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

          {/* Filters */}

          <div className="p-5 sm:p-6">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Hive Search */}

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

              {/* Farm Filter */}

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

            {/* Filter Status */}

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
            No hive matches the selected
            Hive ID or Farm ID.
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

          {/* List Header */}

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

          {/* Scrollable Hive Grid */}

          <div className="max-h-[600px] overflow-y-auto overflow-x-hidden scrollbar-thin p-4 sm:p-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

              {filteredHives.map((hive) => {
                const hiveId = getId(hive);

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

                    {/* Top */}

                    <div className="flex items-start justify-between gap-4">

                      <div className="w-11 h-11 border border-gold/40 flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
                        <Hexagon
                          size={20}
                          className="text-gold"
                        />
                      </div>

                      <span className="text-[10px] uppercase tracking-[0.15em] text-gray dark:text-muted">
                        Hive
                      </span>
                    </div>

                    {/* Hive ID */}

                    <div className="mt-5 min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.18em] text-gray dark:text-muted">
                        Hive ID
                      </p>

                      <p className="mt-2 text-sm font-semibold break-all">
                        {hiveId || '—'}
                      </p>
                    </div>

                    {/* Details */}

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

                    {/* Footer */}

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
          HIVE DETAIL OVERLAY
          ====================================================== */}

      {selectedHive && (
        <HiveDetail
          hive={selectedHive}
          farms={safeFarms}
          risk={
            risks?.[getId(selectedHive)]
          }
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

  const [form, setForm] = useState({
    hiveCode: `HV-${Date.now()}`,
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
    <form className="border border-gold/30 bg-gold/5 overflow-hidden">

      {/* Form Header */}

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

      {/* Fields */}

      <div className="p-5 sm:p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Hive Code */}

          <FormField
            label="Hive Code"
            value={form.hiveCode}
            disabled
            required
          />

          {/* Farm */}

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

          {/* Hive Type */}

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

        {/* Buttons */}

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
  risk,
  onClose,
}) {
  const hiveId = getId(hive);

  const safeFarms = Array.isArray(farms)
    ? farms
    : [];

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

  const additionalDetails = Object.entries(
    hive || {},
  ).filter(([key, value]) => {
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
  });

  /* ==========================================================
     RISK DATA
     ========================================================== */

  const hasRiskObject =
    risk !== null &&
    risk !== undefined;

  const riskEntries =
    typeof risk === 'object' &&
    risk !== null
      ? Object.entries(risk).filter(
          ([, value]) =>
            value !== null &&
            value !== undefined &&
            value !== '',
        )
      : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4">

      {/* Overlay */}

      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Detail Panel */}

      <div className="relative z-10 w-full max-w-5xl max-h-[92vh] overflow-hidden bg-cream-card dark:bg-black-card border border-black/10 dark:border-white/10 shadow-2xl flex flex-col">

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

              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gold font-semibold">
                    Overview
                  </p>

                  <h3 className="mt-1 font-semibold">
                    Basic Hive Information
                  </h3>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">

                {basicDetails.map(
                  (item) => (
                    <InfoItem
                      key={item.label}
                      label={item.label}
                      value={
                        item.value || '—'
                      }
                    />
                  ),
                )}

              </div>

              {/* Additional API Fields */}

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
                DISEASE RISK
                ================================================== */}

            <div className="mt-5 sm:mt-6 border border-black/10 dark:border-white/10 p-5 sm:p-6">

              <div className="flex items-start gap-3">

                <div className="w-10 h-10 border border-gold/40 flex items-center justify-center shrink-0">
                  <ShieldAlert
                    size={18}
                    className="text-gold"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="font-semibold">
                    Disease Risk
                  </h3>

                  <p className="mt-1 text-xs text-gray dark:text-muted">
                    Disease-risk analysis for this hive
                  </p>
                </div>
              </div>

              {!hasRiskObject ? (
                <div className="mt-5 border border-black/10 dark:border-white/10 p-5">
                  <p className="text-sm text-gray dark:text-muted">
                    Disease risk data is not available for this hive.
                  </p>
                </div>
              ) : (
                <>
                  {/* Risk Badge */}

                  <div className="mt-5">
                    <RiskBadge
                      risk={risk}
                      large
                    />
                  </div>

                  {/* Risk Data */}

                  {riskEntries.length >
                    0 && (
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">

                      {riskEntries.map(
                        ([key, value]) => (
                          <InfoItem
                            key={key}
                            label={formatLabel(
                              key,
                            )}
                            value={formatRiskValue(
                              value,
                            )}
                          />
                        ),
                      )}

                    </div>
                  )}
                </>
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
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^./, (char) =>
      char.toUpperCase(),
    )
    .trim();
}

/* ============================================================
   FORMAT RISK VALUE
   ============================================================ */

function formatRiskValue(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return '—';
  }

  if (
    typeof value === 'object'
  ) {
    return JSON.stringify(
      value,
      null,
      2,
    );
  }

  if (
    typeof value === 'boolean'
  ) {
    return value ? 'Yes' : 'No';
  }

  return String(value);
}

/* ============================================================
   EXPORTS
   ============================================================ */

export default HivesSection;

export {
  HiveForm,
  HiveDetail,
};