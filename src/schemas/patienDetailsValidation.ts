import { email, object, minLength, string, pipe, nonEmpty, custom, regex, union, literal } from 'valibot'

export const PatientDetailValedationSchema = object({
  firstName: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(3, 'First Name must be at least 3 characters long')
  ),
  lastName: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(3, 'Last Name must be at least 3 characters long')
  ),
  fullName: pipe(
    string(),
    nonEmpty('This field is required'),
    minLength(3, 'Enter Full Name'),
    custom(
    (input) => {
        const words = typeof input === 'string' ? input.trim().split(/\s+/) : [];
     
        const validWords = words.filter(word => {
      
          return word.length >= 2 && /^[a-zA-Z'-]+$/.test(word);
        });
      
        return validWords.length >= 2;
    },
    'Please enter a full name with at least two valid words (letters only).'
    )  
  ),
  ethnicity: pipe(string(), minLength(1, 'Ethnicity is required')),
  gender: pipe(string(), minLength(1, 'Gender is required')),
  maritalStatus: pipe(string(), minLength(1, 'Marital status is required')),
  nic: pipe(
    string(),
    minLength(1, 'NIC is required'),
    regex(/(^([0-9]{9}[x|X|v|V]|[0-9]{12})$)/, 'Please enter a valid NIC number')
  ),
  dob: pipe(
  string("Please select your Date of Birth"), 
  minLength(1, "Please select your Date of Birth")
),
  address: pipe(
    string(),
    minLength(1, 'Address is required'),
    minLength(10, 'Please enter a more detailed address')
  ),
  city: pipe(string(), minLength(3, 'City is required')),
  district: pipe(string(), minLength(3, 'District is required')),
  email: pipe(
    string(),
    minLength(5, 'Email is required'),
    email('Please enter a valid email address')
  ),
  mobileNo: pipe(
    string(),
    minLength(1, 'Mobile number is required'),
    regex(/^(?:0)?(7[0-9]{8})$/, 'Please enter a valid 10-digit mobile number')
  ),
  landNumber:
    pipe(
    string(),
    union([
        literal(''),
        pipe(string(), regex(/^(?:0)?[0-9]{9}$/, 'Please enter a valid 10-digit land number'))
    ])
      
    ), 
  emergencyContactName: pipe(
    string(),
    minLength(1, 'Emergency contact name is required'),
    minLength(3, 'Name must be at least 3 characters')
  ),
  emergencyContactRelationship: pipe(string(), minLength(1, 'Relationship is required')),
  emergencyContactMobile: pipe(
    string(),
    minLength(1, 'Emergency mobile number is required'),
    regex(/^(?:0)?(7[0-9]{8})$/, 'Please enter a valid 10-digit mobile number')
  ),

emergencyContactEmail: pipe(
  string(),
  union([
    literal(''),
    pipe(string(), email('Please enter a valid email address'))
  ])
),
})