package com.personnelmanagement.repository;

import com.personnelmanagement.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

 @Repository 
public interface UserRepository extends MongoRepository<User, String> {
    // Custom query method to find users by a specific role
    List<User> findByRole(String role);

    // Custom query method to find users by employeeId
    Optional<User> findByEmployeeId(String employeeId);
}