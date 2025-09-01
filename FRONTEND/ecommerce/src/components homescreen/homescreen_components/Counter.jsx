import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const StatItem = ({ label, value, duration = 2000, delay = 0 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime = null
    let animationFrame

    const updateCount = (timestamp) => {
      if (!startTime) {
        startTime = timestamp
      }
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)
      setCount(Math.floor(value * percentage))

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(updateCount)
      }
    }

    const timer = setTimeout(() => {
      animationFrame = requestAnimationFrame(updateCount)
    }, delay)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(animationFrame)
    }
  }, [value, duration, delay])

  return (
    <motion.div
      className="d-flex flex-column align-items-center mx-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay }}
      whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 200 } }}
    >
      <motion.span
        className="display-1 font-weight-bold mb-2"
        style={{
          background: "linear-gradient(45deg, #34A85A, #FFC107)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          fontSize: "80px",
          fontWeight: "bolder",
        }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 120, delay: delay + 0.2 }}
      >
        {count.toLocaleString()}
      </motion.span>
      <span className="h4 text-light">{label}</span>
    </motion.div>
  )
}

export default function EnhancedHorizontalStatistics() {
  const [timePeriod, setTimePeriod] = useState("daily")
  const stats = {
    daily: { users: 1000, members: 500, tryOns: 2500 },
    weekly: { users: 7000, members: 3500, tryOns: 17500 },
    monthly: { users: 30000, members: 15000, tryOns: 75000 },
  }

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-transparent text-white p-4">
      <h1 className="display-4 font-weight-bold mb-5 text-center text-gradient">
        Revolutionizing Virtual Fashion
      </h1>
      <div className="mb-4 position-relative w-100">
        <motion.select
          className="form-select form-select-lg bg-black text-light border-light rounded-md px-4 py-2"
          style={{
            border: "2px solid transparent",
            background: "black",
            zIndex: 1,
          }}
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          aria-label="Select time period"
          initial={{ scale: 1 }}
          whileHover={{
            scale: 1.05,
            transition: { type: "spring", stiffness: 200 },
          }}
          transition={{ duration: 0.3 }}
        >
          <option value="daily">Daily Stats</option>
          <option value="weekly">Weekly Stats</option>
          <option value="monthly">Monthly Stats</option>
        </motion.select>
        <motion.div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: "linear-gradient(45deg, #34A85A, #FFC107)",
            filter: "blur(5px)",
            zIndex: 0,
            borderRadius: "0.25rem",
            transition: "all 0.3s ease",
          }}
        />
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={timePeriod}
          className="d-flex justify-content-center gap-5 w-100 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatItem label="Registered Users" value={stats[timePeriod].users} delay={0} />
          <StatItem label="Community Members" value={stats[timePeriod].members} delay={0.2} />
          <StatItem label="Virtual Try-Ons" value={stats[timePeriod].tryOns} delay={0.4} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
