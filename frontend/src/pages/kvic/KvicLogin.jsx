import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

import {
  loginKvicAdmin,
} from '../../services/kvicAuthService';

const KvicLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');

    if (!form.email || !form.password) {
      setError(
        'Email and password are required.'
      );
      return;
    }

    try {
      setLoading(true);

      await loginKvicAdmin(form);

      navigate('/kvic/dashboard', {
        replace: true,
      });
    } catch (err) {
      setError(
        err?.message ||
          'Unable to login as KVIC admin.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAFAF9] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/10">
            <ShieldCheck
              size={30}
              className="text-[#D4AF37]"
            />
          </div>

          <h1 className="text-3xl font-bold">
            KVIC Admin Portal
          </h1>

          <p className="mt-2 text-sm text-white/50">
            HoneyChain administration
          </p>

        </div>


        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37]/60"
              />
            </div>


            {/* Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Password
              </label>

              <div className="relative">

                <input
                  type={
                    showPassword
                      ? 'text'
                      : 'password'
                  }
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#D4AF37]/60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
            </div>


            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}


            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 font-semibold text-black transition hover:bg-[#e2c35b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? 'Signing in...'
                : 'Sign in as KVIC Admin'}

              {!loading && (
                <ArrowRight size={18} />
              )}
            </button>

          </form>


          {/* Registration */}
          <div className="mt-6 border-t border-white/10 pt-5 text-center">

            <p className="text-sm text-white/50">
              Need an admin account?
            </p>

            <Link
              to="/kvic/register"
              className="mt-1 inline-block text-sm font-semibold text-[#D4AF37] hover:underline"
            >
              Create KVIC Admin Account
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default KvicLogin;