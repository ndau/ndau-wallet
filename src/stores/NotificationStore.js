// asyncStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_KEY = 'notifications';

export const saveNotifications = async (notifications) => {
    try {
        await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (error) {
        console.error('Error saving notifications:', error);
    }
};

export const getNotifications = async () => {
    try {
        const data = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error retrieving notifications:', error);
        return [];
    }
};
