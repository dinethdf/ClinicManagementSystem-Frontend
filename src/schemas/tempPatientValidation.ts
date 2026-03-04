import { object, string, pipe, nonEmpty, minLength, regex, nullable, optional } from 'valibot'

export const tempPatientValidationSchema = object({
  firstName: pipe(
    string(),
    nonEmpty('First Name is required'),
    minLength(3, 'At least 3 characters')
  ),
  lastName: pipe(
    string(),
    nonEmpty('Last Name is required'),
    minLength(3, 'At least 3 characters')
  ),
  mobileNo: pipe(
    string(),
    nonEmpty('Mobile number is required'),
    regex(/^(?:0)?(7[0-9]{8})$/, 'Valid 10-digit mobile number required')
  ),
  gender: pipe(
    string(),
    nonEmpty('Gender is required')
  ),
  // Optional Fields (No required/minLength pipes)
  dob: nullable(string()), // Allows null or a date string
  nic: optional(string()), // Allows empty string
  address: optional(string()) // Allows empty string
})