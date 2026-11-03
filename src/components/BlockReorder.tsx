import React from 'react';
import { ChevronUp, ChevronDown, MoveVertical, Image as ImageIcon, Type, MousePointerClick, Sparkles, Building2, AlignLeft } from 'lucide-react';
import { BlockId } from '../types/campaign';

interface BlockReorderProps {
  blockOrder: BlockId[];
  setBlockOrder: (newOrder: BlockId[]) => void;
}

const BLOCK_META: Record<BlockId, { label: string; description: string; icon: React.ReactNode }> = {
  header: {
    label: 'Brand Header & Logo',
    description: 'Brand identity mark, logo graphic, and Problem Solver badge',
    icon: <Building2 className="w-4 h-4 text-amber-600" />,
  },
  title: {
    label: 'Email Title & Headline',
    description: 'Primary high-impact marketing subject headline',
    icon: <Type className="w-4 h-4 text-blue-600" />,
  },
  hero_image: {
    label: 'Hero Image / Brand Banner',
    description: 'Visual marketing graphic, studio photography, or campaign banner',
    icon: <ImageIcon className="w-4 h-4 text-emerald-600" />,
  },
  description: {
    label: 'Problem Solver Description',
    description: 'Core strategic copy, value proposition, and client resolution brief',
    icon: <AlignLeft className="w-4 h-4 text-purple-600" />,
  },
  primary_button: {
    label: 'Primary CTA Link Button',
    description: 'Custom link button (can be positioned first or anywhere in layout)',
    icon: <MousePointerClick className="w-4 h-4 text-rose-600" />,
  },
  advance_features: {
    label: '10 Advanced Attachments & Controls',
    description: 'Phone call, email reply, map, retainer payment, pitch deck, social proof',
    icon: <Sparkles className="w-4 h-4 text-amber-600" />,
  },
};

export const BlockReorder: React.FC<BlockReorderProps> = ({ blockOrder, setBlockOrder }) => {
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blockOrder.length) return;

    const newOrder = [...blockOrder];
    const [moved] = newOrder.splice(index, 1);
    newOrder.splice(targetIndex, 0, moved);
    setBlockOrder(newOrder);
  };

  const setButtonFirst = () => {
    const withoutButton = blockOrder.filter(b => b !== 'primary_button');
    const newOrder: BlockId[] = ['header', 'primary_button', ...withoutButton.filter(b => b !== 'header')];
    setBlockOrder(newOrder);
  };

  const resetDefault = () => {
    setBlockOrder(['header', 'title', 'hero_image', 'description', 'primary_button', 'advance_features']);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <MoveVertical className="w-4 h-4 text-amber-600" />
            <span>Layout Order & Structure Manager</span>
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Adjust which element comes first in the email notification (e.g. put action button first before description).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={setButtonFirst}
            className="px-2.5 py-1 text-xs font-semibold text-slate-900 bg-amber-50 hover:bg-amber-100 rounded-md border border-amber-300 transition-colors cursor-pointer"
          >
            Quick: Link Button First
          </button>
          <button
            onClick={resetDefault}
            className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {blockOrder.map((blockId, index) => {
          const meta = BLOCK_META[blockId];
          return (
            <div
              key={blockId}
              className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-mono font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <div className="p-1.5 rounded-md bg-white border border-slate-200 shadow-2xs">
                  {meta.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {meta.label}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {meta.description}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveBlock(index, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="Move Up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveBlock(index, 'down')}
                  disabled={index === blockOrder.length - 1}
                  className="p-1.5 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                  title="Move Down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
