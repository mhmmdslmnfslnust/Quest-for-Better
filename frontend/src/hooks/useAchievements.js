import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

export const useAchievements = () => {
    const [achievements, setAchievements] = useState([]);
    const [userAchievements, setUserAchievements] = useState([]);
    const [achievementProgress, setAchievementProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all'); // New status filter

    // Fetch all achievements
    const fetchAchievements = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/achievements');
            setAchievements(response || []);
        } catch (err) {
            console.error('Error fetching achievements:', err);
            setError('Failed to fetch achievements');
            toast.error('Failed to load achievements');
        }
    }, []);

    // Fetch user's earned achievements
    const fetchUserAchievements = useCallback(async () => {
        try {
            const response = await api.get('/achievements/user');
            setUserAchievements(response || []);
        } catch (err) {
            console.error('Error fetching user achievements:', err);
            // Don't show error toast for user achievements as this is called frequently
        }
    }, []);

    // Fetch achievement progress
    const fetchAchievementProgress = useCallback(async () => {
        try {
            const response = await api.get('/achievements/progress');
            setAchievementProgress(response || []);
        } catch (err) {
            console.error('Error fetching achievement progress:', err);
            setError('Failed to fetch achievement progress');
        } finally {
            setLoading(false);
        }
    }, []);

    // Check for new achievements
    const checkAchievements = useCallback(async () => {
        try {
            const response = await api.post('/achievements/check');
            const { newAchievements } = response;
            
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

                // Refresh achievement data
                await Promise.all([
                    fetchUserAchievements(),
                    fetchAchievementProgress()
                ]);
            }
            
            return newAchievements;
        } catch (err) {
            console.error('Error checking achievements:', err);
            return [];
        }
    }, [fetchUserAchievements, fetchAchievementProgress]);

    // Smart sorting function - Earned achievements first
    const sortAchievements = useCallback((achievements) => {
        return [...achievements].sort((a, b) => {
            // Primary sort: Earned achievements first
            if (a.is_earned && !b.is_earned) return -1;
            if (!a.is_earned && b.is_earned) return 1;
            
            // Secondary sort: For locked achievements, sort by progress percentage (highest first)
            if (!a.is_earned && !b.is_earned) {
                const aProgress = a.progress ? (a.progress.current / a.progress.target) * 100 : 0;
                const bProgress = b.progress ? (b.progress.current / b.progress.target) * 100 : 0;
                return bProgress - aProgress;
            }
            
            // Tertiary sort: For earned achievements, sort by earned date (most recent first)
            if (a.is_earned && b.is_earned) {
                return new Date(b.earned_at) - new Date(a.earned_at);
            }
            
            return 0;
        });
    }, []);

    // Enhanced filtering by category AND status
    const filteredAchievements = useMemo(() => {
        let filtered = achievementProgress;
        
        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(achievement => 
                achievement.category === selectedCategory
            );
        }
        
        // Filter by status
        if (selectedStatus !== 'all') {
            switch (selectedStatus) {
                case 'earned':
                    filtered = filtered.filter(achievement => achievement.is_earned);
                    break;
                case 'locked':
                    filtered = filtered.filter(achievement => !achievement.is_earned);
                    break;
                case 'close':
                    filtered = filtered.filter(achievement => {
                        if (achievement.is_earned) return false;
                        const progress = achievement.progress;
                        if (!progress) return false;
                        return (progress.current / progress.target) >= 0.8; // 80% or more
                    });
                    break;
                default:
                    break;
            }
        }
        
        // Always apply smart sorting
        return sortAchievements(filtered);
    }, [achievementProgress, selectedCategory, selectedStatus, sortAchievements]);

    // Get category emoji
    const getCategoryEmoji = (category) => {
        const emojiMap = {
            'streak': '🔥',
            'points': '💎',
            'habits': '🎯',
            'special': '🌟'
        };
        return emojiMap[category] || '🏅';
    };

    // Get achievement categories with counts
    const categories = useMemo(() => {
        const categoryMap = new Map();
        categoryMap.set('all', { name: 'All', count: achievementProgress.length, emoji: '🏆' });
        
        achievementProgress.forEach(achievement => {
            const category = achievement.category;
            if (!categoryMap.has(category)) {
                const emoji = getCategoryEmoji(category);
                categoryMap.set(category, { name: category, count: 0, emoji });
            }
            categoryMap.get(category).count++;
        });
        
        return Array.from(categoryMap.entries()).map(([key, value]) => ({
            key,
            ...value
        }));
    }, [achievementProgress]);

    // Enhanced achievement statistics with status counts
    const stats = useMemo(() => {
        const earned = achievementProgress.filter(a => a.is_earned);
        const locked = achievementProgress.filter(a => !a.is_earned);
        const close = achievementProgress.filter(a => {
            if (a.is_earned) return false;
            const progress = a.progress;
            if (!progress) return false;
            return (progress.current / progress.target) >= 0.8;
        });
        
        const byRarity = {
            common: earned.filter(a => a.rarity === 'common').length,
            rare: earned.filter(a => a.rarity === 'rare').length,
            epic: earned.filter(a => a.rarity === 'epic').length,
            legendary: earned.filter(a => a.rarity === 'legendary').length
        };
        
        return {
            total: achievementProgress.length,
            earned: earned.length,
            locked: locked.length,
            close: close.length,
            percentage: achievementProgress.length > 0 
                ? Math.round((earned.length / achievementProgress.length) * 100) 
                : 0,
            byRarity,
            totalPoints: earned.reduce((sum, a) => sum + a.points_reward, 0)
        };
    }, [achievementProgress]);

    // Initial data fetch
    useEffect(() => {
        const initializeData = async () => {
            await fetchAchievements();
            await Promise.all([
                fetchUserAchievements(),
                fetchAchievementProgress()
            ]);
        };
        
        initializeData();
    }, [fetchAchievements, fetchUserAchievements, fetchAchievementProgress]);

    return {
        // Data
        achievements,
        userAchievements,
        achievementProgress,
        filteredAchievements,
        categories,
        stats,
        
        // State
        loading,
        error,
        selectedCategory,
        selectedStatus,
        
        // Actions
        setSelectedCategory,
        setSelectedStatus,
        fetchAchievements,
        fetchUserAchievements,
        fetchAchievementProgress,
        checkAchievements,
        
        // Utils
        getCategoryEmoji,
        sortAchievements
    };
};
