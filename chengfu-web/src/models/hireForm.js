import { createFormModel } from '../utils/models';
import * as HireApi from '../services/hire';

export default createFormModel({
  namespace: 'hireForm',
  fetch: HireApi.getInfo,
  save: HireApi.save,
  redirectUrl: '/inside/hire-list',
});
