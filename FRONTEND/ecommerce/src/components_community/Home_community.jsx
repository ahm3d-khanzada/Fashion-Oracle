import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Post from "../components_community/Screens/Post";
import { PostSkeleton } from "../components_community/Screens/PostSkeleton";
import { fetchPosts } from "../actions/PostAction";
import { Alert } from "react-bootstrap";
import { motion } from "framer-motion";

const BASE_URL = "http://localhost:8000"; // 🔁 Adjust this in production

const styles = {
  container: {
    backgroundColor: "#000000",
    color: "#fff",
    minHeight: "100vh",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    background: "linear-gradient(to right, #34A85A, #FFC107)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  arrowButton: {
    backgroundColor: "#262626",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  mainContent: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  errorAlert: {
    backgroundColor: "#ff3333",
    color: "#fff",
    border: "none",
    marginBottom: "20px",
  },
  noPostsMessage: {
    textAlign: "center",
    fontSize: "18px",
    color: "#fff",
  },
};

// Dummy post data
const dummyPost = {
  id: "dummy1",
  username: "john_doe",
  profile_pic:
    "http://localhost:8000/media/profile_pic/default.png",
  image:
    "https://images.unsplash.com/photo-1567013514336-6de53c9e7e63?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvdCUyMHdvbWFufGVufDB8fDB8fHww",
  likes: 123,
  caption: "This is a dummy post caption.",
  comments: [
    { id: "1", username: "jane_doe", text: "Nice post!" },
    { id: "2", username: "alice", text: "Great content!" },
  ],
  isLiked: false,
  isVerified: true,
};

export default function Home_community() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { posts, profile, loading: postsLoading, error: postsError } = useSelector((state) => state.posts);
  const [showSkeleton, setShowSkeleton] = useState(true);

  const { userInfo } = useSelector((state) => state.userSignin);
  const username = userInfo?.username || "User";

  useEffect(() => {
    dispatch(fetchPosts());
    setTimeout(() => setShowSkeleton(false), 3000);
  }, [dispatch]);

  const greeting = new Date().getHours() < 12 ? "Good Morning" : "Good Afternoon";

  const postsArray = Array.isArray(posts) ? posts : [];

  const handleProfileNavigation = () => {
    navigate("/community/profile");
  };

  // Handle profile picture URL
  const profilePicURL = userInfo?.profile_pic
    ? userInfo.profile_pic.startsWith("http")
      ? userInfo.profile_pic
      : `${BASE_URL}${userInfo.profile_pic}`
    : dummyPost.profile_pic;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>
          {greeting}, {username}!
        </h1>
        <button style={styles.arrowButton} onClick={handleProfileNavigation}>
          <img
            src={profilePicURL}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = dummyPost.profile_pic;
            }}
            alt="Profile"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </button>
      </header>

      <main style={styles.mainContent}>
        {postsError && (
          <Alert variant="danger" style={styles.errorAlert}>
            <i className="bi bi-exclamation-circle me-2"></i>
            <strong>Error:</strong> Unable to fetch data. Please try again later.
          </Alert>
        )}

        {showSkeleton ? (
          <>
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : postsArray.length > 0 ? (
          postsArray.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Post {...post} />
            </motion.div>
          ))
        ) : (
          <>
            <p style={styles.noPostsMessage}>No posts found. Here's a dummy post for you!</p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Post {...dummyPost} />
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
