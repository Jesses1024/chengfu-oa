import { createFormModel } from '../utils/models';
import * as StaffApi from '../services/staff';

export default createFormModel({
  namespace: 'staffForm',
  fetch: StaffApi.getInfo,
  save: StaffApi.save,
  redirectUrl: '/staff/list',
});
