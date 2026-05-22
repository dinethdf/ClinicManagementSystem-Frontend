export enum Roles {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  RECEPTIONIST = 'RECEPTIONIST',
  PATIENT = 'PATIENT',
}

// Define specific permissions in the system
export type Permission = 
  | 'manage_users' 
  | 'manage_appointments' 
  | 'view_patients' 
  | 'manage_prescriptions' 
  | 'view_own_appointments'
  // Add other permissions here
  | string;

export const rolePermissions: Record<Roles, Permission[]> = {
  [Roles.ADMIN]: ['manage_users', 'manage_appointments'],
  [Roles.DOCTOR]: ['view_patients', 'manage_prescriptions'],
  [Roles.RECEPTIONIST]: ['manage_appointments'],
  [Roles.PATIENT]: ['view_own_appointments'],
};

