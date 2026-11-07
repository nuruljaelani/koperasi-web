'use client';

import React from 'react';
import { NotifikasiEmailSection } from './NotifikasiEmailSection';
import { NotifikasiEmailTemplateSection } from './NotifikasiEmailTemplateSection';
import { NotifikasiWhatsAppSection } from './NotifikasiWhatsAppSection';

export function TabNotifikasi() {
  return (
    <div className="space-y-6">
      <NotifikasiEmailSection />
      <NotifikasiEmailTemplateSection />
      <NotifikasiWhatsAppSection />
    </div>
  );
}
