import { createFormModel } from '../utils/models';
import * as ReimburseAPi from '../services/reimburse';

export default createFormModel({
  namespace: 'reimburseForm',
  fetch: ReimburseAPi.getInfo,
  save: ReimburseAPi.save,
  redirectUrl: '/inside/reimburse-list',
});
