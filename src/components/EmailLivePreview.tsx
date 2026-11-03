import React, { useState, useEffect } from 'react';
import { CampaignData } from '../types/campaign';
import { Monitor, Smartphone, Code, Eye, Copy, Check, Send } from 'lucide-react';

interface EmailLivePreviewProps {
  campaign: CampaignData;
  validEmails: string[];
  onQuickTestSend: (recipient: string) => void;
}

export const EmailLivePreview: React.FC<EmailLivePreviewProps> = ({
  campaign,
  validEmails,
  onQuickTestSend,
}) => {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [testRecipient, setTestRecipient] = useState<string>(validEmails[0] || 'bishal@gmail.com');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [, setLoading] = useState(false);

  useEffect(() => {
    if (validEmails.length > 0 && !validEmails.includes(testRecipient)) {
      setTestRecipient(validEmails[0]);
    }
  }, [validEmails]);

  useEffect(() => {
    let isCancelled = false;
    const fetchHtml = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/preview-html', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            campaign,
            recipientEmail: testRecipient,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            setHtmlContent(data.html);
          }
        }
      } catch (err) {
        console.error('Failed to preview html:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchHtml();
    return () => {
      isCancelled = true;
    };
  }, [campaign, testRecipient]);

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Controller Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        {/* Recipient Persona Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Preview As:</span>
          <select
            value={testRecipient}
            onChange={(e) => setTestRecipient(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-900 focus:outline-hidden focus:border-slate-900"
          >
            {validEmails.length > 0 ? (
              validEmails.slice(0, 10).map(e => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))
            ) : (
              <>
                <option value="bishal@gmail.com">bishal@gmail.com</option>
                <option value="nepalo@gmail.com">nepalo@gmail.com</option>
              </>
            )}
          </select>
        </div>

        {/* View Mode & Device Controls */}
        <div className="flex items-center gap-2">
          {/* Visual vs Code Mode */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'visual' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Visual</span>
            </button>
            <button
              onClick={() => setViewMode('code')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'code' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>HTML</span>
            </button>
          </div>

          {/* Desktop vs Mobile Mode (only in visual mode) */}
          {viewMode === 'visual' && (
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setDevice('desktop')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  device === 'desktop' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Desktop View (600px)"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  device === 'mobile' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Mobile View (375px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Test Send Button */}
          <button
            onClick={() => onQuickTestSend(testRecipient)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5 text-amber-400" />
            <span>Send Test to {testRecipient}</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 md:p-8 flex justify-center min-h-[620px] overflow-hidden">
        {viewMode === 'visual' ? (
          <div
            className={`transition-all duration-300 w-full flex justify-center ${
              device === 'mobile' ? 'max-w-[400px]' : 'max-w-[680px]'
            }`}
          >
            {/* Phone/Client Frame */}
            <div className="w-full bg-white border border-slate-300 rounded-2xl shadow-lg overflow-hidden flex flex-col">
              {/* Fake Email Client Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="font-mono text-[11px] text-slate-700 ml-2 truncate max-w-[280px]">
                    Subject: {campaign.subject || 'Brand Strategy Notice'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {device === 'desktop' ? 'Desktop 600px' : 'Mobile 375px'}
                </div>
              </div>

              {/* Rendered Email Body */}
              <div className="flex-1 bg-slate-50 overflow-y-auto max-h-[750px]">
                <iframe
                  title="Email Visual Preview"
                  srcDoc={htmlContent}
                  className="w-full h-[750px] border-0 bg-transparent"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>
          </div>
        ) : (
          /* Raw HTML View */
          <div className="w-full max-w-4xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-700 font-semibold">Generated Email HTML Markup:</span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied HTML!' : 'Copy Markup'}</span>
              </button>
            </div>
            <pre className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[600px] leading-relaxed">
              {htmlContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
