interface User {
  workerId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  gender: string;
  dateOfBirth: string;
  primaryPhone: string;
  secondaryPhone: string;
  activePhone1: boolean;
  activePhone2: boolean;
  activeUser: boolean;
  isAdmin: boolean;
  isFieldWorker: boolean;
  streetAddress: string;
  stateProvince: string;
  zipCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyRelationship: string;
  profilePicture: string;
  shortBio: string;
  skills: string[]; // Define skills as an array of strings
  primaryCode: string;
  secondaryCode: string;
  expirationDate: string;
  timestamp: Date;
}

export default User;
