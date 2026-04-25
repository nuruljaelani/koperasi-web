'use client';

import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';

export type FilterField = {
  id: string;
  label: string;
  type: 'input' | 'select' | 'checkbox' | 'radio';
  options?: { label: string; value: string }[]; // Form select/radio
  placeholder?: string;
  value: any;
  onChange: (val: any) => void;
};

type TableFilterProps = {
  fields: FilterField[];
  onReset?: () => void;
  title?: string;
  defaultOpen?: boolean;
};

export default function TableFilter({ fields, onReset, title = 'Filter Data', defaultOpen = false }: TableFilterProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6 overflow-hidden transition-all duration-300">
      <div 
        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 font-bold text-slate-800">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
            <Filter className="w-4 h-4" />
          </div>
          {title}
        </div>
        <div className="flex items-center gap-4">
          {onReset && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
          <div className="text-slate-400">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-100 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {fields.map((field) => {
              if (field.type === 'input') {
                return (
                  <div key={field.id} className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{field.label}</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      placeholder={field.placeholder || ''}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </div>
                );
              }

              if (field.type === 'select') {
                return (
                  <div key={field.id} className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{field.label}</label>
                    <select
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    >
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field.type === 'checkbox') {
                return (
                  <div key={field.id} className="space-y-1.5 flex flex-col justify-end">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{field.label}</label>
                    <div className="flex flex-wrap gap-3">
                      {field.options?.map((opt, i) => {
                        const isChecked = Array.isArray(field.value) ? field.value.includes(opt.value) : false;
                        return (
                          <label key={i} className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white group-hover:border-emerald-400'}`}>
                              {isChecked && <svg className="w-3 h-3" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                            </div>
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={isChecked}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                if (!Array.isArray(field.value)) return;
                                if (checked) {
                                  field.onChange([...field.value, opt.value]);
                                } else {
                                  field.onChange(field.value.filter((v: string) => v !== opt.value));
                                }
                              }}
                            />
                            <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              if (field.type === 'radio') {
                return (
                  <div key={field.id} className="space-y-1.5 flex flex-col justify-end">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{field.label}</label>
                    <div className="flex flex-wrap gap-3">
                      {field.options?.map((opt, i) => {
                        const isChecked = field.value === opt.value;
                        return (
                          <label key={i} className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isChecked ? 'border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                              {isChecked && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                            </div>
                            <input
                              type="radio"
                              className="hidden"
                              checked={isChecked}
                              onChange={() => field.onChange(opt.value)}
                            />
                            <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
