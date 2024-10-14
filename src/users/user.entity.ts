export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

export class User {
  id: string;
  names: string;
  lastNames: string;
  email: string;
  password: string;
  role: Role;
  departments: string;
  directions: string;
  jobNumber: string;
  contact: string;
}

export type SafeUser = Omit<User, 'password'>;
