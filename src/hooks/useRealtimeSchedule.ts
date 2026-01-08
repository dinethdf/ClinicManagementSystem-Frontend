'use client'

import { useEffect, useState } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '@/services/firebase';
import type { FirebaseSchedule } from '@/types/firebase.types';

export const useRealtimeSchedule = (clinicId: number | string, scheduleId: number | string) => {
  const [data, setData] = useState<FirebaseSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clinicId || !scheduleId) return;

    // 1. Reference the specific schedule path
    const scheduleRef = ref(database, `clinics/${clinicId}/schedules/${scheduleId}`);


    // 2. Set up the listener
    const unsubscribe = onValue(scheduleRef, (snapshot) => {
      const val = snapshot.val();
      
      if (val) {
        setData(val as FirebaseSchedule);
      } else {
        setData(null); // Schedule might not exist yet
      }
      setLoading(false);
    }, (err) => {
      console.error("Firebase Read Error:", err);
      setError(err.message);
      setLoading(false);
    });

    // 3. Cleanup listener on unmount
    
    return () => off(scheduleRef);
  }, [clinicId, scheduleId]);

  console.log(data)
  return { schedule: data, loading, error };
};