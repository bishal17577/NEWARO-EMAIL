import React, { useState } from 'react';
import { DollarSign, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SponsorEarningsCalculatorProps {
  recipientCount: number;
  onApplyRetainerToCampaign: (amount: string) => void;
}

export const SponsorEarningsCalculator: React.FC<SponsorEarningsCalculatorProps> = ({
  recipientCount,
  onApplyRetainerToCampaign,
}) => {
  const [recipients, setRecipients] = useState<number>(recipientCount > 0 ? recipientCount : 250);
  const [retainerFee, setRetainerFee] = useState<number>(3500);
  const [conversionRate, setConversionRate] = useState<number>(2.5);
  const [sponsorPlacementRate, setSponsorPlacementRate] = useState<number>(500);

  React.useEffect(() => {
    if (recipientCount > 0) setRecipients(recipientCount);
  }, [recipientCount]);

  const estimatedDeals = Math.max(1, Math.round((recipients * (conversionRate / 100))));
  const totalRetainerRevenue = estimatedDeals * retainerFee;
  const sponsorshipBroadcastRevenue = (recipients / 100) * sponsorPlacementRate;
  const grossEstimatedEarnings = totalRetainerRevenue + sponsorshipBroadcastRevenue;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-emerald-600" />
              <span>"Get Paid by Brand" Revenue & Retainer Modeler</span>
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Model client retainer deals, brand sponsorship payouts, and ROI when pitching up to 400 brand executives.
            </p>
          </div>
          <button
            onClick={() => onApplyRetainerToCampaign(retainerFee.toString())}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
          >
            <span>Sync ${retainerFee.toLocaleString()} Retainer to Email</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 space-y-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900">Campaign Commercial Parameters</h3>

          {/* 1. Recipient Count */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Targeted Brand Contacts (Max 400):</span>
              <span className="font-mono font-bold text-slate-900">{recipients} Brands</span>
            </div>
            <input
              type="range"
              min="10"
              max="400"
              step="5"
              value={recipients}
              onChange={(e) => setRecipients(Number(e.target.value))}
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>

          {/* 2. Problem Solver Retainer */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Problem Solver Retainer per Deal:</span>
              <span className="font-mono font-bold text-emerald-700">${retainerFee.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="15000"
              step="500"
              value={retainerFee}
              onChange={(e) => setRetainerFee(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex gap-2">
              {[2500, 3500, 5000, 10000].map(fee => (
                <button
                  key={fee}
                  onClick={() => setRetainerFee(fee)}
                  className={`text-[11px] px-2 py-0.5 rounded-sm border cursor-pointer ${
                    retainerFee === fee
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  ${fee.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Conversion Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Response / Close Conversion Rate:</span>
              <span className="font-mono font-bold text-blue-700">{conversionRate}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">
              High-intent problem-solving proposals typically convert between 2.0% - 4.5% into discovery calls and retainer invoices.
            </p>
          </div>

          {/* 4. Sponsorship Fee */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600">Brand Co-Marketing Placement Fee (per 100 reach):</span>
              <span className="font-mono font-bold text-purple-700">${sponsorPlacementRate}</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={sponsorPlacementRate}
              onChange={(e) => setSponsorPlacementRate(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Projection KPI Cards */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-md border border-slate-800">
            <div className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-semibold mb-1">
              Projected Gross Brand Payout
            </div>
            <div className="text-4xl md:text-5xl font-extrabold text-white font-mono tracking-tight tabular-nums">
              ${grossEstimatedEarnings.toLocaleString()}
            </div>
            <p className="text-xs text-slate-300 mt-2">
              Based on {recipients} targeted decision makers with an estimated {estimatedDeals} closed Problem Solver agreements.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800">
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Closed Retainers</div>
                <div className="text-lg font-bold font-mono text-white mt-0.5">{estimatedDeals} Brands</div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Retainer Earnings</div>
                <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
                  ${totalRetainerRevenue.toLocaleString()}
                </div>
              </div>
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-slate-400">Placement Value</div>
                <div className="text-lg font-bold font-mono text-purple-400 mt-0.5">
                  ${sponsorshipBroadcastRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Strategy Checklist for Getting Paid by Brands */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>NEWARO Problem Solver Monetization Playbook</span>
            </h4>
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Identify the Brand Pain Point First:</strong> Frame the email around an unsolved audience friction or marketing leak rather than a generic pitch.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Attach Upfront Payment Links:</strong> Use Feature #5 to provide instant Stripe / PayPal links for a retainer deposit ($1,500 - $5,000) right inside the email.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Multi-Channel CTA:</strong> Provide both a 1-click reply desk and a direct phone hotline to close deals while the brand executive is engaged.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
