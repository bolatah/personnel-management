package com.personnelmanagement.backendspringboot.service;

import com.personnelmanagement.backendspringboot.model.Employee;
import com.personnelmanagement.backendspringboot.model.User;
import com.personnelmanagement.backendspringboot.repository.EmployeeRepository;
import com.personnelmanagement.backendspringboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @SuppressWarnings("null")
    public User createUser(User user) {
        Assert.notNull(user.getEmployeeId(), "Employee ID must be provided");
          // Fetch employee information
        Employee employee = employeeRepository.findById(user.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found"));
        // Set user details
        user.setEmployeeInfo(employee.getPersonalInformation().getName(),
                             employee.getEmploymentDetails().getPosition()); 
                             
        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(String id) {
        return userRepository.findById(id).orElse(null);
    }

    public User updateUser(String id, User updatedUser) {
        updatedUser.setId(id); // Ensure the ID is set for update
        return userRepository.save(updatedUser);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}