package com.personnelmanagement.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.mongodb.lang.Nullable;
import lombok.Data;

@Document(collection = "employees")

@Data
public class Employee {
    @Id
    private String _id;

    private PersonalInformation personalInformation;
    private EmploymentDetails employmentDetails;
    @Nullable
    private Object skills;
     private boolean missing;
    private MissingPeriod missingPeriod;

    // Getters and setters

    public void setId(String _id) {
        this._id = _id;
    }

    @Data
    public static class PersonalInformation {
        private String name;
        private Integer age;
        private String email;
        private String phone;
        private String address;
        @Nullable
        private String birthday;

        // Getters and setters
    }

    @Data
    public static class EmploymentDetails {
        private String position;
        private String department;
        @Nullable
        private String hireDate;
        private Double salaryAmount;
        private String salaryCurrency;
        private String status;

        // Getters and setters
    }

    @Data
    public static class MissingPeriod {
        private String start;
        private String end;
        

        // Getters and setters
    }

    @Data
    public static class Skill {
        private String skill;
        private String proficiency;
        

        // Getters and setters
    }
}
