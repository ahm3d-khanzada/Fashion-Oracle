function NotificationSkeleton() {
    return (
      <div className="notification-skeleton">
        <div className="avatar-skeleton"></div>
        <div className="content-skeleton">
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <style jsx>{`
          .notification-skeleton {
            display: flex;
            align-items: center;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 10px;
            background: rgba(255, 255, 255, 0.8);
            animation: pulse 1.5s infinite;
          }
          .avatar-skeleton {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #e0e0e0;
            margin-right: 15px;
          }
          .content-skeleton {
            flex-grow: 1;
          }
          .line {
            height: 10px;
            background: #e0e0e0;
            margin-bottom: 8px;
            border-radius: 4px;
          }
          .line:last-child {
            width: 60%;
          }
          @keyframes pulse {
            0% {
              opacity: 0.6;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0.6;
            }
          }
        `}</style>
      </div>
    )
  }
  
  export default NotificationSkeleton
  
  