import {
  AlertCircle,
  Boxes,
  CheckCircle2,
  ChevronRight,
  Hexagon,
  MapPin,
  Plus,
  Sprout,
  Tractor,
  TrendingUp,
} from 'lucide-react';

import {
  EmptyState,
  PageHeader,
  PrimaryButton,
  RiskBadge,
  SectionCard,
  StatCard,
  StatusBadge,
} from './DashboardUI';


/* ============================================================
   MAIN DASHBOARD HOME
   ============================================================ */

export default function DashboardHome({
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

      {/* ======================================================
          PAGE HEADER
      ======================================================= */}

      <PageHeader
        eyebrow="HoneyChain / Overview"
        title={`Welcome, ${keeper?.name || 'Keeper'}`}
        description="Monitor your apiaries, hives, honey production, alerts, and predictive insights from one place."
        action={
          farms.length === 0 ? (
            <PrimaryButton
              onClick={() =>
                onOpenSection('farms')
              }
              icon={Plus}
            >
              Create Farm
            </PrimaryButton>
          ) : null
        }
      />


      {/* ======================================================
          STATISTICS
      ======================================================= */}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">

        <StatCard
          label="Total Farms"
          value={
            statistics.totalFarms
          }
          icon={Tractor}
        />

        <StatCard
          label="Total Hives"
          value={
            statistics.totalHives
          }
          icon={Hexagon}
        />

        <StatCard
          label="Honey Batches"
          value={
            statistics.totalBatches
          }
          icon={Boxes}
        />

        <StatCard
          label="Yield Estimate"
          value={
            formatYield(
              yieldEstimate,
            )
          }
          icon={TrendingUp}
        />

        <StatCard
          label="Total Alerts"
          value={
            statistics.totalAlerts
          }
          icon={AlertCircle}
          danger={
            statistics.totalAlerts >
            0
          }
        />

      </div>


      {/* ======================================================
          RESOLVED ALERT SUMMARY
      ======================================================= */}

      <div className="mt-3">

        <SectionCard className="p-5">

          <div className="flex items-center gap-3">

            <CheckCircle2
              size={20}
              className="text-green-600"
            />

            <div>

              <p className="text-[10px] uppercase tracking-[0.15em] text-gray dark:text-muted">
                Resolved Alerts
              </p>

              <p className="mt-1 text-lg font-semibold">
                {statistics.resolvedAlerts}
              </p>

            </div>

          </div>

        </SectionCard>

      </div>


      {/* ======================================================
          NO FARMS
      ======================================================= */}

      {farms.length === 0 && (
        <SectionCard className="mt-6">

          <EmptyState
            icon={Sprout}
            title="No farms registered yet"
            text="Create your first farm to start managing hives, monitoring conditions, estimating yield, and receiving alerts."
            action={
              <PrimaryButton
                onClick={() =>
                  onOpenSection(
                    'farms',
                  )
                }
                icon={Plus}
              >
                Create Your First Farm
              </PrimaryButton>
            }
          />

        </SectionCard>
      )}


      {/* ======================================================
          FARMS + HIVE INSIGHTS
      ======================================================= */}

      {farms.length > 0 && (
        <div className="mt-8 grid lg:grid-cols-2 gap-5">


          {/* ==================================================
              FARM OVERVIEW
          ================================================== */}

          <SectionCard>

            <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">

              <div>

                <p className="text-[10px] uppercase tracking-[0.15em] text-gold">
                  Apiaries
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Your Farms
                </h2>

              </div>

              <button
                onClick={() =>
                  onOpenSection(
                    'farms',
                  )
                }
                className="text-xs underline"
              >
                View all
              </button>

            </div>


            <div className="divide-y divide-black/5 dark:divide-white/10">

              {farms
                .slice(0, 5)
                .map((farm) => (
                  <FarmOverviewItem
                    key={
                      getId(farm)
                    }
                    farm={farm}
                    hives={hives}
                  />
                ))}

            </div>

          </SectionCard>


          {/* ==================================================
              HIVE RISK OVERVIEW
          ================================================== */}

          <SectionCard>

            <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">

              <div>

                <p className="text-[10px] uppercase tracking-[0.15em] text-gold">
                  Hive Health
                </p>

                <h2 className="mt-1 text-lg font-semibold">
                  Disease Risk
                </h2>

              </div>

              <button
                onClick={() =>
                  onOpenSection(
                    'hives',
                  )
                }
                className="text-xs underline"
              >
                View all
              </button>

            </div>


            {hives.length === 0 ? (
              <EmptyState
                icon={Hexagon}
                title="No hives yet"
                text="Create a hive inside one of your farms to start monitoring hive health."
                action={
                  <PrimaryButton
                    onClick={() =>
                      onOpenSection(
                        'hives',
                      )
                  }
                  >
                    Manage Hives
                  </PrimaryButton>
                }
              />
            ) : (
              <div className="divide-y divide-black/5 dark:divide-white/10">

                {hives
                  .slice(0, 5)
                  .map((hive) => (
                    <HiveRiskItem
                      key={
                        getId(hive)
                      }
                      hive={hive}
                      risk={
                        risks[
                          getId(
                            hive,
                          )
                        ]
                      }
                    />
                  ))}

              </div>
            )}

          </SectionCard>

        </div>
      )}


      {/* ======================================================
          ACTIVE ALERTS
      ======================================================= */}

      <SectionCard className="mt-5">

        <div className="p-5 border-b border-black/10 dark:border-white/10 flex items-center justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-[0.15em] text-red-500">
              Attention Required
            </p>

            <h2 className="mt-1 text-lg font-semibold">
              Active Alerts
            </h2>

          </div>

          <button
            onClick={() =>
              onOpenSection(
                'history',
              )
            }
            className="text-xs underline"
          >
            Alert history
          </button>

        </div>


        {alerts.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No active alerts"
            text="Your monitored farms currently have no open alerts."
          />
        ) : (
          <div className="divide-y divide-black/5 dark:divide-white/10">

            {alerts
              .slice(0, 8)
              .map((alert) => (
                <AlertItem
                  key={
                    getId(alert)
                  }
                  alert={alert}
                  onResolve={
                    onResolveAlert
                  }
                  actionLoading={
                    actionLoading
                  }
                />
              ))}

          </div>
        )}

      </SectionCard>


      {/* ======================================================
          QUICK ACTIONS
      ======================================================= */}

      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">

        <QuickAction
          icon={Tractor}
          title="Manage Farms"
          text="Create or update farms"
          onClick={() =>
            onOpenSection(
              'farms',
            )
          }
        />

        <QuickAction
          icon={Hexagon}
          title="Manage Hives"
          text="View and create hives"
          onClick={() =>
            onOpenSection(
              'hives',
            )
          }
        />

        <QuickAction
          icon={Boxes}
          title="Honey Batches"
          text="Track harvested honey"
          onClick={() =>
            onOpenSection(
              'batches',
            )
          }
        />

        <QuickAction
          icon={QrCodeIcon}
          title="Digital Passport"
          text="Lab reports and QR"
          onClick={() =>
            onOpenSection(
              'passport',
            )
          }
        />

      </div>

    </div>
  );
}


