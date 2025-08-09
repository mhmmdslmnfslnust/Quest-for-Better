import { useState, useEffect } from 'react';
import api from '../services/api';

const useAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [patterns, setPatterns] = useState(null);
  const [correlations, setCorrelations] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [achievements, setAchievements] = useState(null);
  const [community, setCommunity] = useState(null);

  const fetchAnalytics = async (period = '30') => {
    try {
      setLoading(true);
      setError(null);
      
      const [
        overviewRes,
        patternsRes,
        correlationsRes,
        predictionsRes,
        achievementsRes,
        communityRes
      ] = await Promise.all([
        api.get(`/analytics/overview?period=${period}`),
        api.get('/analytics/patterns'),
        api.get('/analytics/correlations'),
        api.get('/analytics/predictions'),
        api.get('/analytics/achievements'),
        api.get('/analytics/community')
      ]);

      setOverview(overviewRes || null);
      setPatterns(patternsRes || null);
      setCorrelations(correlationsRes || null);
      setPredictions(predictionsRes || null);
      setAchievements(achievementsRes || null);
      setCommunity(communityRes || null);
      
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch daily data for specific month
  const fetchDailyData = async (month) => {
    try {
      const response = await api.get(`/analytics/patterns?month=${month}`);
      return response?.daily_breakdown || [];
    } catch (err) {
      console.error('Error fetching daily data:', err);
      return [];
    }
  };

  // Generate smart insights from the data
  const generateInsights = () => {
    if (!overview || !patterns || !predictions) return [];
    
    const insights = [];
    
    // Pattern insights
    if (patterns.daily_patterns && patterns.daily_patterns.length > 0) {
      const bestDay = patterns.daily_patterns.reduce((best, day) => 
        day.success_rate > best.success_rate ? day : best
      );
      
      const worstDay = patterns.daily_patterns.reduce((worst, day) => 
        day.success_rate < worst.success_rate ? day : worst
      );
      
      if (bestDay.success_rate - worstDay.success_rate > 20) {
        insights.push({
          title: 'Weekly Pattern Detected',
          description: `You perform best on ${bestDay.day_of_week}s (${bestDay.success_rate}%) and struggle most on ${worstDay.day_of_week}s (${worstDay.success_rate}%). Consider adjusting your ${worstDay.day_of_week} routine.`,
          subType: 'pattern'
        });
      }
    }
    
    // Time pattern insights
    if (patterns.hourly_patterns && patterns.hourly_patterns.length > 0) {
      const bestHour = patterns.hourly_patterns.reduce((best, hour) => 
        hour.success_rate > best.success_rate ? hour : best
      );
      
      if (bestHour.success_rate >= 80) {
        insights.push({
          title: 'Peak Performance Time',
          description: `Your success rate is highest at ${bestHour.hour}:00 (${bestHour.success_rate}%). Consider scheduling important habits during this time.`,
          subType: 'pattern'
        });
      }
    }
    
    // Wellness score insights
    if (overview.wellness_score >= 85) {
      insights.push({
        title: 'Excellent Consistency',
        description: `Your wellness score of ${overview.wellness_score} shows outstanding habit consistency. You're in the top 10% of users!`,
        subType: 'success'
      });
    }
    
    // Category balance insights
    if (overview.category_performance && overview.category_performance.length > 1) {
      const avgSuccessRate = overview.category_performance.reduce((sum, cat) => sum + cat.success_rate, 0) / overview.category_performance.length;
      const unbalanced = overview.category_performance.filter(cat => Math.abs(cat.success_rate - avgSuccessRate) > 25);
      
      if (unbalanced.length > 0) {
        const struggling = unbalanced.filter(cat => cat.success_rate < avgSuccessRate);
        if (struggling.length > 0) {
          insights.push({
            title: 'Category Imbalance',
            description: `Your ${struggling[0].category} habits (${struggling[0].success_rate}%) need attention compared to your overall average (${Math.round(avgSuccessRate)}%).`,
            subType: 'improvement'
          });
        }
      }
    }
    
    return insights;
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    loading,
    error,
    overview,
    patterns,
    correlations,
    predictions,
    achievements,
    community,
    insights: generateInsights(),
    fetchAnalytics,
    fetchDailyData
  };
};

export default useAnalytics;
