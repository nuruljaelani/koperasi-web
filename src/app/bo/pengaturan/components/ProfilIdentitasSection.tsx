'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Building2, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { PengaturanSystemFormValues } from '@/lib/validations/settings';
import { SectionCard, FormField, getInputClass } from './common';

export function ProfilIdentitasSection() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PengaturanSystemFormValues>();

  const profilErrors = errors.profil;

  return (
    <>
      <SectionCard
        title="Identitas Koperasi"
        icon={Building2}
        description="Informasi dasar yang ditampilkan ke anggota dan laporan resmi"
      >
        <div className="grid md:grid-cols-2 gap-5">
          <FormField
            label="Nama Lengkap Koperasi"
            required
            error={profilErrors?.nama?.message}
          >
            <input
              {...register('profil.nama')}
              className={getInputClass(!!profilErrors?.nama)}
              placeholder="Unit Pengelola Kegiatan..."
            />
          </FormField>
          <FormField
            label="Singkatan / Kode"
            required
            error={profilErrors?.singkatan?.message}
          >
            <input
              {...register('profil.singkatan')}
              className={getInputClass(!!profilErrors?.singkatan)}
              placeholder="UPK Mekarsari"
            />
          </FormField>
          <FormField
            label="Tagline / Slogan"
            hint="Ditampilkan pada halaman publik dan dokumen resmi"
            error={profilErrors?.tagline?.message}
          >
            <input
              {...register('profil.tagline')}
              className={getInputClass(!!profilErrors?.tagline)}
              placeholder="Bersama Menuju Kesejahteraan"
            />
          </FormField>
          <FormField
            label="Email Resmi"
            required
            error={profilErrors?.email?.message}
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('profil.email')}
                className={`${getInputClass(!!profilErrors?.email)} pl-9`}
                type="email"
                placeholder="info@koperasi.co.id"
              />
            </div>
          </FormField>
          <FormField
            label="No. Telepon"
            required
            error={profilErrors?.noTelp?.message}
          >
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('profil.noTelp')}
                className={`${getInputClass(!!profilErrors?.noTelp)} pl-9`}
                placeholder="022-5678901"
              />
            </div>
          </FormField>
          <FormField
            label="Website"
            error={profilErrors?.website?.message}
          >
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                {...register('profil.website')}
                className={`${getInputClass(!!profilErrors?.website)} pl-9`}
                placeholder="https://upkmekarsari.co.id"
              />
            </div>
          </FormField>
        </div>
      </SectionCard>

      <SectionCard title="Alamat" icon={MapPin} description="Alamat kantor utama koperasi">
        <div className="grid md:grid-cols-3 gap-5">
          <div className="md:col-span-3">
            <FormField
              label="Alamat Lengkap"
              required
              error={profilErrors?.alamat?.message}
            >
              <input
                {...register('profil.alamat')}
                className={getInputClass(!!profilErrors?.alamat)}
                placeholder="Jl. Nama Jalan No. ..."
              />
            </FormField>
          </div>
          <FormField
            label="Kota / Kabupaten"
            required
            error={profilErrors?.kota?.message}
          >
            <input
              {...register('profil.kota')}
              className={getInputClass(!!profilErrors?.kota)}
              placeholder="Bandung"
            />
          </FormField>
          <FormField
            label="Provinsi"
            required
            error={profilErrors?.provinsi?.message}
          >
            <input
              {...register('profil.provinsi')}
              className={getInputClass(!!profilErrors?.provinsi)}
              placeholder="Jawa Barat"
            />
          </FormField>
          <FormField
            label="Kode Pos"
            error={profilErrors?.kodePos?.message}
          >
            <input
              {...register('profil.kodePos')}
              className={getInputClass(!!profilErrors?.kodePos)}
              placeholder="40123"
            />
          </FormField>
        </div>
      </SectionCard>
    </>
  );
}