/* ============================================================
   FARM OVERVIEW ITEM
   ============================================================ */

function FarmOverviewItem({
  farm,
  hives,
}) {
  const farmId = getId(farm);

  const farmHives =
    hives.filter(
      (hive) =>
        getId(
          hive?.farm,
        ) === farmId ||
        hive?.farm ===
          farmId,
    );

  return (
    <div className="p-5 flex items-center justify-between gap-4">

      <div className="min-w-0">

        <div className="flex items-center gap-2">

          <Tractor
            size={16}
            className="text-gold shrink-0"
          />

          <p className="font-medium truncate">
            {farm?.name ||
              farm?.farmCode ||
              'Unnamed Farm'}
          </p>

        </div>


        <div className="mt-2 flex items-center gap-2 text-xs text-gray dark:text-muted">

          <MapPin size={13} />

          <span className="truncate">
            {getFarmLocation(
              farm,
            )}
          </span>

        </div>

      </div>


      <div className="text-right shrink-0">

        <p className="text-lg font-semibold">
          {farmHives.length}
        </p>

        <p className="text-[10px] uppercase tracking-wide text-gray dark:text-muted">
          Hives
        </p>

      </div>

    </div>
  );
}


/* ============================================================
   HIVE RISK ITEM
   ============================================================ */

function HiveRiskItem({
  hive,
  risk,
}) {
  return (
    <div className="p-5 flex items-center justify-between gap-4">

      <div className="min-w-0">

        <div className="flex items-center gap-2">

          <Hexagon
            size={16}
            className="text-gold shrink-0"
          />

          <p className="font-medium truncate">
            {hive?.hiveCode ||
              hive?.name ||
              `Hive ${getId(hive)}`}
          </p>

        </div>


        <p className="mt-2 text-xs text-gray dark:text-muted">
          {getHiveFarmName(
            hive,
          )}
        </p>

      </div>


      <RiskBadge risk={risk} />

    </div>
  );
}


/* ============================================================
   ALERT ITEM
   ============================================================ */

