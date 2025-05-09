// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const AddEmployee = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     role: '',
//     department_id: '',
//     bio: '',
//     salaryAmount: '',
//     salaryMonth: '',
//     salaryYear: ''
//   });

//   const [profilePic, setProfilePic] = useState(null);
//   const [departments, setDepartments] = useState([]);
//   const [roles, setRoles] = useState([]);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const res = await axios.get('http://localhost:8000/api/departments');
//         setDepartments(res.data);
//       } catch (err) {
//         console.error('Error fetching departments:', err);
//         setMessage('Error fetching departments');
//       }
//     };

//     const fetchRoles = async () => {
//       try {
//         const res = await axios.get('http://localhost:8000/api/roles');
//         setRoles(res.data);
//       } catch (err) {
//         console.error('Error fetching roles:', err);
//         setMessage('Error fetching roles');
//       }
//     };

//     fetchDepartments();
//     fetchRoles();
//   }, []);

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleFileChange = (e) => {
//     setProfilePic(e.target.files[0]);
//   };

//   const validateInputs = () => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const phoneRegex = /^[6-9]\d{9}$/;
//     const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

//     if (!emailRegex.test(formData.email)) {
//       setMessage('Please enter a valid email address.');
//       return false;
//     }

//     if (!phoneRegex.test(formData.phone)) {
//       setMessage('Please enter a valid 10-digit Indian phone number starting with 6-9.');
//       return false;
//     }

//     if (!passwordRegex.test(formData.password)) {
//       setMessage('Password must be at least 6 characters, include 1 uppercase letter and 1 number.');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
    
//     if (!validateInputs()) return;

//     setLoading(true);
//     try {
//       const data = new FormData();
//       for (let key in formData) {
//         data.append(key, formData[key]);
//       }
//       if (profilePic) {
//         data.append('profile_pic', profilePic);
//       }

//       const res = await axios.post('http://localhost:8000/api/employees', data, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       setMessage('Employee added successfully!');
//       setFormData({
//         name: '', email: '', phone: '', password: '',
//         role: '', department_id: '', bio: '',
//         salaryAmount: '', salaryMonth: '', salaryYear: ''
//       });
//       setProfilePic(null);
//     } catch (err) {
//       console.error('Error:', err);
//       setMessage(err.response?.data?.error || 'Failed to add employee');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2>Add New Employee</h2>
//       {message && <div className="alert alert-info">{message}</div>}

//       <form onSubmit={handleSubmit} className="row g-3" encType="multipart/form-data">
//         <div className="col-md-6">
//           <input type="text" className="form-control" placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} required />
//         </div>
//         <div className="col-md-6">
//           <input type="email" className="form-control" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
//         </div>
//         <div className="col-md-6">
//           <input type="text" className="form-control" placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
//         </div>
//         <div className="col-md-6">
//           <input type="password" className="form-control" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
//         </div>

//         <div className="col-md-6">
//           <select className="form-select" name="role" value={formData.role} onChange={handleChange} required>
//             <option value="">Select Role</option>
//             {roles.map((r, i) => (
//               <option key={i} value={r.role_name}>{r.role_name}</option>
//             ))}
//           </select>
//         </div>

//         <div className="col-md-6">
//           <select className="form-select" name="department_id" value={formData.department_id} onChange={handleChange} required>
//             <option value="">Select Department</option>
//             {departments.map(dept => (
//               <option key={dept.id} value={dept.id}>{dept.name}</option>
//             ))}
//           </select>
//         </div>

//         <div className="col-md-12">
//           <textarea className="form-control" rows="3" placeholder="Bio" name="bio" value={formData.bio} onChange={handleChange}></textarea>
//         </div>

//         <div className="col-md-12">
//           <label className="form-label">Upload Profile Picture</label>
//           <input type="file" name="profile_pic" accept="image/*" className="form-control" onChange={handleFileChange} />
//         </div>

//         <h5 className="mt-4">Salary Details</h5>
//         <div className="col-md-4">
//           <input type="number" className="form-control" placeholder="Amount (e.g. 50000)" name="salaryAmount" value={formData.salaryAmount} onChange={handleChange} required />
//         </div>
//         <div className="col-md-4">
//           <input type="text" className="form-control" placeholder="Month (e.g. April)" name="salaryMonth" value={formData.salaryMonth} onChange={handleChange} required />
//         </div>
//         <div className="col-md-4">
//           <input type="number" className="form-control" placeholder="Year (e.g. 2024)" name="salaryYear" value={formData.salaryYear} onChange={handleChange} required />
//         </div>

//         <div className="col-12">
//           <button type="submit" className="btn btn-success" disabled={loading}>
//             {loading ? (
//               <>
//                 <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                 Adding...
//               </>
//             ) : (
//               'Add Employee'
//             )}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default AddEmployee;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: '',
    department_id: '',
    bio: '',
    salaryAmount: '',
    salaryMonth: '',
    salaryYear: '',
    hire_date: '',
    location: ''
  });

  const [profilePic, setProfilePic] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/departments');
        setDepartments(res.data);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setMessage('Error fetching departments');
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/roles');
        setRoles(res.data);
      } catch (err) {
        console.error('Error fetching roles:', err);
        setMessage('Error fetching roles');
      }
    };

    fetchDepartments();
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const validateInputs = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

    if (!emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address.');
      return false;
    }

    if (!phoneRegex.test(formData.phone)) {
      setMessage('Please enter a valid 10-digit Indian phone number starting with 6-9.');
      return false;
    }

    if (!passwordRegex.test(formData.password)) {
      setMessage('Password must be at least 6 characters, include 1 uppercase letter and 1 number.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateInputs()) return;

    setLoading(true);
    try {
      const data = new FormData();
      for (let key in formData) {
        data.append(key, formData[key]);
      }
      if (profilePic) {
        data.append('profile_pic', profilePic);
      }

      const res = await axios.post('http://localhost:8000/api/employees', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessage('Employee added successfully!');
      setFormData({
        name: '', email: '', phone: '', password: '',
        role: '', department_id: '', bio: '',
        salaryAmount: '', salaryMonth: '', salaryYear: '',
        hire_date: '', location: ''
      });
      setProfilePic(null);
    } catch (err) {
      console.error('Error:', err);
      setMessage(err.response?.data?.error || 'Failed to add employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add New Employee</h2>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} className="row g-3" encType="multipart/form-data">
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input type="email" className="form-control" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input type="text" className="form-control" placeholder="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="col-md-6">
          <input type="password" className="form-control" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div className="col-md-6">
          <select className="form-select" name="role" value={formData.role} onChange={handleChange} required>
            <option value="">Select Role</option>
            {roles.map((r, i) => (
              <option key={i} value={r.role_name}>{r.role_name}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <select className="form-select" name="department_id" value={formData.department_id} onChange={handleChange} required>
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        <div className="col-md-12">
          <textarea className="form-control" rows="3" placeholder="Bio" name="bio" value={formData.bio} onChange={handleChange}></textarea>
        </div>

        <div className="col-md-6">
          <label className="form-label">Hire Date</label>
          <input type="date" className="form-control" name="hire_date" value={formData.hire_date} onChange={handleChange} required />
        </div>

        <div className="col-md-6">
          <input type="text" className="form-control mt-4" placeholder="Location (e.g. Pune)" name="location" value={formData.location} onChange={handleChange} required />
        </div>

        <div className="col-md-12">
          <label className="form-label">Upload Profile Picture</label>
          <input type="file" name="profile_pic" accept="image/*" className="form-control" onChange={handleFileChange} />
        </div>

        <h5 className="mt-4">Salary Details</h5>
        <div className="col-md-4">
          <input type="number" className="form-control" placeholder="Amount (e.g. 50000)" name="salaryAmount" value={formData.salaryAmount} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <input type="text" className="form-control" placeholder="Month (e.g. April)" name="salaryMonth" value={formData.salaryMonth} onChange={handleChange} required />
        </div>
        <div className="col-md-4">
          <input type="number" className="form-control" placeholder="Year (e.g. 2024)" name="salaryYear" value={formData.salaryYear} onChange={handleChange} required />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Adding...
              </>
            ) : (
              'Add Employee'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
