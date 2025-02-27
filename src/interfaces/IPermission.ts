export interface IPermission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  createdAt: Date;
  updatedAt: Date;
}
