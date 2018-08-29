import { createListModel } from '../utils/models';
import * as RoleApi from '../services/role';

export default createListModel({
  namespace: 'roleList',
  fetch: RoleApi.getList,
});
