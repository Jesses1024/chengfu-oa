import { createFormModel } from '../utils/models';
import * as UserApi from '../services/user';

export default createFormModel({
  namespace: 'userForm',
  fetch: UserApi.getInfo,
  save: UserApi.saveUser,
  redirectUrl: '/staff/user-list',
});
