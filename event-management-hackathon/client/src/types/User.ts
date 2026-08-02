// src/types/User.ts
import { Role } from './Role';
import { BaseEntity } from './Common';

export interface User extends BaseEntity {
  name: string;
  email: string;
  role: Role;
  college?: string;
}
