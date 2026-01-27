
const CLINIC_STORAGE_KEY = 'clinicData';

export interface ClinicStorageData {
  name: string;
  subdomain: string;
  address: string;
  city: string;
  mobileNo: string;
  landNo: string;
  email: string;
  logoUrl: string;
  // id: number; // You mentioned ID is not needed, but usually helpful. Uncomment if required.
}

export const saveClinicDetails = (data: any) => {
  // 1. Clean existing data
  if (localStorage.getItem(CLINIC_STORAGE_KEY)) {
    localStorage.removeItem(CLINIC_STORAGE_KEY);
  }

  // 2. Select only the fields you want to save
  const safeData: ClinicStorageData = {
    name: data.name || '',
    subdomain: data.subdomain || '',
    address: data.address || '',
    city: data.city || '',
    mobileNo: data.mobileNo || '',
    landNo: data.landNo || '',
    email: data.email || '',
    logoUrl: data.logoUrl || '',
  };

  try {
    localStorage.setItem(CLINIC_STORAGE_KEY, JSON.stringify(safeData));
  } catch (error) {
    console.error('Error saving clinic details to localStorage', error);
  }
};

export const getClinicStorageDetails = (): ClinicStorageData | null => {
  if (typeof window === 'undefined') return null;

  const data = localStorage.getItem(CLINIC_STORAGE_KEY);
  if (!data) return null;

  try {
    return JSON.parse(data) as ClinicStorageData;
  } catch (error) {
    console.error('Error parsing clinic details', error);
    return null;
  }
};

export const clearClinicDetails = () => {
  localStorage.removeItem(CLINIC_STORAGE_KEY);
};





export interface UserStorageData {
  userName: string;
  userEmail: string;
  userImg: string;
  userRole: string;
}

const USER_STORAGE_KEY = 'userData';

export const saveUserDetails = (data: { 
  userName: string | null; 
  userEmail: string | null; 
  userImg: string | null; 
  userRole: string | null; 
}) => {
  // 1. Check if exists and remove
  if (localStorage.getItem(USER_STORAGE_KEY)) {
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  const safeData: UserStorageData = {
    userName: data.userName || '',
    userEmail: data.userEmail || '',
    userImg: data.userImg || '',
    userRole: data.userRole || ''
  };

  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(safeData));
  } catch (error) {
    console.error('Error saving user details to localStorage', error);
  }
};


export const getUserDetails = (): UserStorageData | null => {
  if (typeof window === 'undefined') return null; 

  const data = localStorage.getItem(USER_STORAGE_KEY);
  if (!data) return null;

  try {
    return JSON.parse(data) as UserStorageData;
  } catch (error) {
    console.error('Error parsing user details', error);
    return null;
  }
};

export const clearUserDetails = () => {
  localStorage.removeItem(USER_STORAGE_KEY);
};