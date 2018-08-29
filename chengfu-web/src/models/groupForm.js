import { createFormModel } from '../utils/models';
import * as GroupApi from '../services/group';

export default createFormModel({
  namespace: 'groupForm',
  fetch: GroupApi.getInfo,
  save: GroupApi.save,
  redirectUrl: '/staff/group-list',
});
