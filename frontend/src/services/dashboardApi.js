const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000';


/* ============================================================
   API REQUEST HELPER
   ============================================================ */

export async function apiRequest(
  endpoint,
  options = {},
) {
  const token =
    localStorage.getItem(
      'honeychain_token',
    );

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,

      headers: {
        'Content-Type':
          'application/json',

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...(options.headers || {}),
      },
    },
  );


  /* ----------------------------------------------------------
     READ RESPONSE
     ---------------------------------------------------------- */

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }


  /* ----------------------------------------------------------
     HANDLE ERROR
     ---------------------------------------------------------- */

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        `Request failed with status ${response.status}`,
    );
  }


  /* ----------------------------------------------------------
     RETURN DATA
     ---------------------------------------------------------- */

  return data;
}


/* ============================================================
   GET ID
   ============================================================ */

export function getId(item) {
  return (
    item?._id ||
    item?.id
  );
}


/* ============================================================
   FORMAT DATE
   ============================================================ */

export function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  );
}


/* ============================================================
   GET ERROR MESSAGE
   ============================================================ */

export function getErrorMessage(
  error,
) {
  return (
    error?.message ||
    'Something went wrong.'
  );
}