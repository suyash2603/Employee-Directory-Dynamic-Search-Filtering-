import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    role_id: '',
    phone: '',
    department_id: '',
    bio: '',
    profile_pic: '',
    salary_amount: '',
    salary_month: '',
    salary_year: '',
  });

  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empRes, deptRes, roleRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/employees/${id}`),
          axios.get('http://localhost:8000/api/departments'),
          axios.get('http://localhost:8000/api/roles'),
        ]);

        const emp = empRes.data;

        setEmployee({
          name: emp.name || '',
          email: emp.email || '',
          role_id: emp.role_id || '',
          phone: emp.phone || '',
          department_id: emp.department_id || '',
          bio: emp.bio || '',
          profile_pic: emp.profile_pic || '',
          salary_amount: emp.salary?.amount || '',
          salary_month: emp.salary?.month || '',
          salary_year: emp.salary?.year || '',
        });

        setDepartments(deptRes.data);
        setRoles(roleRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setNewProfilePic(e.target.files[0]);
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!emailRegex.test(employee.email)) {
      errors.email = 'Invalid email format';
    }

    if (!phoneRegex.test(employee.phone)) {
      errors.phone = 'Phone number must be 10 digits';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', employee.name);
      formData.append('email', employee.email);
      formData.append('role_id', employee.role_id);
      formData.append('phone', employee.phone);
      formData.append('department_id', employee.department_id);
      formData.append('bio', employee.bio);
      formData.append('salary_amount', employee.salary_amount);
      formData.append('salary_month', employee.salary_month);
      formData.append('salary_year', employee.salary_year);
      if (newProfilePic) {
        formData.append('profile_pic', newProfilePic);
      }

      await axios.put(`http://localhost:8000/api/employees/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Employee updated successfully!');
      navigate('/dashboard/hr');
    } catch (err) {
      console.error('Error updating employee:', err);
      alert('Failed to update employee');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="mt-4">
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={employee.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
            value={employee.email}
            onChange={handleChange}
            required
          />
          {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
        </div>

        <div className="mb-3">
          <label>Role</label>
          <select
            name="role_id"
            className="form-select"
            value={employee.role_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
            value={employee.phone}
            onChange={handleChange}
            required
          />
          {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
        </div>

        <div className="mb-3">
          <label>Department</label>
          <select
            name="department_id"
            className="form-select"
            value={employee.department_id}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Bio</label>
          <textarea
            name="bio"
            className="form-control"
            value={employee.bio}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Upload New Profile Picture</label>
          <input
            type="file"
            name="profile_pic"
            className="form-control"
            onChange={handleFileChange}
            accept="image/*"
          />
          {employee.profile_pic && (
            <div className="mt-2">
              <small>Current:</small><br />
              <img
                src={`http://localhost:8000/uploads/${employee.profile_pic}`}
                alt="Current Profile"
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                }}
              />
            </div>
          )}
        </div>

        <div className="mb-3">
          <label>Salary Amount</label>
          <input
            type="number"
            name="salary_amount"
            className="form-control"
            value={employee.salary_amount}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Salary Month</label>
          <input
            type="text"
            name="salary_month"
            className="form-control"
            value={employee.salary_month}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Salary Year</label>
          <input
            type="text"
            name="salary_year"
            className="form-control"
            value={employee.salary_year}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-success">Update Employee</button>
      </form>
    </div>
  );
};

export default EditEmployee;
