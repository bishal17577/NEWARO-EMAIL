import React from 'react';
import { X, ShieldCheck, AlertTriangle, CheckCircle2, Wand2, MailCheck, Info, ArrowRight } from 'lucide-react';
import { analyzeDeliverability, autoOptimizeSpam } from '../utils/spamChecker';
import { CampaignData } from '../types/campaign';

interface DeliverabilityDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignData;
  setCampaign: React.Dispatch<React.SetStateAction<CampaignData>>;
}

export const DeliverabilityDoctorModal: React.FC<DeliverabilityDoctorModalProps> = ({
  isOpen,
  onClose,
  campaign,
  setCampaign,
}) => {
  if (!isOpen) return null;

  const report = analyzeDeliverability(campaign.subject, campaign.description);

  const handleAutoFix = () => {
    const optimizedSubject = autoOptimizeSpam(campaign.subject);
    setCampaign(prev => ({
      ...prev,
      subject: optimizedSubject,
    }));
  };

  const scoreColor =
    report.score >= 90
      ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
      : report.score >= 70
      ? 'text-amber-800 bg-amber-50 border-amber-300'
      : 'text-rose-700 bg-rose-50 border-rose-300';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Spam Doctor & Primary Inbox Optimizer</h2>
            <p className="text-xs text-slate-600">Diagnose spam triggers and ensure your emails land in Primary Inboxes instead of Spam.</p>
          </div>
        </div>

        {/* Score & Auto-Fix Banner */}
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${scoreColor}`}>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider">Inbox Deliverability Health</div>
            <div className="text-3xl font-extrabold font-mono mt-0.5">{report.score}/100</div>
            <div className="text-xs mt-1 font-medium">
              {report.score >= 90
                ? 'Excellent! Minimal spam triggers detected.'
                : report.score >= 70
                ? 'Moderate spam risk: Subject line contains trigger words or formatting.'
                : 'High spam risk: Subject line has ALL-CAPS or alarm emojis.'}
            </div>
          </div>

          {report.issues.length > 0 && (
            <button
              onClick={handleAutoFix}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Auto-Fix Spam Triggers</span>
            </button>
          )}
        </div>

        {/* Issues list */}
        {report.issues.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Detected Spam Triggers</h3>
            {report.issues.map((issue, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>{issue.message}</span>
                </div>
                <div className="text-slate-600 pl-5 text-[11px]">
                  <strong>Recommended fix:</strong> {issue.fix}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Built-in Anti-Spam Architecture Checklist */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <MailCheck className="w-4 h-4 text-emerald-600" />
            <span>Active Deliverability Safeguards in NEWARO</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Multipart Plain-Text MIME:</strong> Automatically creates clean text version alongside HTML.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>One-Click List-Unsubscribe Header:</strong> Satisfies Gmail & Yahoo 2024/2026 bulk sender policy.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>TLS 465 Direct SMTP:</strong> Authenticated directly with Google without relay proxy.</span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Throttled Pacing:</strong> 250ms chunk delay protects outbound IP reputation.</span>
            </div>
          </div>
        </div>

        {/* Real-World Fix Guide for Gmail */}
        <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-600" />
            <span>How to Train Gmail to Always Land in Primary Inbox</span>
          </h3>
          <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
              <span>
                <strong>Click "Report not spam" once in recipient inbox:</strong> Open the email in the Spam folder and click <em>"Report not spam"</em>. Google immediately white-lists <code className="bg-slate-100 px-1 py-0.5 rounded-xs text-slate-900 font-mono">newaronp@gmail.com</code> for that recipient!
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
              <span>
                <strong>Add sender to Google Contacts:</strong> When the recipient adds <code className="bg-slate-100 px-1 py-0.5 rounded-xs text-slate-900 font-mono">newaronp@gmail.com</code> to their contacts list, Google guarantees 100% Primary Inbox placement.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
              <span>
                <strong>Avoid Spam Filter Words in Subject:</strong> Never use all-caps like <code className="line-through text-rose-600">URGENT BOSS DIRECTIVE</code> or alarm emojis like 🚨. Use clean titles like <em>"Executive Notice: Priority Project Update"</em>.
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Done & Apply
          </button>
        </div>
      </div>
    </div>
  );
};
