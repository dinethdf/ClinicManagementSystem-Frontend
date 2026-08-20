import { Roles } from './roleConfig'

/**
 * Centralized Access Control Configuration
 * Define which roles have access to which pages/features here.
 */
export const AccessControlConfig = {
  // Appointment Schedule
  appointmentScheduleAdd: [Roles.ADMIN, Roles.DOCTOR],
  appointmentScheduleDetails: [Roles.ADMIN, Roles.RECEPTIONIST, Roles.DOCTOR],
  financialScheduleSummary: [Roles.ADMIN],
  manageSchedule: [Roles.ADMIN, Roles.RECEPTIONIST, Roles.DOCTOR],
  
  // Settings
  clinicSettings: [Roles.ADMIN],

  // Doctor Actions
  doctorConsultation: [Roles.DOCTOR, Roles.ADMIN],
  doctorScheduleFinish: [Roles.DOCTOR],
} as const;
