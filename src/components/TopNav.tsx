import React from 'react';
import { Send, SlidersHorizontal, Users, Eye, Calculator, KeyRound, Briefcase, Megaphone, ShieldCheck } from 'lucide-react';
import { DispatchMode } from '../types/campaign';

interface TopNavProps {
  activeTab: 'compose' | 'recipients' | 'preview' | 'calculator';
  setActiveTab: (tab: 'compose' | 'recipients' | 'preview' | 'calculator') => void;
  recipientCount: number;
  dispatchMode: DispatchMode;
  setDispatchMode: (mode: DispatchMode) => void;
  onOpenDispatch: () => void;
  onOpenSmtp: () => void;
  onOpenSpamDoctor: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  recipientCount,
  dispatchMode,
  setDispatchMode,
  onOpenDispatch,
  onOpenSmtp,
  onOpenSpamDoctor,
}) => {
  const maxLimit = dispatchMode === 'office' ? 30 : 400;

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Brand Zone - Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center font-extrabold text-amber-400 text-xl shadow-xs">
            N
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block leading-tight">
              NEWARO <span className="text-amber-600 font-semibold text-sm">{dispatchMode === 'office' ? 'Office Desk' : 'Problem Solver'}</span>
            </span>
          </div>
        </div>

        {/* Navigation Links Zone */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium">
          <button
            onClick={() => setActiveTab('compose')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'compose'
                ? 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span>{dispatchMode === 'office' ? 'Office Directive' : 'Campaign Studio'}</span>
          </button>

          <button
            onClick={() => setActiveTab('recipients')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'recipients'
                ? 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>{dispatchMode === 'office' ? 'Workers' : 'Recipients'}</span>
            <span className="font-mono text-xs px-1.5 py-0.5 rounded-sm bg-slate-200/80 text-emerald-800 border border-slate-300 tabular-nums">
              {recipientCount}/{maxLimit}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span>Live Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-slate-100 text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calculator className="w-4 h-4 text-amber-600" />
            <span>{dispatchMode === 'office' ? 'Payroll & Staff' : 'Brand Earnings'}</span>
          </button>

          <button
            onClick={onOpenSpamDoctor}
            className="px-3 py-1.5 rounded-lg text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            title="Spam Doctor & Primary Inbox Deliverability Optimizer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Spam Doctor</span>
          </button>

          <button
            onClick={onOpenSmtp}
            className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            title="Gmail SMTP Configuration"
          >
            <KeyRound className="w-4 h-4 text-slate-500" />
            <span>Gmail SMTP</span>
          </button>
        </nav>

        {/* Action Zone: Mode Selector + Send Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setDispatchMode('office')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                dispatchMode === 'office'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Office Package: Sent by Boss to up to 30 Workers"
            >
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              <span>Office (30)</span>
            </button>

            <button
              onClick={() => setDispatchMode('marketing')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                dispatchMode === 'marketing'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Customer Marketing: Sent to up to 400 Customers/Brands"
            >
              <Megaphone className="w-3.5 h-3.5 text-amber-600" />
              <span>Customer (400)</span>
            </button>
          </div>

          <button
            onClick={onOpenDispatch}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all shadow-sm flex items-center gap-2 whitespace-nowrap cursor-pointer active:scale-98 ${
              dispatchMode === 'office' ? 'bg-rose-700 hover:bg-rose-800' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            <Send className="w-4 h-4 text-amber-400" />
            <span>{dispatchMode === 'office' ? 'Send Boss Directive' : 'Dispatch Campaign'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
