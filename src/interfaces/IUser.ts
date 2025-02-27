import { IPermission } from './IPermission';

export interface IRole {
  id: string;
  name: string;
  description?: string;
  permissions?: {
    permission: IPermission;
  }[];
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  active: boolean;
  role?: IRole;
  roleId?: string;
  createdAt: Date;
  updatedAt: Date;
}
