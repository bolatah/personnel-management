package com.personnelmanagement.backendspringboot.service;

import com.personnelmanagement.backendspringboot.model.Employee;
import com.personnelmanagement.backendspringboot.model.Employee.MissingPeriod;
import com.personnelmanagement.backendspringboot.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {
    @Autowired
    private EmployeeRepository employeeRepository;

    @SuppressWarnings("null")
    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    @SuppressWarnings("null")
    public Employee getEmployeeById(String id) {
        return employeeRepository.findById(id).orElse(null);
    }

    public Employee updateEmployee(String id, Employee updatedEmployee) {
        updatedEmployee.setId(id); // Ensure the ID is set for update
        return employeeRepository.save(updatedEmployee);
    }

    @SuppressWarnings("null")
    public void deleteEmployee(String id) {
        employeeRepository.deleteById(id);
    }

    @SuppressWarnings("null")
    public void partiallyUpdateEmployee(String id, Employee updatedEmployee) {
        Optional<Employee> employeeOptional = employeeRepository.findById(id);
        Employee existingEmployee = employeeOptional.get();

        if (updatedEmployee.isMissing()) {
            existingEmployee.setMissing(updatedEmployee.isMissing());
        }

        if (updatedEmployee.getMissingPeriod() != null) {
            if (existingEmployee.getMissingPeriod() == null) {
                existingEmployee.setMissingPeriod(new MissingPeriod());
            }
            if (updatedEmployee.getMissingPeriod().getStart() != null) {
                existingEmployee.getMissingPeriod().setStart(updatedEmployee.getMissingPeriod().getStart());
            }
            if (updatedEmployee.getMissingPeriod().getEnd() != null) {
                existingEmployee.getMissingPeriod().setEnd(updatedEmployee.getMissingPeriod().getEnd());
            }
        }
        employeeRepository.save(existingEmployee);
    }
}