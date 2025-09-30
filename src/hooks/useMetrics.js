import { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config/api.js';

// Хук для отслеживания метрик (визиты, длительность сессии)
export function useMetrics() {
  const [sessionId] = useState(() => 
    'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  );
  const [sessionStart] = useState(() => Date.now());

  useEffect(() => {
    // Регистрируем начало визита
    const registerVisit = async () => {
      try {
        await fetch(API_ENDPOINTS.VISIT_METRICS, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ session_id: sessionId })
        });
      } catch (error) {
        console.error('Error registering visit:', error);
      }
    };

    registerVisit();
  }, [sessionId]);

  useEffect(() => {
    // Обновляем длительность сессии каждые 30 секунд
    const updateSessionDuration = async () => {
      const duration = Math.floor((Date.now() - sessionStart) / 1000);
      try {
        await fetch(API_ENDPOINTS.SESSION_METRICS, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            session_id: sessionId, 
            duration_sec: duration 
          })
        });
      } catch (error) {
        console.error('Error updating session duration:', error);
      }
    };

    const interval = setInterval(updateSessionDuration, 30000); // 30 секунд

    // Обновляем при выходе
    const handleBeforeUnload = () => {
      const duration = Math.floor((Date.now() - sessionStart) / 1000);
      navigator.sendBeacon(
        API_ENDPOINTS.SESSION_METRICS,
        JSON.stringify({
          session_id: sessionId,
          duration_sec: duration
        })
      );
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [sessionId, sessionStart]);

  return { sessionId };
}
