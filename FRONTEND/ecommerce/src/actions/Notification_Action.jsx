import * as types from "../constants/Notification_Constant"
import axios from "axios"
const getToken = () => localStorage.getItem('accessToken');

// Dummy notifications data
const dummyNotifications = [
  {
    id: 1,
    type: "follow",
    message: "started following you.",
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    read: false,
    sender: {
      username: "john_doe",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
  },
  {
    id: 2,
    type: "like",
    message: "liked your post.",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    sender: {
      username: "jane_smith",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
  },
  {
    id: 3,
    type: "comment",
    message: "commented on your photo: 'Great shot!'",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    sender: {
      username: "photo_enthusiast",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
  },
  {
    id: 4,
    type: "mention",
    message: "mentioned you in a comment: '@you Check this out!'",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    read: false,
    sender: {
      username: "social_butterfly",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
  },
  {
    id: 5,
    type: "follow",
    message: "started following you.",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    read: true,
    sender: {
      username: "new_user123",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
  },
  {
    id: 6,
    type: "like",
    message: "liked your comment.",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    read: true,
    sender: {
      username: "comment_lover",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
  },
  {
    id: 7,
    type: "system",
    message: "Welcome to our platform! Here's a quick tour to get you started.",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    read: false,
    sender: {
      username: "System",
      avatar: "/system-icon.png",
    },
  },
  {
    id: 8,
    type: "marked",
    message: "marked your post as favorite.",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    read: false,
    sender: {
      username: "post_enthusiast",
      avatar: "https://i.pravatar.cc/150?img=6",
    },
  },
]



// Fetch all notifications
export const fetchNotifications = () => async (dispatch) => {
  dispatch({ type: types.FETCH_NOTIFICATIONS_REQUEST }); // <-- move this to the top before API call

  try {
    const token = getToken();
    if (!token) throw new Error("No authentication token found");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await axios.get(
      "http://127.0.0.1:8000/api/user/notifications/",
      config
    );

    dispatch({
      type: types.FETCH_NOTIFICATIONS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.FETCH_NOTIFICATIONS_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};

// Mark a single notification as read
export const markNotificationAsRead = (notificationId) => async (dispatch) => {
  try {
    const token = getToken();
    if (!token) throw new Error("No authentication token found");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.patch(
      `http://127.0.0.1:8000/api/user/notifications/read/${notificationId}/`,
      {},
      config
    );

    dispatch({ type: types.MARK_NOTIFICATION_READ, payload: notificationId });
  } catch (error) {
    console.error("Error marking notification as read:", error.response?.data || error.message);
  }
};

