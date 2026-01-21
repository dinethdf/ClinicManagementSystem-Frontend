'use client'

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/services/firebase';
import type { FirebaseSchedule } from '@/types/firebase.types';

export const useRealtimeSchedule = (scheduleId: number | string) => {
  const [data, setData] = useState<FirebaseSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scheduleId) {
        setLoading(false);
        return;
    }

    // 1. Reference
    const scheduleRef = ref(database, `clinics/${process.env.NEXT_PUBLIC_CLINIC_ID}/schedules/${scheduleId}`);

    // 2. Listener (onValue returns the unsubscribe function directly)
    const unsubscribe = onValue(scheduleRef, (snapshot) => {
      const val = snapshot.val();
      if (val) {
        setData(val as FirebaseSchedule);
      } else {
        setData(null); 
      }
      setLoading(false);
    }, (err) => {
      console.error("Firebase Read Error:", err);
      setError(err.message);
      setLoading(false);
    });

    // 3. Cleanup
    return () => unsubscribe();
    
  }, [scheduleId]);

  console.log(data)
  return { schedule: data, loading, error };
};