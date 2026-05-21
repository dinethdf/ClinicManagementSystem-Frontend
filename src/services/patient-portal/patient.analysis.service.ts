'use server'

import type { PatientAppointmentDTO, LiveQueueDTO } from '@/types/patient-portal/patient.appointments.types';

// --- MOCK DATA ---
const MOCK_APPOINTMENTS: PatientAppointmentDTO[] = [
  {
    id: 101,
    appointmentId: 101,
    doctorName: "Dr. Sarah Perera",
    specialization: "Cardiologist",
    scheduleId: 55,
    scheduleDate: "2026-01-10",
    date: "2026-01-10T09:30:00",
    startTime: "09:30 AM",
    endTime: "12:00 PM",
    queuePosition: 15,
    queueNo: 15,
    status: 'SCHEDULED',
    clinicName: "City Health Clinic",
    location: "Room 4",
    ticketPrice: 2500.00,
    paymentStatus: 'PAID',
    canCancel: true
  },
  {
    id: 102,
    appointmentId: 102,
    doctorName: "Dr. Kamal Gunawardena",
    specialization: "General Physician",
    scheduleId: 60,
    scheduleDate: new Date().toISOString().split('T')[0],
    date: new Date().toISOString(), // Today's date for Live Queue demo
    startTime: "04:00 PM",
    endTime: "06:00 PM",
    queuePosition: 8,
    queueNo: 8,
    status: 'SCHEDULED',
    clinicName: "City Health Clinic",
    location: "Room 1",
    ticketPrice: 1500.00,
    paymentStatus: 'PENDING',
    canCancel: false // < 24h rule
  },
  {
    id: 99,
    appointmentId: 99,
    doctorName: "Dr. Amal Silva",
    specialization: "Dermatologist",
    scheduleId: 40,
    scheduleDate: "2025-12-20",
    date: "2025-12-20T10:00:00",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    queuePosition: 20,
    queueNo: 20,
    status: 'COMPLETED',
    clinicName: "City Health Clinic",
    location: "Room 2",
    ticketPrice: 2000.00,
    paymentStatus: 'PAID',
    canCancel: false
  }
];

// 1. Get Appointments (Simulating Pagination & Tabs)
export async function getPatientAppointments(type: 'UPCOMING' | 'HISTORY', page: number = 0) {
  // Simulate Network Delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = MOCK_APPOINTMENTS.filter(a => {
    const apptDate = new Date(a.date || a.scheduleDate);
    if (type === 'UPCOMING') {
      return apptDate >= today && a.status !== 'COMPLETED' && a.status !== 'CANCELLED';
    } else {
      return apptDate < today || a.status === 'COMPLETED' || a.status === 'CANCELLED';
    }
  });

  // Mock Pagination Logic
  const pageSize = 5;
  const start = page * pageSize;
  const paginatedItems = filtered.slice(start, start + pageSize);

  return {
    success: true,
    data: {
      content: paginatedItems,
      totalPages: Math.ceil(filtered.length / pageSize),
      totalElements: filtered.length
    }
  };
}

// 2. Cancel Appointment
export async function cancelAppointment(appointmentId: number) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In real implementation: await http.patch(...)
  return { success: true, message: "Appointment cancelled successfully." };
}

// 3. Get Live Queue Status (Polling Endpoint)
export async function getLiveQueueStatus(appointmentId: number): Promise<LiveQueueDTO | null> {
  // Mock logic: randomly increment current token to show progress
  const randomCurrent = Math.floor(Math.random() * 5) + 1; 
  
  return {
    appointmentId,
    scheduleId: 101,
    yourToken: 8,
    currentToken: randomCurrent,
    estimatedTime: "04:30 PM",
    status: 'ON_TIME'
  };
}