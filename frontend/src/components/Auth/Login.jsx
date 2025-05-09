import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [availableRoles, setAvailableRoles] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch available roles from backend
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/roles");
        setAvailableRoles(response.data);
        if (response.data.length > 0) {
          setSelectedRole(response.data[0].role_name); // set default role
        }
      } catch (err) {
        console.error("Error fetching roles:", err);
        setError("Failed to load roles. Please try again later.");
      }
    };

    fetchRoles();
  }, []);

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        {
          email,
          password,
          selectedRole, // ✅ sending selectedRole to backend
        }
      );

      const { token, user } = response.data;
      const userRole = user?.selectedRole
        ? user.selectedRole.toLowerCase().trim()
        : (user.roles && user.roles[0]?.toLowerCase()) || "employee";

      // Store data in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("role", userRole);
      localStorage.setItem("employeeId", user.id);
      localStorage.setItem("email", user.email);
      localStorage.setItem("employeeName", user.name);

      // Navigate based on role
      if (userRole === "hr" || userRole === "manager") {
        navigate("/dashboard/hr");
      } else {
        navigate("/dashboard/employee");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleLogin} className="card p-4 shadow rounded">
        <h2 className="mb-3 text-center">Login</h2>
        {error && <p className="text-danger text-center">{error}</p>}

        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <select
            className="form-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="" disabled>
              Select a role
            </option>
            {availableRoles.map((r) => (
              <option key={r.id} value={r.role_name}>
                {r.role_name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>

        <div className="mt-3 text-center">
          <Link to="/forgot-password" className="d-block text-decoration-none">
            Forgot Password?
          </Link>
          <span>Don't have an account? </span>
          <Link to="/signup" className="text-decoration-none">
            Sign up
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
