import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { format } from 'date-fns';

const NOTIFICATION_CACHE_KEY = 'notifications_cache';
const NOTIFICATION_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY = 'notifications_cache';
const DEFAULT_LIMIT = 10;

const formatTimestamp = (timestamp) => {
  if (!timestamp) return Date.now();
  
  // If it's a Firestore timestamp
  if (timestamp?.toMillis) {
    return timestamp.toMillis();
  }
  
  // If it's already a number (milliseconds)
  if (typeof timestamp === 'number') {
    return timestamp;
  }
  
  // If it's a date object
  if (timestamp instanceof Date) {
    return timestamp.getTime();
  }
  
  // Default fallback
  return Date.now();
};

// Helper function to convert Firestore timestamp to serializable format
const serializeNotification = (notification) => {
  try {
    let timestamp;
   

    if (!notification.timestamp) {
    
      timestamp = Date.now();
    } else if (notification.timestamp?.toDate) {
      timestamp = notification.timestamp.toDate().getTime();
    } else if (notification.timestamp?.seconds) {
      timestamp = notification.timestamp.seconds * 1000;
    } else if (typeof notification.timestamp === 'number') {
      timestamp = notification.timestamp;
    } else {

      timestamp = Date.now();
    }

    return {
      ...notification,
      timestamp
    };
  } catch (error) {
    console.error('Error serializing notification:', error);
    return {
      ...notification,
      timestamp: Date.now()
    };
  }
};

// Helper function to convert serialized timestamp back to Date
const deserializeNotification = (notification) => {
  try {
    const timestamp = notification.timestamp;
  

    return {
      ...notification,
      timestamp: {
        toDate: () => new Date(timestamp),
        toMillis: () => timestamp,
        seconds: Math.floor(timestamp / 1000)
      }
    };
  } catch (error) {
    console.error('Error deserializing notification:', error);
    const fallbackTime = Date.now();
    return {
      ...notification,
      timestamp: {
        toDate: () => new Date(fallbackTime),
        toMillis: () => fallbackTime,
        seconds: Math.floor(fallbackTime / 1000)
      }
    };
  }
};

export const getNotifications = async (limitParam = DEFAULT_LIMIT) => {
  try {
    // Convert limitParam to number if it's a string
    const limit = parseInt(limitParam, 10) || DEFAULT_LIMIT;
    
    // Get cached notifications
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { notifications, timestamp } = JSON.parse(cachedData);
      // Check if cache is still valid (e.g., less than 5 minutes old)
      if (Date.now() - timestamp < 5 * 60 * 1000) {
        return notifications.slice(0, limit);
      }
    }

    // If no cache or cache expired, fetch from server
    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("workerId", "in", [workerID, "all"]),
      where("hidden", "==", false),
      orderBy("timestamp", "desc"),
      limit(limit)
    );

    const querySnapshot = await getDocs(q);
    const notifications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Cache the new results
    const cacheData = {
      notifications: notifications,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    
    return notifications.slice(0, limit);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const updateNotificationCache = (notifications) => {
  try {
    const serializedNotifications = notifications.map(serializeNotification);
    localStorage.setItem(CACHE_KEY, JSON.stringify(serializedNotifications));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error updating notification cache:', error);
  }
};

export const invalidateNotificationCache = () => {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('Error invalidating notification cache:', error);
  }
};

export const getUnreadCount = () => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const notifications = JSON.parse(cachedData).map(deserializeNotification);
      return notifications.filter(n => !n.read).length;
    }
    return 0;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}; 