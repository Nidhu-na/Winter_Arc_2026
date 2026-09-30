import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Send, Tag, Search, Calendar, ShieldCheck } from 'lucide-react';
import { DayLog } from '../types';
import { soundEngine } from '../utils/audio';

interface ProofOfWorkLogProps {
  logs: Record<number, DayLog>;
  currentDay: number;
  onSaveProof: (dayNumber: number, content: string, tags: string[]) => void;
  isOpenAsModal?: boolean;
  onCloseModal?: () => void;
}

const COLD_TAGS = [
  'Zero Excuses',
  'Fought Resistance',
  'Deep Silence',
  'Early Dawn',
  'Heavy Iron',
  'Metabolic Fire',
  'Ice In Veins',
];

export const ProofOfWorkLog: React.FC<ProofOfWorkLogProps> = ({
  logs,
  currentDay,
  onSaveProof,
  isOpenAsModal = false,
  onCloseModal,
}) => {
  const [content, setContent] = useState(logs[currentDay]?.proofOfWork?.content || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(
    logs[currentDay]?.proofOfWork?.tags || ['Zero Excuses']
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Gather past proofs
  const pastProofs: Array<{ dayNumber: number; date: string; content: string; tags: string[] }> = [];
  for (let i = 1; i <= 90; i++) {
    const l = logs[i];
    if (l?.proofOfWork?.content) {
      pastProofs.unshift({
        dayNumber: i,
        date: l.date,
        content: l.proofOfWork.content,
        tags: l.proofOfWork.tags,
      });
    }
  }

  const toggleTag = (tag: string) => {
    soundEngine.playIceShatter();
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 8) {
      soundEngine.playAlert();
      return;
    }

    soundEngine.playFortressBlock();
    soundEngine.playEmberIgnite();
    onSaveProof(currentDay, content.trim(), selectedTags);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (isOpenAsModal && onCloseModal) {
        onCloseModal();
      }
    }, 800);
  };

  const filteredProofs = pastProofs.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.content.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      `day ${p.dayNumber}`.includes(q)
    );
  });

  const contentUI = (
    <div className="space-y-6">
      {/* Daily Input Form */}
      <div className="frost-card rounded-lg p-5 sm:p-6 border border-[#7FB3D5]/30 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#7FB3D5]/15">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#1B2A4A] text-[#FF4D4D] border border-[#FF4D4D]/30">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-condensed text-xl sm:text-2xl text-[#E8F0F7] tracking-wider uppercase">
                Proof Of Work — Day {currentDay}
              </h3>
              <p className="text-xs text-[#7FB3D5]/80 font-mono-stat mt-0.5">
                NO THERAPY. NO FEELINGS. 1 SENTENCE OF COLD TRUTH.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="E.g., Conquered the 5am cold wake, crushed the deadlifts at 5:30am, zero sugar, shut down all distraction."
              className="w-full bg-[#0A0E1A]/80 border border-[#7FB3D5]/30 rounded-lg p-3 text-sm text-[#E8F0F7] placeholder-[#7FB3D5]/40 font-mono-stat focus:outline-none focus:border-[#7FB3D5] focus:ring-1 focus:ring-[#7FB3D5]"
            />
            <div className="flex justify-between items-center text-[11px] font-mono-stat text-[#7FB3D5]/70 mt-1">
              <span>Minimum 1 complete sentence of raw accountability</span>
              <span>{content.length} CHARS</span>
            </div>
          </div>

          {/* Quick Tags */}
          <div>
            <span className="block text-[11px] uppercase font-mono-stat text-[#7FB3D5]/80 mb-2">
              Discipline Stamp
            </span>
            <div className="flex flex-wrap gap-2">
              {COLD_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded text-xs font-mono-stat transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#1B2A4A] border-[#7FB3D5] text-[#7FB3D5] font-bold'
                        : 'bg-[#0A0E1A]/60 border-[#7FB3D5]/20 text-[#E8F0F7]/60 hover:border-[#7FB3D5]/40'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {isOpenAsModal && onCloseModal && (
              <button
                type="button"
                onClick={onCloseModal}
                className="px-4 py-2 text-xs font-condensed tracking-wider uppercase text-[#E8F0F7]/60 hover:text-white"
              >
                Close
              </button>
            )}
            <button
              type="submit"
              disabled={content.trim().length < 8}
              className={`inline-flex items-center gap-2 px-6 py-2.5 font-condensed tracking-wider text-sm uppercase rounded font-bold transition-all cursor-pointer ${
                content.trim().length >= 8
                  ? 'bg-[#7FB3D5] hover:bg-[#E8F0F7] text-[#0A0E1A] shadow-md shadow-[#7FB3D5]/20'
                  : 'bg-[#1B2A4A]/30 text-[#E8F0F7]/40 cursor-not-allowed border border-transparent'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{savedSuccess ? 'PROOF LOCKED' : 'Deposit Proof of Work'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Past Archive Log */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="font-condensed text-lg text-[#E8F0F7] tracking-wider uppercase">
            Proof Of Work Ledger ({pastProofs.length} Entries)
          </h4>

          {/* Search ledger */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#7FB3D5]/60" />
            <input
              type="text"
              placeholder="Search ledger entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0E1A]/80 border border-[#7FB3D5]/20 rounded pl-8 pr-3 py-1.5 text-xs text-[#E8F0F7] focus:outline-none focus:border-[#7FB3D5] font-mono-stat"
            />
          </div>
        </div>

        {filteredProofs.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono-stat text-[#7FB3D5]/60 border border-dashed border-[#7FB3D5]/20 rounded">
            NO PROOF DEPOSITED YET. WORDS ARE CHEAP, LOCK IN TODAY'S RESULT.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
            {filteredProofs.map((p) => (
              <div
                key={p.dayNumber}
                className="p-4 bg-[#0A0E1A]/60 border border-[#7FB3D5]/20 rounded-lg space-y-2 hover:border-[#7FB3D5]/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-mono-stat">
                  <span className="font-bold text-[#7FB3D5] uppercase">
                    DAY {p.dayNumber} OF 90
                  </span>
                  <span className="text-[#E8F0F7]/50">{p.date}</span>
                </div>
                <p className="text-sm text-[#E8F0F7] font-mono-stat">
                  "{p.content}"
                </p>
                {p.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono-stat px-2 py-0.5 rounded bg-[#1B2A4A]/40 text-[#7FB3D5] border border-[#7FB3D5]/20"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isOpenAsModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0E1A]/90 backdrop-blur-md p-4">
        <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto">
          {contentUI}
        </div>
      </div>
    );
  }

  return contentUI;
};
