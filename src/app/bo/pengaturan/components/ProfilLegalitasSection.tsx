'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Hash, Calendar, CreditCard } from 'lucide-react';
import { PengaturanSystemFormValues } from '@/lib/validations/settings';
import { SectionCard, FormField, getInputClass } from './common';

export function ProfilLegalitasSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PengaturanSystemFormValues>();

  const profilErrors = errors.profil;

  return (
    <>
      <SectionCard title="Legalitas" icon={Hash} description="Data legal dan perizinan koperasi">
        <div className="grid md:grid-cols-2 gap-5">
          <FormField
            label="No. SK Pendirian"
            required
            error={profilErrors?.noSK?.message}
          >
            <input
              {...register('profil.noSK')}
              className={getInputClass(!!profilErrors?.noSK)}
              placeholder="SK/BH/PAD/..."
            />
          </FormField>
          <FormField
            label="Tanggal Berdiri"
            required
            error={profilErrors?.tanggalBerdiri?.message}
          >
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('profil.tanggalBerdiri')}
                className={`${getInputClass(!!profilErrors?.tanggalBerdiri)} pl-9`}
                type="date"
              />
            </div>
          </FormField>
          <FormField
            label="NPWP"
            required
            hint="Format: XX.XXX.XXX.X-XXX.000"
            error={profilErrors?.npwp?.message}
          >
            <input
              {...register('profil.npwp')}
              className={getInputClass(!!profilErrors?.npwp)}
              placeholder="12.345.678.9-012.000"
            />
          </FormField>
        </div>
      </SectionCard>

      <SectionCard
        title="Rekening Bank"
        icon={CreditCard}
        description="Rekening utama untuk transaksi koperasi"
      >
        <div className="grid md:grid-cols-3 gap-5">
          <FormField
            label="Nama Bank"
            required
            error={profilErrors?.bankNama?.message}
          >
            <input
              {...register('profil.bankNama')}
              className={getInputClass(!!profilErrors?.bankNama)}
              placeholder="Bank BRI"
            />
          </FormField>
          <FormField
            label="No. Rekening"
            required
            error={profilErrors?.bankNoRekening?.message}
          >
            <input
              {...register('profil.bankNoRekening')}
              className={getInputClass(!!profilErrors?.bankNoRekening)}
              placeholder="1234-5678-9012"
            />
          </FormField>
          <FormField
            label="Atas Nama"
            required
            error={profilErrors?.bankAtasNama?.message}
          >
            <input
              {...register('profil.bankAtasNama')}
              className={getInputClass(!!profilErrors?.bankAtasNama)}
              placeholder="UPK Mekarsari"
            />
          </FormField>
        </div>
      </SectionCard>
    </>
  );
}
