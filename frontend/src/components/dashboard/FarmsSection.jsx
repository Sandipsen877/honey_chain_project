import { useState } from 'react';

import {
  ChevronRight,
  Hexagon,
  LoaderCircle,
  MapPin,
  Plus,
  Tractor,
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

import { getId } from '../../services/dashboardApi';


/* ============================================================
   FARMS SECTION
   ============================================================ */

function FarmsSection({
  farms,
  hives,
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
                  {farm.name ||
                    farm.farmCode ||
                    'Unnamed Farm'}
                </h3>

                <p className="mt-1 text-xs text-gray dark:text-muted">
                  {farm.farmCode || 'No farm code'}
                </p>

                <div className="mt-5 space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin
                      size={14}
                      className="text-gold"
                    />
                    {farm.location?.area ||
                      'Location not provided'}
                  </div>

                  <div className="flex items-center gap-2">
                    <Hexagon
                      size={14}
                      className="text-gold"
                    />
                    {farmHives.length} hives
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
    farmCode: initialData.farmCode || `FRM-${Date.now()}`,
    name: initialData.name || '',
    area: initialData.location?.area || '',
    state: initialData.location?.state || '',
    lat: initialData.location?.lat || '',
    lng: initialData.location?.lng || '',
    environmentType:
      initialData.environmentType || 'humid',
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
            {initialData?.name
              ? 'Update Farm'
              : 'Create Farm'}
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
          onChange={(value) =>
            update('farmCode', value)
          }
          placeholder="FRM-TEST-001"
          required
        />

        <FormField
          label="Farm Name"
          value={form.name}
          onChange={(value) =>
            update('name', value)
          }
          placeholder="Green Valley Apiary"
          required
        />

        <FormField
          label="Area"
          value={form.area}
          onChange={(value) =>
            update('area', value)
          }
          placeholder="Barasat"
          required
        />

        <FormField
          label="State"
          value={form.state}
          onChange={(value) =>
            update('state', value)
          }
          placeholder="West Bengal"
          required
        />

        <FormField
          label="Latitude"
          value={form.lat}
          onChange={(value) =>
            update('lat', value)
          }
          placeholder="22.72"
          type="number"
        />

        <FormField
          label="Longitude"
          value={form.lng}
          onChange={(value) =>
            update('lng', value)
          }
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
  onClose,
  onCreateHive,
  onUpdateFarm,
  actionLoading,
}) {
  const [showHiveForm, setShowHiveForm] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const farmId = getId(farm);

  const farmHives = hives.filter(
    (hive) =>
      getId(hive?.farm) === farmId ||
      hive?.farm === farmId,
  );

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-black/10 dark:bg-white/10 mb-8">
        <DetailStat
          label="Farm Code"
          value={farm.farmCode || '—'}
        />

        <DetailStat
          label="Hives"
          value={farmHives.length}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FARM INFORMATION */}

        <div className="border border-black/10 dark:border-white/10 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Farm Information
            </h3>

            <button
              onClick={() =>
                setEditing((value) => !value)
              }
              className="text-xs underline underline-offset-4"
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
                actionLoading={actionLoading}
                onCancel={() =>
                  setEditing(false)
                }
                onSubmit={async (data) => {
                  await onUpdateFarm(
                    farmId,
                    data,
                  );

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

        {/* HIVES */}

        <div className="border border-black/10 dark:border-white/10 p-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Hives
            </h3>

            <button
              onClick={() =>
                setShowHiveForm(
                  (value) => !value,
                )
              }
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
              onCancel={() =>
                setShowHiveForm(false)
              }
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
                      {hive.hiveType ||
                        'Unknown type'}
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