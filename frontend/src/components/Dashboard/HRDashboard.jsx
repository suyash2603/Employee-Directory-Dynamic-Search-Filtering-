
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Modal from "react-bootstrap/Modal";
// import Button from "react-bootstrap/Button";

// const HRDashboard = () => {
//   const [employees, setEmployees] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [department, setDepartment] = useState("");
//   const [selectedEmployee, setSelectedEmployee] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const [salaryMonth, setSalaryMonth] = useState("");
//   const [salaryYear, setSalaryYear] = useState("");
//   const [salaryAmount, setSalaryAmount] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchEmployees();
//     fetchDepartments();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/api/employees");
//       setEmployees(res.data);
//     } catch (err) {
//       console.error("Failed to fetch employees", err);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/api/departments");
//       setDepartments(res.data);
//     } catch (err) {
//       console.error("Failed to fetch departments", err);
//     }
//   };

//   const getDepartmentName = (id) => {
//     return departments.find((d) => d.id === id)?.name || "Unknown";
//   };

//   const filteredEmployees = employees.filter((emp) => {
//     const deptName = getDepartmentName(emp.department_id);
//     const matchesSearch =
//       emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       emp.role?.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesDept = department ? deptName === department : true;
//     return matchesSearch && matchesDept;
//   });

//   const indexOfLastEmployee = currentPage * itemsPerPage;
//   const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
//   const currentEmployees = filteredEmployees.slice(
//     indexOfFirstEmployee,
//     indexOfLastEmployee
//   );
//   const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

//   const goToPage = (page) => setCurrentPage(page);

//   const openModal = (employee) => {
//     setSelectedEmployee(employee);
//     setShowModal(true);
//     // Reset salary slip form fields
//     setSalaryMonth("");
//     setSalaryYear("");
//     setSalaryAmount("");
//   };

//   const handleEdit = (id) => {
//     setShowModal(false);
//     navigate(`/edit-employee/${id}`);
//   };

//   const toggleStatus = async (id) => {
//     try {
//       await axios.patch(`http://localhost:8000/api/employees/${id}/status`);
//       setEmployees((prev) =>
//         prev.map((emp) =>
//           emp.id === id
//             ? {
//                 ...emp,
//                 status: emp.status === "active" ? "inactive" : "active",
//               }
//             : emp
//         )
//       );
//     } catch (error) {
//       console.error("Error toggling status:", error);
//     }
//   };

//   const handleGenerateSalarySlip = async () => {
//     if (!salaryMonth || !salaryYear || !salaryAmount) {
//       alert('Please fill in all salary slip fields.');
//       return;
//     }
  
//     try {
//       const response = await axios.post('http://localhost:8000/api/generate-salary-slip', {
//         employee_id: selectedEmployee.id,
//         month: salaryMonth,
//         year: salaryYear,
//         amount: salaryAmount,
//       });
//       alert('Salary slip generated');
//     } catch (err) {
//       console.error("Salary slip generation error:", err.response?.data || err.message);
//       alert(`Error: ${err.response?.data?.error || 'Failed to generate salary slip'}`);
//     }
//   };
  
//   return (
//     <div className="container mt-5">
//       <h2 className="mb-4">HR Dashboard</h2>

//       <div className="d-flex mb-3">
//         <input
//           type="text"
//           className="form-control me-2"
//           placeholder="Search by name or role"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <select
//           className="form-select me-2"
//           value={department}
//           onChange={(e) => setDepartment(e.target.value)}
//         >
//           <option value="">All Departments</option>
//           {departments.map((dept) => (
//             <option key={dept.id} value={dept.name}>
//               {dept.name}
//             </option>
//           ))}
//         </select>
//         <Link to="/add-employee" className="btn btn-primary">
//           Add Employee
//         </Link>
//       </div>

