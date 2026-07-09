import React from "react";
import { Check } from "lucide-react";
import { PIPELINE_STAGES } from "../../data/mockData";

export default function PipelineTracker({ activeIndex, onStageClick, stageCounts = [] }) {
  return (
    <div className="flex items-center overflow-x-auto pb-4 pt-2 px-1 scrollbar-hide">
      {PIPELINE_STAGES.map((stage, i) => {
        const done = i < activeIndex;
        const current = i === activeIndex;
        const count = stageCounts[i] || 0;
        const isClickable = !!onStageClick;
        
        return (
          <div key={stage} className="flex items-center last:flex-none">
            <button 
              onClick={() => isClickable && onStageClick(i, stage)}
              disabled={!isClickable}
              className={`group relative flex flex-col items-center gap-1.5 ${isClickable ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
            >
              {count > 0 && (
                <div className="absolute -top-3.5 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-slate-800 px-1 text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                  {count}
                </div>
              )}
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ring-2 transition-colors
                ${done ? "bg-indigo-600 text-white ring-indigo-600" : current ? "bg-white text-indigo-600 ring-indigo-600" : "bg-white text-slate-400 ring-slate-300"}`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={`w-20 shrink-0 text-center text-[10.5px] leading-tight transition-colors ${current ? "font-semibold text-indigo-700" : "text-slate-500"} ${isClickable ? "group-hover:text-indigo-600" : ""}`}>
                {stage}
              </span>
            </button>
            {i < PIPELINE_STAGES.length - 1 && (
              <div className={`h-0.5 w-8 shrink-0 sm:w-14 transition-colors ${done ? "bg-indigo-600" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
