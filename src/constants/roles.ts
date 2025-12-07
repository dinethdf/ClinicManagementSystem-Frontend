export const ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'STAFF',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
} as const;

export type UserRole = keyof typeof ROLES;