export interface FirebaseAppointment {
  patientName: string;
  queueNo: number;
  status: 'PENDING' | 'SERVING' | 'COMPLETED' | 'CANCELLED';
}

export interface FirebaseSchedule {
  currentServing: number;
  scheduleStatus: 'PENDING' | 'STARTED' | 'FINISHED' | 'CANCELLED' | 'SCHEDULED';
  doctorName: string;
  specialization: string;
  startedAt: string;
  finishedAt: string;
  date: string;
  time: string;
  cancelReason: string;
  appointments: Record<string, FirebaseAppointment>; // Maps "1", "3" to objects
}