//       <div className="table-responsive">
//         <table className="table table-bordered table-striped">
//           <thead className="table-dark">
//             <tr>
//               <th>#</th>
//               <th>Employee ID</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Department</th>
//               <th>Phone</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentEmployees.length > 0 ? (
//               currentEmployees.map((emp, index) => (
//                 <tr key={emp.id}>
//                   <td>{indexOfFirstEmployee + index + 1}</td>
//                   <td>{emp.id}</td>
//                   <td>{emp.name}</td>
//                   <td>{emp.email}</td>
//                   <td>{emp.role || "N/A"}</td>
//                   <td>{getDepartmentName(emp.department_id)}</td>
//                   <td>{emp.phone || "-"}</td>
//                   <td>{emp.status}</td>
//                   <td>
//                     <Button
//                       variant="info"
//                       size="sm"
//                       onClick={() => openModal(emp)}
//                       className="me-2"
//                     >
//                       Details
//                     </Button>
//                     <Button
//                       variant={emp.status === "active" ? "danger" : "success"}
//                       size="sm"
//                       onClick={() => toggleStatus(emp.id)}
//                     >
//                       {emp.status === "active" ? "Deactivate" : "Activate"}
//                     </Button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="9" className="text-center">
//                   No employees found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {totalPages > 1 && (
//         <nav className="mt-3">
//           <ul className="pagination justify-content-center">
//             <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//               <button
//                 className="page-link"
//                 onClick={() => goToPage(currentPage - 1)}
//               >
//                 Previous
//               </button>
//             </li>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <li
//                 key={page}
//                 className={`page-item ${page === currentPage ? "active" : ""}`}
//               >
//                 <button className="page-link" onClick={() => goToPage(page)}>
//                   {page}
//                 </button>
//               </li>
//             ))}
//             <li
//               className={`page-item ${
//                 currentPage === totalPages ? "disabled" : ""
//               }`}
//             >
//               <button
//                 className="page-link"
//                 onClick={() => goToPage(currentPage + 1)}
//               >
//                 Next
//               </button>
//             </li>
//           </ul>
//         </nav>
//       )}

//       {/* Modal for Employee Details */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Employee Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedEmployee && (
//             <>
//               <div className="mb-3 text-center">
//                 <img
//                   src={
//                     selectedEmployee.profile_pic
//                       ? `http://localhost:8000/uploads/${selectedEmployee.profile_pic}`
//                       : "default-profile-pic.png"
//                   }
//                   alt={selectedEmployee.name}
//                   className="rounded-circle"
//                   style={{
//                     width: "100px",
//                     height: "100px",
//                     objectFit: "cover",
//                   }}
//                 />
//               </div>
//               <p><strong>Name:</strong> {selectedEmployee.name}</p>
//               <p><strong>Email:</strong> {selectedEmployee.email}</p>
//               <p><strong>Role:</strong> {selectedEmployee.role || "N/A"}</p>
//               <p><strong>Department:</strong> {getDepartmentName(selectedEmployee.department_id)}</p>
//               <p><strong>Phone:</strong> {selectedEmployee.phone || "N/A"}</p>
//               <p><strong>Status:</strong> {selectedEmployee.status}</p>

