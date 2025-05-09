import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const EmployeeModal = ({ show, handleClose, employee }) => {
  if (!employee) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{employee.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Role:</strong> {employee.role}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EmployeeModal;
