// pages/Profile.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/authcontext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // ✅ Safe access with fallbacks
  const userData = user || {};
  const userEmail = userData.email || 'No email';
  const userName = userData.name || userData.username || 'User';
  const userPhone = userData.phone || 'Not provided';
  const userAddress = userData.address || 'Not provided';

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Profile</h1>
        
        <div style={styles.card}>
          <div style={styles.infoRow}>
            <span style={styles.label}>Name:</span>
            <span style={styles.value}>{userName}</span>
          </div>
          
          <div style={styles.infoRow}>
            <span style={styles.label}>Email:</span>
            <span style={styles.value}>{userEmail}</span>
          </div>
          
          <div style={styles.infoRow}>
            <span style={styles.label}>Phone:</span>
            <span style={styles.value}>{userPhone}</span>
          </div>
          
          <div style={styles.infoRow}>
            <span style={styles.label}>Address:</span>
            <span style={styles.value}>{userAddress}</span>
          </div>
          
          <button 
            onClick={() => {
              logout();
              navigate("/login");
            }}
            style={styles.logoutBtn}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#fff",
    padding: "40px 20px"
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto"
  },
  title: {
    fontSize: "2rem",
    marginBottom: "30px",
    borderLeft: "4px solid #3b82f6",
    paddingLeft: "20px"
  },
  card: {
    background: "#1a1a1a",
    padding: "30px",
    borderRadius: "12px",
    border: "1px solid #2a2a2a"
  },
  infoRow: {
    display: "flex",
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #2a2a2a"
  },
  label: {
    width: "100px",
    color: "#888"
  },
  value: {
    flex: 1,
    color: "#fff",
    fontWeight: "500"
  },
  logoutBtn: {
    width: "100%",
    padding: "15px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "20px"
  }
};

export default Profile;