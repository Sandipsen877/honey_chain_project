import { ArrowLeft, X } from 'lucide-react';


/* ============================================================
   SIDEBAR BUTTON
   ============================================================ */

export function SidebarButton({
  active,
  icon: Icon,
  label,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 text-left text-sm border ${
        active
          ? 'bg-black text-cream dark:bg-cream dark:text-black border-black dark:border-cream'
          : 'border-transparent hover:border-black/10 dark:hover:border-white/10'
      }`}
    >
      <Icon
        size={17}
        className={
          active ? 'text-gold' : ''
        }
      />

      <span>{label}</span>
    </button>
  );
}


/* ============================================================
   PAGE HEADER
   ============================================================ */

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-5">

      <div>

        <p className="text-[10px] uppercase tracking-[0.25em] text-gold font-semibold">
          {eyebrow}
        </p>

        <h1 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
          {title}
        </h1>

        {description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray dark:text-muted">
            {description}
          </p>
        )}

      </div>

      {action}

    </div>
  );
}


/* ============================================================
   STAT CARD
   ============================================================ */

export function StatCard({
  label,
  value,
  icon: Icon,
  danger = false,
}) {
  return (
    <div className="bg-cream-card dark:bg-black-card p-5">

      <div className="flex items-center justify-between">

        <p className="text-[10px] uppercase tracking-[0.15em] text-gray dark:text-muted">
          {label}
        </p>

        {Icon && (
          <Icon
            size={18}
            className={
              danger
                ? 'text-red-500'
                : 'text-gold'
            }
          />
        )}

      </div>

      <p
        className={`mt-4 text-2xl font-semibold ${
          danger
            ? 'text-red-500'
            : ''
        }`}
      >
        {value}
      </p>

    </div>
  );
}


/* ============================================================
   RISK BADGE
   ============================================================ */

export function RiskBadge({
  risk,
  large = false,
}) {
  const raw =
    risk?.risk ??
    risk?.level ??
    risk?.status ??
    risk;

  const value =
    raw === null ||
    raw === undefined
      ? 'Unknown'
      : String(raw);

  const normalized =
    value.toLowerCase();

  let className =
    'border-gray-400/30 text-gray-500';

  if (
    normalized.includes('high') ||
    normalized.includes('severe')
  ) {
    className =
      'border-red-500/30 text-red-500';
  } else if (
    normalized.includes('medium') ||
    normalized.includes('moderate')
  ) {
    className =
      'border-amber-500/30 text-amber-600';
  } else if (
    normalized.includes('low') ||
    normalized.includes('safe')
  ) {
    className =
      'border-green-600/30 text-green-600';
  }

  return (
    <span
      className={`inline-flex items-center border ${
        large
          ? 'text-sm px-3 py-2'
          : 'text-[10px] px-2 py-1'
      } ${className}`}
    >
      {value}
    </span>
  );
}


/* ============================================================
   DETAIL OVERLAY
   ============================================================ */

export function DetailOverlay({
  eyebrow,
  title,
  children,
  onClose,
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 p-4 sm:p-6 overflow-y-auto"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose();
        }
      }}
    >

      <div className="min-h-full flex items-start justify-center">

        <div className="w-full max-w-5xl bg-cream dark:bg-black border border-black/10 dark:border-white/10 shadow-2xl my-4 sm:my-8">


          {/* HEADER */}

          <div className="sticky top-0 z-10 bg-cream dark:bg-black border-b border-black/10 dark:border-white/10 p-5 flex items-center justify-between">

            <div className="flex items-center gap-4">

              <button
                onClick={onClose}
                className="w-9 h-9 border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black hover:text-cream dark:hover:bg-cream dark:hover:text-black transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft
                  size={17}
                />
              </button>


              <div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-gold">
                  {eyebrow}
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {title}
                </h2>

              </div>

            </div>


            <button
              onClick={onClose}
              className="w-9 h-9 border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black hover:text-cream dark:hover:bg-cream dark:hover:text-black transition-colors"
              aria-label="Close"
            >
              <X size={17} />
            </button>

          </div>


          {/* CONTENT */}

          <div className="p-5 sm:p-7">
            {children}
          </div>

        </div>

      </div>

    </div>
  );
}


/* ============================================================
   DETAIL STAT
   ============================================================ */

export function DetailStat({
  label,
  value,
}) {
  return (
    <div className="bg-cream-card dark:bg-black-card p-5">

      <p className="text-[10px] uppercase tracking-[0.15em] text-gray dark:text-muted">
        {label}
      </p>

      <p className="mt-3 text-lg font-semibold break-words">
        {value || '—'}
      </p>

    </div>
  );
}


/* ============================================================
   INFO ITEM
   ============================================================ */

export function InfoItem({
  label,
  value,
}) {
  return (
    <div>

      <p className="text-[10px] uppercase tracking-[0.15em] text-gray dark:text-muted">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium break-words">
        {value || '—'}
      </p>

    </div>
  );
}


/* ============================================================
   FORM FIELD
   ============================================================ */

export function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}) {
  return (
    <div>

      <label className="text-xs font-medium">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm outline-none focus:border-gold"
      />

    </div>
  );
}


/* ============================================================
   TEXTAREA FIELD
   ============================================================ */

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
}) {
  return (
    <div>

      <label className="text-xs font-medium">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="mt-2 w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm outline-none focus:border-gold resize-y"
      />

    </div>
  );
}


/* ============================================================
   SELECT FIELD
   ============================================================ */

export function SelectField({
  label,
  value,
  onChange,
  options = [],
  required = false,
}) {
  return (
    <div>

      <label className="text-xs font-medium">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        required={required}
        className="mt-2 w-full border border-black/10 dark:border-white/10 bg-cream dark:bg-black px-3 py-3 text-sm outline-none focus:border-gold"
      >

        <option value="">
          Select {label}
        </option>

        {options.map(
          (option) => {
            const optionValue =
              typeof option ===
              'string'
                ? option
                : option.value;

            const optionLabel =
              typeof option ===
              'string'
                ? option
                : option.label;

            return (
              <option
                key={
                  optionValue
                }
                value={
                  optionValue
                }
              >
                {
                  optionLabel
                }
              </option>
            );
          },
        )}

      </select>

    </div>
  );
}


/* ============================================================
   EMPTY STATE
   ============================================================ */

export function EmptyState({
  icon: Icon,
  title,
  text,
  action,
}) {
  return (
    <div className="p-10 text-center">

      {Icon && (
        <Icon
          size={30}
          className="mx-auto text-gold"
        />
      )}

      <h3 className="mt-4 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray dark:text-muted max-w-md mx-auto">
        {text}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}

    </div>
  );
}


/* ============================================================
   PRIMARY BUTTON
   ============================================================ */

export function PrimaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  icon: Icon,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-black text-cream dark:bg-cream dark:text-black text-sm font-medium border border-black dark:border-cream hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
    >
      {Icon && (
        <Icon size={16} />
      )}

      {children}
    </button>
  );
}


/* ============================================================
   SECONDARY BUTTON
   ============================================================ */

export function SecondaryButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  icon: Icon,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2 px-4 py-3 border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card text-sm font-medium hover:border-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {Icon && (
        <Icon size={16} />
      )}

      {children}
    </button>
  );
}


/* ============================================================
   STATUS BADGE
   ============================================================ */

export function StatusBadge({
  status,
}) {
  const value =
    status || 'Unknown';

  const normalized =
    String(value)
      .toLowerCase();

  let className =
    'border-gray-400/30 text-gray-500';

  if (
    normalized === 'open' ||
    normalized === 'active'
  ) {
    className =
      'border-red-500/30 text-red-500';
  } else if (
    normalized ===
      'resolved' ||
    normalized === 'success' ||
    normalized === 'completed'
  ) {
    className =
      'border-green-600/30 text-green-600';
  } else if (
    normalized ===
      'pending' ||
    normalized === 'processing'
  ) {
    className =
      'border-amber-500/30 text-amber-600';
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-1 border text-[10px] uppercase tracking-wide ${className}`}
    >
      {value}
    </span>
  );
}


/* ============================================================
   SECTION CARD
   ============================================================ */

export function SectionCard({
  children,
  className = '',
}) {
  return (
    <div
      className={`bg-cream-card dark:bg-black-card border border-black/5 dark:border-white/10 ${className}`}
    >
      {children}
    </div>
  );
}


/* ============================================================
   LOADING BUTTON CONTENT
   ============================================================ */

export function LoadingContent({
  loading,
  children,
}) {
  if (!loading) {
    return children;
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      Processing...
    </span>
  );
}