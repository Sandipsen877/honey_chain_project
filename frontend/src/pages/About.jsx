import {
  ArrowUpRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileCheck2,
  FlaskConical,
  Globe2,
  Landmark,
  Network,
  Scale,
  ShieldCheck,
  Sprout,
  Store,
  Truck,
  Users,
} from 'lucide-react';

export default function About() {
  return (
    <div className="bg-cream dark:bg-black text-black dark:text-cream overflow-hidden">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative py-24 md:py-32 border-b border-black/5 dark:border-white/5">

        <div className="max-w-7xl mx-auto px-6">

          <div className="max-w-4xl">

            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-gold mb-7">
              <BookOpen size={15} strokeWidth={1.6} />
              About HoneyChain
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-[-0.05em] leading-[0.9]">
              Building trust
              <br />
              <span className="text-gold">from hive to jar.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-gray dark:text-muted">
              HoneyChain is a digital traceability ecosystem designed to
              connect beekeepers, hive intelligence, honey batches and
              consumers through IoT, AI, blockchain and QR-based verification.
            </p>

          </div>

        </div>
      </section>


      {/* =====================================================
          ABOUT HONEYCHAIN
      ===================================================== */}
      <section className="py-24 md:py-32">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-14 lg:gap-24">

            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-gold">
                01 · The idea
              </p>

              <h2 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                More than
                <br />
                <span className="text-gold">a QR code.</span>
              </h2>
            </div>

            <div className="space-y-6 text-gray dark:text-muted leading-relaxed">

              <p>
                Honey is not simply a food product. Beekeeping supports rural
                livelihoods while bees contribute to pollination, agricultural
                productivity, biodiversity and sustainable development.
              </p>

              <p>
                Yet the journey from hive to consumer can involve multiple
                disconnected stages. Information about the beekeeper, harvest,
                processing, testing and packaging may not remain connected
                throughout the supply chain.
              </p>

              <p>
                HoneyChain aims to create a digital thread across these stages.
                The platform brings together traditional beekeeping practices
                with modern digital agriculture technologies to make honey
                information more connected, transparent and useful.
              </p>

              <p>
                The goal is not to replace existing government systems or
                agricultural practices, but to complement them with a
                technology-driven layer for traceability, monitoring and
                decision support.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          TECHNOLOGY
      ===================================================== */}
      <section className="py-24 md:py-32 bg-cream-card dark:bg-black-soft border-y border-black/5 dark:border-white/5">

        <div className="max-w-7xl mx-auto px-6">

          <div className="max-w-2xl mb-16">

            <p className="text-xs uppercase tracking-[0.22em] text-gold">
              02 · Technology
            </p>

            <h2 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
              Four technologies.
              <br />
              <span className="text-gold">One connected ecosystem.</span>
            </h2>

          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10">

            <TechnologyCard
              icon={Network}
              number="01"
              title="Blockchain"
              text="Creates a trusted digital record for relevant events and information associated with a honey batch."
            />

            <TechnologyCard
              icon={Sprout}
              number="02"
              title="IoT"
              text="Connects hive-level monitoring with environmental and colony information for smarter beekeeping."
            />

            <TechnologyCard
              icon={Database}
              number="03"
              title="AI"
              text="Analyses collected information to support insights around colony health, abnormal conditions and productivity."
            />

            <TechnologyCard
              icon={ShieldCheck}
              number="04"
              title="QR verification"
              text="Provides consumers with a simple entry point to recorded information about a honey product."
            />

          </div>

        </div>
      </section>


      {/* =====================================================
          DIGITAL TRACEABILITY
      ===================================================== */}
      <section className="py-24 md:py-32">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-[0.75fr_1.25fr] gap-14 lg:gap-24">

            <div>

              <p className="text-xs uppercase tracking-[0.22em] text-gold">
                03 · Traceability
              </p>

              <h2 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                One digital
                <br />
                <span className="text-gold">journey.</span>
              </h2>

              <p className="mt-6 text-base leading-relaxed text-gray dark:text-muted max-w-md">
                HoneyChain is designed around the actual movement of honey,
                connecting information from the source through processing to
                the consumer.
              </p>

            </div>


            <div className="space-y-px bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10">

              <TraceStep
                number="01"
                icon={Sprout}
                title="Source"
                text="Connect the honey batch with its beekeeper, hive or source information."
              />

              <TraceStep
                number="02"
                icon={Store}
                title="Harvest"
                text="Record relevant harvest information associated with the batch."
              />

              <TraceStep
                number="03"
                icon={FlaskConical}
                title="Testing & processing"
                text="Maintain relevant information around quality testing and processing stages."
              />

              <TraceStep
                number="04"
                icon={PackageCheckIcon}
                title="Packaging"
                text="Associate the final packaged product with its digital batch record."
              />

              <TraceStep
                number="05"
                icon={ShieldCheck}
                title="Consumer"
                text="Use QR-based verification to access available product-origin information."
              />

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          GOVERNMENT ECOSYSTEM
      ===================================================== */}
      <section className="py-24 md:py-32 bg-cream-card dark:bg-black-soft border-y border-black/5 dark:border-white/5">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-14 lg:gap-24">

            <div>

              <p className="text-xs uppercase tracking-[0.22em] text-gold">
                04 · Government ecosystem
              </p>

              <h2 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                Aligned with
                <br />
                <span className="text-gold">existing support.</span>
              </h2>

            </div>


            <div className="space-y-6 text-gray dark:text-muted leading-relaxed">

              <p>
                Beekeeping and honey production in India are supported through
                government programmes, institutional frameworks, food-safety
                standards and agricultural market systems.
              </p>

              <p>
                The National Beekeeping & Honey Mission (NBHM) is a Central
                Sector Scheme implemented by the Department of Agriculture &
                Farmers Welfare through the National Bee Board. It promotes
                scientific beekeeping, honey and hive-product development,
                livelihood opportunities and improvements in agriculture and
                horticulture.
              </p>

              <p>
                HoneyChain is conceptually positioned as a digital technology
                layer that can complement this ecosystem through monitoring,
                traceability, data and consumer-facing verification.
              </p>

            </div>

          </div>


          {/* NBHM Mini Missions */}
          <div className="grid md:grid-cols-3 gap-px bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 mt-16">

            <MissionBlock
              number="I"
              title="Pollination & productivity"
              text="Promotes scientific beekeeping and the role of bees in pollination and agricultural productivity."
            />

            <MissionBlock
              number="II"
              title="Post-harvest management"
              text="Focuses on collection, processing, storage, quality improvement, value addition and market development."
            />

            <MissionBlock
              number="III"
              title="Research & technology"
              text="Supports research, technology generation and capacity development for the beekeeping ecosystem."
            />

          </div>

        </div>
      </section>


      {/* =====================================================
          SUBSIDIES
      ===================================================== */}
      <section className="py-24 md:py-32">

        <div className="max-w-7xl mx-auto px-6">

          <div className="max-w-3xl">

            <p className="text-xs uppercase tracking-[0.22em] text-gold">
              05 · Financial assistance
            </p>

            <h2 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
              Support exists.
              <br />
              <span className="text-gold">Eligibility matters.</span>
            </h2>

            <p className="mt-6 text-base leading-relaxed text-gray dark:text-muted">
              Government assistance for beekeeping is scheme- and
              guideline-specific. Support can differ according to beneficiary
              category, implementing agency, activity and geographical area.
            </p>

          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-14">

            <SupportCard
              icon={Users}
              title="Beekeepers & groups"
              text="Individuals, societies, firms and eligible collective structures may be covered under applicable guidelines."
            />

            <SupportCard
              icon={Building2}
              title="Institutional frameworks"
              text="Eligible SHGs, JLGs, FPOs and other institutional structures can receive support under specified components."
            />

            <SupportCard
              icon={Landmark}
              title="Government organisations"
              text="Government organisations may have different assistance patterns under relevant programme components."
            />

            <SupportCard
              icon={Globe2}
              title="Regional provisions"
              text="Certain provisions can vary by region, including special patterns for eligible North-Eastern areas."
            />

          </div>


          <div className="mt-10 p-6 md:p-8 border border-gold/30 bg-gold/5">

            <div className="flex gap-4">

              <FileCheck2
                className="text-gold shrink-0 mt-0.5"
                size={21}
                strokeWidth={1.6}
              />

              <p className="text-sm leading-relaxed text-gray dark:text-muted">
                Subsidy percentages and eligible activities should always be
                checked against the latest applicable NBHM guidelines and
                implementing-agency requirements. They should not be treated
                as a universal subsidy rate for every beekeeper or project.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          RULES & GUIDELINES
      ===================================================== */}
      <section className="py-24 md:py-32 bg-cream-card dark:bg-black-soft border-y border-black/5 dark:border-white/5">

        <div className="max-w-7xl mx-auto px-6">

          <div className="max-w-3xl mb-14">

            <p className="text-xs uppercase tracking-[0.22em] text-gold">
              06 · Compliance
            </p>

            <h2 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
              Traceability must
              <br />
              <span className="text-gold">meet standards.</span>
            </h2>

            <p className="mt-6 text-base leading-relaxed text-gray dark:text-muted">
              Digital records are useful only when they operate alongside
              applicable food-safety, quality, labelling and export
              requirements.
            </p>

          </div>


          <div className="grid md:grid-cols-2 gap-5">

            <GuidelineCard
              icon={Scale}
              title="Food safety & standards"
              text="Honey sold in India is subject to applicable FSSAI food-safety standards and regulations covering honey and related products."
            />

            <GuidelineCard
              icon={ClipboardCheck}
              title="Labelling & display"
              text="Packaged food products must comply with applicable food labelling and display requirements, including the latest amendments."
            />

            <GuidelineCard
              icon={FlaskConical}
              title="Quality & authenticity"
              text="Honey quality assessment can involve parameters associated with authenticity and composition, including recognised analytical methods."
            />

            <GuidelineCard
              icon={Globe2}
              title="Export requirements"
              text="Exporters must comply with applicable DGFT, APEDA and destination-market requirements. Requirements can change over time."
            />

          </div>

        </div>
      </section>


      {/* =====================================================
          HONEY BUSINESS
      ===================================================== */}
      <section className="py-24 md:py-32">

        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-14 lg:gap-24">

            <div>

              <p className="text-xs uppercase tracking-[0.22em] text-gold">
                07 · Honey business
              </p>

              <h2 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
                From production
                <br />
                <span className="text-gold">to market.</span>
              </h2>

            </div>


            <div>

              <p className="text-base leading-relaxed text-gray dark:text-muted max-w-2xl">
                Honey production involves more than harvesting. Collection,
                testing, processing, storage, packaging, branding, marketing,
                value addition and market access all influence the final
                product and its value.
              </p>


              <div className="grid sm:grid-cols-2 gap-px bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 mt-10">

                <BusinessCard
                  icon={Sprout}
                  title="Production"
                  text="Bee colonies, forage availability, hive management and harvesting form the foundation."
                />

                <BusinessCard
                  icon={FlaskConical}
                  title="Quality"
                  text="Testing and appropriate processing help maintain product quality and consumer confidence."
                />

                <BusinessCard
                  icon={PackageCheckIcon}
                  title="Value addition"
                  text="Processing, packaging, branding and product differentiation can increase market value."
                />

                <BusinessCard
                  icon={Truck}
                  title="Market access"
                  text="Efficient supply chains and reliable product information can help connect producers with markets."
                />

              </div>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          EXISTING ECOSYSTEM
      ===================================================== */}
      <section className="py-24 md:py-32 bg-cream-card dark:bg-black-soft border-y border-black/5 dark:border-white/5">

        <div className="max-w-7xl mx-auto px-6">

          <div className="max-w-3xl mb-14">

            <p className="text-xs uppercase tracking-[0.22em] text-gold">
              08 · Existing ecosystem
            </p>

            <h2 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
              HoneyChain does not
              <br />
              <span className="text-gold">start from zero.</span>
            </h2>

            <p className="mt-6 text-base leading-relaxed text-gray dark:text-muted">
              India already has important institutions, programmes and
              digital systems connected to beekeeping, honey quality and
              markets.
            </p>

          </div>


          <div className="grid md:grid-cols-2 gap-5">

            <ExistingCard
              icon={Database}
              title="Madhukranti Portal"
              text="A National Bee Board initiative supporting online registration and traceability of the source of honey and bee products."
            />

            <ExistingCard
              icon={Building2}
              title="National Bee Board"
              text="An important institutional body associated with the development and promotion of scientific beekeeping in India."
            />

            <ExistingCard
              icon={ShieldCheck}
              title="FSSAI"
              text="Provides food-safety standards and regulatory requirements relevant to honey and food labelling."
            />

            <ExistingCard
              icon={Globe2}
              title="APEDA"
              text="Supports agricultural and processed-food export promotion and provides information relevant to natural honey exports."
            />

          </div>

        </div>
      </section>


      {/* =====================================================
          VISION
      ===================================================== */}
      <section className="py-24 md:py-32">

        <div className="max-w-5xl mx-auto px-6 text-center">

          <p className="text-xs uppercase tracking-[0.22em] text-gold mb-6">
            09 · Vision
          </p>

          <h2 className="text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-[-0.04em] font-semibold">
            A trusted,
            <br />
            <span className="text-gold">intelligent honey ecosystem.</span>
          </h2>

          <p className="mt-8 max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-gray dark:text-muted">
            HoneyChain envisions a future where rural beekeepers have better
            digital intelligence, honey batches have connected traceability,
            and consumers have better access to product information.
          </p>

        </div>

      </section>


      {/* =====================================================
          MISSION
      ===================================================== */}
      <section className="py-24 md:py-32 bg-black text-cream">

        <div className="max-w-7xl mx-auto px-6">

          <div className="max-w-2xl mb-16">

            <p className="text-xs uppercase tracking-[0.22em] text-gold">
              10 · Mission
            </p>

            <h2 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight">
              Turning the vision
              <br />
              <span className="text-gold">into a connected system.</span>
            </h2>

          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10">

            <DarkMission
              number="01"
              title="Empower beekeepers"
              text="Provide accessible digital tools that can support rural beekeepers and organised producer groups."
            />

            <DarkMission
              number="02"
              title="Monitor smarter"
              text="Use IoT and AI to make hive and environmental information more useful for decision-making."
            />

            <DarkMission
              number="03"
              title="Build traceability"
              text="Create connected digital records that follow relevant information across the honey supply chain."
            />

            <DarkMission
              number="04"
              title="Improve transparency"
              text="Make appropriate product-origin information easier to access and understand."
            />

            <DarkMission
              number="05"
              title="Support quality"
              text="Complement existing quality, testing, processing and regulatory ecosystems with digital information."
            />

            <DarkMission
              number="06"
              title="Connect the ecosystem"
              text="Bring producers, groups, processors, institutions and consumers closer through shared information."
            />

          </div>

        </div>
      </section>


      {/* =====================================================
          IMPORTANT NOTE
      ===================================================== */}
      <section className="py-20">

        <div className="max-w-4xl mx-auto px-6">

          <div className="border border-black/10 dark:border-white/10 p-7 md:p-9">

            <div className="flex gap-4">

              <BookOpen
                size={20}
                className="text-gold shrink-0 mt-1"
                strokeWidth={1.5}
              />

              <div>

                <h3 className="font-semibold text-black dark:text-cream">
                  About the information on this page
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-gray dark:text-muted">
                  Government schemes, subsidies, standards, export policies
                  and regulatory requirements can change. The information
                  presented here is intended as a high-level overview for the
                  HoneyChain concept and should not be treated as legal,
                  financial or regulatory advice. Users should verify current
                  requirements with the relevant government authority before
                  applying a scheme, selling products or exporting honey.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          END STRIP
      ===================================================== */}
      <section className="border-t border-black/5 dark:border-white/5">

        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">

          <p className="text-xs text-gray dark:text-muted">
            HoneyChain · SIH26021
          </p>

          <a
            href="#"
            className="group inline-flex items-center gap-2 text-xs text-gray dark:text-muted hover:text-gold transition-colors"
          >
            Explore HoneyChain
            <ArrowUpRight
              size={13}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </a>

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   REUSABLE COMPONENTS
   ========================================================= */

