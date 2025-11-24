// src/schemas/doctorDetailsValidation.ts

import { email, object, minLength, string, pipe, nonEmpty, regex } from 'valibot'

export const getDoctorValidationSchema = () => {
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
      regex(/^(?:0)?(7[0-9]{8})$/, 'Please enter a valid 10-digit mobile number')
    ),

    // --- 2. Professional Information ---
    slmcNumber: pipe(
      string(),
      nonEmpty('SLMC Registration Number is required'),
      minLength(4, 'Invalid SLMC Number')
    ),
    specializationId: pipe(
      string(), 
      nonEmpty('Specialization is required')
    ),
    qualification: pipe(
      string(),
      nonEmpty('Qualifications are required'),
      minLength(2, 'Please enter valid qualifications')
    ),
    experienceYears: pipe(
      string(),
      nonEmpty('Experience is required'),
      regex(/^\d+$/, 'Experience must be a valid number')
    ),
    availabilityStatus: pipe(
      string(), 
      nonEmpty('Availability Status is required')
    )
  })
}