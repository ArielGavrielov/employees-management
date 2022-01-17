package com.ariel.employees;

public final class Validation {
	
	public final static String[] nameRegex = {
		"^(?i)[a-z ,.'-]{2,20}$",
		"can contains 2-20 characters, only letters, space or special characters (, . ' -)"
	};
	
	public static void validateEmail(String name) {
		if(name == null || !name.matches("^[^@]+@[^@]+\\.[^@]+$"))
			throw new IllegalArgumentException("Invalid email");
	}
}
