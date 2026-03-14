// pages/Login.jsx - Correct version
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/authcontext";
import axios from "axios";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from || "/";
  const message = location.state?.message;
  const savedRedirect = localStorage.getItem("redirectAfterLogin");
  const savedCartData = localStorage.getItem("cartData");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/token/", {
        email,
        password
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      
      const userData = { email };
      localStorage.setItem("user", JSON.stringify(userData));
      login(userData);

      toast.success("Login successful!");

      const finalRedirect = savedRedirect || from;
      const cartData = savedCartData ? JSON.parse(savedCartData) : null;
      
      localStorage.removeItem("redirectAfterLogin");
      localStorage.removeItem("cartData");
      
      if (finalRedirect === "/checkout" && cartData) {
        navigate("/checkout", { state: cartData, replace: true });
      } else {
        navigate(finalRedirect, { replace: true });
      }

    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h1 style={styles.title}>Welcome Back</h1>
          
          {message && (
            <div style={styles.messageBox}>
              <p style={styles.message}>{message}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <button 
              type="submit" 
              disabled={loading}
              style={styles.button}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ✅ Styles - NOT exported, just a constant inside the file
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a0a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    maxWidth: "400px",
    width: "90%"
  },
  formContainer: {
    background: "#1a1a1a",
    padding: "40px",
    borderRadius: "16px"
  },
  title: {
    fontSize: "2rem",
    color: "#fff",
    marginBottom: "20px",
    textAlign: "center"
  },
  messageBox: {
    background: "#2a2a2a",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px"
  },
  message: {
    color: "#3b82f6",
    textAlign: "center",
    margin: 0
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#222",
    color: "#fff",
    fontSize: "1rem"
  },
  button: {
    padding: "14px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer"
  }
};