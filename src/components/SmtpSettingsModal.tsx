import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, RefreshCw, KeyRound, Mail, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { SmtpConfig } from '../types/campaign';

interface SmtpSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  smtpConfig: SmtpConfig;
  setSmtpConfig: React.Dispatch<React.SetStateAction<SmtpConfig>>;
}

export const SmtpSettingsModal: React.FC<SmtpSettingsModalProps> = ({
  isOpen,
  onClose,
  smtpConfig,
  setSmtpConfig,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: smtpConfig.user,
          pass: smtpConfig.pass,
        }),
      });
      const data = await res.json();
      setTestResult({
        success: data.success,
        message: data.message || (data.success ? 'SMTP Connection Verified!' : 'Authentication Failed'),
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to reach server test endpoint',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Gmail SMTP Dispatch Configuration</h3>
            <p className="text-xs text-slate-500">Pre-configured with your secure Google App credentials</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-800 block mb-1">
              Gmail Account Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={smtpConfig.user}
                onChange={(e) => setSmtpConfig(prev => ({ ...prev, user: e.target.value }))}
                placeholder="newaronp@gmail.com"
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-800 block mb-1">
              Google App Password (16 Characters)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={smtpConfig.pass}
                onChange={(e) => setSmtpConfig(prev => ({ ...prev, pass: e.target.value }))}
                placeholder="xccu ltbx vwty rfip"
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-10 py-2 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Configured: <span className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded-sm">xccu ltbx vwty rfip</span> (spaces automatically cleaned during dispatch).
            </p>
          </div>

          {/* Test Connection Button & Result */}
          <div className="pt-2">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                  <span>Authenticating with Gmail SMTP Server...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verify Gmail SMTP Connection</span>
                </>
              )}
            </button>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              )}
              <div className="font-sans leading-relaxed">{testResult.message}</div>
            </div>
          )}

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="text-slate-900 font-semibold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Security & Delivery Invariant:</span>
            </div>
            <div>
              Emails are dispatched directly via Google’s TLS SMTP server (<span className="font-mono text-slate-800">smtp.gmail.com:465</span>). No third-party relays.
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer shadow-xs"
          >
            Save & Return to Studio
          </button>
        </div>
      </div>
    </div>
  );
};
