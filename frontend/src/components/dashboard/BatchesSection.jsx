
import { useState } from 'react';

import {
  Boxes,
  ChevronRight,
  LoaderCircle,
  Plus,
} from 'lucide-react';

import {
  PageHeader,
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
  const [showForm, setShowForm] = useState(false);

  /*
   * ------------------------------------------------------------
   * SELECTED FARM FILTER
   * ------------------------------------------------------------
   */

  const [selectedFarmId, setSelectedFarmId] =
    useState('all');


  /*
   * ------------------------------------------------------------
   * CURRENT KEEPER ID
   * ------------------------------------------------------------
   */

  const keeperId = getId(keeper);


  /*
   * ------------------------------------------------------------
   * FIND FARMS BELONGING TO CURRENT KEEPER
   * ------------------------------------------------------------
   *
   * Some backend responses may contain:
   *
   * farm.keeper = "keeperId"
   *
   * or:
   *
   * farm.keeper = { _id: "keeperId" }
   *
   * We support both.
   * ------------------------------------------------------------
   */

  const keeperFarmIds = farms
    .filter((farm) => {
      const farmKeeperId =
        getId(farm?.keeper) ||
        farm?.keeper;

      return (
        farmKeeperId === keeperId
      );
    })
    .map((farm) => getId(farm))
    .filter(Boolean);


  /*
   * ------------------------------------------------------------
   * GET BATCHES BELONGING TO CURRENT KEEPER
   * ------------------------------------------------------------
   *
   * We check two possibilities:
   *
   * 1. The batch directly contains the keeper ID.
   *
   * 2. The batch contains a farm ID and that farm belongs
   *    to the current keeper.
   *
   * This prevents batches from disappearing when the backend
   * does not populate batch.keeper.
   * ------------------------------------------------------------
   */

  const keeperBatches = batches.filter((batch) => {

    const batchKeeperId =
      getId(batch?.keeper) ||
      batch?.keeper;

    const batchFarmId =
      getId(batch?.farm) ||
      batch?.farm;


    const belongsToKeeper =
      batchKeeperId === keeperId ||
      keeperFarmIds.includes(
        batchFarmId
      );


    return belongsToKeeper;
  });


  /*
   * ------------------------------------------------------------
   * APPLY FARM FILTER
   * ------------------------------------------------------------
   */

  const filteredBatches =
    selectedFarmId === 'all'
      ? keeperBatches
      : keeperBatches.filter((batch) => {

          const batchFarmId =
            getId(batch?.farm) ||
            batch?.farm;

          return (
            batchFarmId ===
            selectedFarmId
          );
        });


  return (
    <div>

      {/* ======================================================
          PAGE HEADER
          ====================================================== */}

      <PageHeader
        eyebrow="03 / Honey Batches"
        title="Honey Batches"
        description="Create, view and update harvested honey batches."
        action={
          <button
            onClick={() =>
              setShowForm(
                (value) => !value
              )
            }
            className="inline-flex items-center gap-2 bg-gold text-black px-4 py-3 text-sm font-semibold"
          >
            <Plus size={17} />
            Create Batch
          </button>
        }
      />


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

      <div className="mb-6 border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-5">

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
              Batch Filter
            </p>

            <h3 className="mt-1 text-sm font-semibold">
              Filter batches by farm
            </h3>

            <p className="mt-1 text-xs text-gray dark:text-muted">
              Only batches belonging to the current keeper are shown.
            </p>

          </div>


          <div className="w-full md:w-72">

            <label className="text-xs font-medium">
              Select Farm
            </label>

            <select
              value={selectedFarmId}
              onChange={(event) =>
                setSelectedFarmId(
                  event.target.value
                )
              }
              className="mt-2 w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm"
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


        {/* ====================================================
            RESULT COUNT
            ==================================================== */}

        <div className="mt-4 border-t border-black/10 dark:border-white/10 pt-4">

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

        </div>

      </div>


      {/* ======================================================
          BATCH LIST
          ====================================================== */}

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

                {filteredBatches.map(
                  (batch) => {

                    /*
                     * Find farm information
                     * for displaying farm name.
                     */

                    const farm =
                      farms.find(
                        (item) =>
                          getId(item) ===
                            getId(batch?.farm) ||
                          getId(item) ===
                            batch?.farm
                      );


                    return (
                      <tr
                        key={getId(batch)}
                        className="border-b border-black/10 dark:border-white/10 last:border-b-0"
                      >

                        {/* BATCH */}

                        <td className="p-4">

                          <p className="font-semibold">
                            {batch.batchCode ||
                              'Unnamed Batch'}
                          </p>

                        </td>


                        {/* FARM */}

                        <td className="p-4">

                          {farm?.name ||
                            farm?.farmCode ||
                            'Unknown'}

                        </td>


                        {/* HARVEST DATE */}

                        <td className="p-4">

                          {formatDate(
                            batch.harvestDate
                          )}

                        </td>


                        {/* QUANTITY */}

                        <td className="p-4">

                          {batch.quantityKg != null
                            ? `${batch.quantityKg} kg`
                            : '—'}

                        </td>


                        {/* FLORAL SOURCE */}

                        <td className="p-4">

                          {batch.floralSourceClaimed ||
                            '—'}

                        </td>


                        {/* VIEW */}

                        <td className="p-4 text-right">

                          <button
                            onClick={() =>
                              onOpenBatch(
                                batch
                              )
                            }
                            className="inline-flex items-center gap-1 text-xs text-gold"
                          >

                            View

                            <ChevronRight
                              size={14}
                            />

                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

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
  farms = [],
  keeper,
  initialData = null,
  onSubmit,
  onCancel,
  actionLoading,
}) {

  /*
   * ------------------------------------------------------------
   * FORM DATA
   * ------------------------------------------------------------
   *
   * New batch:
   *
   * BATCH-${Date.now()}
   *
   * Existing batch:
   *
   * Keep existing batch code.
   * ------------------------------------------------------------
   */

  const [form, setForm] = useState({

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
            initialData.harvestDate
          ).slice(0, 10)
        : '',

    quantityKg:
      initialData?.quantityKg != null
        ? String(
            initialData.quantityKg
          )
        : '',

    floralSourceClaimed:
      initialData?.floralSourceClaimed ||
      '',

    priceInrPerKg:
      initialData?.priceInrPerKg != null
        ? String(
            initialData.priceInrPerKg
          )
        : '',
  });


  /*
   * ------------------------------------------------------------
   * UPDATE FORM FIELD
   * ------------------------------------------------------------
   */

  function update(
    field,
    value
  ) {

    setForm((current) => ({
      ...current,
      [field]: value,
    }));

  }


  /*
   * ------------------------------------------------------------
   * SUBMIT
   * ------------------------------------------------------------
   */

  async function submit(event) {

    event.preventDefault();

    /*
     * Keeper ID comes from the logged-in
     * keeper profile.
     */

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
              form.quantityKg
            )
          : undefined,

      floralSourceClaimed:
        form.floralSourceClaimed.trim(),

      priceInrPerKg:
        form.priceInrPerKg
          ? Number(
              form.priceInrPerKg
            )
          : undefined,

    });

  }


  const isEditing =
    Boolean(initialData);


  return (
    <form
      onSubmit={submit}
      className="mb-8 border border-gold/40 bg-cream-card dark:bg-black-card p-6"
    >

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="flex items-center justify-between mb-6">

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
          className="px-3 py-2 border border-black/10 dark:border-white/10 text-xs"
        >
          Close
        </button>

      </div>


      {/* ======================================================
          FORM FIELDS
          ====================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


        {/* BATCH CODE */}

        <FormField
          label="Batch Code"

          value={
            form.batchCode
          }

          onChange={(value) =>
            update(
              'batchCode',
              value
            )
          }

          placeholder="BATCH-TEST-001"

          required
        />


        {/* FARM */}

        <div>

          <label className="text-xs font-medium">
            Farm
          </label>

          <select
            value={form.farm}
            onChange={(event) =>
              update(
                'farm',
                event.target.value
              )
            }
            required
            className="mt-2 w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm"
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

              )
            )}

          </select>

        </div>


        {/* HARVEST DATE */}

        <FormField
          label="Harvest Date"

          value={
            form.harvestDate
          }

          onChange={(value) =>
            update(
              'harvestDate',
              value
            )
          }

          type="date"

          required
        />


        {/* QUANTITY */}

        <FormField
          label="Quantity (kg)"

          value={
            form.quantityKg
          }

          onChange={(value) =>
            update(
              'quantityKg',
              value
            )
          }

          placeholder="25"

          type="number"

          required
        />


        {/* FLORAL SOURCE */}

        <FormField
          label="Floral Source"

          value={
            form.floralSourceClaimed
          }

          onChange={(value) =>
            update(
              'floralSourceClaimed',
              value
            )
          }

          placeholder="Mustard"
        />


        {/* PRICE */}

        <FormField
          label="Price (INR/kg)"

          value={
            form.priceInrPerKg
          }

          onChange={(value) =>
            update(
              'priceInrPerKg',
              value
            )
          }

          placeholder="450"

          type="number"
        />

      </div>


      {/* ======================================================
          BUTTONS
          ====================================================== */}

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

          {isEditing
            ? 'Update Batch'
            : 'Create Batch'}

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


  /*
   * Find farm belonging to this batch.
   */

  const farm = farms.find(
    (item) =>
      getId(item) ===
        getId(batch?.farm) ||
      getId(item) ===
        batch?.farm
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-black/10 dark:bg-white/10">

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
              batch.harvestDate
            )
          }
        />

      </div>


      {/* ======================================================
          BATCH INFORMATION
          ====================================================== */}

      <div className="mt-6 border border-black/10 dark:border-white/10 p-6">

        <div className="flex items-center justify-between">

          <h3 className="font-semibold">
            Batch Information
          </h3>


          <button
            type="button"
            onClick={() =>
              setEditing(
                (value) => !value
              )
            }
            className="text-xs underline underline-offset-4"
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

              /*
               * Use the logged-in keeper.
               */

              keeper={keeper}

              /*
               * Preserve existing batch values.
               */

              initialData={batch}

              onCancel={() =>
                setEditing(false)
              }

              onSubmit={async (data) => {

                await onUpdate(
                  getId(batch),
                  data
                );

                setEditing(false);

              }}

              actionLoading={
                actionLoading
              }
            />

          </div>

        ) : (

          <div className="mt-5 space-y-4">

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
                  batch.harvestDate
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

      <div className="mt-6 border border-gold/30 bg-gold/5 p-6">

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
