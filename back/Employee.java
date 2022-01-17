package com.ariel.employees;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Employee {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id", nullable = false, unique = true)
	private Integer id;
	@Column(nullable=false)
	private String firstName;
	@Column(nullable=false)
	private String lastName;
	@Column(unique=true,nullable=false)
	private String email;
	  
	public Employee() { }
	  
	public Employee(String firstName, String lastName, String email) {
		setAll(firstName, lastName, email);
	}
	
	public boolean setAll(String firstName, String lastName, String email) throws IllegalArgumentException {
		List<String> errors = new ArrayList<>(); // list of all errors for response
		boolean hasChange = false; // check if some field changed
		
		try {
			hasChange |= this.setFirstName(firstName);
		} catch(IllegalArgumentException e) {
			errors.add(e.getMessage());
		}
		
		try {
			hasChange |= this.setLastName(lastName);
		} catch(IllegalArgumentException e) {
			errors.add(e.getMessage());
		}
		try {
			hasChange |= this.setEmail(email);
		} catch(IllegalArgumentException e) {
			errors.add(e.getMessage());
		}

		if(!errors.isEmpty()) {
			// errors in inputs...
			throw new IllegalArgumentException(String.join("\n", errors));
		}
		
		return hasChange;
	}
	
	public Integer getId() {
		return id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public boolean setFirstName(String firstName) {
		if(firstName == null || !firstName.matches(Validation.nameRegex[0]))
			throw new IllegalArgumentException("First name " + Validation.nameRegex[1]);
		
		if(firstName.equals(this.firstName)) return false;
		
		this.firstName = firstName;
		return true;
	}
	
	public String getFirstName() {
		return firstName;
	}
	
	public boolean setLastName(String lastName) {
		if(lastName == null || !lastName.matches(Validation.nameRegex[0]))
			throw new IllegalArgumentException("Last name " + Validation.nameRegex[1]);
		
		if(lastName.equals(this.lastName)) return false;
		
		this.lastName = lastName;
		return true;
	}
	
	public String getLastName() {
		return lastName;
	}
	
	public boolean setEmail(String email) {
		Validation.validateEmail(email);
		
		if(email.equals(this.email)) return false;
		
		this.email = email;
		return true;
	}
	
	public String getEmail() {
		return email;
	}
}