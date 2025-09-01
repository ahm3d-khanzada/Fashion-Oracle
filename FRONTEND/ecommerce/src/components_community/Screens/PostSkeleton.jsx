import React from "react";
import { Card } from "react-bootstrap";
import { motion } from "framer-motion";

const styles = {
  card: {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    marginBottom: "20px",
  },
  avatarSkeleton: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    marginRight: "10px",
    backgroundColor: "#333",
  },
  usernameSkeleton: {
    width: "100px",
    height: "20px",
    backgroundColor: "#333",
  },
  imageSkeleton: {
    width: "100%",
    height: "300px",
    backgroundColor: "#333",
  },
  textSkeleton: {
    height: "20px",
    marginBottom: "10px",
    backgroundColor: "#333",
  },
};

export function PostSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card style={styles.card}>
        <Card.Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={styles.avatarSkeleton} />
            <div style={styles.usernameSkeleton} />
          </div>
        </Card.Header>
        <div style={styles.imageSkeleton} />
        <Card.Body>
          <div style={{ ...styles.textSkeleton, width: "60%" }} />
          <div style={{ ...styles.textSkeleton, width: "80%" }} />
        </Card.Body>
      </Card>
    </motion.div>
  );
}