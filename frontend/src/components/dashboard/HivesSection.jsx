
import { useMemo, useState } from 'react';

import {
  Hexagon,
  Plus,
  Search,
} from 'lucide-react';

import {
  PageHeader,
  EmptyState,
  FormField,
} from './DashboardUI';

import { getId } from '../../services/dashboardApi';


/* ============================================================
   HIVES SECTION
   ============================================================ */

function HivesSection({
  farms = [],
  hives = [],
  onCreate,
  actionLoading = false,
}) {
  const [showForm, setShowForm] = useState(false);

  /* ==========================================================
     FILTER STATE
     ========================================================== */

  // Search by Hive ID or Hive Code
  const [hiveSearch, setHiveSearch] = useState('');

  // Filter by Farm ID
  const [selectedFarmId, setSelectedFarmId] = useState('');

  /*
   * Defensive checks.
   *
   * This prevents the page from crashing if the API temporarily
   * returns null, undefined, or another unexpected value.
   */
  const safeFarms = Array.isArray(farms)
    ? farms
    : [];

  const safeHives = Array.isArray(hives)
    ? hives
    : [];


  /* ==========================================================
     FILTERED HIVES
     ========================================================== */

  const filteredHives = useMemo(() => {
    const search = hiveSearch
      .trim()
      .toLowerCase();

    return safeHives.filter((hive) => {
      /*
       * Hive ID
       */
      const hiveId = String(
        getId(hive) || '',
      ).toLowerCase();


      /*
       * Hive Code
       */
      const hiveCode = String(
        hive?.hiveCode || '',
      ).toLowerCase();


      /*
       * Farm ID
       *
       * hive.farm may be:
       *
       * "FARM_ID"
       *
       * OR
       *
       * {
       *   _id: "FARM_ID",
       *   name: "Farm Name"
       * }
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
     FIND FARM
     ========================================================== */

  function findFarm(hive) {
    const hiveFarmId =
      getId(hive?.farm) ||
      hive?.farm ||
      '';

    return safeFarms.find((farm) => {
      const farmId = getId(farm);

      return (
        String(farmId) ===
          String(hiveFarmId)
      );
    });
  }


  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div>

      {/* ========================================================
         PAGE HEADER
         ======================================================== */}

      <PageHeader
        eyebrow="02 / Hives"
        title="Hives"
        description="Monitor all registered hives across your farms."
        action={
          <button
            type="button"
            onClick={() =>
              setShowForm((value) => !value)
            }
            className="inline-flex items-center gap-2 bg-gold text-black px-4 py-3 text-sm font-semibold"
          >
            <Plus size={17} />

            {showForm
              ? 'Close Form'
              : 'Create Hive'}
          </button>
        }
      />


      {/* ========================================================
         CREATE HIVE FORM
         ======================================================== */}

      {showForm && (
        <HiveForm
          farms={safeFarms}
          onSubmit={async (data) => {
            await onCreate?.(data);
            setShowForm(false);
          }}
          onCancel={() =>
            setShowForm(false)
          }
          actionLoading={actionLoading}
        />
      )}


      {/* ========================================================
         SEARCH & FILTER
         ======================================================== */}

      {safeHives.length > 0 && (
        <div className="mt-5 border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-5">

          {/* ----------------------------------------------------
             FILTER HEADER
             ---------------------------------------------------- */}

          <div className="flex items-center gap-2">

            <Search
              size={18}
              className="text-gold"
            />

            <h3 className="text-sm font-semibold">
              Search & Filter Hives
            </h3>

          </div>


          {/* ----------------------------------------------------
             FILTER FIELDS
             ---------------------------------------------------- */}

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

                  const farmId =
                    getId(farm);

                  return (
                    <option
                      key={farmId}
                      value={farmId}
                    >
                      {farm?.name ||
                        farm?.farmCode ||
                        farmId ||
                        'Unnamed Farm'}
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
              </span>

              {' '}of{' '}

              <span className="font-semibold text-black dark:text-cream">
                {safeHives.length}
              </span>

              {' '}hives

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


      {/* ========================================================
         HIVE LIST
         ======================================================== */}

      {safeHives.length === 0 ? (

        /* ------------------------------------------------------
           NO HIVES
           ------------------------------------------------------ */

        <EmptyState
          icon={Hexagon}
          title="No hives registered"
          text="Create a hive inside one of your farms."
        />

      ) : filteredHives.length === 0 ? (

        /* ------------------------------------------------------
           NO SEARCH RESULTS
           ------------------------------------------------------ */

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

        /* ------------------------------------------------------
           HIVE CARDS
           ------------------------------------------------------ */

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {filteredHives.map((hive) => {

            const hiveId =
              getId(hive);

            const hiveFarmId =
              getId(hive?.farm) ||
              hive?.farm ||
              '';

            const farm =
              findFarm(hive);


            /*
             * IMPORTANT:
             *
             * This is deliberately a <div>, NOT a <button>.
             *
             * Therefore clicking a Hive card will NOT:
             *
             * - open a new page
             * - open a detail window
             * - redirect
             * - change selectedHive
             */

            return (
              <div
                key={
                  hiveId ||
                  hive?.hiveCode ||
                  `hive-${Math.random()}`
                }
                className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-6"
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

                </div>


                {/* =================================================
                   HIVE CODE
                   ================================================= */}

                <h3 className="mt-5 text-lg font-semibold">
                  {hive?.hiveCode ||
                    'Unnamed Hive'}
                </h3>


                {/* =================================================
                   HIVE TYPE
                   ================================================= */}

                <p className="mt-1 text-xs text-gray dark:text-muted">
                  {hive?.hiveType ||
                    'Type not specified'}
                </p>


                {/* =================================================
                   HIVE ID
                   ================================================= */}

                <p className="mt-4 text-xs text-gray dark:text-muted">

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

              </div>
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
  farmId = '',
  onSubmit,
  onCancel,
  actionLoading = false,
}) {

  /*
   * Make sure farms is always an array.
   */
  const safeFarms = Array.isArray(farms)
    ? farms
    : [];


  const [form, setForm] = useState({
    hiveCode: `HV-${Date.now()}`,
    farm: farmId || '',
    hiveType: 'Langstroth',
  });


  /* ==========================================================
     UPDATE FORM
     ========================================================== */

  function update(field, value) {

    setForm((current) => ({
      ...current,
      [field]: value,
    }));

  }


  /* ==========================================================
     SUBMIT FORM
     ========================================================== */

  async function submit(event) {

    event.preventDefault();

    /*
     * Prevent submitting when no farm is selected.
     */
    if (!form.farm) {
      return;
    }


    await onSubmit?.({
      hiveCode:
        form.hiveCode.trim(),

      farm:
        form.farm,

      hiveType:
        form.hiveType,
    });

  }


  /* ==========================================================
     FORM UI
     ========================================================== */

  return (
    <form
      onSubmit={submit}
      className="mt-5 p-4 border border-gold/30 bg-gold/5"
    >

      {/* ======================================================
         HIVE CODE
         ====================================================== */}

      <FormField
        label="Hive Code"
        value={form.hiveCode}
        disabled
        required
      />


      {/* ======================================================
         FARM
         ====================================================== */}

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
            className="mt-2 w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm outline-none focus:border-gold"
          >

            <option value="">
              Select farm
            </option>


            {safeFarms.map((farm) => {

              const currentFarmId =
                getId(farm);

              return (
                <option
                  key={currentFarmId}
                  value={currentFarmId}
                >
                  {farm?.name ||
                    farm?.farmCode ||
                    currentFarmId ||
                    'Unnamed Farm'}
                </option>
              );

            })}

          </select>

        </div>
      )}


      {/* ======================================================
         HIVE TYPE
         ====================================================== */}

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


      {/* ======================================================
         BUTTONS
         ====================================================== */}

      <div className="mt-5 flex gap-2">

        <button
          type="submit"
          disabled={
            actionLoading ||
            !form.farm
          }
          className="bg-black text-cream dark:bg-cream dark:text-black px-4 py-2 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {actionLoading
            ? 'Creating...'
            : 'Create Hive'}
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
   EXPORTS
   ============================================================ */

export default HivesSection;

export {
  HiveForm,
};

