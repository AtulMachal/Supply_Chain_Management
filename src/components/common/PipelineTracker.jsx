import React from "react";
import { Check } from "lucide-react";
import { PIPELINE_STAGES } from "../../data/mockData";

export default function PipelineTracker({ activeIndex }) {
  return (
    <div className="flex items-center overflow-x-auto pb-1">
      {PIPELINE_STAGES.map((stage, i) => {
        const done = i < activeIndex;
        const current = i === activeIndex;
        return (
          <div key={stage} className="flex items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ring-2
                ${done ? "bg-indigo-600 text-white ring-indigo-600" : current ? "bg-white text-indigo-600 ring-indigo-600" : "bg-white text-slate-400 ring-slate-300"}`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={`w-20 shrink-0 text-center text-[10.5px] leading-tight ${current ? "font-semibold text-indigo-700" : "text-slate-500"}`}>
                {stage}
              </span>
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <div className={`h-0.5 w-8 shrink-0 sm:w-14 ${done ? "bg-indigo-600" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
