import { useState, useEffect, useCallback } from 'react';
import { challengesAPI } from '../services/api';

export const useChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [userChallenges, setUserChallenges] = useState([]);
    const [trendingChallenges, setTrendingChallenges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all available challenges
    const fetchChallenges = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await challengesAPI.getAll();
            setChallenges(data || []);
        } catch (err) {
            console.error('Error fetching challenges:', err);
            setError('Failed to load challenges');
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch user's challenges
    const fetchUserChallenges = useCallback(async () => {
        try {
            setError(null);
            const data = await challengesAPI.getUserChallenges();
            setUserChallenges(data || []);
        } catch (err) {
            console.error('Error fetching user challenges:', err);
            setError('Failed to load your challenges');
        }
    }, []);

    // Fetch trending challenges
    const fetchTrendingChallenges = useCallback(async (limit = 5) => {
        try {
            setError(null);
            const data = await challengesAPI.getTrending(limit);
            setTrendingChallenges(data || []);
        } catch (err) {
            console.error('Error fetching trending challenges:', err);
            setError('Failed to load trending challenges');
        }
    }, []);

    // Join a challenge
    const joinChallenge = useCallback(async (challengeId) => {
        try {
            setError(null);
            await challengesAPI.join(challengeId);
            
            // Refresh user challenges after joining
            await fetchUserChallenges();
            
            return { success: true, message: 'Successfully joined challenge!' };
        } catch (err) {
            console.error('Error joining challenge:', err);
            const errorMessage = err.response?.data?.message || 'Failed to join challenge';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        }
    }, [fetchUserChallenges]);

    // Update challenge progress
    const updateProgress = useCallback(async (challengeId) => {
        try {
            setError(null);
            const result = await challengesAPI.updateProgress(challengeId);
            
            // Refresh user challenges after updating progress
            await fetchUserChallenges();
            
            return { 
                success: true, 
                data: result,
                message: result.completed ? 'Challenge completed! 🎉' : 'Progress updated!'
            };
        } catch (err) {
            console.error('Error updating challenge progress:', err);
            const errorMessage = err.response?.data?.message || 'Failed to update progress';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        }
    }, [fetchUserChallenges]);

    // Leave a challenge
    const leaveChallenge = useCallback(async (challengeId) => {
        try {
            setError(null);
            const result = await challengesAPI.leave(challengeId);
            
            // Refresh user challenges after leaving
            await fetchUserChallenges();
            
            return { 
                success: true, 
                data: result,
                message: 'Successfully left the challenge'
            };
        } catch (err) {
            console.error('Error leaving challenge:', err);
            const errorMessage = err.response?.data?.message || 'Failed to leave challenge';
            setError(errorMessage);
            return { success: false, message: errorMessage };
        }
    }, [fetchUserChallenges]);

    // Get challenge leaderboard
    const getLeaderboard = useCallback(async (challengeId, limit = 20) => {
        try {
            setError(null);
            const data = await challengesAPI.getLeaderboard(challengeId, limit);
            return { success: true, data: data || [] };
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            const errorMessage = err.response?.data?.message || 'Failed to load leaderboard';
            setError(errorMessage);
            return { success: false, message: errorMessage, data: [] };
        }
    }, []);

    // Get challenge statistics
    const getChallengeStats = useCallback(async (challengeId) => {
        try {
            setError(null);
            const data = await challengesAPI.getStats(challengeId);
            return { success: true, data: data || {} };
        } catch (err) {
            console.error('Error fetching challenge stats:', err);
            const errorMessage = err.response?.data?.message || 'Failed to load challenge stats';
            setError(errorMessage);
            return { success: false, message: errorMessage, data: {} };
        }
    }, []);

    // Get user's rank in a challenge
    const getUserRank = useCallback(async (challengeId) => {
        try {
            setError(null);
            const data = await challengesAPI.getUserRank(challengeId);
            return { success: true, rank: data.rank };
        } catch (err) {
            console.error('Error fetching user rank:', err);
            const errorMessage = err.response?.data?.message || 'Failed to load rank';
            setError(errorMessage);
            return { success: false, message: errorMessage, rank: null };
        }
    }, []);

    // Helper functions for data processing
    const getActiveChallenges = useCallback(() => {
        return userChallenges.filter(challenge => challenge.status === 'active');
    }, [userChallenges]);

    const getCompletedChallenges = useCallback(() => {
        return userChallenges.filter(challenge => challenge.status === 'completed');
    }, [userChallenges]);

    const getExpiredChallenges = useCallback(() => {
        return userChallenges.filter(challenge => challenge.status === 'expired');
    }, [userChallenges]);

    const getAvailableChallenges = useCallback(() => {
        const userChallengeIds = userChallenges.map(uc => uc.id);
        return challenges.filter(challenge => !userChallengeIds.includes(challenge.id));
    }, [challenges, userChallenges]);

    const getChallengeProgress = useCallback((challenge) => {
        if (!challenge) return 0;
        return challenge.progress_percentage || 0;
    }, []);

    const getDaysRemaining = useCallback((challenge) => {
        if (!challenge || challenge.status !== 'active') return 0;
        return Math.max(0, challenge.days_remaining || 0);
    }, []);

    const isNearCompletion = useCallback((challenge) => {
        const progress = getChallengeProgress(challenge);
        return progress >= 80 && progress < 100;
    }, [getChallengeProgress]);

    // Load initial data on mount
    useEffect(() => {
        fetchChallenges();
        fetchTrendingChallenges();
    }, [fetchChallenges, fetchTrendingChallenges]);

    // Stats derived from data
    const stats = {
        totalAvailable: challenges.length,
        totalJoined: userChallenges.length,
        active: getActiveChallenges().length,
        completed: getCompletedChallenges().length,
        expired: getExpiredChallenges().length,
        completionRate: userChallenges.length > 0 
            ? Math.round((getCompletedChallenges().length / userChallenges.length) * 100)
            : 0
    };

    return {
        // Data
        challenges,
        userChallenges,
        trendingChallenges,
        
        // State
        loading,
        error,
        
        // Actions
        fetchChallenges,
        fetchUserChallenges,
        fetchTrendingChallenges,
        joinChallenge,
        updateProgress,
        leaveChallenge,
        getLeaderboard,
        getChallengeStats,
        getUserRank,
        
        // Helper functions
        getActiveChallenges,
        getCompletedChallenges,
        getExpiredChallenges,
        getAvailableChallenges,
        getChallengeProgress,
        getDaysRemaining,
        isNearCompletion,
        
        // Stats
        stats,
        
        // Utility
        clearError: () => setError(null)
    };
};
