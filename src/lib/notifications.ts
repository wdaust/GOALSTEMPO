import { Notification } from "@/components/notifications/NotificationCenter";

// Mock notifications data
let notifications: Notification[] = [
  {
    id: "1",
    title: "Bible Reading Reminder",
    message:
      "Don't forget to complete your daily Bible reading goal of 3 chapters.",
    time: "10 minutes ago",
    read: false,
    type: "habit",
  },
  {
    id: "2",
    title: "Meeting Today",
    message: "Midweek meeting starts in 2 hours. Don't forget to prepare!",
    time: "2 hours ago",
    read: false,
    type: "meeting",
  },
  {
    id: "3",
    title: "Goal Progress",
    message: "You're 60% of the way to your field service goal this month!",
    time: "Yesterday",
    read: true,
    type: "goal",
  },
  {
    id: "4",
    title: "New Feature Available",
    message: "Check out the new habit tracking features in the app.",
    time: "2 days ago",
    read: true,
    type: "system",
  },
];

// Get all notifications
export const getNotifications = () => {
  return [...notifications];
};

// Mark a notification as read
export const markAsRead = (id: string) => {
  notifications = notifications.map((notification) =>
    notification.id === id ? { ...notification, read: true } : notification,
  );
  return [...notifications];
};

// Mark all notifications as read
export const markAllAsRead = () => {
  notifications = notifications.map((notification) => ({
    ...notification,
    read: true,
  }));
  return [...notifications];
};

// Clear all notifications
export const clearAllNotifications = () => {
  notifications = [];
  return [];
};

// Add a new notification
export const addNotification = (notification: Omit<Notification, "id">) => {
  const newNotification = {
    ...notification,
    id: Date.now().toString(),
  };
  notifications = [newNotification, ...notifications];
  return [...notifications];
};

// Create a habit reminder notification
export const createHabitReminder = (habitName: string) => {
  return addNotification({
    title: `${habitName} Reminder`,
    message: `It's time to complete your ${habitName} habit.`,
    time: "Just now",
    read: false,
    type: "habit",
  });
};

// Create a break habit milestone notification
export const createBreakHabitMilestone = (
  daysSince: number,
  habitName: string,
) => {
  let message = "";
  let title = "";

  if (daysSince === 1) {
    title = "First Day Achievement";
    message = `You've gone 1 day without ${habitName}. Great start!`;
  } else if (daysSince === 7) {
    title = "One Week Milestone";
    message = `You've gone a full week without ${habitName}. Keep going!`;
  } else if (daysSince === 30) {
    title = "One Month Milestone!";
    message = `Incredible! You've gone 30 days without ${habitName}. This is a significant achievement!`;
  } else if (daysSince === 90) {
    title = "Three Month Milestone!";
    message = `Amazing discipline! You've gone 90 days without ${habitName}. Your new habits are taking root.`;
  } else if (daysSince % 30 === 0) {
    title = `${daysSince / 30} Month Milestone!`;
    message = `You've gone ${daysSince} days without ${habitName}. Your commitment is inspiring!`;
  } else if (daysSince % 7 === 0) {
    title = `${daysSince / 7} Week Milestone!`;
    message = `You've gone ${daysSince} days without ${habitName}. Keep up the great work!`;
  }

  if (title && message) {
    return addNotification({
      title,
      message,
      time: "Just now",
      read: false,
      type: "habit",
    });
  }

  return null;
};

// Create a goal progress notification
export const createGoalProgressNotification = (
  goalName: string,
  progress: number,
) => {
  return addNotification({
    title: `Goal Progress Update`,
    message: `You're ${progress}% of the way to your ${goalName} goal!`,
    time: "Just now",
    read: false,
    type: "goal",
  });
};

// Create a meeting reminder notification
export const createMeetingReminder = (
  meetingName: string,
  timeUntil: string,
) => {
  return addNotification({
    title: `Meeting Reminder`,
    message: `${meetingName} starts in ${timeUntil}.`,
    time: "Just now",
    read: false,
    type: "meeting",
  });
};
