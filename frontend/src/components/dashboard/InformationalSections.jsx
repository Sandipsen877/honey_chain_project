import {
  BookOpen,
  Boxes,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

import {
  PageHeader,
  EmptyState,
} from './DashboardUI';

import { getId } from '../../services/dashboardApi';


/* ============================================================
   TRAINING
   ============================================================ */

function TrainingSection() {
  const materials = [
    {
      title: 'Beekeeping Basics',

      description:
        'Introduction to hive management, bee colonies and seasonal care.',

      url: 'https://www.fao.org',
    },

    {
      title: 'Honey Bee Health',

      description:
        'Learn practical approaches to monitoring colony health.',

      url: 'https://www.usda.gov',
    },

    {
      title: 'Sustainable Beekeeping',

      description:
        'Explore open educational resources for sustainable apiary practices.',

      url: 'https://www.open.edu',
    },
  ];


  return (
    <div>

      <PageHeader
        eyebrow="05 / Training"
        title="Training"
        description="Learning resources for better hive management, bee health and honey production."
      />


      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {materials.map((material) => (
          <div
            key={material.title}
            className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-6"
          >

            <BookOpen
              size={23}
              className="text-gold"
            />


            <h3 className="mt-5 font-semibold">
              {material.title}
            </h3>


            <p className="mt-2 text-sm leading-6 text-gray dark:text-muted">
              {material.description}
            </p>


            <a
              href={material.url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-xs text-gold underline underline-offset-4"
            >
              Open Resource

              <ExternalLink
                size={13}
              />
            </a>

          </div>
        ))}

      </div>


      <div className="mt-6 border border-black/10 dark:border-white/10 p-6">

        <div className="flex gap-3">

          <ExternalLink
            size={20}
            className="text-gold"
          />


          <div>

            <h3 className="font-semibold">
              Open-source learning
            </h3>


            <p className="mt-2 text-sm text-gray dark:text-muted">
              Use public educational repositories and
              documentation to continue learning about
              beekeeping technology and traceability.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   FRAUD ALERTS
   ============================================================ */

function FraudSection({
  batches,
}) {
  return (
    <div>

      <PageHeader
        eyebrow="06 / Fraud Detection"
        title="Fraud Alerts"
        description="Demo interface for honey batch authenticity and fraud detection."
      />


      <div className="border border-orange-500/30 bg-orange-500/5 p-5 mb-6">

        <div className="flex gap-3">

          <ShieldAlert
            size={22}
            className="text-orange-500 shrink-0"
          />


          <div>

            <h3 className="font-semibold">
              Demo fraud detection
            </h3>


            <p className="mt-1 text-sm text-gray dark:text-muted">
              This section currently contains dummy
              detection results. It is not connected to a
              production fraud-detection model.
            </p>

          </div>

        </div>

      </div>


      {batches.length === 0 ? (

        <EmptyState
          icon={ShieldAlert}
          title="No batches to inspect"
          text="Create honey batches to display demo fraud results."
        />

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {batches.map((batch, index) => {

            const demoRisk =
              index % 3 === 0
                ? 'Low'
                : index % 3 === 1
                  ? 'Medium'
                  : 'Low';


            return (
              <div
                key={getId(batch)}
                className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-6"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-sm font-semibold">
                      {batch.batchCode}
                    </p>


                    <p className="mt-1 text-xs text-gray dark:text-muted">
                      {batch.floralSourceClaimed ||
                        'Unknown floral source'}
                    </p>

                  </div>


                  <span className="px-2 py-1 border border-green-600/30 text-xs text-green-600">
                    {demoRisk} risk
                  </span>

                </div>


                <div className="mt-5 space-y-2 text-xs text-gray dark:text-muted">

                  <p>
                    Claimed quantity:{' '}
                    {batch.quantityKg ?? '—'} kg
                  </p>


                  <p>
                    Authenticity status: Demo
                  </p>


                  <p>
                    Blockchain verification: Pending
                  </p>

                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}


/* ============================================================
   BLOCKCHAIN EXPLORER
   ============================================================ */

function BlockchainSection() {

  const stages = [
    {
      title: 'Farm Registration',

      status: 'Current',

      description:
        'Farm identity and location are recorded in the HoneyChain system.',
    },

    {
      title: 'Hive Data',

      status: 'Connected',

      description:
        'Hive and sensor information can be associated with registered farms.',
    },

    {
      title: 'Honey Batch',

      status: 'Connected',

      description:
        'Harvested honey batches receive traceable identifiers.',
    },

    {
      title: 'Laboratory Verification',

      status: 'Planned',

      description:
        'Verified laboratory results can become part of the traceability chain.',
    },

    {
      title: 'Blockchain Record',

      status: 'Planned',

      description:
        'Future blockchain integration can provide tamper-resistant traceability.',
    },
  ];


  return (
    <div>

      <PageHeader
        eyebrow="07 / Blockchain"
        title="Blockchain Explorer"
        description="Demo roadmap showing how HoneyChain traceability can evolve toward blockchain-backed records."
      />


      <div className="border border-gold/30 bg-gold/5 p-6 mb-6">

        <div className="flex gap-3">

          <Boxes
            size={23}
            className="text-gold shrink-0"
          />


          <div>

            <h3 className="font-semibold">
              Current blockchain stage
            </h3>


            <p className="mt-2 text-sm leading-6 text-gray dark:text-muted">
              Blockchain functionality is currently represented
              as a demo roadmap. The present application
              focuses on digital traceability and data flow.
            </p>

          </div>

        </div>

      </div>


      <div className="space-y-3">

        {stages.map((stage, index) => (

          <div
            key={stage.title}
            className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card p-5"
          >

            <div className="flex gap-4">

              <div className="w-8 h-8 shrink-0 border border-gold flex items-center justify-center text-xs text-gold">
                {index + 1}
              </div>


              <div className="flex-1">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                  <h3 className="font-semibold">
                    {stage.title}
                  </h3>


                  <span className="text-xs text-gold">
                    {stage.status}
                  </span>

                </div>


                <p className="mt-2 text-sm text-gray dark:text-muted">
                  {stage.description}
                </p>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}


/* ============================================================
   EXPORTS
   ============================================================ */

export {
  TrainingSection,
  FraudSection,
  BlockchainSection,
};