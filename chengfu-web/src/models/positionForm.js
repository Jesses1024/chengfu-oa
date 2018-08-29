import { createFormModel } from '../utils/models';
import * as PositionApi from '../services/position';

export default createFormModel({
  namespace: 'positionForm',
  fetch: PositionApi.getInfo,
  save: PositionApi.save,
  redirectUrl: '/inventory/position-list',
});
