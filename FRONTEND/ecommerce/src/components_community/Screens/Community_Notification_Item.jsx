import { useDispatch } from "react-redux";
import { markNotificationAsRead } from "../../actions/Notification_Action";

function Community_Notification_Item({ notification }) {
  const dispatch = useDispatch();

  const handleClick = () => {
    if (!notification.read) {
      dispatch(markNotificationAsRead(notification.id));
    }
  };

  const getIcon = () => {
    switch (notification.notification_type) {
      case "follow":
        return "👥";
      case "like":
        return "❤️";
      case "comment":
        return "💬";
      case "mention":
        return "@️";
      case "system":
        return ""; 
      case "marked":
        return "🔖";
      case "new_post":
        return "🆕";  // NEW POST ICON
      default:
        return "📣";
    }
  };
  
  

  return (
    <div className={`notification-item ${notification.read ? "read" : "unread"}`} onClick={handleClick}>
      <div className="avatar-container">
      <img
  src={notification?.sender?.profile_pic || "/placeholder.svg"}
  alt="Profile"
  className="user-avatar"
  onError={(e) => {
    if (e.target.src !== window.location.origin + "/placeholder.svg") {
      e.target.onerror = null; // prevent infinite loop
      e.target.src = "/placeholder.svg";
    }
  }}
/>
        {getIcon() && <span className="notification-icon">{getIcon()}</span>}
      </div>

      <div className="notification-content">
        <p>
          <strong>{notification?.sender?.username || "Unknown User"}</strong> {notification.message}
          <span className="time-ago">{new Date(notification.created_at).toLocaleString()}</span>
        </p>
      </div>

      {/* Styling */}
      <style jsx>{`
        .notification-item {
          display: flex;
          align-items: center;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 10px;
          transition: all 0.3s ease;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.8);
          animation: slideInRight 0.5s ease-out;
        }
        .notification-item:hover {
          border-color: #34A85A;
          transform: translateX(5px);
        }
        .notification-item.unread {
          border-left: 4px solid #34A85A;
        }
        .avatar-container {
          position: relative;
          margin-right: 15px;
        }
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        .notification-item:hover .user-avatar {
          transform: scale(1.1);
        }
        .notification-icon {
          position: absolute;
          bottom: -5px;
          right: -5px;
          background: white;
          border-radius: 50%;
          padding: 3px;
          font-size: 0.8rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        .notification-item:hover .notification-icon {
          transform: rotate(15deg);
        }
        .notification-content {
          flex-grow: 1;
        }
        .time-ago {
          color: #999;
          font-size: 0.8rem;
          display: block;
          margin-top: 5px;
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @media (max-width: 768px) {
          .notification-item {
            flex-direction: column;
            align-items: flex-start;
          }
          .avatar-container {
            margin-bottom: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default Community_Notification_Item;
