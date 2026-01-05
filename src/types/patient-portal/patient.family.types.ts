export type RelationType = 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING' | 'OTHER';

export interface FamilyMemberDTO {
  id: number;
  fullName: string;
  relation: RelationType;
  dob: string; // ISO Date
  gender: 'MALE' | 'FEMALE';
  isPrimary: boolean; // True for the logged-in user
  avatarUrl?: string;
}

export interface SwitchProfileResponse {
  success: boolean;
  activeProfileId: number;
  message: string;
}