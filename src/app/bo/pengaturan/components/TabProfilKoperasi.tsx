'use client';

import React from 'react';
import { ProfilIdentitasSection } from './ProfilIdentitasSection';
import { ProfilLegalitasSection } from './ProfilLegalitasSection';

export function TabProfilKoperasi() {
  return (
    <div className="space-y-6">
      <ProfilIdentitasSection />
      <ProfilLegalitasSection />
    </div>
  );
}
