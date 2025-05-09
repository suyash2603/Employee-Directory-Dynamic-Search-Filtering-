import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    bio: "",
    department_id: ""
  });

  const [profilePic, setProfilePic] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, roleRes] = await Promise.all([
          axios.get("http://localhost:8000/api/departments"),
          axios.get("http://localhost:8000/api/roles")
        ]);

        setDepartments(deptRes.data);
        setRoles(roleRes.data);
      } catch (err) {
        console.error("Error fetching departments/roles:", err);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{6,}$/;

    if (!emailRegex.test(form.email)) {
      setError("Invalid email format.");
      return false;
    }

    if (!phoneRegex.test(form.phone)) {
      setError("Phone number must be exactly 10 digits.");
      return false;
    }

    if (!passwordRegex.test(form.password)) {
      setError(
        "Password must be at least 6 characters long and include uppercase, lowercase, number, and special character."
      );
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (profilePic) {
        formData.append("profile_pic", profilePic);
      }

      const res = await axios.post("http://localhost:8000/api/auth/signup", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.status === 200 || res.status === 201) {
        alert("Signup successful. Please login.");
        navigate("/login");
      } else {
        setError(res.data?.error || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} className="row g-3" encType="multipart/form-data">
        <div className="col-md-6">
          <label className="form-label">Full Name</label>
          <input
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Phone</label>
          <input
            name="phone"
            className="form-control"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Role</label>
          <select
            name="role"
            className="form-select"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Role --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.role_name}>
                {role.role_name.charAt(0).toUpperCase() + role.role_name.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Select Department</label>
          <select
            name="department_id"
            className="form-select"
            value={form.department_id}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">Bio</label>
          <textarea
            name="bio"
            className="form-control"
            rows="3"
            value={form.bio}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="col-12">
          <label className="form-label">Upload Profile Picture</label>
          <input
            type="file"
            name="profile_pic"
            className="form-control"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        {error && (
          <div className="col-12">
            <div className="alert alert-danger">{error}</div>
          </div>
        )}

        <div className="col-12">
          <div className="mt-3">
            <p>
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </div>
          <button type="submit" className="btn btn-success">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
