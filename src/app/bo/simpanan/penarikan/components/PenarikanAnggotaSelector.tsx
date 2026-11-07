'use client';

import React, { useState } from 'react';
import { User, ChevronDown, X, Wallet, AlertCircle } from 'lucide-react';
import { Anggota } from '@/hooks/useAnggotaData';

interface PenarikanAnggotaSelectorProps {
  anggotaList: Anggota[];
  selectedAnggotaId: string;
  onSelect: (id: string) => void;
  onClear: () => void;
  errorMessage?: string;
  memberRekeningData: any;
  rekeningLoading: boolean;
  selectedRekeningId: string;
  onSelectRekening: (rekeningId: string, jenis: 'Pokok' | 'Wajib' | 'Sukarela') => void;
  formatRupiah: (v: number) => string;
}

export function PenarikanAnggotaSelector({
  anggotaList,
  selectedAnggotaId,
  onSelect,
  onClear,
  errorMessage,
  memberRekeningData,
  rekeningLoading,
  selectedRekeningId,
  onSelectRekening,
  formatRupiah,
}: PenarikanAnggotaSelectorProps) {
  const [anggotaSearch, setAnggotaSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const selectedAnggotaData = anggotaList.find((a) => a.id === selectedAnggotaId);

  const filteredAnggota = anggotaList.filter(
    (a) =>
      a.nama.toLowerCase().includes(anggotaSearch.toLowerCase()) ||
      a.nomorAnggota.toLowerCase().includes(anggotaSearch.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        Pilih Anggota <span className="text-rose-500">*</span>
      </label>
      {selectedAnggotaData ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg">
                {selectedAnggotaData.nama.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-slate-900">{selectedAnggotaData.nama}</div>
                <div className="text-xs text-slate-500">
                  {selectedAnggotaData.nomorAnggota} • {selectedAnggotaData.nomorHp || '-'}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onClear}
              className="p-2.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Informasi Saldo Simpanan Anggota */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Wallet size={14} className="text-emerald-600" />
                Pilih Rekening Yang Ingin Ditarik
              </span>
              {rekeningLoading && (
                <span className="text-xs text-slate-400 animate-pulse">Memuat saldo...</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(memberRekeningData?.rekening || []).map((r: any) => {
                const isChosen =
                  selectedRekeningId === r.rekeningId ||
                  (!selectedRekeningId && r.tipe === 'sukarela');
                return (
                  <button
                    key={r.tipe || r.nama}
                    type="button"
                    onClick={() => {
                      onSelectRekening(
                        r.rekeningId,
                        r.tipe === 'pokok' ? 'Pokok' : r.tipe === 'wajib' ? 'Wajib' : 'Sukarela'
                      );
                    }}
                    className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer ${
                      isChosen
                        ? 'bg-white border-emerald-600 ring-2 ring-emerald-100 shadow-sm'
                        : 'bg-white/80 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-[11px] font-bold text-slate-500 block truncate">
                      {r.nama}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900 font-mono mt-0.5 block">
                      {formatRupiah(r.saldo || 0)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {r.nomorRekening || 'Belum Ada Rekening'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div
            className={`flex items-center gap-3 p-3.5 bg-slate-50 border rounded-2xl transition-all ${
              errorMessage
                ? 'border-rose-500 focus-within:ring-4 focus-within:ring-rose-100'
                : 'border-slate-200 focus-within:ring-4 focus-within:ring-emerald-100'
            }`}
          >
            <User className="w-5 h-5 text-slate-400 ml-1 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cari nama lengkap atau nomor anggota..."
              className="flex-1 bg-transparent outline-none text-slate-800 font-medium text-sm placeholder:text-slate-400"
              value={anggotaSearch}
              onChange={(e) => {
                setAnggotaSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </div>

          {showDropdown && (
            <div className="absolute z-20 top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl max-h-56 overflow-y-auto">
              {filteredAnggota.length === 0 ? (
                <div className="p-4 text-center text-slate-400 text-sm font-medium">
                  Anggota tidak ditemukan.
                </div>
              ) : (
                filteredAnggota.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      onSelect(a.id);
                      setShowDropdown(false);
                      setAnggotaSearch('');
                    }}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-emerald-50 text-left transition-colors border-b border-slate-100 last:border-0 cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-slate-800 text-sm">{a.nama}</div>
                      <div className="text-xs text-slate-400">{a.nomorAnggota}</div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700">
                      Pilih
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      )}
      {errorMessage && (
        <p className="text-xs text-rose-600 mt-2 flex items-center gap-1 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}
