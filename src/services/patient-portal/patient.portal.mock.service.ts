import type { PortalStats, PortalAppointmentDTO, PortalLabReportDTO } from '@/types/patient-portal/patient.portal.types';

// Simulate API delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const patientPortalService = {
  
  // 1. Get Dashboard Stats
  getStats: async (): Promise<PortalStats> => {
    await delay(800);
    return {
      upcomingAppointments: 2,
      pendingLabReports: 1,
      completedVisits: 12,
      totalSpent: 15400.00
    };
  },

  // 2. Get Appointments
  getAppointments: async (filter: 'UPCOMING' | 'HISTORY'): Promise<PortalAppointmentDTO[]> => {
    await delay(1000);
    
    if (filter === 'UPCOMING') {
      return [
        {
          id: 101,
          doctorName: "Dr. Sarah Perera",
          specialization: "Cardiologist",
          date: "2026-01-10T09:30:00",
          time: "09:30 AM - 10:00 AM",
          queueNo: 12,
          status: 'SCHEDULED',
          clinicName: "City Health Clinic",
          location: "Room 4, 1st Floor",
          ticketPrice: 2500.00
        },
        {
          id: 102,
          doctorName: "Dr. Kamal Gunawardena",
          specialization: "General Physician",
          date: "2026-01-15T16:00:00",
          time: "04:00 PM - 04:30 PM",
          queueNo: 5,
          status: 'PENDING_PAYMENT',
          clinicName: "City Health Clinic",
          location: "Room 1, Ground Floor",
          ticketPrice: 1500.00
        }
      ];
    } else {
      return [
        {
          id: 99,
          doctorName: "Dr. Amal Silva",
          specialization: "Dermatologist",
          date: "2025-12-20T10:00:00",
          time: "10:00 AM",
          queueNo: 20,
          status: 'COMPLETED',
          clinicName: "City Health Clinic",
          location: "Room 2",
          ticketPrice: 2000.00
        }
      ];
    }
  },

  // 3. Get Recent Lab Reports
  getRecentLabReports: async (): Promise<PortalLabReportDTO[]> => {
    await delay(600);
    return [
      { id: 501, testName: "Full Blood Count (FBC)", date: "2025-12-20", status: 'READY', downloadUrl: '#' },
      { id: 502, testName: "Lipid Profile", date: "2026-01-02", status: 'PENDING' }
    ];
  }
};