import React, { useState, useRef } from 'react';
import { X, Send, AlertTriangle, CheckCircle2, XCircle, Download, RefreshCw, ShieldCheck, Pause, Play, Briefcase } from 'lucide-react';
import { CampaignData, SmtpConfig } from '../types/campaign';

interface BatchDispatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: CampaignData;
  recipients: string[];
  smtpConfig: SmtpConfig;
}

interface DispatchLog {
  email: string;
  success: boolean;
  message?: string;
  time: string;
}

export const BatchDispatcherModal: React.FC<BatchDispatcherModalProps> = ({
  isOpen,
  onClose,
  campaign,
  recipients,
  smtpConfig,
}) => {
  const isOffice = campaign.dispatchMode === 'office';
  const maxLimit = isOffice ? 30 : 400;

  const [activeTab, setActiveTab] = useState<'batch' | 'test'>('batch');
  const [singleRecipient, setSingleRecipient] = useState<string>('newaronp@gmail.com');
  const [singleStatus, setSingleStatus] = useState<{ loading: boolean; success?: boolean; msg?: string }>({ loading: false });

  // Batch states
  const [isSending, setIsSending] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPausedRef = useRef(false);
  const cancelRef = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [logs, setLogs] = useState<DispatchLog[]>([]);
  const [sentCount, setSentCount] = useState(0);
  const [failCount, setFailCount] = useState(0);

  if (!isOpen) return null;

  const validRecipients = recipients.filter(e => Boolean(e.trim())).slice(0, maxLimit);

  // Single test send
  const handleSingleSend = async () => {
    if (!singleRecipient) return;
    setSingleStatus({ loading: true });
    try {
      const res = await fetch('/api/send-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign,
          recipientEmail: singleRecipient.trim(),
          smtpUser: smtpConfig.user,
          smtpPass: smtpConfig.pass,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSingleStatus({
          loading: false,
          success: true,
          msg: `Success! Message delivered to ${singleRecipient}. Check inbox!`,
        });
      } else {
        setSingleStatus({
          loading: false,
          success: false,
          msg: data.error || 'Failed to dispatch email.',
        });
      }
    } catch (err: any) {
      setSingleStatus({
        loading: false,
        success: false,
        msg: err.message || 'Network error sending test.',
      });
    }
  };

  // Robust Chunk-based dispatch loop: sends in chunks of 3 emails
  const handleStartBatch = async () => {
    if (validRecipients.length === 0) return;

    setIsSending(true);
    setIsPaused(false);
    isPausedRef.current = false;
    cancelRef.current = false;

    setCurrentIndex(0);
    setLogs([]);
    setSentCount(0);
    setFailCount(0);

    let sent = 0;
    let failed = 0;
    const chunkSize = 3;

    for (let i = 0; i < validRecipients.length; i += chunkSize) {
      if (cancelRef.current) break;

      // Handle pause
      while (isPausedRef.current) {
        await new Promise(r => setTimeout(r, 200));
        if (cancelRef.current) break;
      }
      if (cancelRef.current) break;

      const chunk = validRecipients.slice(i, i + chunkSize);

      try {
        const res = await fetch('/api/send-chunk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaign,
            recipients: chunk,
            smtpUser: smtpConfig.user,
            smtpPass: smtpConfig.pass,
          }),
        });

        const data = await res.json();
        const timeNow = new Date().toLocaleTimeString();

        if (data.success && data.results) {
          for (const r of data.results) {
            if (r.success) sent++;
            else failed++;

            setLogs(prev => [
              ...prev,
              {
                email: r.email,
                success: r.success,
                message: r.error || (r.success ? 'Delivered via Gmail SMTP' : 'Rejected'),
                time: timeNow,
              },
            ]);
          }
        } else {
          for (const email of chunk) {
            failed++;
            setLogs(prev => [
              ...prev,
              {
                email,
                success: false,
                message: data.error || 'Chunk error',
                time: timeNow,
              },
            ]);
          }
        }
      } catch (err: any) {
        const timeNow = new Date().toLocaleTimeString();
        for (const email of chunk) {
          failed++;
          setLogs(prev => [
            ...prev,
            {
              email,
              success: false,
              message: err.message || 'Network error',
              time: timeNow,
            },
          ]);
        }
      }

      setSentCount(sent);
      setFailCount(failed);
      setCurrentIndex(Math.min(validRecipients.length, i + chunk.length));

      // 150ms gentle pause between chunks
      await new Promise(r => setTimeout(r, 150));
    }

    setIsSending(false);
  };

  const handleTogglePause = () => {
    isPausedRef.current = !isPausedRef.current;
    setIsPaused(isPausedRef.current);
  };

  const handleCancel = () => {
    cancelRef.current = true;
    setIsSending(false);
    setIsPaused(false);
  };

  const downloadReport = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      ['Recipient Email,Mode,Status,Details,Timestamp', ...logs.map(l => `"${l.email}","${isOffice ? 'OFFICE_WORKER' : 'CUSTOMER'}","${l.success ? 'SUCCESS' : 'FAILED'}","${l.message || ''}","${l.time}"`)].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `newaro_${isOffice ? 'office_worker' : 'customer'}_dispatch_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const progressPercentage = validRecipients.length > 0
    ? Math.round((currentIndex / validRecipients.length) * 100)
    : 0;

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
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${isOffice ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
              {isOffice ? '🏢 Office Package (Boss to Workers)' : '🚀 Customer Marketing Engine'}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-1">
            <Send className="w-5 h-5 text-amber-600" />
            <span>
              {isOffice
                ? `Dispatch Directive to up to 30 Workers`
                : `Dispatch Notification Campaign to up to 400 Customers`}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Connected to Gmail SMTP: <strong className="font-mono text-slate-800">{smtpConfig.user}</strong>.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('batch')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'batch' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isOffice
              ? `Batch Dispatch (${validRecipients.length}/30 Workers)`
              : `Batch Dispatch (${validRecipients.length}/400 Customers)`}
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
              activeTab === 'test' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1-Click Single Test Send
          </button>
        </div>

        {activeTab === 'test' ? (
          /* Single Test Email View */
          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Test Recipient Email Address
              </label>
              <input
                type="email"
                value={singleRecipient}
                onChange={(e) => setSingleRecipient(e.target.value)}
                placeholder="newaronp@gmail.com"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-slate-900"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Delivers an exact HTML render with all active buttons, logos, and directives.
              </p>
            </div>

            <button
              onClick={handleSingleSend}
              disabled={singleStatus.loading || !singleRecipient}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {singleStatus.loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Dispatching Test Email to Inbox...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>Send Immediate Test to {singleRecipient}</span>
                </>
              )}
            </button>

            {singleStatus.msg && (
              <div
                className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                  singleStatus.success
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {singleStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                )}
                <span>{singleStatus.msg}</span>
              </div>
            )}
          </div>
        ) : (
          /* Batch Send View */
          <div className="space-y-4">
            {validRecipients.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <div>
                  No recipient emails loaded. Go to the <strong>Recipients</strong> tab and load {isOffice ? '30 workers' : 'customer emails'}.
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">{isOffice ? 'Target Office Workers:' : 'Target Brand Customers:'}</span>
                  <span className="font-mono font-bold text-slate-900">
                    {validRecipients.length} / {maxLimit} Max
                  </span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500">Live Progress:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {currentIndex} / {validRecipients.length} ({progressPercentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-200 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Chunk-based sequential delivery prevents Gmail rate-limits and HTTP timeouts.</span>
                </div>
              </div>
            )}

            {/* Launch / Pause / Cancel Controls */}
            <div className="flex gap-2">
              <button
                onClick={handleStartBatch}
                disabled={isSending || validRecipients.length === 0}
                className={`flex-1 py-3 px-4 font-bold rounded-lg text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                  isOffice ? 'bg-rose-700 hover:bg-rose-800 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Sending ({currentIndex}/{validRecipients.length})...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {isOffice
                        ? `Send Boss Directive to ${validRecipients.length} Workers`
                        : `Launch Campaign to ${validRecipients.length} Customers`}
                    </span>
                  </>
                )}
              </button>

              {isSending && (
                <>
                  <button
                    onClick={handleTogglePause}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-sm font-semibold border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-sm font-semibold border border-rose-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            {/* Progress Counters & Logs */}
            {logs.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600">
                    Results: <strong className="text-emerald-700 font-mono">{sentCount} Sent</strong> · <strong className="text-rose-700 font-mono">{failCount} Failed</strong>
                  </span>
                  {!isSending && (
                    <button
                      onClick={downloadReport}
                      className="text-xs text-slate-900 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Delivery CSV</span>
                    </button>
                  )}
                </div>

                {/* Console Log Terminal */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] max-h-48 overflow-y-auto space-y-1">
                  {logs.map((log, idx) => (
                    <div key={idx} className="flex items-center justify-between py-0.5 border-b border-slate-900 last:border-0">
                      <div className="flex items-center gap-2 truncate">
                        {log.success ? (
                          <span className="text-emerald-400 font-bold">✓ DELIVERED</span>
                        ) : (
                          <span className="text-rose-400 font-bold">✗ FAIL</span>
                        )}
                        <span className="text-slate-300 truncate">{log.email}</span>
                      </div>
                      <span className="text-slate-500 shrink-0 ml-2">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
