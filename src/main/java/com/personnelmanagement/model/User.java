package com.personnelmanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "users")

@Data
public class User {
    @Id
    private String _id;
    private String role;
    private String employeeId;
    private EmployeeInfo employeeInfo;

    // Getters and setters
    public void setId(String _id) {
        this._id = _id;
    }
    public void setEmployeeInfo(String name, String position) {
        this.employeeInfo = new EmployeeInfo(name, position);
    }
 
}

@Data
@AllArgsConstructor
class EmployeeInfo {
    private String name;
    private String position;
}

