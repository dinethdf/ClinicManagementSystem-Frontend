// src/services/company.server.service.ts

export interface CompanyDetails {
  name: string;
  subTitle: string;
  logoUrl: string; // URL for the logo image
  address?: string;
}

export const getCompanyDetails = async (): Promise<CompanyDetails> => {

  
  return {
    name: "Cure Guard Clinic",
    subTitle: "Patient Identity Card",
    logoUrl: "/images/clinic-logo.png", 
    address: "No. 123, Main Street, Colombo"
  };
};