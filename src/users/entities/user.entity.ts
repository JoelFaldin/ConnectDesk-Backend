export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export class User {
  rut: string;
  names: string;
  lastNames: string;
  email: string;
  password: string;
  role: string;
  departments: string;
  directions: string;
  jobNumber: string;
  contact: string;
}

export type SafeUser = Omit<User, 'password'>;

export class ReturnUserData extends User {
  message: string;
}
