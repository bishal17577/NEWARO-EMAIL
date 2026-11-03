import React, { useState } from 'react';
import { TopNav } from './components/TopNav';
import { EmailComposer } from './components/EmailComposer';
import { BlockReorder } from './components/BlockReorder';
import { AdvanceFeaturesEditor } from './components/AdvanceFeaturesEditor';
import { RecipientManager } from './components/RecipientManager';
import { EmailLivePreview } from './components/EmailLivePreview';
import { SponsorEarningsCalculator } from './components/SponsorEarningsCalculator';
import { BatchDispatcherModal } from './components/BatchDispatcherModal';
import { SmtpSettingsModal } from './components/SmtpSettingsModal';
import { DeliverabilityDoctorModal } from './components/DeliverabilityDoctorModal';
import { CampaignData, DispatchMode, SmtpConfig } from './types/campaign';
import { INITIAL_CAMPAIGN, SAMPLE_30_WORKERS, SAMPLE_MARKETING_CUSTOMERS } from './utils/constants';
import { parseEmailList } from './utils/emailParser';
import { analyzeDeliverability } from './utils/spamChecker';
import { Sparkles, Send, Eye, Users, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'compose' | 'recipients' | 'preview' | 'calculator'>('compose');
  const [campaign, setCampaign] = useState<CampaignData>(INITIAL_CAMPAIGN);

  const isOffice = campaign.dispatchMode === 'office';

  // Recipient input & parsed list
  const [rawText, setRawText] = useState<string>(() => {
    return SAMPLE_30_WORKERS.slice(0, 30).join(', ');
  });

  const [validEmails, setValidEmails] = useState<string[]>(() => {
    return parseEmailList(SAMPLE_30_WORKERS.slice(0, 30).join(', '), 30).validEmails;
  });

  // Switch mode handler
  const handleSetDispatchMode = (newMode: DispatchMode) => {
    const isNewOffice = newMode === 'office';
    const newMax = isNewOffice ? 30 : 400;
    const defaultList = isNewOffice
      ? SAMPLE_30_WORKERS.slice(0, 30).join(', ')
      : SAMPLE_MARKETING_CUSTOMERS.join(', ');

    setCampaign(prev => ({
      ...prev,
      dispatchMode: newMode,
      senderName: isNewOffice ? 'Executive Director Desk | NEWARO Office' : 'NEWARO | Brand Problem Solver',
      brandName: isNewOffice ? 'NEWARO Operations & Executive Command' : 'NEWARO Creative & Problem Solvers',
      subject: isNewOffice ? 'Executive Notice: Priority Project Tasks and Schedule for {{name}}' : 'Executive Brand Resolution Proposal for {{brand}}',
      buttonText: isNewOffice ? 'Confirm Directive Received & Log In' : 'View Solution Architecture',
      buttonColor: isNewOffice ? '#0f172a' : '#d97706',
    }));

    setRawText(defaultList);
    setValidEmails(parseEmailList(defaultList, newMax).validEmails);
    showToast(isNewOffice ? 'Switched to Office Package (30 Workers)' : 'Switched to Customer Marketing (400 Brands)');
  };

  // SMTP credentials with user-provided Gmail and App Password
  const [smtpConfig, setSmtpConfig] = useState<SmtpConfig>({
    user: 'newaronp@gmail.com',
    pass: 'xccu ltbx vwty rfip',
  });

  // Modals
  const [isDispatchOpen, setIsDispatchOpen] = useState(false);
  const [isSmtpOpen, setIsSmtpOpen] = useState(false);
  const [isSpamDoctorOpen, setIsSpamDoctorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const deliverabilityReport = analyzeDeliverability(campaign.subject, campaign.description);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleQuickTestSend = async (recipient: string) => {
    showToast(`Sending test dispatch to ${recipient}...`);
    try {
      const res = await fetch('/api/send-single', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign,
          recipientEmail: recipient,
          smtpUser: smtpConfig.user,
          smtpPass: smtpConfig.pass,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Success! Email delivered to ${recipient}`);
      } else {
        showToast(`Error: ${data.error || 'Failed to dispatch'}`);
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    }
  };

  const handleApplyRetainer = (amount: string) => {
    setCampaign(prev => ({
      ...prev,
      features: {
        ...prev.features,
        invoiceAmount: amount,
      },
      enabledFeatures: {
        ...prev.enabledFeatures,
        payment: true,
      },
    }));
    showToast(`Synced $${amount} to Email Retainer/Payroll!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navigation */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        recipientCount={validEmails.length}
        dispatchMode={campaign.dispatchMode}
        setDispatchMode={handleSetDispatchMode}
        onOpenDispatch={() => setIsDispatchOpen(true)}
        onOpenSmtp={() => setIsSmtpOpen(true)}
        onOpenSpamDoctor={() => setIsSpamDoctorOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8">
        {activeTab === 'compose' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Composer Controls */}
            <div className="lg:col-span-7 space-y-6">
              <EmailComposer campaign={campaign} setCampaign={setCampaign} />
              <BlockReorder
                blockOrder={campaign.blockOrder}
                setBlockOrder={(newOrder) => setCampaign(prev => ({ ...prev, blockOrder: newOrder }))}
              />
              <AdvanceFeaturesEditor
                features={campaign.features}
                setFeatures={(updater) => setCampaign(prev => ({ ...prev, features: updater(prev.features) }))}
                enabledFeatures={campaign.enabledFeatures}
                setEnabledFeatures={(updater) => setCampaign(prev => ({ ...prev, enabledFeatures: updater(prev.enabledFeatures) }))}
              />
            </div>

            {/* Right Column: Sticky Quick Preview & Action Widget */}
            <div className="lg:col-span-5 sticky top-20 space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Eye className="w-4 h-4 text-amber-600" />
                    <span>{isOffice ? 'Office Directive Summary' : 'Real-Time Layout Summary'}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className="text-xs text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
                  >
                    Full Preview →
                  </button>
                </div>

                {/* Spam Score / Deliverability Gauge */}
                <div
                  onClick={() => setIsSpamDoctorOpen(true)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer transition-colors flex items-center justify-between"
                  title="Click to inspect deliverability and fix spam triggers"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-800">Deliverability Health:</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-700">
                    <span>{deliverabilityReport.score}/100</span>
                    <span className="text-[10px] text-slate-500 font-sans font-normal">(Fix Spam Triggers →)</span>
                  </div>
                </div>

                {/* Mini Summary Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2 font-mono">
                  <div className="text-slate-600 flex justify-between">
                    <span>Mode:</span>
                    <span className="text-slate-900 font-bold uppercase">
                      {isOffice ? '🏢 Office (30 Workers)' : '🚀 Customer (400 Brands)'}
                    </span>
                  </div>
                  <div className="text-slate-600 flex justify-between">
                    <span>Sender:</span>
                    <span className="text-slate-900 font-semibold truncate max-w-[180px]">{campaign.senderName}</span>
                  </div>
                  <div className="text-slate-600 flex justify-between">
                    <span>Subject:</span>
                    <span className="text-slate-900 truncate max-w-[180px]">{campaign.subject}</span>
                  </div>
                  <div className="text-slate-600 flex justify-between">
                    <span>Button Color:</span>
                    <span className="flex items-center gap-1.5 text-slate-900 font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: campaign.buttonColor }} />
                      {campaign.buttonColor}
                    </span>
                  </div>
                  {isOffice && (
                    <div className="text-slate-600 flex justify-between">
                      <span>Priority:</span>
                      <span className="text-slate-900 font-bold uppercase">{campaign.officeDetails?.priority}</span>
                    </div>
                  )}
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => setIsDispatchOpen(true)}
                    className={`w-full py-2.5 px-4 text-white font-bold rounded-lg text-xs transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer ${
                      isOffice ? 'bg-rose-700 hover:bg-rose-800' : 'bg-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>
                      {isOffice
                        ? `Dispatch Boss Directive to ${validEmails.length} Workers`
                        : `Dispatch Campaign to ${validEmails.length} Customers`}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('recipients')}
                    className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
                  >
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>
                      {isOffice
                        ? `Manage 30 Worker Staff Roster (${validEmails.length}/30)`
                        : `Manage Customer Recipient List (${validEmails.length}/400)`}
                    </span>
                  </button>
                </div>
              </div>

              {/* Quick Feature Checklist */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-2 shadow-xs">
                <span className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider block">
                  10 Interactive Attachments & Features
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono">
                  {Object.entries(campaign.enabledFeatures).map(([k, active]) => (
                    <div key={k} className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                      <span className={active ? 'text-slate-800 font-medium capitalize' : 'text-slate-400 capitalize'}>
                        {k}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'recipients' && (
          <RecipientManager
            rawText={rawText}
            setRawText={setRawText}
            validEmails={validEmails}
            setValidEmails={setValidEmails}
            dispatchMode={campaign.dispatchMode}
          />
        )}

        {activeTab === 'preview' && (
          <EmailLivePreview
            campaign={campaign}
            validEmails={validEmails}
            onQuickTestSend={handleQuickTestSend}
          />
        )}

        {activeTab === 'calculator' && (
          <SponsorEarningsCalculator
            recipientCount={validEmails.length}
            onApplyRetainerToCampaign={handleApplyRetainer}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <strong className="text-slate-800">NEWARO Executive Office & Marketing Dispatch Engine</strong> · Dual Boss Directive & Brand Marketing System
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSpamDoctorOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 transition-colors font-medium cursor-pointer"
            >
              Spam Doctor (Score: {deliverabilityReport.score}/100)
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <button
              onClick={() => setIsSmtpOpen(true)}
              className="text-slate-700 hover:text-slate-900 transition-colors font-medium cursor-pointer"
            >
              Gmail SMTP ({smtpConfig.user})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BatchDispatcherModal
        isOpen={isDispatchOpen}
        onClose={() => setIsDispatchOpen(false)}
        campaign={campaign}
        recipients={validEmails}
        smtpConfig={smtpConfig}
      />

      <SmtpSettingsModal
        isOpen={isSmtpOpen}
        onClose={() => setIsSmtpOpen(false)}
        smtpConfig={smtpConfig}
        setSmtpConfig={setSmtpConfig}
      />

      <DeliverabilityDoctorModal
        isOpen={isSpamDoctorOpen}
        onClose={() => setIsSpamDoctorOpen(false)}
        campaign={campaign}
        setCampaign={setCampaign}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 border border-slate-800">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
