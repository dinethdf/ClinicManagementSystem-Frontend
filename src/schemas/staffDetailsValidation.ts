// src/schemas/staffDetailsValidation.ts

import { email, object, minLength, string, pipe, nonEmpty, regex } from 'valibot'

export const getStaffValidationSchema = () => {
  return object({
    // --- 1. Personal Information ---
    firstName: pipe(
      string(),
      nonEmpty('First Name is required'),
      minLength(3, 'First Name must be at least 3 characters long')
    ),
    lastName: pipe(
      string(),
      nonEmpty('Last Name is required'),
      minLength(3, 'Last Name must be at least 3 characters long')
    ),
    nameWithInitials: pipe(
      string(),
      nonEmpty('Name with initials is required'),
      minLength(3, 'Name with initials must be at least 3 characters long')
    ),
    gender: pipe(
      string(), 
      nonEmpty('Gender is required')
    ),
    dob: pipe(
      string(), 
      nonEmpty('Date of Birth is required')
    ),
    nic: pipe(
      string(),
      nonEmpty('NIC is required'),

      // Using your exact NIC Regex from the Doctor schema
      regex(/(^([0-9]{9}[x|X|v|V]|[0-9]{12})$)/, 'Please enter a valid NIC number')
    ),
    
    // --- Address & Contact ---
    address: pipe(
      string(),
      nonEmpty('Address is required'),
      minLength(5, 'Please enter a more detailed address')
    ),
    city: pipe(
      string(), 
      nonEmpty('City is required')
    ),
    district: pipe(
      string(), 
      nonEmpty('District is required')
    ),
    email: pipe(
      string(),
      nonEmpty('Email is required'),
      email('Please enter a valid email address')
    ),
    mobileNo: pipe(
      string(),
      nonEmpty('Mobile number is required'),

      // Using your exact Mobile Regex
      regex(/^(?:0)?(7[0-9]{8})$/, 'Please enter a valid 10-digit mobile number')
    ),

    // --- 2. Job Information (Staff Specific) ---
    designation: pipe(
      string(),
      nonEmpty('Designation is required'),
      minLength(2, 'Designation must be valid')
    ),
    assignedRoleId: pipe(
      string(),
      nonEmpty('System Role is required')
    )
  })
}