function TechnologyCard({ icon: Icon, number, title, text }) {
  return (
    <div className="bg-cream-card dark:bg-black-soft p-7 md:p-8 min-h-[260px]">

      <div className="flex items-center justify-between">

        <Icon
          size={24}
          className="text-gold"
          strokeWidth={1.5}
        />

        <span className="text-xs text-gray dark:text-muted">
          {number}
        </span>

      </div>

      <h3 className="mt-14 text-xl font-semibold text-black dark:text-cream">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-gray dark:text-muted">
        {text}
      </p>

    </div>
  );
}


function TraceStep({ number, icon: Icon, title, text }) {
  return (
    <div className="bg-cream dark:bg-black p-6 md:p-7 flex gap-5">

      <div className="w-11 h-11 shrink-0 border border-gold/30 flex items-center justify-center text-gold">
        <Icon size={19} strokeWidth={1.5} />
      </div>

      <div className="flex-1">

        <div className="flex items-center gap-3">

          <span className="text-[10px] uppercase tracking-[0.16em] text-gold">
            {number}
          </span>

          <h3 className="font-semibold text-black dark:text-cream">
            {title}
          </h3>

        </div>

        <p className="mt-2 text-sm leading-relaxed text-gray dark:text-muted">
          {text}
        </p>

      </div>

    </div>
  );
}


