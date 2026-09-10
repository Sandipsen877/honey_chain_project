import { useMemo, useState } from 'react';

import {
  Bell,
  ChevronRight,
  Hexagon,
  Plus,
  Search,
  ShieldAlert,
} from 'lucide-react';

import {
  PageHeader,
  DetailOverlay,
  DetailStat,
  InfoItem,
  EmptyState,
  FormField,
  RiskBadge,
} from './DashboardUI';

import { AlertRow } from './AlertHistory';

import { getId } from '../../services/dashboardApi';


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

  /* ==========================================================
     FILTER STATE
     ========================================================== */

  // Search by Hive ID or Hive Code
  const [hiveSearch, setHiveSearch] = useState('');

  // Filter by Farm ID
  const [selectedFarmId, setSelectedFarmId] = useState('');


  /* ==========================================================
     FILTERED HIVES
     ========================================================== */

  const filteredHives = useMemo(() => {
    const search = hiveSearch.trim().toLowerCase();

    return hives.filter((hive) => {
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

      /* --------------------------------------------------------
         SEARCH FILTER
         -------------------------------------------------------- */

      const matchesHiveSearch =
        !search ||
        hiveId.includes(search) ||
        hiveCode.includes(search);


      /* --------------------------------------------------------
         FARM FILTER
         -------------------------------------------------------- */

      const matchesFarm =
        !selectedFarmId ||
        hiveFarmId === String(selectedFarmId);


      return (
        matchesHiveSearch &&
        matchesFarm
      );
    });
  }, [hives, hiveSearch, selectedFarmId]);


  /* ==========================================================
     CLEAR FILTERS
     ========================================================== */

  function clearFilters() {
    setHiveSearch('');
    setSelectedFarmId('');
  }


  return (
    <div>
      <PageHeader
        eyebrow="02 / Hives"
        title="Hives"
        description="Monitor all registered hives across your farms."
        action={
          <button
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


      {/* ========================================================
         CREATE HIVE FORM
         ======================================================== */}

      {showForm && (
        <HiveForm
          farms={farms}
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


      {/* ========================================================
         HIVE FILTERS
         ======================================================== */}

      {hives.length > 0 && (
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

            {/* --------------------------------------------------
               HIVE ID / CODE SEARCH
               -------------------------------------------------- */}

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
                    setHiveSearch(event.target.value)
                  }
                  placeholder="Search hive ID or HV-TEST-001"
                  className="w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black pl-9 pr-3 py-3 text-sm outline-none focus:border-gold"
                />
              </div>
            </div>


            {/* --------------------------------------------------
               FARM FILTER
               -------------------------------------------------- */}

            <div>
              <label className="text-xs font-medium">
                Filter by Farm
              </label>

              <select
                value={selectedFarmId}
                onChange={(event) =>
                  setSelectedFarmId(event.target.value)
                }
                className="mt-2 w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm outline-none focus:border-gold"
              >
                <option value="">
                  All Farms
                </option>

                {farms.map((farm) => {
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


          {/* ----------------------------------------------------
             FILTER STATUS
             ---------------------------------------------------- */}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">

            <p className="text-xs text-gray dark:text-muted">
              Showing{' '}
              <span className="font-semibold text-black dark:text-cream">
                {filteredHives.length}
              </span>{' '}
              of{' '}
              <span className="font-semibold text-black dark:text-cream">
                {hives.length}
              </span>{' '}
              hives
            </p>


            {(hiveSearch || selectedFarmId) && (
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


      {/* ========================================================
         HIVE LIST
         ======================================================== */}

      {hives.length === 0 ? (
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
            No hive matches the selected Hive ID or Farm ID.
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


            /* --------------------------------------------------
               HIVE ALERTS
               -------------------------------------------------- */

            const hiveAlerts = alerts.filter(
              (alert) =>
                getId(alert?.hive) === hiveId ||
                alert?.hive === hiveId,
            );


            /* --------------------------------------------------
               FIND FARM
               -------------------------------------------------- */

            const hiveFarmId = getId(hive?.farm);

            const farm = farms.find(
              (item) =>
                getId(item) === hiveFarmId ||
                getId(item) === hive?.farm,
            );


            return (
              <button
                key={hiveId}
                onClick={() =>
                  onOpenHive(hive)
                }
                className="text-left border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-6 hover:border-gold"
              >

                {/* =================================================
                   ICON
                   ================================================= */}

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


                {/* =================================================
                   HIVE NAME
                   ================================================= */}

                <h3 className="mt-5 text-lg font-semibold">
                  {hive.hiveCode ||
                    'Unnamed Hive'}
                </h3>


                <p className="mt-1 text-xs text-gray dark:text-muted">
                  {hive.hiveType ||
                    'Type not specified'}
                </p>


                {/* =================================================
                   HIVE ID
                   ================================================= */}

                <p className="mt-3 text-xs text-gray dark:text-muted">
                  Hive ID:{' '}
                  <span className="text-black dark:text-cream">
                    {hiveId || '—'}
                  </span>
                </p>


                {/* =================================================
                   FARM
                   ================================================= */}

                <p className="mt-4 text-xs">
                  Farm:{' '}
                  <span className="text-gold">
                    {farm?.name ||
                      farm?.farmCode ||
                      'Unknown'}
                  </span>
                </p>


                {/* =================================================
                   FARM ID
                   ================================================= */}

                <p className="mt-2 text-xs text-gray dark:text-muted">
                  Farm ID:{' '}
                  <span className="text-black dark:text-cream">
                    {hiveFarmId || '—'}
                  </span>
                </p>


                {/* =================================================
                   RISK + ALERT
                   ================================================= */}

                <div className="mt-4 flex items-center justify-between">

                  <RiskBadge
                    risk={risks[hiveId]}
                  />

                  {hiveAlerts.length > 0 && (
                    <span className="text-xs text-red-500">
                      {hiveAlerts.length} alert
                      {hiveAlerts.length > 1
                        ? 's'
                        : ''}
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

            {farms.map((farm) => (
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
  alerts,
  risk,
  onClose,
  onResolveAlert,
  actionLoading,
}) {
  const hiveId = getId(hive);


  /* ==========================================================
     FIND FARM
     ========================================================== */

  const farm = farms.find(
    (item) =>
      getId(item) ===
        getId(hive?.farm) ||
      getId(item) === hive?.farm,
  );


  /* ==========================================================
     HIVE ALERTS
     ========================================================== */

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

      {/* ========================================================
         SUMMARY
         ======================================================== */}

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


      {/* ========================================================
         INFORMATION + RISK
         ======================================================== */}

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ------------------------------------------------------
           HIVE INFORMATION
           ------------------------------------------------------ */}

        <div className="border border-black/10 dark:border-white/10 p-6">

          <h3 className="font-semibold">
            Hive Information
          </h3>

          <div className="mt-5 space-y-4">

            <InfoItem
              label="Hive ID"
              value={hiveId}
            />

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

            <InfoItem
              label="Farm ID"
              value={getId(hive?.farm)}
            />

          </div>

        </div>


        {/* ------------------------------------------------------
           DISEASE RISK
           ------------------------------------------------------ */}

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

            <RiskBadge
              risk={risk}
              large
            />

          </div>

        </div>

      </div>


      {/* ========================================================
         HIVE ALERTS
         ======================================================== */}

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
                actionLoading={
                  actionLoading
                }
              />
            ))

          )}

        </div>

      </div>

    </DetailOverlay>
  );
}


/* ============================================================
   EXPORTS
   ============================================================ */

export default HivesSection;

export {
  HiveForm,
  HiveDetail,
};