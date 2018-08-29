import { createListModel } from '../utils/models';
import * as PositionAPi from '../services/position';

export default createListModel({
  namespace: 'positionList',
  fetch: PositionAPi.getList,
});
