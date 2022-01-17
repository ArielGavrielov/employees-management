package com.ariel.employees;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface EmployeeRepository extends CrudRepository<Employee, Integer> {
	@Query("select emp from Employee emp where emp.email = ?1")
	Employee findByEmailAddress(String email);
}