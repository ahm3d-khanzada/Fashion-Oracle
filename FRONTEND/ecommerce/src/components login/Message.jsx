import React from "react";

function Message({ variant, children, onTryAgain, onBack }) {
  const containerStyle = {
    padding: "20px",
    borderRadius: "15px",
    background: "linear-gradient(135deg, #34A85A, #FFC107)",
    color: "#fff",
    textAlign: "center",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    animation: "rollUp 0.8s ease-in-out, float 4s infinite ease-in-out",
    position: "relative",
    overflow: "hidden",
    transformOrigin: "top",
  };

  const overlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))",
    borderRadius: "15px",
    pointerEvents: "none",
  };

  const buttonContainerStyle = {
    marginTop: "15px",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
  };

  const buttonStyle = {
    padding: "10px 20px",
    borderRadius: "25px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    background: "rgba(255, 255, 255, 0.2)",
    color: "#fff",
    backdropFilter: "blur(10px)",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const tryAgainButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #FFC107, #34A85A)",
  };

  const backButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #34A85A, #FFC107)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const backIconStyle = {
    fontSize: "18px",
    transition: "transform 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <div style={overlayStyle}></div>
      {children}
      <div style={buttonContainerStyle}>
        {onTryAgain && (
          <button
            style={tryAgainButtonStyle}
            onClick={onTryAgain}
            onMouseOver={(e) => (e.target.style.transform = "scale(1.05)")}
            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
          >
            Try Again
          </button>
        )}
        {onBack && (
          <button
            style={backButtonStyle}
            onClick={onBack}
            onMouseOver={(e) => {
              e.target.style.transform = "scale(1.05)";
              e.target.querySelector("span").style.transform = "translateX(-5px)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "scale(1)";
              e.target.querySelector("span").style.transform = "translateX(0)";
            }}
          >
            <span style={backIconStyle}>⬅️</span> Go Back
          </button>
        )}
      </div>
    </div>
  );
}

export default Message;