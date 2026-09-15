import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';

import {
  registerKvicAdmin,
} from '../../services/kvicAuthService';

const KvicRegister = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    inviteCode: '',
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
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
    setSuccess('');

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword ||
      !form.inviteCode.trim()
    ) {
      setError(
        'Please fill in all required fields.'
      );
      return;
    }

    if (form.password.length < 6) {
      setError(
        'Password must be at least 6 characters.'
      );
      return;
    }

    if (
      form.password !== form.confirmPassword
    ) {
      setError(
        'Passwords do not match.'
      );
      return;
    }

    try {
      setLoading(true);

      await registerKvicAdmin({
        name: form.name,
        email: form.email,
        password: form.password,
        inviteCode: form.inviteCode,
      });

      setSuccess(
        'KVIC admin account created successfully.'
      );

      setForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        inviteCode: '',
      });

      setTimeout(() => {
        navigate('/kvic/login', {
          replace: true,
        });
      }, 1200);

    } catch (err) {
      setError(
        err?.message ||
          'Unable to create KVIC admin account.'
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
            KVIC Admin Registration
          </h1>

          <p className="mt-2 text-sm text-white/50">
            Create an authorized HoneyChain
            administration account
          </p>

        </div>


        {/* Registration Card */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl backdrop-blur-xl">

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="KVIC Administrator"
                autoComplete="name"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37]/60"
              />
            </div>


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
                  placeholder="Create a password"
                  autoComplete="new-password"
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


            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Confirm Password
              </label>

              <div className="relative">

                <input
                  type={
                    showConfirmPassword
                      ? 'text'
                      : 'password'
                  }
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 pr-12 text-sm outline-none transition focus:border-[#D4AF37]/60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
            </div>


            {/* Invite Code */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                KVIC Invite Code
              </label>

              <input
                type="text"
                name="inviteCode"
                value={form.inviteCode}
                onChange={handleChange}
                placeholder="Enter authorized invite code"
                autoComplete="off"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37]/60"
              />

              <p className="mt-2 text-xs text-white/40">
                An authorized KVIC invite code is
                required to create an admin account.
              </p>
            </div>


            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}


            {/* Success */}
            {success && (
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                {success}
              </div>
            )}


            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-3 font-semibold text-black transition hover:bg-[#e2c35b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? 'Creating account...'
                : 'Create KVIC Admin Account'}

              {!loading && (
                <ArrowRight size={18} />
              )}
            </button>

          </form>


          {/* Login */}
          <div className="mt-6 border-t border-white/10 pt-5 text-center">

            <p className="text-sm text-white/50">
              Already have a KVIC admin account?
            </p>

            <Link
              to="/kvic/login"
              className="mt-1 inline-block text-sm font-semibold text-[#D4AF37] hover:underline"
            >
              Sign in
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
};

export default KvicRegister;