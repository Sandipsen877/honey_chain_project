import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Hexagon,
  User,
  Mail,
  Lock,
  ArrowUpRight,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { registerUser } from '../services/authService';

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name) {
      return 'Full name is required.';
    }

    if (name.length < 2) {
      return 'Please enter a valid name.';
    }

    if (!email) {
      return 'Email is required.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address.';
    }

    if (!password) {
      return 'Password is required.';
    }

    if (password.length < 8) {
      return 'Password must contain at least 8 characters.';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      /*
       * Example backend response:
       *
       * {
       *   success: true,
       *   message: "Account created successfully",
       *   token: "...",
       *   user: {
       *     id: "...",
       *     name: "...",
       *     email: "..."
       *   }
       * }
       */

      console.log('Registration successful:', response);

      // Temporary navigation target.
      // Change according to your backend/authentication flow.
      navigate('/login');
    } catch (err) {
      setError(
        err?.message ||
          'Unable to create your account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-72px)] flex items-center overflow-hidden bg-cream dark:bg-black">
      {/* Background decoration */}
      <div className="absolute -right-32 -top-32 w-[520px] h-[520px] border border-gold/10 rotate-30 pointer-events-none" />

      <div className="absolute -left-40 -bottom-40 w-[500px] h-[500px] border border-gold/5 rotate-30 pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-16">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left */}
          <div className="hidden lg:block">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-gold mb-8">
              <span className="w-8 h-px bg-gold" />
              HoneyChain
            </div>

            <h1 className="text-6xl xl:text-7xl font-semibold tracking-[-0.05em] leading-[0.9] text-black dark:text-cream">
              Start your
              <br />
              <span className="text-gold">journey.</span>
            </h1>

            <p className="mt-8 max-w-md text-base leading-relaxed text-gray dark:text-muted">
              Create your HoneyChain account and become part of a more
              connected and transparent honey ecosystem.
            </p>

            <div className="mt-14 flex items-start gap-4">
              <div className="w-11 h-11 border border-gold/30 flex items-center justify-center text-gold shrink-0">
                <ShieldCheck size={20} strokeWidth={1.5} />
              </div>

              <div>
                <p className="text-sm font-medium text-black dark:text-cream">
                  Built around trust
                </p>

                <p className="mt-1 text-xs leading-relaxed text-gray dark:text-muted max-w-xs">
                  Connect hive intelligence, honey traceability and consumer
                  verification through one ecosystem.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="w-full max-w-md mx-auto lg:ml-auto">
            {/* Mobile heading */}
            <div className="lg:hidden mb-10">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-gold mb-6">
                <span className="w-7 h-px bg-gold" />
                HoneyChain
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-black dark:text-cream">
                Start your <span className="text-gold">journey.</span>
              </h1>
            </div>

            <div className="mb-8">
              <div className="w-12 h-12 bg-gold flex items-center justify-center text-black mb-6">
                <Hexagon size={25} strokeWidth={1.7} />
              </div>

              <h2 className="text-2xl font-semibold tracking-tight text-black dark:text-cream">
                Create account
              </h2>

              <p className="mt-2 text-sm text-gray dark:text-muted">
                Register for your Honey Chain account
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="border border-black/10 dark:border-white/10 bg-cream-card dark:bg-black-card"
            >
              <div className="p-7 md:p-8 space-y-5">
                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-600 dark:text-red-400"
                  >
                    {error}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label
                    htmlFor="register-name"
                    className="block text-xs uppercase tracking-[0.12em] font-medium text-gray dark:text-muted mb-3"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={17}
                      strokeWidth={1.5}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray dark:text-muted"
                    />

                    <input
                      id="register-name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      autoComplete="name"
                      disabled={loading}
                      className="w-full pl-11 pr-4 py-3.5 bg-cream dark:bg-black-soft border border-black/10 dark:border-white/10 text-black dark:text-cream placeholder:text-gray/60 dark:placeholder:text-muted/60 text-sm focus:outline-none focus:border-gold disabled:opacity-60 transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="register-email"
                    className="block text-xs uppercase tracking-[0.12em] font-medium text-gray dark:text-muted mb-3"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      strokeWidth={1.5}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray dark:text-muted"
                    />

                    <input
                      id="register-email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      disabled={loading}
                      className="w-full pl-11 pr-4 py-3.5 bg-cream dark:bg-black-soft border border-black/10 dark:border-white/10 text-black dark:text-cream placeholder:text-gray/60 dark:placeholder:text-muted/60 text-sm focus:outline-none focus:border-gold disabled:opacity-60 transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="register-password"
                    className="block text-xs uppercase tracking-[0.12em] font-medium text-gray dark:text-muted mb-3"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={17}
                      strokeWidth={1.5}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray dark:text-muted"
                    />

                    <input
                      id="register-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      disabled={loading}
                      className="w-full pl-11 pr-12 py-3.5 bg-cream dark:bg-black-soft border border-black/10 dark:border-white/10 text-black dark:text-cream placeholder:text-gray/60 dark:placeholder:text-muted/60 text-sm focus:outline-none focus:border-gold disabled:opacity-60 transition-colors duration-300"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={loading}
                      aria-label={
                        showPassword ? 'Hide password' : 'Show password'
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray dark:text-muted hover:text-gold transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    htmlFor="register-confirm-password"
                    className="block text-xs uppercase tracking-[0.12em] font-medium text-gray dark:text-muted mb-3"
                  >
                    Confirm Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={17}
                      strokeWidth={1.5}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray dark:text-muted"
                    />

                    <input
                      id="register-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      disabled={loading}
                      className="w-full pl-11 pr-12 py-3.5 bg-cream dark:bg-black-soft border border-black/10 dark:border-white/10 text-black dark:text-cream placeholder:text-gray/60 dark:placeholder:text-muted/60 text-sm focus:outline-none focus:border-gold disabled:opacity-60 transition-colors duration-300"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword((prev) => !prev)
                      }
                      disabled={loading}
                      aria-label={
                        showConfirmPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray dark:text-muted hover:text-gold transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center gap-2 py-3.5 bg-black dark:bg-cream text-cream dark:text-black text-sm font-semibold hover:bg-gold hover:text-black disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowUpRight
                        size={15}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                      />
                    </>
                  )}
                </button>
              </div>

              {/* Login */}
              <div className="border-t border-black/10 dark:border-white/10 px-7 md:px-8 py-5">
                <p className="text-center text-sm text-gray dark:text-muted">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-gold font-medium hover:underline underline-offset-4"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>

            <p className="mt-6 text-center text-[11px] uppercase tracking-[0.14em] text-gray/60 dark:text-muted/60">
              Honey Chain · SIH26021
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}