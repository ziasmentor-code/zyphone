// pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);

    try {
      // ✅ ഇമെയിലിനൊപ്പം username കൂടി അയക്കുന്നു
      const response = await axios.post("http://127.0.0.1:8000/api/register/", {
        email: email,
        password: password,
        username: email // Django-യുടെ 'The given username must be set' എറർ ഒഴിവാക്കാൻ ഇത് സഹായിക്കും
      });

      console.log("Signup response:", response.data);
      
      toast.success("Account created successfully! Please login.");
      navigate("/login");

    } catch (error) {
      console.error("Signup error:", error.response?.data);
      
      // ബാക്കെൻഡിൽ നിന്നുള്ള കൃത്യമായ എറർ മെസ്സേജ് കാണിക്കാൻ
      const backendError = error.response?.data;
      if (backendError?.error) {
        toast.error(backendError.error);
      } else if (backendError?.email) {
        toast.error("Email: " + backendError.email[0]);
      } else if (backendError?.username) {
        toast.error("Username: " + backendError.username[0]);
      } else {
        toast.error("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Sign up to get started</p>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {})
              }}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>

          <p style={styles.loginText}>
            Already have an account?{" "}
            <span 
              onClick={() => navigate("/login")}
              style={styles.loginLink}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

// Styles ഭാഗത്ത് മാറ്റമില്ല, പഴയത് തന്നെ ഉപയോഗിക്കാം
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
    borderRadius: "16px",
    border: "1px solid #2a2a2a"
  },
  title: {
    fontSize: "2rem",
    color: "#fff",
    marginBottom: "10px",
    textAlign: "center"
  },
  subtitle: {
    color: "#888",
    textAlign: "center",
    marginBottom: "30px"
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  label: {
    color: "#aaa",
    fontSize: "0.9rem"
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#222",
    color: "#fff",
    fontSize: "1rem",
    outline: "none"
  },
  button: {
    padding: "14px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "10px",
    transition: "0.3s"
  },
  buttonDisabled: {
    background: "#666",
    cursor: "not-allowed"
  },
  loginText: {
    textAlign: "center",
    marginTop: "20px",
    color: "#888"
  },
  loginLink: {
    color: "#3b82f6",
    cursor: "pointer",
    textDecoration: "underline"
  }
};