function MissionBlock({ number, title, text }) {
  return (
    <div className="bg-cream-card dark:bg-black-soft p-7 md:p-8">

      <span className="text-xs text-gold">
        MINI MISSION {number}
      </span>

      <h3 className="mt-8 text-xl font-semibold text-black dark:text-cream">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-gray dark:text-muted">
        {text}
      </p>

    </div>
  );
}


function SupportCard({ icon: Icon, title, text }) {
  return (
    <div className="border border-black/10 dark:border-white/10 p-7">

      <Icon
        size={23}
        className="text-gold"
        strokeWidth={1.5}
      />

      <h3 className="mt-8 font-semibold text-black dark:text-cream">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-gray dark:text-muted">
        {text}
      </p>

    </div>
  );
}


function GuidelineCard({ icon: Icon, title, text }) {
  return (
    <div className="border border-black/10 dark:border-white/10 p-7 md:p-8">

      <div className="flex items-center gap-4">

        <div className="w-11 h-11 border border-gold/30 flex items-center justify-center text-gold">
          <Icon size={19} strokeWidth={1.5} />
        </div>

        <h3 className="font-semibold text-black dark:text-cream">
          {title}
        </h3>

      </div>

      <p className="mt-5 text-sm leading-relaxed text-gray dark:text-muted">
        {text}
      </p>

    </div>
  );
}


