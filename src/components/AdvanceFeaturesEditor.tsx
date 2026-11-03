import React from 'react';
import { Phone, Mail, MapPin, FileSpreadsheet, CreditCard, Star, Clock, Calendar, ShieldCheck, Tag, Sparkles } from 'lucide-react';
import { CampaignFeatures } from '../types/campaign';

interface AdvanceFeaturesEditorProps {
  features: CampaignFeatures;
  setFeatures: (updater: (prev: CampaignFeatures) => CampaignFeatures) => void;
  enabledFeatures: Record<string, boolean>;
  setEnabledFeatures: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
}

export const AdvanceFeaturesEditor: React.FC<AdvanceFeaturesEditorProps> = ({
  features,
  setFeatures,
  enabledFeatures,
  setEnabledFeatures,
}) => {
  const toggleFeature = (key: string) => {
    setEnabledFeatures(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const updateFeature = (field: keyof CampaignFeatures, val: string) => {
    setFeatures(prev => ({
      ...prev,
      [field]: val,
    }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span>10 Advanced Marketing & Problem Solver Attachments</span>
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Attach interactive buttons for phone, direct reply, maps, retainer invoices, decks, and proof blocks.
          </p>
        </div>
        <div className="text-xs text-slate-600">
          <span className="text-emerald-700 font-mono font-bold">
            {Object.values(enabledFeatures).filter(Boolean).length}/10
          </span>{' '}
          Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Phone Direct Call */}
        <div className={`p-4 rounded-xl border transition-all ${enabledFeatures.phone ? 'bg-amber-50/50 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>1. Direct Phone Line (Click-to-Call)</span>
            </div>
            <button
              onClick={() => toggleFeature('phone')}
              className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${enabledFeatures.phone ? 'bg-slate-900 justify-end' : 'bg-slate-300 justify-start'}`}
            >
              <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md" />
            </button>
          </div>
          {enabledFeatures.phone && (
            <div className="space-y-2 mt-2">
              <input
                type="text"
                value={features.phoneNumber}
                onChange={(e) => updateFeature('phoneNumber', e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
              />
              <input
                type="text"
                value={features.phoneLabel}
                onChange={(e) => updateFeature('phoneLabel', e.target.value)}
                placeholder="Button Label: Call Strategic Hotline"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-slate-900"
              />
            </div>
          )}
        </div>

        {/* 2. Direct Reply Email */}
        <div className={`p-4 rounded-xl border transition-all ${enabledFeatures.reply ? 'bg-amber-50/50 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Mail className="w-4 h-4 text-blue-600" />
              <span>2. 1-Click Direct Reply Button</span>
            </div>
            <button
              onClick={() => toggleFeature('reply')}
              className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${enabledFeatures.reply ? 'bg-slate-900 justify-end' : 'bg-slate-300 justify-start'}`}
            >
              <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md" />
            </button>
          </div>
          {enabledFeatures.reply && (
            <div className="space-y-2 mt-2">
              <input
                type="email"
                value={features.replyEmail}
                onChange={(e) => updateFeature('replyEmail', e.target.value)}
                placeholder="newaronp@gmail.com"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
              />
              <input
                type="text"
                value={features.replyLabel}
                onChange={(e) => updateFeature('replyLabel', e.target.value)}
                placeholder="Button Label: Direct Reply Desk"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-slate-900"
              />
            </div>
          )}
        </div>

        {/* 3. Google Maps Location */}
        <div className={`p-4 rounded-xl border transition-all ${enabledFeatures.map ? 'bg-amber-50/50 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>3. Google Maps Location Pin</span>
            </div>
            <button
              onClick={() => toggleFeature('map')}
              className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${enabledFeatures.map ? 'bg-slate-900 justify-end' : 'bg-slate-300 justify-start'}`}
            >
              <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md" />
            </button>
          </div>
          {enabledFeatures.map && (
            <div className="space-y-2 mt-2">
              <input
                type="text"
                value={features.mapLocation}
                onChange={(e) => updateFeature('mapLocation', e.target.value)}
                placeholder="Address: Financial District, San Francisco"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
              />
              <input
                type="text"
                value={features.mapUrl}
                onChange={(e) => updateFeature('mapUrl', e.target.value)}
                placeholder="Google Maps URL"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-slate-900"
              />
            </div>
          )}
        </div>

        {/* 4. Problem Solver Pitch Deck */}
        <div className={`p-4 rounded-xl border transition-all ${enabledFeatures.pitchDeck ? 'bg-amber-50/50 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <FileSpreadsheet className="w-4 h-4 text-amber-600" />
              <span>4. Solution Deck / PDF Case Study</span>
            </div>
            <button
              onClick={() => toggleFeature('pitchDeck')}
              className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${enabledFeatures.pitchDeck ? 'bg-slate-900 justify-end' : 'bg-slate-300 justify-start'}`}
            >
              <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md" />
            </button>
          </div>
          {enabledFeatures.pitchDeck && (
            <div className="space-y-2 mt-2">
              <input
                type="text"
                value={features.pitchDeckUrl}
                onChange={(e) => updateFeature('pitchDeckUrl', e.target.value)}
                placeholder="https://.../problem-solver-deck.pdf"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
              />
              <input
                type="text"
                value={features.pitchDeckLabel}
                onChange={(e) => updateFeature('pitchDeckLabel', e.target.value)}
                placeholder="Download Strategy Deck"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-slate-900"
              />
            </div>
          )}
        </div>

        {/* 5. "Get Paid by Brand" Retainer Card */}
        <div className={`p-4 rounded-xl border transition-all ${enabledFeatures.payment ? 'bg-emerald-50/70 border-emerald-300' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <CreditCard className="w-4 h-4 text-emerald-700" />
              <span>5. "Get Paid by Brand" Retainer / Invoice</span>
            </div>
            <button
              onClick={() => toggleFeature('payment')}
              className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${enabledFeatures.payment ? 'bg-slate-900 justify-end' : 'bg-slate-300 justify-start'}`}
            >
              <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md" />
            </button>
          </div>
          {enabledFeatures.payment && (
            <div className="space-y-2 mt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={features.invoiceCurrency}
                  onChange={(e) => updateFeature('invoiceCurrency', e.target.value)}
                  placeholder="$"
                  className="w-16 bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 text-center font-bold"
                />
                <input
                  type="text"
                  value={features.invoiceAmount}
                  onChange={(e) => updateFeature('invoiceAmount', e.target.value)}
                  placeholder="3,500"
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono font-bold"
                />
              </div>
              <input
                type="text"
                value={features.paymentUrl}
                onChange={(e) => updateFeature('paymentUrl', e.target.value)}
                placeholder="Payment Link (Stripe, PayPal, BuyMeACoffee, etc.)"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
              />
              <input
                type="text"
                value={features.paymentLabel}
                onChange={(e) => updateFeature('paymentLabel', e.target.value)}
                placeholder="Button: Lock Sprint Retainer"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-slate-900"
              />
            </div>
          )}
        </div>

        {/* 6. Social Proof / Endorsement */}
        <div className={`p-4 rounded-xl border transition-all ${enabledFeatures.socialProof ? 'bg-amber-50/50 border-amber-300' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Star className="w-4 h-4 text-amber-600" />
              <span>6. Social Proof & Case Metrics</span>
            </div>
            <button
              onClick={() => toggleFeature('socialProof')}
              className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${enabledFeatures.socialProof ? 'bg-slate-900 justify-end' : 'bg-slate-300 justify-start'}`}
            >
              <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md" />
            </button>
          </div>
          {enabledFeatures.socialProof && (
            <div className="space-y-2 mt-2">
              <input
                type="text"
                value={features.socialProofScore}
                onChange={(e) => updateFeature('socialProofScore', e.target.value)}
                placeholder="Headline: 99.4% Client Resolution Rate"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
              />
              <textarea
                value={features.socialProofReview}
                onChange={(e) => updateFeature('socialProofReview', e.target.value)}
                placeholder="Client Testimonial quote"
                rows={2}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800"
              />
            </div>
          )}
        </div>

        {/* 7. Urgency / Limited Time Notice */}
        <div className={`p-4 rounded-xl border transition-all ${enabledFeatures.urgency ? 'bg-rose-50/60 border-rose-300' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Clock className="w-4 h-4 text-rose-600" />
              <span>7. Urgency / Expiration Notice</span>
            </div>
            <button
              onClick={() => toggleFeature('urgency')}
              className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${enabledFeatures.urgency ? 'bg-slate-900 justify-end' : 'bg-slate-300 justify-start'}`}
            >
              <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md" />
            </button>
          </div>
          {enabledFeatures.urgency && (
            <div className="space-y-2 mt-2">
              <input
                type="text"
                value={features.urgencyText}
                onChange={(e) => updateFeature('urgencyText', e.target.value)}
                placeholder="Only 2 brand sponsorship slots remaining this quarter."
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
              />
              <input
                type="text"
                value={features.urgencyDaysLeft}
                onChange={(e) => updateFeature('urgencyDaysLeft', e.target.value)}
                placeholder="48 Hours"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800"
              />
            </div>
          )}
        </div>

        {/* 8. 15-Minute Strategy Booking Link */}
        <div className={`p-4 rounded-xl border transition-all ${enabledFeatures.booking ? 'bg-purple-50/50 border-purple-300' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>8. Strategy Call Booking (Calendly/Meet)</span>
            </div>
            <button
              onClick={() => toggleFeature('booking')}
              className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${enabledFeatures.booking ? 'bg-slate-900 justify-end' : 'bg-slate-300 justify-start'}`}
            >
              <div className="bg-white w-3.5 h-3.5 rounded-full shadow-md" />
            </button>
          </div>
          {enabledFeatures.booking && (
            <div className="space-y-2 mt-2">
              <input
                type="text"
                value={features.bookingUrl}
                onChange={(e) => updateFeature('bookingUrl', e.target.value)}
                placeholder="https://calendly.com/your-brand-link"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
              />
              <input
                type="text"
                value={features.bookingLabel}
                onChange={(e) => updateFeature('bookingLabel', e.target.value)}
                placeholder="Schedule 15-Minute Strategy Call"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800"
              />
            </div>
          )}
        </div>

        {/* 9. Dynamic Personalization Tokens Info */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 md:col-span-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-1">
            <Tag className="w-4 h-4 text-amber-600" />
            <span>9. Dynamic Personalization Tokens</span>
          </div>
          <p className="text-xs text-slate-600 mb-3">
            These variables automatically resolve for each recipient during broadcast:
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-white text-slate-800 border border-slate-300 shadow-2xs">
              {'{{name}}'} → Recipient username
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white text-blue-700 border border-slate-300 shadow-2xs">
              {'{{email}}'} → Recipient email address
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white text-emerald-700 border border-slate-300 shadow-2xs">
              {'{{brand}}'} → Brand Name
            </span>
          </div>
        </div>

        {/* 10. Sponsor Legal & Unsubscribe Compliance */}
        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 md:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>10. Sponsor Disclaimer & Unsubscribe Footer</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleFeature('disclaimer')}
                className={`text-xs px-2.5 py-1 rounded-md border cursor-pointer font-medium ${enabledFeatures.disclaimer ? 'bg-white text-slate-900 border-slate-300 shadow-2xs' : 'text-slate-500 border-slate-200'}`}
              >
                Disclaimer {enabledFeatures.disclaimer ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => toggleFeature('unsubscribe')}
                className={`text-xs px-2.5 py-1 rounded-md border cursor-pointer font-medium ${enabledFeatures.unsubscribe ? 'bg-white text-slate-900 border-slate-300 shadow-2xs' : 'text-slate-500 border-slate-200'}`}
              >
                Unsubscribe {enabledFeatures.unsubscribe ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={features.sponsorDisclaimer}
              onChange={(e) => updateFeature('sponsorDisclaimer', e.target.value)}
              placeholder="Commercial marketing disclaimer"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
            />
            <input
              type="text"
              value={features.unsubscribeUrl}
              onChange={(e) => updateFeature('unsubscribeUrl', e.target.value)}
              placeholder="Unsubscribe link URL"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
