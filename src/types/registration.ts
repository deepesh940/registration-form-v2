export type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Address {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ApplicantDetails {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  birthday: string;
  motherMaidenName: string;
  maritalStatus: string;
  mobileNumber: string;
  countryCode: string;
  isMobileVerified: boolean;
  address: Address;
  isAddressVerified: boolean;
  idType: string;
  idNumber: string;
  idDocument?: string;
  isUsCitizen: boolean;
  ssn?: string;
}

export interface RegistrationState extends ApplicantDetails {
  step: Step;
  email: string;
  isEmailVerified: boolean;
  accountType: 'Single' | 'Joint';
  secondaryApplicant?: ApplicantDetails;
  paymentStatus: 'pending' | 'completed' | 'failed';
  verificationStatus: 'not_started' | 'in_progress' | 'completed' | 'failed';
}
