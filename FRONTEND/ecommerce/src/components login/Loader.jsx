import React from "react";

function Loader() {
  return (
    <div style={styles.container}>
      <div style={styles.rippleWrapper}>
        {/* Main pulsating core */}
        <div style={styles.core}></div>
        
        {/* Ripple waves */}
        <div style={styles.ripple}></div>
        <div style={{ ...styles.ripple, animationDelay: "0.5s" }}></div>
        <div style={{ ...styles.ripple, animationDelay: "1s" }}></div>
        
        {/* Gradient overlay for depth */}
        <div style={styles.gradientOverlay}></div>
      </div>
      <p style={styles.loadingText}>Loading...</p>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  rippleWrapper: {
    position: "relative",
    width: "120px",
    height: "120px",
  },
  core: {
    position: "absolute",
    width: "40px",
    height: "40px",
    backgroundColor: "#34A85A",
    borderRadius: "50%",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    filter: "drop-shadow(0 0 8px #34A85A)",
    animation: "pulse 2s infinite cubic-bezier(0.4, 0, 0.2, 1)",
  },
  ripple: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    animation: "ripple 2s infinite cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 0 0 0 rgba(255, 193, 7, 0.4)",
  },
  gradientOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "conic-gradient(#34A85A 0% 25%, #FFC107 25% 50%, #34A85A 50% 75%, #FFC107 75% 100%)",
    borderRadius: "50%",
    animation: "rotate 4s linear infinite",
    opacity: "0.3",
    mixBlendMode: "overlay",
  },
  loadingText: {
    marginTop: "32px",
    fontSize: "1.2rem",
    fontWeight: "600",
    background: "linear-gradient(90deg, #34A85A, #FFC107)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "textGlow 2s infinite alternate",
  },
};

// Animation keyframes
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
  }
  
  @keyframes ripple {
    0% { transform: scale(0.6); opacity: 1; box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4); }
    100% { transform: scale(1.4); opacity: 0; box-shadow: 0 0 0 20px rgba(255, 193, 7, 0); }
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes textGlow {
    0% { filter: drop-shadow(0 0 4px #34A85A); }
    100% { filter: drop-shadow(0 0 8px #FFC107); }
  }
`;
document.head.appendChild(styleSheet);

export default Loader;