function BusinessCard({ icon: Icon, title, text }) {
  return (
    <div className="bg-cream dark:bg-black p-7">

      <Icon
        size={21}
        className="text-gold"
        strokeWidth={1.5}
      />

      <h3 className="mt-7 font-semibold text-black dark:text-cream">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-gray dark:text-muted">
        {text}
      </p>

    </div>
  );
}


function ExistingCard({ icon: Icon, title, text }) {
  return (
    <div className="border border-black/10 dark:border-white/10 p-7 md:p-8">

      <div className="flex items-center justify-between">

        <div className="w-11 h-11 border border-gold/30 flex items-center justify-center text-gold">
          <Icon size={19} strokeWidth={1.5} />
        </div>

        <ArrowUpRight
          size={17}
          className="text-gray dark:text-muted"
        />

      </div>

      <h3 className="mt-8 text-xl font-semibold text-black dark:text-cream">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-gray dark:text-muted">
        {text}
      </p>

    </div>
  );
}


function DarkMission({ number, title, text }) {
  return (
    <div className="bg-black p-7 md:p-8 min-h-[220px]">

      <span className="text-xs text-gold">
        {number}
      </span>

      <h3 className="mt-10 text-xl font-semibold text-cream">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-relaxed text-muted">
        {text}
      </p>

    </div>
  );
}


/* Keeps the JSX readable while using the same package icon */
function PackageCheckIcon(props) {
  return <CheckCircle2 {...props} />;
}