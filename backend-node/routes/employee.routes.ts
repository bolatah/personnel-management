import express from 'express';
import { createEmployee, getEmployees, updateEmployee, deleteEmployee, getEmployeeById } from '../handlers/employee.handlers';


const router = express.Router();

// Create a new employee
router.post('/employees', async (req, res) => {
  try {
    const newEmployee = await createEmployee(req.body);
    res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all employees
router.get('/employees', async (_, res) => {
  try {
    const employees = await getEmployees()
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/employees/:id', async (req, res) => {
  try {
    const employee = await getEmployeeById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Update an employee
router.put('/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await updateEmployee(req.params.id, req.body);
    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an employee
router.delete('/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await deleteEmployee(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(deletedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;