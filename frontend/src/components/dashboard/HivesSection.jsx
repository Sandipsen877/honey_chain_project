
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

  /* ==========================================================
     FILTER STATE
     ========================================================== */

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
      const hiveId = String(
        getId(hive) || '',
      ).toLowerCase();

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
     CLOSE HIVE DETAILS
     ========================================================== */

  function closeHiveDetails() {
    setSelectedHive(null);
  }

  /* ==========================================================
     RETURN
     ========================================================== */

  return (
    <div>
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
            className="inline-flex items-center gap-2 bg-gold text-black px-4 py-3 text-sm font-semibold"
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
        <div className="mt-5 border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-5">
          <div className="flex items-center gap-2">
            <Search
              size={18}
              className="text-gold"
            />

            <h3 className="text-sm font-semibold">
              Search & Filter Hives
            </h3>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* ==================================================
                HIVE SEARCH
                ================================================== */}

            <div>
              <label className="text-xs font-medium">
                Search Hive ID / Hive Code
              </label>

              <div className="relative mt-2">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray dark:text-muted"
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
                  className="w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black pl-9 pr-3 py-3 text-sm outline-none focus:border-gold"
                />
              </div>
            </div>

            {/* ==================================================
                FARM FILTER
                ================================================== */}

            <div>
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
                className="mt-2 w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm outline-none focus:border-gold"
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

          {/* ==================================================
              FILTER STATUS
              ================================================== */}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-gray dark:text-muted">
              Showing{' '}
              <span className="font-semibold text-black dark:text-cream">
                {filteredHives.length}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-black dark:text-cream">
                {safeHives.length}
              </span>{' '}
              hives
            </p>

            {(hiveSearch ||
              selectedFarmId) && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-gold hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
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
        <div className="mt-5 border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-10 text-center">
          <div className="mx-auto w-12 h-12 border border-gold/40 flex items-center justify-center">
            <Search
              size={20}
              className="text-gold"
            />
          </div>

          <h3 className="mt-4 text-base font-semibold">
            No hives found
          </h3>

          <p className="mt-2 text-sm text-gray dark:text-muted">
            No hive matches the selected
            Hive ID or Farm ID.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 border border-black/10 dark:border-white/10 px-4 py-2 text-xs font-semibold hover:border-gold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

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
              /* ==================================================
                 HIVE CARD
                 ================================================== */

              <button
                type="button"
                key={hiveId}
                onClick={() =>
                  setSelectedHive(hive)
                }
                className="text-left w-full border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-6 hover:border-gold transition-colors focus:outline-none focus:border-gold"
              >
                {/* ==================================================
                    ICON
                    ================================================== */}

                <div className="w-11 h-11 border border-gold/40 flex items-center justify-center">
                  <Hexagon
                    size={20}
                    className="text-gold"
                  />
                </div>

                {/* ==================================================
                    HIVE ID
                    ================================================== */}

                <div className="mt-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray dark:text-muted">
                    Hive ID
                  </p>

                  <p className="mt-2 text-sm font-semibold break-all">
                    {hiveId || '—'}
                  </p>
                </div>

                {/* ==================================================
                    FARM
                    ================================================== */}

                <div className="mt-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray dark:text-muted">
                    Farm
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gold">
                    {farm?.name ||
                      farm?.farmCode ||
                      'Unknown'}
                  </p>
                </div>

                {/* ==================================================
                    HIVE TYPE
                    ================================================== */}

                <div className="mt-5">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-gray dark:text-muted">
                    Hive Type
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {hive?.hiveType ||
                      'Not specified'}
                  </p>
                </div>

                {/* ==================================================
                    VIEW DETAILS
                    ================================================== */}

                <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10">
                  <p className="text-xs font-semibold text-gold">
                    Click to view hive details →
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ========================================================
          HIVE DETAIL OVERLAY
          ======================================================== */}

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
    <form
      onSubmit={submit}
      className="mt-5 p-4 border border-gold/30 bg-gold/5"
    >
      {/* ========================================================
          HIVE CODE
          ======================================================== */}

      <FormField
        label="Hive Code"
        value={form.hiveCode}
        disabled
        required
      />

      {/* ========================================================
          FARM
          ======================================================== */}

      {!farmId && (
        <div className="mt-4">
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
            className="mt-2 w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm"
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
      )}

      {/* ========================================================
          HIVE TYPE
          ======================================================== */}

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

      {/* ========================================================
          BUTTONS
          ======================================================== */}

      <div className="mt-5 flex gap-2">
        <button
          type="submit"
          disabled={actionLoading}
          className="bg-black text-cream dark:bg-cream dark:text-black px-4 py-2 text-xs font-semibold disabled:opacity-50"
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
  risk,
  onClose,
}) {
  const hiveId = getId(hive);

  /* ==========================================================
     FIND FARM
     ========================================================== */

  const hiveFarmId = String(
    getId(hive?.farm) ||
      hive?.farm ||
      '',
  );

  const farm = farms.find(
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
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">

      {/* ======================================================
          OVERLAY
          ====================================================== */}

      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* ======================================================
          DETAIL PANEL
          ====================================================== */}

      <div className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-cream-card dark:bg-black-card border border-black/10 dark:border-white/10 shadow-2xl">

        {/* ====================================================
            HEADER
            ==================================================== */}

        <div className="sticky top-0 z-20 bg-cream-card dark:bg-black-card border-b border-black/10 dark:border-white/10 px-6 py-5 flex items-start justify-between gap-4">

          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
              Hive Details
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              {hive?.hiveCode ||
                'Hive'}
            </h2>

            <p className="mt-1 text-xs text-gray dark:text-muted break-all">
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

        <div className="p-6">

          {/* ==================================================
              SUMMARY
              ================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-black/10 dark:bg-white/10">

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
              BASIC HIVE INFORMATION
              ================================================== */}

          <div className="mt-6 border border-black/10 dark:border-white/10 p-6">

            <h3 className="font-semibold">
              Basic Hive Information
            </h3>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">

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

            {/* ==================================================
                ADDITIONAL API FIELDS
                ================================================== */}

            {additionalDetails.length >
              0 && (
              <div className="mt-6 pt-6 border-t border-black/10 dark:border-white/10">

                <h4 className="text-sm font-semibold">
                  Additional Details
                </h4>

                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">

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

          <div className="mt-6 border border-black/10 dark:border-white/10 p-6">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 border border-gold/40 flex items-center justify-center">
                <ShieldAlert
                  size={18}
                  className="text-gold"
                />
              </div>

              <div>
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
                {/* ==================================================
                    RISK BADGE
                    ================================================== */}

                <div className="mt-6">
                  <RiskBadge
                    risk={risk}
                    large
                  />
                </div>

                {/* ==================================================
                    RISK DATA FIELDS
                    ================================================== */}

                {riskEntries.length >
                  0 && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">

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
              CLOSE BUTTON
              ================================================== */}

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="border border-black/10 dark:border-white/10 px-5 py-3 text-sm font-semibold hover:border-gold"
            >
              Close
            </button>
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
    <div>
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
