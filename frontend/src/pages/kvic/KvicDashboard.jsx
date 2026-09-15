import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getStoredKvicAdmin,
  isKvicAuthenticated,
  logoutKvicAdmin,
} from '../../services/kvicAuthService';

const KvicDashboard = () => {
  const navigate = useNavigate();

  const admin = getStoredKvicAdmin();

  useEffect(() => {
    if (!isKvicAuthenticated()) {
      navigate('/kvic/login', {
        replace: true,
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    logoutKvicAdmin();

    navigate('/kvic/login', {
      replace: true,
    });
  };

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAF9]">

      {/* Header */}
      <header className="border-b border-white/10 bg-black/30">

        <div className="flex items-center justify-between px-6 py-4">

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]">
              HoneyChain
            </p>

            <h1 className="mt-1 text-xl font-bold">
              KVIC Admin Portal
            </h1>
          </div>


          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">
                {admin.name}
              </p>

              <p className="text-xs text-white/40">
                {admin.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:border-red-500/40 hover:text-red-400"
            >
              Logout
            </button>

          </div>

        </div>

      </header>


      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-10">

          <p className="text-sm text-[#D4AF37]">
            Administration
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Welcome, {admin.name}
          </h2>

          <p className="mt-2 max-w-2xl text-white/50">
            Manage beekeeping farms, honey batches and
            laboratory verification through the HoneyChain
            KVIC administration portal.
          </p>

        </div>


        {/* Initial Stats */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-white/40">
              Farms
            </p>

            <p className="mt-3 text-3xl font-bold">
              —
            </p>

            <p className="mt-2 text-xs text-white/30">
              Loading from backend
            </p>
          </div>


          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-white/40">
              Hives
            </p>

            <p className="mt-3 text-3xl font-bold">
              —
            </p>

            <p className="mt-2 text-xs text-white/30">
              Loading from backend
            </p>
          </div>


          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-white/40">
              Batches
            </p>

            <p className="mt-3 text-3xl font-bold">
              —
            </p>

            <p className="mt-2 text-xs text-white/30">
              Loading from backend
            </p>
          </div>


          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-white/40">
              Lab Reports
            </p>

            <p className="mt-3 text-3xl font-bold">
              —
            </p>

            <p className="mt-2 text-xs text-white/30">
              Loading from backend
            </p>
          </div>

        </div>


        {/* Status */}
        <div className="mt-8 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-6">

          <h3 className="font-semibold">
            KVIC authentication active
          </h3>

          <p className="mt-2 text-sm text-white/50">
            You are authenticated as a KVIC administrator.
            Backend data integration will be added next.
          </p>

        </div>

      </main>

    </div>
  );
};

export default KvicDashboard;