//               <hr />
//               <h5>Generate Salary Slip</h5>
//               <div className="mb-2">
//                 <input
//                   type="text"
//                   placeholder="Month (e.g. April)"
//                   className="form-control"
//                   value={salaryMonth}
//                   onChange={(e) => setSalaryMonth(e.target.value)}
//                 />
//               </div>
//               <div className="mb-2">
//                 <input
//                   type="text"
//                   placeholder="Year (e.g. 2025)"
//                   className="form-control"
//                   value={salaryYear}
//                   onChange={(e) => setSalaryYear(e.target.value)}
//                 />
//               </div>
//               <div className="mb-3">
//                 <input
//                   type="number"
//                   placeholder="Amount"
//                   className="form-control"
//                   value={salaryAmount}
//                   onChange={(e) => setSalaryAmount(e.target.value)}
//                 />
//               </div>
//               <Button variant="success" onClick={handleGenerateSalarySlip}>
//                 Generate Salary Slip
//               </Button>
//             </>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={() => handleEdit(selectedEmployee.id)}>
//             Edit
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default HRDashboard;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const HRDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [salaryMonth, setSalaryMonth] = useState("");
  const [salaryYear, setSalaryYear] = useState("");
  const [salaryAmount, setSalaryAmount] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/departments");
      setDepartments(res.data);
    } catch (err) {
      console.error("Failed to fetch departments", err);
    }
  };

  const getDepartmentName = (id) => {
    return departments.find((d) => d.id === id)?.name || "Unknown";
  };

  const filteredEmployees = employees.filter((emp) => {
    const deptName = getDepartmentName(emp.department_id);
    const matchesSearch =
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = department ? deptName === department : true;
    return matchesSearch && matchesDept;
  });

  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const goToPage = (page) => setCurrentPage(page);

  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
    setSalaryMonth("");
    setSalaryYear("");
    setSalaryAmount("");
  };

  const handleEdit = (id) => {
    setShowModal(false);
    navigate(`/edit-employee/${id}`);
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/api/employees/${id}/status`);
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id
            ? {
                ...emp,
                status: emp.status === "active" ? "inactive" : "active",
              }
            : emp
        )
      );
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleGenerateSalarySlip = async () => {
    if (!salaryMonth || !salaryYear || !salaryAmount) {
      alert("Please fill in all salary slip fields.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/generate-salary-slip", {
        employee_id: selectedEmployee.id,
        month: salaryMonth,
        year: salaryYear,
        amount: salaryAmount,
      });
      alert("Salary slip generated");
    } catch (err) {
      console.error("Salary slip generation error:", err.response?.data || err.message);
      alert(`Error: ${err.response?.data?.error || "Failed to generate salary slip"}`);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/employees/${selectedEmployee.id}`);
      alert("Employee deleted successfully");
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      console.error("Error deleting employee:", err);
      alert("Failed to delete employee");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">HR Dashboard</h2>

      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by name or role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="form-select me-2"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
        <Link to="/add-employee" className="btn btn-primary">
          Add Employee
        </Link>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map((emp, index) => (
                <tr key={emp.id}>
                  <td>{indexOfFirstEmployee + index + 1}</td>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.role || "N/A"}</td>
                  <td>{getDepartmentName(emp.department_id)}</td>
                  <td>{emp.phone || "-"}</td>
                  <td>{emp.status}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => openModal(emp)}
                      className="me-2"
                    >
                      Details
                    </Button>
                    <Button
                      variant={emp.status === "active" ? "danger" : "success"}
                      size="sm"
                      onClick={() => toggleStatus(emp.id)}
                    >
                      {emp.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => goToPage(currentPage - 1)}>
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
                <button className="page-link" onClick={() => goToPage(page)}>
                  {page}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => goToPage(currentPage + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Employee Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee && (
            <>
              <div className="mb-3 text-center">
                <img
                  src={
                    selectedEmployee.profile_pic
                      ? `http://localhost:8000/uploads/${selectedEmployee.profile_pic}`
                      : "default-profile-pic.png"
                  }
                  alt={selectedEmployee.name}
                  className="rounded-circle"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </div>
              <p><strong>Name:</strong> {selectedEmployee.name}</p>
              <p><strong>Email:</strong> {selectedEmployee.email}</p>
              <p><strong>Role:</strong> {selectedEmployee.role || "N/A"}</p>
              <p><strong>Department:</strong> {getDepartmentName(selectedEmployee.department_id)}</p>
              <p><strong>Phone:</strong> {selectedEmployee.phone || "N/A"}</p>
              <p><strong>Status:</strong> {selectedEmployee.status}</p>

              <hr />
              <h5>Generate Salary Slip</h5>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Month (e.g. April)"
                  className="form-control"
                  value={salaryMonth}
                  onChange={(e) => setSalaryMonth(e.target.value)}
                />
              </div>
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Year (e.g. 2025)"
                  className="form-control"
                  value={salaryYear}
                  onChange={(e) => setSalaryYear(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  placeholder="Amount"
                  className="form-control"
                  value={salaryAmount}
                  onChange={(e) => setSalaryAmount(e.target.value)}
                />
              </div>
              <Button variant="success" onClick={handleGenerateSalarySlip}>
                Generate Salary Slip
              </Button>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleEdit(selectedEmployee.id)}>
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HRDashboard;
