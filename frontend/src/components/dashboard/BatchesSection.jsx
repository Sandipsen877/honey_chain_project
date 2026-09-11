import { useState } from 'react';

import {
  Boxes,
  ChevronRight,
  LoaderCircle,
  Plus,
} from 'lucide-react';

import {
  DetailOverlay,
  DetailStat,
  InfoItem,
  EmptyState,
  FormField,
} from './DashboardUI';

import {
  getId,
  formatDate,
} from '../../services/dashboardApi';


/* ============================================================
   SECTION LABEL
   ============================================================ */

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5 sm:mb-6">
      <span className="h-px flex-1 bg-gold/20" />

      <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-gold whitespace-nowrap">
        {children}
      </span>

      <span className="h-px flex-1 bg-gold/20" />
    </div>
  );
}


/* ============================================================
   BATCHES SECTION
   ============================================================ */

function BatchesSection({
  farms = [],
  batches = [],
  keeper,
  onCreate,
  onOpenBatch,
  onUpdate,
  actionLoading,
}) {
  const [showForm, setShowForm] =
    useState(false);

  const [selectedFarmId, setSelectedFarmId] =
    useState('all');

  const keeperId = getId(keeper);


  /* ==========================================================
     FIND KEEPER FARMS
     ========================================================== */

  const keeperFarmIds = farms
    .filter((farm) => {
      const farmKeeperId =
        getId(farm?.keeper) ||
        farm?.keeper;

      return farmKeeperId === keeperId;
    })
    .map((farm) => getId(farm))
    .filter(Boolean);


  /* ==========================================================
     FIND KEEPER BATCHES
     ========================================================== */

  const keeperBatches = batches.filter(
    (batch) => {
      const batchKeeperId =
        getId(batch?.keeper) ||
        batch?.keeper;

      const batchFarmId =
        getId(batch?.farm) ||
        batch?.farm;

      return (
        batchKeeperId === keeperId ||
        keeperFarmIds.includes(
          batchFarmId,
        )
      );
    },
  );


  /* ==========================================================
     APPLY FARM FILTER
     ========================================================== */

  const filteredBatches =
    selectedFarmId === 'all'
      ? keeperBatches
      : keeperBatches.filter(
          (batch) => {
            const batchFarmId =
              getId(batch?.farm) ||
              batch?.farm;

            return (
              batchFarmId ===
              selectedFarmId
            );
          },
        );


  return (
    <div className="w-full min-w-0">

      {/* ======================================================
          SECTION HEADING
         ====================================================== */}

      <div className="mb-8 sm:mb-10">

        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
            03 / Honey Batches
          </span>

          <span className="h-px w-12 bg-gold/30" />
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">

          <div className="min-w-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-black dark:text-cream">
              Honey <span className="text-gold">Batches.</span>
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray dark:text-muted">
              Create, view and update harvested honey batches.
            </p>
          </div>

          <button
            onClick={() =>
              setShowForm(
                (value) => !value,
              )
            }
            className="
              shrink-0
              inline-flex items-center justify-center gap-2
              bg-gold text-black
              px-5 py-3
              text-sm font-semibold
              hover:bg-gold-light
              transition-colors
            "
          >
            <Plus size={17} />
            {showForm
              ? 'Close Form'
              : 'Create Batch'}
          </button>

        </div>
      </div>


      {/* ======================================================
          CREATE BATCH FORM
         ====================================================== */}

      {showForm && (
        <BatchForm
          farms={farms}
          keeper={keeper}

          onSubmit={async (data) => {
            await onCreate(data);
            setShowForm(false);
          }}

          onCancel={() =>
            setShowForm(false)
          }

          actionLoading={
            actionLoading
          }
        />
      )}


      {/* ======================================================
          FARM FILTER
         ====================================================== */}

      <SectionLabel>
        Batch filter
      </SectionLabel>

      <div className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card mb-7 sm:mb-8">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">

          {/* Filter information */}

          <div className="p-5 sm:p-6 lg:border-r border-black/10 dark:border-white/10">

            <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
              Farm Selection
            </p>

            <h3 className="mt-1 text-sm sm:text-base font-semibold">
              Filter batches by farm
            </h3>

            <p className="mt-2 max-w-xl text-xs leading-5 text-gray dark:text-muted">
              Only batches belonging to the current
              keeper are shown in the results.
            </p>

          </div>


          {/* Select */}

          <div className="p-5 sm:p-6">

            <label className="text-xs font-medium">
              Select Farm
            </label>

            <select
              value={selectedFarmId}
              onChange={(event) =>
                setSelectedFarmId(
                  event.target.value,
                )
              }
              className="
                mt-2
                w-full
                border border-black/10
                dark:border-white/10
                bg-cream dark:bg-black
                px-3 py-3
                text-sm
                outline-none
                focus:border-gold
              "
            >

              <option value="all">
                All Farms
              </option>

              {farms.map((farm) => (
                <option
                  key={getId(farm)}
                  value={getId(farm)}
                >
                  {farm.name ||
                    farm.farmCode ||
                    'Unnamed Farm'}
                </option>
              ))}

            </select>

          </div>

        </div>


        {/* Result count */}

        <div className="border-t border-black/10 dark:border-white/10 px-5 sm:px-6 py-4">

          <div className="flex flex-wrap items-center justify-between gap-2">

            <p className="text-xs text-gray dark:text-muted">

              Showing{' '}

              <span className="font-semibold text-black dark:text-white">
                {filteredBatches.length}
              </span>{' '}

              batch
              {filteredBatches.length !== 1
                ? 'es'
                : ''}

              {selectedFarmId !== 'all'
                ? ' for the selected farm'
                : ''}

            </p>

            <span className="text-[9px] uppercase tracking-[0.18em] text-gold">
              {selectedFarmId === 'all'
                ? 'All farms'
                : 'Filtered'}
            </span>

          </div>

        </div>

      </div>


      {/* ======================================================
          BATCH LIST
         ====================================================== */}

      <SectionLabel>
        Batch records
      </SectionLabel>

      {filteredBatches.length === 0 ? (

        <EmptyState
          icon={Boxes}
          title="No honey batches"
          text={
            selectedFarmId === 'all'
              ? 'No batches were found for this keeper.'
              : 'No batches were found for the selected farm.'
          }
        />

      ) : (

        <div className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card overflow-hidden">

          {/* ==================================================
              DESKTOP TABLE
             ================================================== */}

          <div className="hidden lg:block">

            <div className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr_1fr_80px] gap-4 px-5 py-3 border-b border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">

              <span className="text-[9px] uppercase tracking-[0.18em] text-muted">
                Batch
              </span>

              <span className="text-[9px] uppercase tracking-[0.18em] text-muted">
                Farm
              </span>

              <span className="text-[9px] uppercase tracking-[0.18em] text-muted">
                Harvest Date
              </span>

              <span className="text-[9px] uppercase tracking-[0.18em] text-muted">
                Quantity
              </span>

              <span className="text-[9px] uppercase tracking-[0.18em] text-muted">
                Floral Source
              </span>

              <span />
            </div>


            <div className="max-h-[520px] overflow-y-auto overflow-x-hidden scrollbar-thin">

              {filteredBatches.map(
                (batch) => {

                  const farm =
                    farms.find(
                      (item) =>
                        getId(item) ===
                          getId(batch?.farm) ||
                        getId(item) ===
                          batch?.farm,
                    );

                  return (
                    <div
                      key={getId(batch)}
                      className="
                        grid
                        grid-cols-[1.2fr_1fr_1fr_0.8fr_1fr_80px]
                        gap-4
                        px-5 py-4
                        border-b
                        border-black/5
                        dark:border-white/10
                        last:border-b-0
                        hover:bg-black/[0.02]
                        dark:hover:bg-white/[0.02]
                        transition-colors
                      "
                    >

                      <div className="min-w-0">
                        <p className="text-sm font-semibold break-words">
                          {batch.batchCode ||
                            'Unnamed Batch'}
                        </p>
                      </div>

                      <p className="text-xs text-gray dark:text-muted break-words">
                        {farm?.name ||
                          farm?.farmCode ||
                          'Unknown'}
                      </p>

                      <p className="text-xs text-gray dark:text-muted">
                        {formatDate(
                          batch.harvestDate,
                        )}
                      </p>

                      <p className="text-xs font-medium">
                        {batch.quantityKg != null
                          ? `${batch.quantityKg} kg`
                          : '—'}
                      </p>

                      <p className="text-xs text-gray dark:text-muted break-words">
                        {batch.floralSourceClaimed ||
                          '—'}
                      </p>

                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            onOpenBatch(
                              batch,
                            )
                          }
                          className="
                            inline-flex
                            items-center
                            gap-1
                            text-xs
                            text-gold
                            hover:gap-2
                            transition-all
                          "
                        >
                          View
                          <ChevronRight
                            size={14}
                          />
                        </button>
                      </div>

                    </div>
                  );
                },
              )}

            </div>

          </div>


          {/* ==================================================
              MOBILE / TABLET CARDS
             ================================================== */}

          <div className="lg:hidden max-h-[560px] overflow-y-auto overflow-x-hidden scrollbar-thin">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3">

              {filteredBatches.map(
                (batch) => {

                  const farm =
                    farms.find(
                      (item) =>
                        getId(item) ===
                          getId(batch?.farm) ||
                        getId(item) ===
                          batch?.farm,
                    );

                  return (
                    <div
                      key={getId(batch)}
                      className="
                        min-w-0
                        border
                        border-black/10
                        dark:border-white/10
                        p-4
                        bg-cream
                        dark:bg-black
                      "
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <p className="text-[9px] uppercase tracking-[0.16em] text-gold">
                            Batch
                          </p>

                          <h3 className="mt-1 text-sm font-semibold break-words">
                            {batch.batchCode ||
                              'Unnamed Batch'}
                          </h3>

                        </div>

                        <button
                          onClick={() =>
                            onOpenBatch(
                              batch,
                            )
                          }
                          className="
                            shrink-0
                            w-8 h-8
                            flex items-center justify-center
                            border
                            border-black/10
                            dark:border-white/10
                            text-gold
                          "
                          aria-label="View batch"
                        >
                          <ChevronRight
                            size={15}
                          />
                        </button>

                      </div>


                      <div className="mt-4 grid grid-cols-2 gap-2">

                        <div className="border border-black/10 dark:border-white/10 p-3">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-muted">
                            Farm
                          </p>

                          <p className="mt-1 text-xs font-medium break-words">
                            {farm?.name ||
                              farm?.farmCode ||
                              'Unknown'}
                          </p>
                        </div>


                        <div className="border border-black/10 dark:border-white/10 p-3">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-muted">
                            Quantity
                          </p>

                          <p className="mt-1 text-xs font-medium">
                            {batch.quantityKg != null
                              ? `${batch.quantityKg} kg`
                              : '—'}
                          </p>
                        </div>


                        <div className="border border-black/10 dark:border-white/10 p-3">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-muted">
                            Harvest
                          </p>

                          <p className="mt-1 text-xs font-medium">
                            {formatDate(
                              batch.harvestDate,
                            )}
                          </p>
                        </div>


                        <div className="border border-black/10 dark:border-white/10 p-3">
                          <p className="text-[9px] uppercase tracking-[0.14em] text-muted">
                            Source
                          </p>

                          <p className="mt-1 text-xs font-medium break-words">
                            {batch.floralSourceClaimed ||
                              '—'}
                          </p>
                        </div>

                      </div>

                    </div>
                  );
                },
              )}

            </div>

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
  farms = [],
  keeper,
  initialData = null,
  onSubmit,
  onCancel,
  actionLoading,
}) {
  const [form, setForm] =
    useState({

      batchCode:
        initialData?.batchCode ||
        `BATCH-${Date.now()}`,

      farm:
        getId(initialData?.farm) ||
        initialData?.farm ||
        '',

      keeper:
        getId(keeper) ||
        '',

      harvestDate:
        initialData?.harvestDate
          ? String(
              initialData.harvestDate,
            ).slice(0, 10)
          : '',

      quantityKg:
        initialData?.quantityKg != null
          ? String(
              initialData.quantityKg,
            )
          : '',

      floralSourceClaimed:
        initialData?.floralSourceClaimed ||
        '',

      priceInrPerKg:
        initialData?.priceInrPerKg != null
          ? String(
              initialData.priceInrPerKg,
            )
          : '',
    });


  function update(
    field,
    value,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }


  async function submit(event) {
    event.preventDefault();

    await onSubmit({

      batchCode:
        form.batchCode.trim(),

      farm:
        form.farm,

      keeper:
        getId(keeper),

      harvestDate:
        form.harvestDate,

      quantityKg:
        form.quantityKg
          ? Number(
              form.quantityKg,
            )
          : undefined,

      floralSourceClaimed:
        form.floralSourceClaimed.trim(),

      priceInrPerKg:
        form.priceInrPerKg
          ? Number(
              form.priceInrPerKg,
            )
          : undefined,

    });
  }


  const isEditing =
    Boolean(initialData);


  return (
    <form
      onSubmit={submit}
      className="
        mb-8
        border border-gold/40
        bg-cream-card
        dark:bg-black-card
        overflow-hidden
      "
    >

      {/* ======================================================
          FORM HEADER
         ====================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 sm:p-6 border-b border-gold/20">

        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
            Batch details
          </p>

          <h2 className="mt-1 text-lg font-semibold">
            {isEditing
              ? 'Update Honey Batch'
              : 'Create Honey Batch'}
          </h2>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="
            self-start sm:self-auto
            px-4 py-2
            border border-black/10
            dark:border-white/10
            text-xs
          "
        >
          Close
        </button>

      </div>


      {/* ======================================================
          FORM BODY
         ====================================================== */}

      <div className="p-5 sm:p-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <FormField
            label="Batch Code"
            value={
              form.batchCode
            }
            onChange={(value) =>
              update(
                'batchCode',
                value,
              )
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
                update(
                  'farm',
                  event.target.value,
                )
              }
              required
              className="
                mt-2
                w-full
                border border-black/10
                dark:border-white/10
                bg-cream dark:bg-black
                px-3 py-3
                text-sm
                outline-none
                focus:border-gold
              "
            >

              <option value="">
                Select farm
              </option>

              {farms.map(
                (farm) => (
                  <option
                    key={getId(farm)}
                    value={getId(farm)}
                  >
                    {farm.name ||
                      farm.farmCode}
                  </option>
                ),
              )}

            </select>
          </div>


          <FormField
            label="Harvest Date"
            value={
              form.harvestDate
            }
            onChange={(value) =>
              update(
                'harvestDate',
                value,
              )
            }
            type="date"
            required
          />


          <FormField
            label="Quantity (kg)"
            value={
              form.quantityKg
            }
            onChange={(value) =>
              update(
                'quantityKg',
                value,
              )
            }
            placeholder="25"
            type="number"
            required
          />


          <FormField
            label="Floral Source"
            value={
              form.floralSourceClaimed
            }
            onChange={(value) =>
              update(
                'floralSourceClaimed',
                value,
              )
            }
            placeholder="Mustard"
          />


          <FormField
            label="Price (INR/kg)"
            value={
              form.priceInrPerKg
            }
            onChange={(value) =>
              update(
                'priceInrPerKg',
                value,
              )
            }
            placeholder="450"
            type="number"
          />

        </div>


        {/* ====================================================
            FORM BUTTONS
           ==================================================== */}

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">

          <button
            type="submit"
            disabled={actionLoading}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              bg-black
              text-cream
              dark:bg-cream
              dark:text-black
              px-5 py-3
              text-sm font-semibold
              disabled:opacity-50
            "
          >

            {actionLoading && (
              <LoaderCircle
                size={16}
                className="animate-spin"
              />
            )}

            {isEditing
              ? 'Update Batch'
              : 'Create Batch'}

          </button>


          <button
            type="button"
            onClick={onCancel}
            className="
              px-5 py-3
              text-sm
              border border-black/10
              dark:border-white/10
            "
          >
            Cancel
          </button>

        </div>

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
  keeper,
  onClose,
  onUpdate,
  actionLoading,
}) {
  const [editing, setEditing] =
    useState(false);


  const farm = farms.find(
    (item) =>
      getId(item) ===
        getId(batch?.farm) ||
      getId(item) ===
        batch?.farm,
  );


  return (
    <DetailOverlay
      eyebrow="Honey Batch Details"
      title={
        batch.batchCode ||
        'Honey Batch'
      }
      onClose={onClose}
    >

      {/* ======================================================
          SUMMARY
         ====================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-black/10 dark:bg-white/10">

        <DetailStat
          label="Batch Code"
          value={
            batch.batchCode ||
            '—'
          }
        />

        <DetailStat
          label="Quantity"
          value={
            batch.quantityKg != null
              ? `${batch.quantityKg} kg`
              : '—'
          }
        />

        <DetailStat
          label="Floral Source"
          value={
            batch.floralSourceClaimed ||
            '—'
          }
        />

        <DetailStat
          label="Harvest Date"
          value={
            formatDate(
              batch.harvestDate,
            )
          }
        />

      </div>


      {/* ======================================================
          BATCH INFORMATION
         ====================================================== */}

      <div className="mt-6 border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-5 sm:p-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-gold">
              Record
            </p>

            <h3 className="mt-1 font-semibold">
              Batch Information
            </h3>
          </div>

          <button
            type="button"
            onClick={() =>
              setEditing(
                (value) => !value,
              )
            }
            className="
              self-start sm:self-auto
              text-xs
              underline
              underline-offset-4
            "
          >
            {editing
              ? 'Close Edit'
              : 'Update Batch'}
          </button>

        </div>


        {editing ? (

          <div className="mt-5">

            <BatchForm
              farms={farms}
              keeper={keeper}
              initialData={batch}
              onCancel={() =>
                setEditing(false)
              }
              onSubmit={async (
                data,
              ) => {

                await onUpdate(
                  getId(batch),
                  data,
                );

                setEditing(false);
              }}
              actionLoading={
                actionLoading
              }
            />

          </div>

        ) : (

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">

            <InfoItem
              label="Batch Code"
              value={
                batch.batchCode
              }
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
              label="Harvest Date"
              value={
                formatDate(
                  batch.harvestDate,
                )
              }
            />

            <InfoItem
              label="Quantity"
              value={
                batch.quantityKg != null
                  ? `${batch.quantityKg} kg`
                  : '—'
              }
            />

            <InfoItem
              label="Floral Source"
              value={
                batch.floralSourceClaimed ||
                '—'
              }
            />

            <InfoItem
              label="Price"
              value={
                batch.priceInrPerKg != null
                  ? `₹${batch.priceInrPerKg} / kg`
                  : '—'
              }
            />

          </div>

        )}

      </div>


      {/* ======================================================
          DIGITAL PASSPORT NOTE
         ====================================================== */}

      <div className="mt-6 border border-gold/30 bg-gold/5 p-5 sm:p-6">

        <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
          Digital Passport
        </p>

        <p className="mt-2 text-sm leading-6 text-gray dark:text-muted">
          Lab submission and QR passport
          actions are available from the
          Digital Passport section.
        </p>

      </div>

    </DetailOverlay>
  );
}


/* ============================================================
   EXPORTS
   ============================================================ */

export default BatchesSection;

export {
  BatchForm,
  BatchDetail,
};