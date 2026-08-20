'use server'

import type { FamilyMemberDTO } from '@/types/patient-portal/patient.family.types';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const MOCK_FAMILY: FamilyMemberDTO[] = [
  { id: 101, fullName: "Isuru Abeywickrama", relation: 'other' as any, dob: "1990-05-15", gender: 'MALE', isPrimary: true, avatarUrl: '/images/avatars/1.png' },
  { id: 102, fullName: "Sahan Abey", relation: 'CHILD', dob: "2018-08-20", gender: 'MALE', isPrimary: false },
  { id: 103, fullName: "Mala Perera", relation: 'SPOUSE', dob: "1992-12-10", gender: 'FEMALE', isPrimary: false, avatarUrl: '/images/avatars/2.png' }
];

export async function getFamilyMembers() {
  await delay(600);
  
return MOCK_FAMILY;
}

export async function addFamilyMember(data: Omit<FamilyMemberDTO, 'id' | 'isPrimary'>) {
  await delay(1000);

  // In real app: POST /api/patient/family
  return { success: true, message: "Family member added successfully." };
}

export async function switchActiveProfile(memberId: number) {
  await delay(500);

  // In real app: POST /api/auth/switch-profile { id: memberId }
  // This would return a new Token or set a Session Cookie
  return { success: true, activeProfileId: memberId, message: `Switched profile.` };
}