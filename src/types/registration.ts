export type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface RegistrationState {
  step: Step;
  email: string;
  isEmailVerified: boolean;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  birthday: string;
  motherMaidenName: string;
  maritalStatus: string;
  mobileNumber: string;
  isMobileVerified: boolean;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isAddressVerified: boolean;
  idType: string;
  idNumber: string;
  isUsCitizen: boolean;
  ssn?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  verificationStatus: 'not_started' | 'in_progress' | 'completed' | 'failed';
}
