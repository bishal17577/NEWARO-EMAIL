import React, { useRef, useState } from 'react';
import { CampaignData } from '../types/campaign';
import { MARKETING_TEMPLATES, OFFICE_TEMPLATES, DEFAULT_HERO_IMAGE, DEFAULT_LOGO_IMAGE } from '../utils/constants';
import { Sparkles, Link as LinkIcon, Building, User, Mail, Upload, Briefcase, AlertOctagon, CheckSquare, Clock } from 'lucide-react';

interface EmailComposerProps {
  campaign: CampaignData;
  setCampaign: React.Dispatch<React.SetStateAction<CampaignData>>;
}

const PRESET_COLORS = [
  { name: 'Boss Urgent Red', hex: '#dc2626' },
  { name: 'Executive Obsidian', hex: '#0f172a' },
  { name: 'NEWARO Gold', hex: '#d97706' },
  { name: 'Payroll Emerald', hex: '#059669' },
  { name: 'Corporate Blue', hex: '#2563eb' },
  { name: 'Strategy Violet', hex: '#7c3aed' },
];

export const EmailComposer: React.FC<EmailComposerProps> = ({ campaign, setCampaign }) => {
  const isOffice = campaign.dispatchMode === 'office';
  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>(isOffice ? 'urgentDirective' : 'problemSolver');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);

  const activeTemplates = isOffice ? OFFICE_TEMPLATES : MARKETING_TEMPLATES;

  const applyTemplate = (key: string) => {
    setSelectedTemplateKey(key);
    const tmpl = activeTemplates[key];
    if (tmpl) {
      setCampaign(prev => ({
        ...prev,
        ...tmpl.data,
      }));
    }
  };

  const updateField = <K extends keyof CampaignData>(field: K, value: CampaignData[K]) => {
    setCampaign(prev => ({ ...prev, [field]: value }));
  };

  const updateOfficeField = <K extends keyof CampaignData['officeDetails']>(
    field: K,
    value: CampaignData['officeDetails'][K]
  ) => {
    setCampaign(prev => ({
      ...prev,
      officeDetails: {
        ...prev.officeDetails,
        [field]: value,
      },
    }));
  };

  const insertToken = (token: string) => {
    setCampaign(prev => ({
      ...prev,
      description: prev.description + ` ${token} `,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        updateField('brandLogoUrl', ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        updateField('heroImageUrl', ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Template Quick Switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isOffice ? <Briefcase className="w-4 h-4 text-blue-600" /> : <Sparkles className="w-4 h-4 text-amber-600" />}
            <h3 className="text-sm font-bold text-slate-900">
              {isOffice ? 'Office Package Presets (Sent by Boss to 30 Workers)' : 'Customer Marketing Strategy Presets (400 Brands)'}
            </h3>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700">
            {isOffice ? '🏢 Office Package' : '🚀 Customer Marketing'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(activeTemplates).map(([key, item]) => (
            <button
              key={key}
              onClick={() => applyTemplate(key)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                selectedTemplateKey === key
                  ? (isOffice ? 'bg-blue-50/70 border-blue-400 text-slate-900 shadow-2xs' : 'bg-amber-50/70 border-amber-400 text-slate-900 shadow-2xs')
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="text-xs font-bold mb-1 text-slate-900">{item.label}</div>
              <div className="text-[11px] text-slate-600 line-clamp-2">{item.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Office Package Boss Directive Parameters (Rendered when in Office Mode) */}
      {isOffice && (
        <div className="bg-white border-2 border-blue-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              <span>Boss Executive Directives & Priority Protocol</span>
            </h3>
            <span className="text-xs font-bold text-blue-700 uppercase">Office Package</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Boss Name / Sender Title
              </label>
              <input
                type="text"
                value={campaign.officeDetails?.bossName || ''}
                onChange={(e) => updateOfficeField('bossName', e.target.value)}
                placeholder="Executive Director (Boss)"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Department / Team
              </label>
              <input
                type="text"
                value={campaign.officeDetails?.department || ''}
                onChange={(e) => updateOfficeField('department', e.target.value)}
                placeholder="Operations & Engineering Division"
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Directive Priority Level
              </label>
              <select
                value={campaign.officeDetails?.priority || 'urgent'}
                onChange={(e) => updateOfficeField('priority', e.target.value as any)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 font-bold"
              >
                <option value="urgent">🚨 Urgent Boss Directive (Red)</option>
                <option value="high">⚠️ High Priority Notice (Amber)</option>
                <option value="routine">📋 Routine Office Directive (Slate)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Action Deadline for 30 Workers
              </label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={campaign.officeDetails?.deadline || ''}
                  onChange={(e) => updateOfficeField('deadline', e.target.value)}
                  placeholder="Today by 5:00 PM Sharp"
                  className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-800 block mb-1">
                Worker Acknowledgment Button
              </label>
              <div className="relative">
                <CheckSquare className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600" />
                <input
                  type="text"
                  value={campaign.officeDetails?.ackButtonText || ''}
                  onChange={(e) => {
                    updateOfficeField('ackButtonText', e.target.value);
                    updateField('buttonText', e.target.value);
                  }}
                  placeholder="Confirm Directive Received & Log In"
                  className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Brand Identity & Sender Config */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Building className="w-4 h-4 text-amber-600" />
          <span>{isOffice ? 'Office Name & Executive Identity' : 'Brand Identity & Sender Name'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-800 block mb-1">
              {isOffice ? 'Boss Sender Display' : 'Main Sender Display Name'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={campaign.senderName}
                onChange={(e) => updateField('senderName', e.target.value)}
                placeholder={isOffice ? "Executive Director Desk | NEWARO Office" : "NEWARO | Brand Problem Solver"}
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-800 block mb-1">
              {isOffice ? 'Company / Office Name' : 'Brand Name'}
            </label>
            <div className="relative">
              <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={campaign.brandName}
                onChange={(e) => updateField('brandName', e.target.value)}
                placeholder={isOffice ? "NEWARO Operations & Executive Command" : "NEWARO Creative & Problem Solvers"}
                className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Brand Logo Upload / Selection */}
        <div>
          <label className="text-xs font-semibold text-slate-800 block mb-1">
            {isOffice ? 'Office Insignia / Seal (Drag & Drop or Image)' : 'Brand Logo (Image / Drag & Drop)'}
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
              {campaign.brandLogoUrl ? (
                <img src={campaign.brandLogoUrl} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span className="text-[10px] text-slate-400">No Logo</span>
              )}
            </div>

            <div className="flex-1 w-full space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={campaign.brandLogoUrl}
                  onChange={(e) => updateField('brandLogoUrl', e.target.value)}
                  placeholder="Paste Logo URL or upload file..."
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
                />
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs text-slate-800 font-semibold rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer border border-slate-200"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-600" />
                  <span>Upload</span>
                </button>
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateField('brandLogoUrl', DEFAULT_LOGO_IMAGE)}
                  className="text-[11px] text-amber-700 font-medium hover:underline cursor-pointer"
                >
                  Use Official NEWARO Mark
                </button>
                <span className="text-slate-300">·</span>
                <button
                  onClick={() => updateField('brandLogoUrl', '')}
                  className="text-[11px] text-slate-500 hover:text-rose-600 cursor-pointer"
                >
                  Remove Logo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Subject & Headline */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Mail className="w-4 h-4 text-blue-600" />
          <span>{isOffice ? 'Directive Subject & Memo Headline' : 'Email Subject & Headline'}</span>
        </h3>

        <div>
          <label className="text-xs font-semibold text-slate-800 block mb-1">
            Email Subject Line
          </label>
          <input
            type="text"
            value={campaign.subject}
            onChange={(e) => updateField('subject', e.target.value)}
            placeholder={isOffice ? "🚨 URGENT BOSS DIRECTIVE: Priority Action Tasks for {{name}}" : "Executive Brand Resolution Proposal for {{brand}}"}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 font-medium"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-800 block mb-1">
            In-Email Headline / Title
          </label>
          <input
            type="text"
            value={campaign.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder={isOffice ? "Executive Task Directive: Priority Execution Plan for Staff" : "Solving Critical Brand Obstacles & Driving Measurable Market Authority"}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 font-bold"
          />
        </div>

        {/* Hero Image Drag & Drop */}
        <div>
          <label className="text-xs font-semibold text-slate-800 block mb-1">
            {isOffice ? 'Office Notice Banner / Workspace Media' : 'Hero Marketing Banner / Media'}
          </label>
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={campaign.heroImageUrl}
                onChange={(e) => updateField('heroImageUrl', e.target.value)}
                placeholder="Paste Image URL or upload..."
                className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
              />
              <button
                onClick={() => heroInputRef.current?.click()}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs text-slate-800 font-semibold rounded-lg flex items-center gap-1.5 shrink-0 cursor-pointer border border-slate-200"
              >
                <Upload className="w-3.5 h-3.5 text-slate-600" />
                <span>Upload Banner</span>
              </button>
              <input
                type="file"
                ref={heroInputRef}
                onChange={handleHeroUpload}
                accept="image/*"
                className="hidden"
              />
            </div>

            {campaign.heroImageUrl && (
              <div className="relative rounded-lg overflow-hidden border border-slate-200 max-h-40 group shadow-2xs">
                <img src={campaign.heroImageUrl} alt="Banner" className="w-full h-36 object-cover" />
                <button
                  onClick={() => updateField('heroImageUrl', '')}
                  className="absolute top-2 right-2 bg-slate-900/80 hover:bg-rose-700 text-white text-[10px] px-2 py-1 rounded-sm transition-colors cursor-pointer"
                >
                  Remove Banner
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateField('heroImageUrl', DEFAULT_HERO_IMAGE)}
                className="text-[11px] text-amber-700 font-medium hover:underline cursor-pointer"
              >
                Use Official NEWARO Strategy Room Banner
              </button>
            </div>
          </div>
        </div>

        {/* Description / Instructions */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-800">
              {isOffice ? 'Boss Directives, Work Orders & Instructions' : 'Problem Solver Description & Strategic Copy'}
            </label>
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-500">Insert:</span>
              <button
                type="button"
                onClick={() => insertToken('{{name}}')}
                className="text-amber-700 hover:text-amber-800 font-mono px-1.5 py-0.5 rounded-sm bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                {'{{name}}'}
              </button>
              {isOffice && (
                <button
                  type="button"
                  onClick={() => insertToken('{{boss}}')}
                  className="text-rose-700 hover:text-rose-800 font-mono px-1.5 py-0.5 rounded-sm bg-slate-100 hover:bg-slate-200 cursor-pointer"
                >
                  {'{{boss}}'}
                </button>
              )}
              <button
                type="button"
                onClick={() => insertToken('{{email}}')}
                className="text-blue-700 hover:text-blue-800 font-mono px-1.5 py-0.5 rounded-sm bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                {'{{email}}'}
              </button>
            </div>
          </div>

          <textarea
            value={campaign.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={7}
            placeholder={isOffice ? "Write directive tasks for the 30 office workers..." : "Describe the problem, strategic resolution, and proposal for the brand..."}
            className="w-full bg-white border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 font-sans leading-relaxed resize-y shadow-2xs"
          />
        </div>
      </div>

      {/* Call To Action Button Customizer */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-amber-600" />
          <span>{isOffice ? 'Staff Action & Acknowledgment Button' : 'Call-to-Action Link & Button Customizer'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-800 block mb-1">
              Button Text / Action
            </label>
            <input
              type="text"
              value={campaign.buttonText}
              onChange={(e) => updateField('buttonText', e.target.value)}
              placeholder={isOffice ? "Confirm Directive Received & Log In" : "View Solution Architecture"}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900 font-bold"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-800 block mb-1">
              Destination Link (URL)
            </label>
            <input
              type="text"
              value={campaign.buttonLink}
              onChange={(e) => updateField('buttonLink', e.target.value)}
              placeholder="https://newaro.com/office-confirm"
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-slate-900"
            />
          </div>
        </div>

        {/* Color Palette Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-800 block mb-2">
            Button Color
          </label>
          <div className="flex flex-wrap items-center gap-2.5">
            {PRESET_COLORS.map(c => (
              <button
                key={c.hex}
                type="button"
                onClick={() => updateField('buttonColor', c.hex)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  campaign.buttonColor.toLowerCase() === c.hex.toLowerCase()
                    ? 'border-slate-900 text-slate-900 bg-slate-100 shadow-xs'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                <span>{c.name}</span>
              </button>
            ))}

            {/* Custom Hex Input */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
              <span className="text-[11px] text-slate-500">Hex:</span>
              <input
                type="color"
                value={campaign.buttonColor}
                onChange={(e) => updateField('buttonColor', e.target.value)}
                className="w-5 h-5 bg-transparent border-0 cursor-pointer rounded-xs"
              />
              <input
                type="text"
                value={campaign.buttonColor}
                onChange={(e) => updateField('buttonColor', e.target.value)}
                className="w-16 bg-transparent text-xs font-mono text-slate-900 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Live CTA Button Preview */}
        <div className="pt-2">
          <span className="text-[11px] text-slate-500 block mb-2">Button Appearance Preview:</span>
          <div className="p-4 bg-slate-50 rounded-lg text-center border border-slate-200">
            <a
              href={campaign.buttonLink || '#'}
              target="_blank"
              rel="noreferrer"
              style={{
                backgroundColor: campaign.buttonColor,
                color: campaign.buttonTextColor,
              }}
              className="inline-block px-6 py-2.5 rounded-lg font-bold text-xs shadow-xs hover:opacity-90 transition-opacity"
            >
              {campaign.buttonText || 'Click Here'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
