import React, { useState, useRef } from 'react';
import { Users, Upload, Trash2, CheckCircle2, AlertCircle, Search, Sparkles, Briefcase, UserCheck } from 'lucide-react';
import { parseEmailList } from '../utils/emailParser';
import { SAMPLE_30_WORKERS, SAMPLE_MARKETING_CUSTOMERS } from '../utils/constants';
import { DispatchMode } from '../types/campaign';

interface RecipientManagerProps {
  rawText: string;
  setRawText: (val: string) => void;
  validEmails: string[];
  setValidEmails: (emails: string[]) => void;
  dispatchMode: DispatchMode;
}

export const RecipientManager: React.FC<RecipientManagerProps> = ({
  rawText,
  setRawText,
  validEmails,
  setValidEmails,
  dispatchMode,
}) => {
  const isOffice = dispatchMode === 'office';
  const maxLimit = isOffice ? 30 : 400;

  const [searchQuery, setSearchQuery] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [duplicateNote, setDuplicateNote] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (text: string) => {
    setRawText(text);
    const result = parseEmailList(text, maxLimit);
    setValidEmails(result.validEmails);
    setDuplicateNote(result.duplicateCount);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const combined = rawText ? `${rawText},\n${content}` : content;
        handleTextChange(combined);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const combined = rawText ? `${rawText},\n${content}` : content;
          handleTextChange(combined);
        }
      };
      reader.readAsText(file);
    }
  };

  const removeEmail = (emailToRemove: string) => {
    const updated = validEmails.filter(e => e !== emailToRemove);
    setValidEmails(updated);
    setRawText(updated.join(', '));
  };

  const clearAll = () => {
    setRawText('');
    setValidEmails([]);
    setDuplicateNote(0);
  };

  const loadOfficeWorkers = () => {
    handleTextChange(SAMPLE_30_WORKERS.slice(0, 30).join(', '));
  };

  const loadMarketingSample = () => {
    handleTextChange(SAMPLE_MARKETING_CUSTOMERS.join(', '));
  };

  const generateDemoBatch = (count: number) => {
    const sampleBrands = [
      'nike', 'apple', 'stripe', 'linear', 'spotify', 'airbnb', 'figma', 'notion',
      'shopify', 'brex', 'ramp', 'vercel', 'supabase', 'datadog', 'retool', 'loom',
      'zoom', 'hubspot', 'salesforce', 'twitch', 'canva', 'discord', 'asana', 'slack'
    ];
    const generated: string[] = ['bishal@gmail.com', 'nepalo@gmail.com'];
    for (let i = 1; i <= count - 2; i++) {
      const brand = sampleBrands[i % sampleBrands.length];
      const dept = i % 2 === 0 ? 'partnerships' : 'marketing';
      generated.push(`${dept}${i}@${brand}.com`);
    }
    handleTextChange(generated.join(', '));
  };

  const filteredEmails = validEmails.filter(e =>
    e.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const percentageUsed = Math.min(100, Math.round((validEmails.length / maxLimit) * 100));

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              {isOffice ? (
                <span className="px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  Office Package Mode: Sent by Boss to Staff
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-sm bg-amber-50 text-amber-800 text-xs font-bold uppercase tracking-wider border border-amber-200 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Customer Marketing Mode: Problem Solver Dispatch
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mt-1">
              <Users className="w-5 h-5 text-amber-600" />
              <span>{isOffice ? 'Office Staff Recipient Roster (Up to 30 Workers)' : 'Customer Recipient Vault (Up to 400 Emails)'}</span>
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {isOffice ? (
                <>Upload or type up to <strong className="text-slate-900 font-bold">30 office workers</strong>. Separate by comma (e.g. <span className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded-sm">bishal@gmail.com,nepalo@gmail.com</span>) to dispatch boss memos and directives.</>
              ) : (
                <>Upload or paste up to <strong className="text-slate-900 font-bold">400 customer/brand emails</strong> at once. Type with commas or upload CSV.</>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isOffice ? (
              <button
                onClick={loadOfficeWorkers}
                className="px-3 py-1.5 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Load 30 Office Staff Workers</span>
              </button>
            ) : (
              <>
                <button
                  onClick={loadMarketingSample}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Load Sample Brands</span>
                </button>
                <button
                  onClick={() => generateDemoBatch(100)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  +100 Brand Leads
                </button>
                <button
                  onClick={() => generateDemoBatch(400)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-900 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-300 transition-colors cursor-pointer"
                >
                  Fill Max 400
                </button>
              </>
            )}

            {validEmails.length > 0 && (
              <button
                onClick={clearAll}
                className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear List</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar of Capacity */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600">
              Capacity: <strong className="text-slate-900 font-mono">{validEmails.length}</strong> / {maxLimit} {isOffice ? 'Workers' : 'Customer Emails'}
            </span>
            <span className={`font-mono font-semibold ${validEmails.length > maxLimit ? 'text-rose-600' : 'text-emerald-700'}`}>
              {percentageUsed}% {validEmails.length > maxLimit ? `(Exceeds ${maxLimit} limit!)` : 'allocated'}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                validEmails.length > maxLimit
                  ? 'bg-rose-500'
                  : validEmails.length >= (isOffice ? 25 : 350)
                  ? 'bg-amber-500'
                  : 'bg-emerald-600'
              }`}
              style={{ width: `${Math.min(100, (validEmails.length / maxLimit) * 100)}%` }}
            />
          </div>
        </div>

        {duplicateNote > 0 && (
          <div className="mt-3 text-xs text-amber-800 flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            <span>Automatically identified and removed {duplicateNote} duplicate email addresses.</span>
          </div>
        )}
      </div>

      {/* Input Area & Drag and Drop File Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-900">
              {isOffice ? 'Type or Paste Worker Staff Emails (Comma or Newline Separated)' : 'Paste or Type Customer Emails (Comma or Newline Separated)'}
            </label>
            <span className="text-xs text-slate-500">
              Example: bishal@gmail.com, nepalo@gmail.com
            </span>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={isOffice ? "bishal@gmail.com, nepalo@gmail.com, worker1@office.internal, worker2@office.internal..." : "bishal@gmail.com, nepalo@gmail.com, ceo@brand.com, marketing@sponsor.io..."}
            rows={8}
            className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all resize-y shadow-2xs"
          />

          {/* Drag & Drop File Upload Box */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
              dragActive
                ? 'border-amber-500 bg-amber-50/50'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv,.txt"
              className="hidden"
            />
            <Upload className="w-7 h-7 text-slate-500 mx-auto mb-2" />
            <div className="text-sm font-semibold text-slate-900">
              {isOffice ? 'Upload Staff Contact List (.CSV or .TXT)' : 'Drag & Drop .CSV or .TXT Email File here'}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Supports CSV rosters exported from Google Sheets, Excel, or payroll HR files
            </div>
          </div>
        </div>

        {/* Validated Recipients List Preview */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 flex flex-col h-[460px] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{isOffice ? 'Staff Roster' : 'Parsed Contacts'} ({validEmails.length})</span>
            </div>
            {validEmails.length > 0 && (
              <span className="text-xs font-mono text-slate-500">
                100% Unique
              </span>
            )}
          </div>

          {/* Search box for filtering */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isOffice ? "Filter worker email..." : "Filter recipient..."}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-slate-900 focus:bg-white"
            />
          </div>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1">
            {filteredEmails.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 text-xs">
                <Users className="w-8 h-8 text-slate-300 mb-2" />
                <span>No emails entered yet.</span>
                <span className="mt-1 text-slate-400">
                  {isOffice ? 'Type up to 30 worker emails or click "Load 30 Office Staff Workers".' : 'Type comma-separated emails or upload a file.'}
                </span>
              </div>
            ) : (
              filteredEmails.map((email, idx) => (
                <div key={email + idx} className="py-2 px-1 flex items-center justify-between group hover:bg-slate-50 rounded-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[11px] font-mono text-slate-400 w-6 text-right tabular-nums">
                      {idx + 1}.
                    </span>
                    <span className="text-xs font-mono text-slate-800 truncate" title={email}>
                      {email}
                    </span>
                    {isOffice && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-xs border border-slate-200">
                        Staff
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeEmail(email)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 transition-opacity cursor-pointer"
                    title="Remove email"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Bottom Summary Bar */}
          <div className="pt-3 mt-2 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <span>{isOffice ? 'Ready for Boss Dispatch' : 'Ready for Customer Blast'}</span>
            <span className="text-slate-900 font-bold">
              {validEmails.length > 0 ? `${validEmails.length} ${isOffice ? 'Workers Ready' : 'Brands Targetable'}` : '0 Recipients'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
