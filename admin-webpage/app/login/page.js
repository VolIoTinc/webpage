"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { AuthProvider, useAuth } from "@/lib/auth";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupCode, setSetupCode] = useState("");
  const { signIn, completeNewPassword, confirmMFA, verifyMFASetup, user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  if (authLoading || user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const result = await signIn(username, password);

      if (result.challengeName === "NEW_PASSWORD_REQUIRED") {
        setChallenge(result);
        setLoading(false);
        return;
      }

      if (result.challengeName === "SOFTWARE_TOKEN_MFA") {
        setChallenge(result);
        setLoading(false);
        return;
      }

      if (result.challengeName === "MFA_SETUP") {
        setChallenge(result);
        setLoading(false);
        return;
      }

      router.replace("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Sign in failed");
    }
    setLoading(false);
  };

  const handleMFASetup = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const result = await verifyMFASetup(challenge.cognitoUser, setupCode);

      if (result.challengeName === "SOFTWARE_TOKEN_MFA") {
        setChallenge(result);
        setMfaCode("");
        setLoading(false);
        return;
      }

      router.replace("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Invalid code");
    }
    setLoading(false);
  };

  const handleNewPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const result = await completeNewPassword(challenge.cognitoUser, newPassword);

      if (result.challengeName === "SOFTWARE_TOKEN_MFA") {
        setChallenge(result);
        setLoading(false);
        return;
      }

      if (result.challengeName === "MFA_SETUP") {
        setChallenge(result);
        setLoading(false);
        return;
      }

      router.replace("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Failed to set new password");
    }
    setLoading(false);
  };

  const handleMFA = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await confirmMFA(challenge.cognitoUser, mfaCode);
      router.replace("/dashboard");
    } catch (err) {
      setErrorMsg(err.message || "Invalid MFA code");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-heading font-bold text-brand-purple">
            Admin Portal
          </h1>
          <p className="text-gray-500 text-sm mt-1">Store Admin</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
              {errorMsg}
            </div>
          )}

          {challenge?.challengeName === "MFA_SETUP" ? (
            <form onSubmit={handleMFASetup}>
              <p className="text-sm text-gray-600 mb-3">
                Scan this QR code with your authenticator app:
              </p>
              <div className="flex justify-center mb-4">
                <QRCodeSVG
                  value={`otpauth://totp/StoreAdmin:${username}?secret=${challenge.secretCode}&issuer=StoreAdmin`}
                  size={180}
                />
              </div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter code from app"
                value={setupCode}
                onChange={(e) => setSetupCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-purple"
                maxLength={6}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-purple text-white py-2 rounded font-medium hover:bg-brand-purple-dark disabled:opacity-50 transition-colors"
              >
                {loading ? "Verifying..." : "Verify & Enable MFA"}
              </button>
            </form>
          ) : challenge?.challengeName === "SOFTWARE_TOKEN_MFA" ? (
            <form onSubmit={handleMFA}>
              <p className="text-sm text-gray-600 mb-4">
                Enter the code from your authenticator app.
              </p>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="MFA Code"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-purple"
                maxLength={6}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-purple text-white py-2 rounded font-medium hover:bg-brand-purple-dark disabled:opacity-50 transition-colors"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </form>
          ) : challenge?.challengeName === "NEW_PASSWORD_REQUIRED" ? (
            <form onSubmit={handleNewPassword}>
              <p className="text-sm text-gray-600 mb-4">
                You must set a new password before continuing.
              </p>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-purple text-white py-2 rounded font-medium hover:bg-brand-purple-dark disabled:opacity-50 transition-colors"
              >
                {loading ? "Setting Password..." : "Set Password"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                autoComplete="username"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-brand-purple"
                autoComplete="current-password"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-purple text-white py-2 rounded font-medium hover:bg-brand-purple-dark disabled:opacity-50 transition-colors"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginForm />
    </AuthProvider>
  );
}
