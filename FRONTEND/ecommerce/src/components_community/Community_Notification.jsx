"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchNotifications } from "../actions/Notification_Action"
import NotificationItem from "./Screens/Community_Notification_Item"
import NotificationSkeleton from "./Screens/NotificationSkeleton"

function Community_Notification() {
  const dispatch = useDispatch()
  const { notifications, loading, error } = useSelector((state) => state.notifications)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    dispatch(fetchNotifications())
    // Simulate loading time for skeleton
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [dispatch])

  const groupNotifications = (notifications) => {
    if (!Array.isArray(notifications)) {
      return {}
    }
    return notifications.reduce((groups, notification) => {
      const date = new Date(notification.created_at)
      const now = new Date()
      const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))

      let group
      if (diffDays === 0) {
        group = "Today"
      } else if (diffDays === 1) {
        group = "Yesterday"
      } else if (diffDays <= 7) {
        group = "This week"
      } else {
        group = "Earlier"
      }

      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(notification)
      return groups
    }, {})
  }

  const groupedNotifications = groupNotifications(notifications)

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="notification-system">
      <h1 className="notification-title">Notifications</h1>
      <div className="notification-container">
        {isLoading
          ? Array(5)
              .fill()
              .map((_, index) => <NotificationSkeleton key={index} />)
          : Object.entries(groupedNotifications).map(([group, groupNotifications]) => (
              <div key={group} className="notification-group">
                <h2 className="group-title">{group}</h2>
                {groupNotifications.map((notification) => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            ))}
      </div>
      <style jsx>{`
        .notification-system {
          padding: 20px;
          min-height: 100vh;
        }
        .notification-title {
          font-size: 2rem;
          margin-bottom: 20px;
          color: #34A85A;
          text-align: center;
          animation: fadeInDown 0.5s ease-out;
        }
        .notification-container {
          max-width: 600px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          padding: 20px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .notification-group {
          margin-bottom: 20px;
          animation: fadeIn 0.5s ease-out;
        }
        .group-title {
          font-size: 1.2rem;
          margin-bottom: 10px;
          color: #34A85A;
          border-bottom: 2px solid #FFC107;
          padding-bottom: 5px;
        }
        .error {
          font-size: 1.2rem;
          text-align: center;
          margin-top: 50px;
          color: #34A85A;
        }
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 768px) {
          .notification-system {
            padding: 15px;
          }
          .notification-title {
            font-size: 1.5rem;
          }
          .notification-container {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  )
}

export default Community_Notification

