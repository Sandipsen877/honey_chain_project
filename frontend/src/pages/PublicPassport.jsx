import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  LoaderCircle,
  Home,
} from 'lucide-react';

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ||
  'http://localhost:5000';

function formatLabel(key) {
  if (!key) return '';
  return String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatValue(value, key = '') {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (Array.isArray(value)) {
    if (!value.length) return '—';
    return value
      .map((item) =>
        typeof item === 'object' && item !== null
          ? Object.entries(item)
              .map(
                ([k, v]) =>
                  `${formatLabel(k)}: ${formatValue(v, k)}`,
              )
              .join(', ')
          : String(item),
      )
      .join(' · ');
  }

  if (typeof value === 'object') {
    return null;
  }

  if (
    typeof value === 'string' &&
    (key.toLowerCase().includes('date') ||
      key.toLowerCase().includes('time'))
  ) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  return String(value);
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function DataField({ label, value }) {
  return (
    <div className="border border-black/10 dark:border-white/10 p-4 bg-cream dark:bg-black">
      <p className="text-[10px] uppercase tracking-[0.16em] text-gray dark:text-muted">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold break-words text-black dark:text-cream">
        {value}
      </p>
    </div>
  );
}

function JsonSection({ title, data }) {
  if (!isObject(data)) return null;

  const entries = Object.entries(data).filter(
    ([, v]) => v !== null && v !== undefined && v !== '',
  );

  if (!entries.length) return null;

  const flat = entries.filter(
    ([, v]) => !isObject(v) && !Array.isArray(v),
  );
  const nested = entries.filter(
    ([, v]) => isObject(v) || Array.isArray(v),
  );

  return (
    <section className="mb-8">
      {title && (
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.12em] text-gold">
          {title}
        </h2>
      )}

      {flat.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {flat.map(([key, value]) => (
            <DataField
              key={key}
              label={formatLabel(key)}
              value={formatValue(value, key)}
            />
          ))}
        </div>
      )}

      {nested.map(([key, value]) => {
        if (Array.isArray(value)) {
          return (
            <div key={key} className="mt-5">
              <h3 className="text-xs uppercase tracking-[0.16em] text-gold font-semibold mb-3">
                {formatLabel(key)}
              </h3>
              <div className="space-y-3">
                {value.map((item, index) => (
                  <div
                    key={`${key}-${index}`}
                    className="border border-black/10 dark:border-white/10 p-4"
                  >
                    {isObject(item) ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(item).map(([k, v]) => (
                          <DataField
                            key={k}
                            label={formatLabel(k)}
                            value={formatValue(v, k)}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm font-medium">
                        {formatValue(item, key)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        }

        return (
          <div key={key} className="mt-5">
            <JsonSection title={formatLabel(key)} data={value} />
          </div>
        );
      })}
    </section>
  );
}

export default function PublicPassport() {
  const { batchId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!batchId) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API_BASE}/api/qr/scan/${batchId}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || `Failed (${res.status})`);
        }
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not load passport');
          setData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [batchId]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-cream dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="animate-spin text-gold" size={32} />
          <p className="text-sm text-gray dark:text-muted">
            Loading digital passport…
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-cream dark:bg-black text-black dark:text-cream px-5 py-12">
        <div className="max-w-lg mx-auto border border-red-500/30 bg-red-500/5 p-8 text-center">
          <XCircle size={40} className="mx-auto text-red-500" />
          <h1 className="mt-4 text-xl font-semibold">Passport not found</h1>
          <p className="mt-2 text-sm text-gray dark:text-muted">
            {error || 'This batch passport could not be loaded.'}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 text-sm text-gold underline"
          >
            <Home size={16} />
            Back to HoneyChain
          </Link>
        </div>
      </div>
    );
  }

  const overall =
    data.labReport?.overallResult ?? data.overallResult ?? null;

  const passed =
    String(overall || '')
      .trim()
      .toUpperCase() === 'PASS';

  return (
    <div className="min-h-[calc(100vh-72px)] bg-cream dark:bg-black text-black dark:text-cream">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 py-10 sm:py-14">
        <div className="text-center mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold">
            HoneyChain · Public Passport
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
            Digital <span className="text-gold">Honey Passport</span>
          </h1>
        </div>

        {overall != null && (
          <div
            className={`border p-5 mb-8 flex items-start gap-3 ${
              passed
                ? 'border-green-600/30 bg-green-600/5'
                : 'border-orange-500/30 bg-orange-500/5'
            }`}
          >
            {passed ? (
              <CheckCircle2 size={22} className="text-green-600 shrink-0" />
            ) : (
              <ShieldCheck size={22} className="text-orange-500 shrink-0" />
            )}
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-gold">
                Overall result
              </p>
              <p className="mt-1 text-lg font-semibold">{String(overall)}</p>
            </div>
          </div>
        )}

        <JsonSection title="Passport data" data={data} />

        <div className="pt-6 border-t border-black/10 dark:border-white/10 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs text-gold underline"
          >
            <Home size={14} />
            Visit HoneyChain
          </Link>
        </div>
      </div>
    </div>
  );
}