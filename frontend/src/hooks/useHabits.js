import { useState, useEffect, useCallback } from 'react';
import { habitsAPI } from '../services/api';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useHabits = () => {
  const [habits, setHabits] = useState([]);
  const [todayLogs, setTodayLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all habits
  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await habitsAPI.getAll();
      // Ensure data is an array
      setHabits(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to fetch habits');
      console.error('Fetch habits error:', err);
      setHabits([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch today's status
  const fetchTodayStatus = useCallback(async () => {
    try {
      const data = await habitsAPI.getTodayStatus();
      setTodayLogs(data);
    } catch (err) {
      console.error('Fetch today status error:', err);
    }
  }, []);

  // Create a new habit
  const createHabit = useCallback(async (habitData) => {
    try {
      setLoading(true);
      const newHabit = await habitsAPI.create(habitData);
      setHabits(prev => [...prev, newHabit]);
      toast.success('Habit created successfully!');
      return newHabit;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create habit';
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update habit
  const updateHabit = useCallback(async (id, habitData) => {
    try {
      setLoading(true);
      const updatedHabit = await habitsAPI.update(id, habitData);
      setHabits(prev => prev.map(habit => 
        habit.id === id ? updatedHabit : habit
      ));
      toast.success('Habit updated successfully!');
      return updatedHabit;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update habit';
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete habit
  const deleteHabit = useCallback(async (id) => {
    try {
      setLoading(true);
      await habitsAPI.delete(id);
      setHabits(prev => prev.filter(habit => habit.id !== id));
      toast.success('Habit deleted successfully!');
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete habit';
      toast.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Log habit completion
  const logHabitCompletion = useCallback(async (habitId, success, notes = '') => {
    try {
      const logData = await habitsAPI.logCompletion(habitId, { 
        success, 
        notes 
      });
      
      // Update today's logs
      setTodayLogs(prev => {
        const existingIndex = prev.findIndex(log => log.habit_id === habitId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = logData;
          return updated;
        } else {
          return [...prev, logData];
        }
      });

      // Update habit stats
      await fetchHabits();
      
      // Check for new achievements after successful habit completion
      if (success) {
        try {
          const achievementResponse = await api.post('/achievements/check');
          const { newAchievements } = achievementResponse.data.data;
          
          if (newAchievements && newAchievements.length > 0) {
            // Show celebration toast for each new achievement
            newAchievements.forEach(achievement => {
              toast.success(
                `🎉 Achievement Unlocked: ${achievement.name}!`,
                {
                  duration: 5000,
                  style: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: '600'
                  }
                }
              );
            });
          }
        } catch (achievementError) {
          console.error('Error checking achievements:', achievementError);
          // Don't throw - achievements are nice-to-have, not critical
        }
      }
      
      toast.success(success ? 'Habit completed! 🎉' : 'Progress logged');
      return logData;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to log habit';
      toast.error(errorMsg);
      throw err;
    }
  }, [fetchHabits]);

  // Get habit logs for a specific period
  const getHabitLogs = useCallback(async (habitId, startDate, endDate) => {
    try {
      return await habitsAPI.getLogs(habitId, startDate, endDate);
    } catch (err) {
      console.error('Fetch habit logs error:', err);
      return [];
    }
  }, []);

  // Check if habit is completed today
  const isHabitCompletedToday = useCallback((habitId) => {
    const todayLog = todayLogs.find(log => log.habit_id === habitId);
    return todayLog?.success || false;
  }, [todayLogs]);

  // Get today's log for a habit
  const getTodayLog = useCallback((habitId) => {
    return todayLogs.find(log => log.habit_id === habitId) || null;
  }, [todayLogs]);

  // Calculate habit statistics
  const getHabitStats = useCallback((habit) => {
    const completionRate = habit.total_logs > 0 
      ? Math.round((habit.successful_logs / habit.total_logs) * 100) 
      : 0;
    
    return {
      completionRate,
      currentStreak: habit.current_streak || 0,
      bestStreak: habit.best_streak || 0,
      totalLogs: habit.total_logs || 0,
      successfulLogs: habit.successful_logs || 0,
      pointsEarned: habit.points_earned || 0
    };
  }, []);

  // Initialize data on mount
  useEffect(() => {
    fetchHabits();
    fetchTodayStatus();
  }, [fetchHabits, fetchTodayStatus]);

  return {
    habits,
    todayLogs,
    loading,
    error,
    fetchHabits,
    fetchTodayStatus,
    createHabit,
    updateHabit,
    deleteHabit,
    logHabitCompletion,
    getHabitLogs,
    isHabitCompletedToday,
    getTodayLog,
    getHabitStats
  };
};
