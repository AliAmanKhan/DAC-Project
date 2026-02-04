import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Zap, ArrowLeft, Mail } from "lucide-react";
import { authService } from "../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      const msg = err?.message || "Failed to send reset email. Please try again.";
      setError(msg);
      console.error("Forgot password error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Zap className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">collabit</span>
          </div>

          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-500" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
            <p className="text-muted-foreground mb-6">
              If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
            </p>

            <p className="text-sm text-muted-foreground mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="w-full btn-secondary"
              >
                Try Different Email
              </button>

              <Link to="/login" className="block w-full btn-primary">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Zap className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold gradient-text">collabit</span>
        </div>

        <div className="bg-card border border-border rounded-lg p-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
          <p className="text-muted-foreground mb-8">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                placeholder="your@email.com"
                className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            {error && (
              <p role="alert" aria-live="assertive" className="text-red-400 text-sm">
                {error}
              </p>
            )}
          </form>

          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> The reset link will expire in 1 hour for security reasons.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
