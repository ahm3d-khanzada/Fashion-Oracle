"use client";

import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { motion, AnimatePresence } from "framer-motion";
import {
  searchUsers,
  clearRecentSearches,
} from "../../actions/Search_Action";
import { useNavigate } from "react-router-dom";

const styles = {
  searchContainer: {
    minHeight: "100vh",
    backgroundColor: "#000",
    padding: "20px",
  },
  searchWrapper: {
    maxWidth: "600px",
    margin: "0 auto",
  },
  searchTitle: {
    color: "#fff",
    marginBottom: "20px",
    fontSize: "24px",
  },
  searchInputContainer: {
    position: "relative",
    marginBottom: "20px",
  },
  searchInput: {
    width: "100%",
    padding: "12px 40px 12px 15px",
    borderRadius: "8px",
    border: "1px solid rgba(52, 168, 90, 0.3)",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "#fff",
    fontSize: "16px",
    transition: "all 0.3s ease",
  },
  clearButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "20px",
    cursor: "pointer",
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
    background:
      "linear-gradient(145deg, rgba(52, 168, 90, 0.1), rgba(255, 193, 7, 0.1))",
    border: "1px solid rgba(52, 168, 90, 0.2)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  userAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    marginRight: "15px",
    border: "2px solid #34A85A",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: "#fff",
    margin: 0,
    fontSize: "16px",
  },
  recentSection: {
    marginTop: "20px",
  },
  recentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  recentTitle: {
    color: "#fff",
    fontSize: "18px",
    margin: 0,
  },
  clearAll: {
    background: "none",
    border: "none",
    color: "#34A85A",
    cursor: "pointer",
    fontSize: "14px",
  },
  loadingSpinner: {
    color: "#34A85A",
    textAlign: "center",
    padding: "20px",
  },
  searchResults: {
    animation: "fadeIn 0.3s ease-out",
  },
  errorMessage: {
    color: "#FFC107",
    textAlign: "center",
    padding: "20px",
  },
};

const Community_Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { users, recentSearches, loading, error } = useSelector(
    (state) => state.search,
  );
  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query) {
        dispatch(searchUsers(query));
      }
    }, 500),
    [dispatch]
  );

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const getUserIdFromProfileUrl = (profileUrl) => {
    if (!profileUrl) return null;
    const match = profileUrl.match(/\/(\d+)\/$/);
    return match ? match[1] : null;
  };

  const renderUserCard = (user) => {
    const userId = getUserIdFromProfileUrl(user.profile_url) || user.user_id || user.id;

    return (
      <motion.div
        key={userId || user.username}
        style={styles.userCard}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        onClick={() => {
          if (userId) {
            navigate(`/community/profile/${userId}`);
          } else {
            console.error("User ID is undefined");
          }
        }}
      >
        <img
          src={user.profile_pic || user.image || "https://via.placeholder.com/50"}
          alt="user"
          style={styles.userAvatar}
        />
        <div style={styles.userInfo}>
          <h3 style={styles.userName}>{user.username}</h3>
        </div>
      </motion.div>
    );
  };

  // Remove duplicates from recentSearches based on username
  const uniqueRecentSearches = Array.from(
    new Map(recentSearches.map((user) => [user.username, user])).values()
  );

  return (
    <div style={styles.searchContainer}>
      <div style={styles.searchWrapper}>
        <h1 style={styles.searchTitle}>Search</h1>

        <div style={styles.searchInputContainer}>
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
          />
          {searchTerm && (
            <button
              style={styles.clearButton}
              onClick={() => setSearchTerm("")}
            >
              ×
            </button>
          )}
        </div>

        {!searchTerm && (
          <div style={styles.recentSection}>
            <div style={styles.recentHeader}>
              <h2 style={styles.recentTitle}>Recent</h2>
              <button
                style={styles.clearAll}
                onClick={() => dispatch(clearRecentSearches())}
              >
                Clear All
              </button>
            </div>
            <AnimatePresence>
              {uniqueRecentSearches.map((user) => renderUserCard(user))}
            </AnimatePresence>
          </div>
        )}

        {loading ? (
          <div style={styles.loadingSpinner}>Loading...</div>
        ) : error ? (
          <div style={styles.errorMessage}>{error}</div>
        ) : (
          <div style={styles.searchResults}>
            <AnimatePresence>
              {users.map((user) => renderUserCard(user))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community_Search;
