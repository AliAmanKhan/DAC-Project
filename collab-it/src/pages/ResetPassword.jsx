import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Zap, Check, Eye, EyeOff } from "lucide-react";
import { authService } from "../services/authService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Password strength indicator
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  useEffect(() => {
    setPasswordStrength({
      hasMinLength: newPassword.length >= 6,
      hasNumber: /\d/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    });
  }, [newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword(token, newPassword);
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      const msg = err?.message || "Failed to reset password. The link may have expired.";
      setError(msg);
      console.error("Reset password error:", err);
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
              <Check className="w-8 h-8 text-green-500" />
            </div>

            <h1 className="text-2xl font-bold mb-2">Password Reset Successful!</h1>
            <p className="text-muted-foreground mb-6">
              Your password has been reset successfully. You can now login with your new password.
            </p>

            <p className="text-sm text-muted-foreground mb-4">
              Redirecting to login page...
            </p>

            <Link to="/login" className="inline-block w-full btn-primary">
              Go to Login
            </Link>
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
          <h1 className="text-3xl font-bold mb-2">Reset Your Password</h1>
          <p className="text-muted-foreground mb-8">
            Enter your new password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2 pr-10 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password strength indicator */}
              {newPassword && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-muted-foreground">Password strength:</p>
                  <div className="space-y-1">
                    <div className={`flex items-center gap-2 text-xs ${passwordStrength.hasMinLength ? 'text-green-500' : 'text-muted-foreground'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength.hasMinLength ? 'bg-green-500' : 'bg-slate-600'}`} />
                      At least 6 characters
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordStrength.hasNumber ? 'text-green-500' : 'text-muted-foreground'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength.hasNumber ? 'bg-green-500' : 'bg-slate-600'}`} />
                      Contains a number (recommended)
                    </div>
                    <div className={`flex items-center gap-2 text-xs ${passwordStrength.hasSpecialChar ? 'text-green-500' : 'text-muted-foreground'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength.hasSpecialChar ? 'bg-green-500' : 'bg-slate-600'}`} />
                      Contains a special character (recommended)
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2 pr-10 rounded-lg bg-input border border-border focus:ring-2 focus:ring-primary outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full btn-primary disabled:opacity-50"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
                {error.includes("expired") && (
                  <Link to="/forgot-password" className="text-primary text-sm hover:underline block mt-2">
                    Request a new reset link
                  </Link>
                )}
              </div>
            )}
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
