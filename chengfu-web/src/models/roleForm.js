import { createFormModel } from '../utils/models';
import * as RoleApi from '../services/role';

export default createFormModel({
  namespace: 'roleForm',
  fetch: RoleApi.getInfo,
  save: RoleApi.save,
  redirectUrl: '/staff/role-list',
});
