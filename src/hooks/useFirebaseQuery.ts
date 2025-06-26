
import { useState, useEffect, useCallback } from 'react';
import { Query, onSnapshot, getDocs } from 'firebase/firestore';

interface UseFirebaseQueryOptions {
  realtime?: boolean;
  enabled?: boolean;
}

export const useFirebaseQuery = <T>(
  query: Query | null,
  options: UseFirebaseQueryOptions = {}
) => {
  const { realtime = false, enabled = true } = options;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!query || !enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Executing Firebase query...');
      
      const querySnapshot = await getDocs(query);
      const results: T[] = [];
      
      querySnapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data()
        } as T);
      });
      
      console.log('Query completed, found:', results.length, 'documents');
      setData(results);
    } catch (err) {
      console.error('Firebase query error:', err);
      setError('Failed to fetch data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [query, enabled]);

  useEffect(() => {
    if (!query || !enabled) {
      setLoading(false);
      return;
    }

    if (realtime) {
      console.log('Setting up real-time listener...');
      const unsubscribe = onSnapshot(
        query,
        (querySnapshot) => {
          const results: T[] = [];
          querySnapshot.forEach((doc) => {
            results.push({
              id: doc.id,
              ...doc.data()
            } as T);
          });
          console.log('Real-time update received:', results.length, 'documents');
          setData(results);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error('Real-time listener error:', error);
          setError('Connection error. Please refresh the page.');
          setLoading(false);
        }
      );

      return () => {
        console.log('Cleaning up real-time listener');
        unsubscribe();
      };
    } else {
      fetchData();
    }
  }, [query, enabled, realtime, fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};