function AlertItem({
  alert,
  onResolve,
  actionLoading,
}) {
  const status =
    alert?.status ||
    'open';

  const title =
    alert?.title ||
    alert?.type ||
    alert?.alertType ||
    'Hive Alert';

  const message =
    alert?.message ||
    alert?.description ||
    alert?.details ||
    'An alert requires attention.';

  return (
    <div className="p-5 flex flex-col md:flex-row md:items-center gap-4">

      <div className="w-9 h-9 shrink-0 flex items-center justify-center border border-red-500/20 bg-red-500/5">

        <AlertCircle
          size={18}
          className="text-red-500"
        />

      </div>


      <div className="flex-1 min-w-0">

        <div className="flex flex-wrap items-center gap-2">

          <p className="font-medium">
            {title}
          </p>

          <StatusBadge
            status={status}
          />

        </div>


        <p className="mt-1 text-sm text-gray dark:text-muted">
          {message}
        </p>


        <p className="mt-2 text-[10px] text-gray dark:text-muted">
          {getAlertTarget(
            alert,
          )}
        </p>

      </div>


      <button
        onClick={() =>
          onResolve(
            getId(alert),
          )
        }
        disabled={
          actionLoading ||
          !getId(alert)
        }
        className="shrink-0 inline-flex items-center justify-center gap-2 px-3 py-2 border border-black/10 dark:border-white/10 text-xs font-medium hover:border-gold disabled:opacity-50"
      >
        <CheckCircle2
          size={15}
        />

        Resolve
      </button>

    </div>
  );
}


/* ============================================================
   QUICK ACTION
   ============================================================ */

function QuickAction({
  icon: Icon,
  title,
  text,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="text-left bg-cream-card dark:bg-black-card border border-black/5 dark:border-white/10 p-5 hover:border-gold transition-colors"
    >

      <div className="flex items-start justify-between gap-3">

        <Icon
          size={19}
          className="text-gold"
        />

        <ChevronRight
          size={16}
          className="text-gray dark:text-muted"
        />

      </div>

      <p className="mt-5 text-sm font-semibold">
        {title}
      </p>

      <p className="mt-1 text-xs leading-5 text-gray dark:text-muted">
        {text}
      </p>

    </button>
  );
}


/* ============================================================
   HELPERS
   ============================================================ */

function getId(item) {
  return (
    item?._id ||
    item?.id
  );
}


function formatYield(value) {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'number') {
    return `${value} kg`;
  }

  if (typeof value === 'string') {
    return value.includes('kg') ? value : `${value} kg`;
  }

  if (typeof value === 'object') {
    const number =
      value.estimatedYieldKg ??
      value.estimatedYield ??
      value.yieldEstimate ??
      value.predictedYield ??
      value.yield ??
      value.value ??
      value.amount ??
      value.kg ??
      value.quantity;

    if (number !== undefined && number !== null && number !== '') {
      return `${number} kg`;
    }

    return '—';
  }

  return `${value} kg`;
}

function getFarmLocation(
  farm,
) {
  const location =
    farm?.location;

  if (!location) {
    return 'Location not provided';
  }

  if (
    typeof location ===
    'string'
  ) {
    return location;
  }

  const parts = [
    location.area,
    location.state,
  ].filter(Boolean);

  if (parts.length) {
    return parts.join(
      ', ',
    );
  }

  if (
    location.lat !==
      undefined &&
    location.lng !==
      undefined
  ) {
    return `${location.lat}, ${location.lng}`;
  }

  return 'Location not provided';
}


function getHiveFarmName(
  hive,
) {
  const farm =
    hive?.farm;

  if (!farm) {
    return 'Farm not assigned';
  }

  if (
    typeof farm ===
    'string'
  ) {
    return `Farm: ${farm}`;
  }

  return (
    farm?.name ||
    farm?.farmCode ||
    'Farm assigned'
  );
}


function getAlertTarget(
  alert,
) {
  if (alert?.hive) {
    const hive =
      alert.hive;

    if (
      typeof hive ===
      'object'
    ) {
      return `Hive: ${
        hive?.hiveCode ||
        hive?.name ||
        getId(hive)
      }`;
    }

    return `Hive: ${hive}`;
  }

  if (alert?.farm) {
    const farm =
      alert.farm;

    if (
      typeof farm ===
      'object'
    ) {
      return `Farm: ${
        farm?.name ||
        farm?.farmCode ||
        getId(farm)
      }`;
    }

    return `Farm: ${farm}`;
  }

  return 'HoneyChain monitoring system';
}


/* ============================================================
   QR ICON WRAPPER
   ============================================================ */

function QrCodeIcon(
  props,
) {
  return (
    <span
      className="inline-flex"
      {...props}
    >
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect
          x="3"
          y="3"
          width="6"
          height="6"
        />

        <rect
          x="15"
          y="3"
          width="6"
          height="6"
        />

        <rect
          x="3"
          y="15"
          width="6"
          height="6"
        />

        <path d="M15 15h3v3h-3z" />
        <path d="M21 15v6" />
        <path d="M15 21h3" />
        <path d="M12 3v3" />
        <path d="M12 9v3" />
        <path d="M9 12h3" />
        <path d="M15 12h6" />
      </svg>
    </span>
  );
}