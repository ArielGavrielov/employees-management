package com.ariel.employees;

import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path="/api/employees")
public class MainController {
	@Autowired
	private EmployeeRepository employeeRepository;
	
	// Get all employees request
	@GetMapping(path="/")
	public @ResponseBody ResponseEntity<Iterable<Employee>> getAllEmployees() {
		return new ResponseEntity<>(employeeRepository.findAll(), HttpStatus.OK);
	}

	// Add new employee request
	@PostMapping(path="/")
	public @ResponseBody ResponseEntity<String> addNewUser (@RequestBody Map<String, ?> json) {
		try {
			// all parameters MUST be String, if not - THROW!
			if(!(json.get("firstname") instanceof String && json.get("lastname") instanceof String && json.get("lastname") instanceof String))
				throw new IllegalArgumentException("Illegal parameters.");
			
			Employee emp = new Employee((String) json.get("firstname"), (String) json.get("lastname"), (String) json.get("email"));
			employeeRepository.save(emp);
			
			// If we get here we will update that everything is fine
			return new ResponseEntity<>("Added successfull", HttpStatus.OK);
		} catch(IllegalArgumentException e) {
			// Employee's fields is invalid...
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		} catch(DataIntegrityViolationException e) {
			// The email is already in the database...
			return new ResponseEntity<>("This email is already at the list.", HttpStatus.CONFLICT);
		}
	}
	
	// Update employee request
	@PutMapping(path="/{id}")
	public @ResponseBody ResponseEntity<String> updateEmployeeById(@PathVariable Integer id, @RequestBody Map<String, ?> json) {
		try {
			Optional<Employee> opt = employeeRepository.findById(id);
			Employee emp = opt.get();
			
			// all parameters MUST be String, if not - THROW!
			if(!(json.get("firstname") instanceof String && json.get("lastname") instanceof String && json.get("lastname") instanceof String))
				throw new IllegalArgumentException("Illegal parameters.");

			// if the setter returned true, the parameter changed and we can update database
			if(emp.setAll((String) json.get("firstname"), (String) json.get("lastname"), (String) json.get("email"))) {
				employeeRepository.save(emp);
				return new ResponseEntity<>("Saved", HttpStatus.OK);
			} else {
				// Nothing changed...
				return new ResponseEntity<>("Nothing changed...", HttpStatus.BAD_REQUEST);
			}
		} catch(NoSuchElementException e) {
			// There is no row with given id...
			return new ResponseEntity<>("Sorry, there is no employee with given id...", HttpStatus.BAD_REQUEST);
		} catch(IllegalArgumentException e) {
			// Employee's constructor throw exception
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		} catch(DataIntegrityViolationException e) {
			// The email is already in the database...
			return new ResponseEntity<>("This email is already at the list.", HttpStatus.CONFLICT);
		}
	}
	
	// Delete employee request
	@DeleteMapping(path="/{id}")
	public @ResponseBody ResponseEntity<String> deleteEmployeeById(@PathVariable Integer id) {
		try {
			employeeRepository.deleteById(id);
			return new ResponseEntity<>("Deleted...", HttpStatus.OK);
		} catch(EmptyResultDataAccessException e) {
			// There is no row with given id...
			return new ResponseEntity<>("Sorry, there is no employee with given id...", HttpStatus.BAD_REQUEST);
		}
	}

	// Get employee by email request
	@GetMapping(path="/{email}")
	public @ResponseBody ResponseEntity<?> getEmployeeByEmail(@PathVariable String email) {
		try {
			Validation.validateEmail(email);
		} catch(IllegalArgumentException e) {
			// invalid email
			return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
		}
		
		Employee e = employeeRepository.findByEmailAddress(email);
		if(e == null) {
			return new ResponseEntity<>("Employee not found.", HttpStatus.BAD_REQUEST);
		}
		return new ResponseEntity<>(e, HttpStatus.OK);
	}
	
	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<String> handleException(HttpMessageNotReadableException e){
		System.out.println(e.toString());
		return new ResponseEntity<>("Something went wrong...", HttpStatus.BAD_REQUEST);
	}
}